import {describe, it, expect, beforeEach, vi} from "vitest";
import {
  clampSidebarWidth,
  getSavedSidebarWidth,
  saveSidebarWidth,
  MIN_SIDEBAR_WIDTH,
  MAX_SIDEBAR_WIDTH,
  DEFAULT_SIDEBAR_WIDTH,
} from "./sidebar";

describe("sidebar helpers", () => {
  describe("clampSidebarWidth", () => {
    it("returns MIN when value is below minimum", () => {
      expect(clampSidebarWidth(100)).toBe(MIN_SIDEBAR_WIDTH);
    });

    it("returns MAX when value exceeds maximum", () => {
      expect(clampSidebarWidth(1200)).toBe(MAX_SIDEBAR_WIDTH);
    });

    it("returns the value when within range", () => {
      expect(clampSidebarWidth(500)).toBe(500);
    });

    it("returns exactly MIN at boundary", () => {
      expect(clampSidebarWidth(MIN_SIDEBAR_WIDTH)).toBe(MIN_SIDEBAR_WIDTH);
    });

    it("returns exactly MAX at boundary", () => {
      expect(clampSidebarWidth(MAX_SIDEBAR_WIDTH)).toBe(MAX_SIDEBAR_WIDTH);
    });
  });

  describe("getSavedSidebarWidth", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("returns null when nothing is stored", () => {
      expect(getSavedSidebarWidth()).toBeNull();
    });

    it("returns the stored width when valid", () => {
      localStorage.setItem("maputnik:sidebarWidth", "600");
      expect(getSavedSidebarWidth()).toBe(600);
    });

    it("returns null when stored value is below MIN", () => {
      localStorage.setItem("maputnik:sidebarWidth", "100");
      expect(getSavedSidebarWidth()).toBeNull();
    });

    it("returns null when stored value is above MAX", () => {
      localStorage.setItem("maputnik:sidebarWidth", "9999");
      expect(getSavedSidebarWidth()).toBeNull();
    });

    it("returns null when stored value is not a number", () => {
      localStorage.setItem("maputnik:sidebarWidth", "abc");
      expect(getSavedSidebarWidth()).toBeNull();
    });
  });

  describe("saveSidebarWidth", () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it("persists the width to localStorage", () => {
      saveSidebarWidth(500);
      expect(localStorage.getItem("maputnik:sidebarWidth")).toBe("500");
    });
  });

  describe("DEFAULT_SIDEBAR_WIDTH", () => {
    it("is the sum of list and drawer widths", () => {
      expect(DEFAULT_SIDEBAR_WIDTH).toBe(570);
    });
  });
});
