import { describe, it, expect, beforeEach, vi } from "vitest";
import { StyleStore } from "./stylestore";

class LocalStorageMock {
  private store: Record<string, string> = {};
  get length() {
    return Object.keys(this.store).length;
  }
  key(i: number) {
    return Object.keys(this.store)[i] ?? null;
  }
  getItem(k: string) {
    return k in this.store ? this.store[k] : null;
  }
  setItem(k: string, v: string) {
    this.store[k] = v;
  }
  removeItem(k: string) {
    delete this.store[k];
  }
  clear() {
    this.store = {};
  }
}
vi.stubGlobal("window", { localStorage: new LocalStorageMock() });
// loadDefaultStyle fetches the default style over the network; serve it locally.
vi.stubGlobal(
  "fetch",
  vi.fn(async () => ({
    json: async () => ({ version: 8, id: "default", sources: {}, layers: [] }),
  }))
);

const style = (id: string) => ({ version: 8, id, sources: {}, layers: [] }) as any;

describe("StyleStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("returns the default style when nothing is stored", async () => {
    const store = new StyleStore();
    const latest = await store.getLatestStyle();
    expect(latest.id).toBe("default");
  });

  it("saves a style and reads it back as the latest", async () => {
    const store = new StyleStore();
    store.save(style("abc"));
    // A fresh store discovers the persisted style ids.
    const reopened = new StyleStore();
    const latest = await reopened.getLatestStyle();
    expect(latest.id).toBe("abc");
  });

  it("purge removes all maputnik keys", async () => {
    const store = new StyleStore();
    store.save(style("abc"));
    window.localStorage.setItem("unrelated", "keep");
    store.purge();
    expect(window.localStorage.getItem("maputnik:style:abc")).toBeNull();
    expect(window.localStorage.getItem("unrelated")).toBe("keep");
  });
});
