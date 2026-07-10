import { describe, it, expect } from "vitest";
import { RevisionStore } from "./revisions";

const rev = (id: string) => ({ version: 8, id, sources: {}, layers: [] }) as any;

describe("RevisionStore", () => {
  it("tracks latest/current as revisions are added", () => {
    const store = new RevisionStore();
    store.addRevision(rev("a"));
    store.addRevision(rev("b"));
    expect(store.latest.id).toBe("b");
    expect(store.current.id).toBe("b");
  });

  it("undo and redo move through history", () => {
    const store = new RevisionStore();
    store.addRevision(rev("a"));
    store.addRevision(rev("b"));
    expect(store.undo().id).toBe("a");
    expect(store.undo().id).toBe("a"); // clamped at start
    expect(store.redo().id).toBe("b");
    expect(store.redo().id).toBe("b"); // clamped at end
  });

  it("clears redo history when a new revision is added after undo", () => {
    const store = new RevisionStore();
    store.addRevision(rev("a"));
    store.addRevision(rev("b"));
    store.undo();
    store.addRevision(rev("c"));
    expect(store.latest.id).toBe("c");
    expect(store.redo().id).toBe("c");
  });
});
