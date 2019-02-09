// N.B. ES6 modules without babel is a PITA
// @link https://github.com/vuejs/vue-cli/issues/2040#issuecomment-449877687
import { nn } from "./neural-network"

describe("I want it to display random values", () => {
  it("rand(0,1) is between 0 and 1", () => {
    Array(100).fill(0).map(_ => {
      // this is purely a test of one case
      // I guess we could repeat this test 1,000,000x
      // But that still wouldn't prove it's correct
      const r = nn().chartGen.rand(0, 1)
      expect(r).toBeGreaterThanOrEqual(0)
      expect(r).toBeLessThanOrEqual(1)
    })
  })

  it("rand(1,3) is between 1 and 3", () => {
    Array(100).fill(0).map(_ => {
      // this is purely a test of one case
      // I guess we could repeat this test 1,000,000x
      // But that still wouldn't prove it's correct
      const r = nn().chartGen.rand(1, 3)
      expect(r).toBeGreaterThanOrEqual(1)
      expect(r).toBeLessThanOrEqual(3)
    })
  })
})

describe("I want to generate a set of random test values", () => {
  it("zero test values should be an empty set", () => {
    const r = nn().chartGen.examples(0)
    expect(r.length).toBe(0)
  })

  it("one test values should have one element", () => {
    const r = nn().chartGen.examples(1)
    expect(r.length).toBe(1)
  })

  it("n test values should have n elements", () => {
    Array(100).fill(0).map((_, n) => {
      const r = nn().chartGen.examples(n)
      expect(r.length).toBe(n)  
    })
  })
})
