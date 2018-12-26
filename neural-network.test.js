// N.B. ES6 modules without babel is a PITA
// @link https://github.com/vuejs/vue-cli/issues/2040#issuecomment-449877687
import { fff } from "./neural-network.js"

test("rand(0,1) is between 0 and 1", () => {
  // this is purely a test of one case
  // I guess we could repeat this test 1,000,000x
  // But that still wouldn't prove it's correct
  const r = fff().chartGen.rand(0, 1)
  expect(r).toBeGreaterThanOrEqual(0)
  expect(r).toBeLessThanOrEqual(1)
})

test("rand(1,3) is between 1 and 3", () => {
  // this is purely a test of one case
  // I guess we could repeat this test 1,000,000x
  // But that still wouldn't prove it's correct
  const r = fff().chartGen.rand(1, 3)
  expect(r).toBeGreaterThanOrEqual(1)
  expect(r).toBeLessThanOrEqual(3)
})
