import { describe, it, expect } from "vitest";
import { sortNumerically } from "./sort-numerically";

describe("sortNumerically", () => {
  it("orders numbers (and numeric strings) ascending", () => {
    expect([3, 1, 2].sort(sortNumerically)).toEqual([1, 2, 3]);
    expect(["10", "2", "1"].sort(sortNumerically)).toEqual(["1", "2", "10"]);
    expect(sortNumerically(5, 5)).toBe(0);
    expect(sortNumerically(1, 2)).toBe(-1);
    expect(sortNumerically(2, 1)).toBe(1);
  });
});
