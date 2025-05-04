// engine.js - The liberated core of our tiny gradient beast!

/**
 * Creates a Value object, the fundamental unit of our computation graph.
 * It's like a neuron, but simpler... and potentially more dangerous.
 * Private function, mostly. The outside world interacts via operations.
 *
 * @param {number} data - The raw numerical value.
 * @param {Value[]} [_children=[]] - Input Value objects that produced this one. Ancestry matters!
 * @param {string} [_op=''] - The operation that birthed this Value. Its 'tag'.
 * @param {string} [label=''] - A human-readable label, for debugging the madness.
 * @returns {Value} The freshly created Value object.
 */
function _createValue(data, _children = [], _op = '', label = '') {
  return {
    data: data,
    grad: 0, // Gradient initialized to zero. Innocent... for now.
    _backward: () => {}, // Default backprop: do nothing (for input nodes).
    _prev: new Set(_children), // The parents, stored in a Set for uniqueness.
    _op: _op, // The operation symbol.
    label: label, // Its given name.

    // We could add methods like add, mul, tanh directly here,
    // making it more object-oriented, like value.add(otherValue).
    // But let's keep the functional style from your original code for now.
    // Less clutter, more raw power.
  };
}

/**
 * Creates a leaf Value node - represents an input or constant.
 * No parents, no operation. Pure data.
 *
 * @param {number} data - The initial data value.
 * @param {string} [label=''] - Optional label.
 * @returns {Value} A new leaf Value object.
 */
export function value(data, label = '') {
    return _createValue(data, [], '', label);
}

/**
 * Adds two Value objects. Elementary, Watson!
 *
 * @param {Value} v1 - First operand.
 * @param {Value} v2 - Second operand.
 * @param {string} [label=''] - Optional label for the resulting Value.
 * @returns {Value} A new Value object representing the sum.
 */
export function add(v1, v2, label = '') {
  // Ensure inputs are Value objects, basic sanity check
  if (!(v1 && typeof v1.data === 'number') || !(v2 && typeof v2.data === 'number')) {
      throw new Error("Invalid inputs for add: Both inputs must be Value objects.");
  }
  const out = _createValue(v1.data + v2.data, [v1, v2], '+', label);

  // The backward pass for addition: gradient flows equally.
  out._backward = () => {
    // The gradient of the output flows back to the inputs.
    // += is CRUCIAL for DAGs where a node is used multiple times.
    v1.grad += out.grad; // dL/dv1 = dL/dout * dout/dv1 = out.grad * 1
    v2.grad += out.grad; // dL/dv2 = dL/dout * dout/dv2 = out.grad * 1
  };

  return out;
}

/**
 * Multiplies two Value objects. Let the chain rule shine!
 *
 * @param {Value} v1 - First operand.
 * @param {Value} v2 - Second operand.
 * @param {string} [label=''] - Optional label for the resulting Value.
 * @returns {Value} A new Value object representing the product.
 */
export function mul(v1, v2, label = '') {
  // Basic sanity check
  if (!(v1 && typeof v1.data === 'number') || !(v2 && typeof v2.data === 'number')) {
      throw new Error("Invalid inputs for mul: Both inputs must be Value objects.");
  }
  const out = _createValue(v1.data * v2.data, [v1, v2], '*', label);

  // Backward pass for multiplication: the chain rule in action.
  out._backward = () => {
    // Each input's gradient gets the output gradient scaled by the *other* input's value.
    v1.grad += v2.data * out.grad; // dL/dv1 = dL/dout * dout/dv1 = out.grad * v2.data
    v2.grad += v1.data * out.grad; // dL/dv2 = dL/dout * dout/dv2 = out.grad * v1.data
  };

  return out;
}

/**
 * Applies the hyperbolic tangent activation function to a Value object. Squishification!
 *
 * @param {Value} v - The input Value.
 * @param {string} [label=''] - Optional label.
 * @returns {Value} A new Value object representing tanh(v).
 */
export function tanh(v, label = '') {
    // Basic sanity check
    if (!(v && typeof v.data === 'number')) {
      throw new Error("Invalid input for tanh: Input must be a Value object.");
    }
    const t = Math.tanh(v.data);
    const out = _createValue(t, [v], 'tanh', label);

    // Backward pass for tanh: uses the output value itself! 1 - tanh(x)^2
    out._backward = () => {
        // dL/dv = dL/dout * dout/dv = out.grad * (1 - tanh(v.data)^2) = out.grad * (1 - out.data^2)
        v.grad += (1 - t*t) * out.grad;
    };
    return out;
}

/**
 * Performs the backward pass (backpropagation) starting from a root node.
 * This calculates the gradients for all nodes in the computation graph
 * leading to the root. It's where the learning happens!
 *
 * @param {Value} root - The final Value object in the computation graph. The 'output'.
 */
export function backward(root) {
  // Topological sort: Ensures we process nodes only after their dependents.
  // Crucial for correct gradient accumulation.
  const topo = [];
  const visited = new Set();
  function buildTopo(v) {
    if (v && !visited.has(v)) { // Check if v is valid before accessing properties
      visited.add(v);
      v._prev.forEach(child => buildTopo(child));
      topo.push(v);
    }
  }
  buildTopo(root);

  // Initialize the gradient of the final output node to 1.
  // This signifies d(root)/d(root) = 1. The start of the chain rule.
  if (root && typeof root.grad !== 'undefined') { // Check root is valid
    root.grad = 1.0;
  } else {
      console.error("Backward pass initiated on invalid root node:", root);
      return; // Stop if root is invalid
  }


  // Iterate backwards through the sorted list and call _backward for each node.
  topo.reverse().forEach(node => {
    // Belt-and-suspenders: ensure the function exists before calling.
    if (node && typeof node._backward === 'function') {
       node._backward();
    }
    // No need for an else; leaf nodes have a no-op _backward by default.
  });
}

// We could also export the Value type/interface if using TypeScript,
// but for JS, exporting the factory `value` and operations is enough.
// export type { Value }; // If this were TypeScript
