// engine.test.js - Where we break the autograd engine for science!
import fc from "fast-check"; // The property-based testing toolkit!
import * as eng from "./engine"; // Import our shiny new module

// Helper to reset gradients for tests - essential!
// We need fresh Value objects for many tests to avoid interference.
const resetGrads = (...values) => {
  const queue = [...values];
  const visited = new Set();
  while (queue.length > 0) {
    const v = queue.shift();
    if (v && typeof v.grad === "number" && !visited.has(v)) {
      visited.add(v);
      v.grad = 0;
      v._prev.forEach((p) => queue.push(p));
    }
  }
};

// Helper for comparing floats with tolerance
const closeTo = (a, b, tolerance = 1e-6) => Math.abs(a - b) < tolerance;

describe("Autograd Engine: Core Operations", () => {
  test("should create a leaf value node correctly", () => {
    const v = eng.value(42.0, "input");
    expect(v.data).toBe(42.0);
    expect(v.label).toBe("input");
    expect(v.grad).toBe(0);
    expect(v._op).toBe("");
    expect(v._prev.size).toBe(0);
  });

  test("add: forward pass works", () => {
    const a = eng.value(5);
    const b = eng.value(-3);
    const c = eng.add(a, b, "c");
    expect(c.data).toBe(2);
    expect(c._op).toBe("+");
    expect([...c._prev]).toEqual([a, b]);
  });

  test("mul: forward pass works", () => {
    const a = eng.value(5);
    const b = eng.value(-3);
    const c = eng.mul(a, b, "c");
    expect(c.data).toBe(-15);
    expect(c._op).toBe("*");
    expect([...c._prev]).toEqual([a, b]);
  });

  test("tanh: forward pass works", () => {
    const a = eng.value(0.5);
    const t = eng.tanh(a, "t");
    expect(t.data).toBeCloseTo(Math.tanh(0.5));
    expect(t._op).toBe("tanh");
    expect([...t._prev]).toEqual([a]);
  });

  // --- Specific Gradient Tests ---

  test("add: backward pass calculates correct gradients", () => {
    const a = eng.value(5.0, "a");
    const b = eng.value(-3.0, "b");
    const c = eng.add(a, b, "c");
    eng.backward(c);

    expect(c.grad).toBe(1.0); // d(c)/d(c)
    expect(a.grad).toBe(1.0); // d(c)/d(a) = 1
    expect(b.grad).toBe(1.0); // d(c)/d(b) = 1
  });

  test("mul: backward pass calculates correct gradients", () => {
    const a = eng.value(5.0, "a");
    const b = eng.value(-3.0, "b");
    const c = eng.mul(a, b, "c");
    eng.backward(c);

    expect(c.grad).toBe(1.0); // d(c)/d(c)
    expect(a.grad).toBe(b.data); // d(c)/d(a) = b.data = -3.0
    expect(b.grad).toBe(a.data); // d(c)/d(b) = a.data = 5.0
  });

  test("tanh: backward pass calculates correct gradients", () => {
    const a = eng.value(0.5, "a");
    const t = eng.tanh(a, "t");
    eng.backward(t);

    const expected_grad_a = 1 - Math.tanh(0.5) ** 2;
    expect(t.grad).toBe(1.0); // d(t)/d(t)
    expect(a.grad).toBeCloseTo(expected_grad_a); // d(t)/d(a) = 1 - tanh(a.data)^2
  });

  test("complex graph: backward pass propagates correctly", () => {
    // Expression: d = a*b + c*a
    // Let a=2, b=3, c=4
    // d = 2*3 + 4*2 = 6 + 8 = 14
    // Gradients:
    // d(d)/d(a) = b + c = 3 + 4 = 7
    // d(d)/d(b) = a = 2
    // d(d)/d(c) = a = 2
    const a = eng.value(2.0, "a");
    const b = eng.value(3.0, "b");
    const c = eng.value(4.0, "c");

    const ab = eng.mul(a, b, "ab"); // a*b
    const ca = eng.mul(c, a, "ca"); // c*a (note reuse of 'a')
    const d = eng.add(ab, ca, "d"); // ab + ca

    eng.backward(d);

    expect(d.data).toBeCloseTo(14.0);
    expect(d.grad).toBe(1.0);
    expect(ab.grad).toBeCloseTo(1.0); // from add backward
    expect(ca.grad).toBeCloseTo(1.0); // from add backward
    expect(a.grad).toBeCloseTo(7.0); // b.data * ab.grad + c.data * ca.grad = 3*1 + 4*1 = 7
    expect(b.grad).toBeCloseTo(2.0); // a.data * ab.grad = 2*1 = 2
    expect(c.grad).toBeCloseTo(2.0); // a.data * ca.grad = 2*1 = 2
  });
});

// --- Property-Based Tests ---
// Unleash the chaos of random inputs!

describe("Autograd Engine: Property-Based Tests", () => {
  // Define an arbitrary for a 'Value' object for fast-check
  // We'll generate simple leaf nodes with random data.
  const valueArbitrary = fc
    .float({ noNaN: true, noDefaultInfinity: true })
    .map((n) => eng.value(n));

  it("add forward pass property: add(a, b).data === a.data + b.data", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        const result = eng.add(a, b);
        // Use closeTo due to potential floating point inaccuracies
        return closeTo(result.data, a.data + b.data);
      }),
    );
  });

  it("mul forward pass property: mul(a, b).data === a.data * b.data", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        const result = eng.mul(a, b);
        return closeTo(result.data, a.data * b.data);
      }),
    );
  });

  it("tanh forward pass property: tanh(a).data === Math.tanh(a.data)", () => {
    // Avoid large inputs to tanh where output is exactly +/-1, might cause gradient issues if not handled carefully later
    const boundedValueArbitrary = fc
      .float({ min: -10, max: 10, noNaN: true })
      .map((n) => eng.value(n));
    fc.assert(
      fc.property(boundedValueArbitrary, (a) => {
        const result = eng.tanh(a);
        return closeTo(result.data, Math.tanh(a.data));
      }),
    );
  });

  it("add backward pass gradient property", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        // Need fresh values for each run to avoid grad accumulation across properties
        const fresh_a = eng.value(a.data);
        const fresh_b = eng.value(b.data);
        const result = eng.add(fresh_a, fresh_b);
        eng.backward(result);
        // Check gradients are approximately 1.0 (scaled by result.grad which is 1.0)
        return closeTo(fresh_a.grad, 1.0) && closeTo(fresh_b.grad, 1.0);
      }),
    );
  });

  it("mul backward pass gradient property", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        const fresh_a = eng.value(a.data);
        const fresh_b = eng.value(b.data);
        const result = eng.mul(fresh_a, fresh_b);
        eng.backward(result);
        // Check gradients: d(res)/da = b.data, d(res)/db = a.data
        return (
          closeTo(fresh_a.grad, fresh_b.data) &&
          closeTo(fresh_b.grad, fresh_a.data)
        );
      }),
    );
  });

  it("tanh backward pass gradient property", () => {
    const boundedValueArbitrary = fc
      .float({ min: -10, max: 10, noNaN: true })
      .map((n) => eng.value(n));
    fc.assert(
      fc.property(boundedValueArbitrary, (a) => {
        const fresh_a = eng.value(a.data);
        const result = eng.tanh(fresh_a);
        eng.backward(result);
        const expected_grad = 1.0 - result.data * result.data; // 1 - tanh(a.data)^2
        return closeTo(fresh_a.grad, expected_grad);
      }),
    );
  });

  it("add commutativity property (data only)", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        const res1 = eng.add(a, b);
        const res2 = eng.add(b, a);
        return closeTo(res1.data, res2.data);
      }),
    );
  });

  it("mul commutativity property (data only)", () => {
    fc.assert(
      fc.property(valueArbitrary, valueArbitrary, (a, b) => {
        const res1 = eng.mul(a, b);
        const res2 = eng.mul(b, a);
        return closeTo(res1.data, res2.data);
      }),
    );
  });

  // Note: Testing gradient commutativity/associativity requires careful graph setup
  // and potentially resetting grads mid-property, which complicates things.
  // Focusing on data properties for these is often sufficient for basic checks.
});
