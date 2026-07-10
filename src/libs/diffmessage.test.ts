import { describe, it, expect } from "vitest";
import type { StyleSpecification } from "maplibre-gl";
import { undoMessages, redoMessages } from "./diffmessage";

const before = { version: 8, sources: {}, layers: [] } as StyleSpecification;
const after = {
  version: 8,
  sources: {},
  layers: [{ id: "bg", type: "background" }],
} as StyleSpecification;

describe("diff messages", () => {
  it("prefixes undo messages with 'Undo'", () => {
    const messages = undoMessages(before, after);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages.every((m) => m.startsWith("Undo "))).toBe(true);
  });

  it("prefixes redo messages with 'Redo'", () => {
    const messages = redoMessages(before, after);
    expect(messages.length).toBeGreaterThan(0);
    expect(messages.every((m) => m.startsWith("Redo "))).toBe(true);
  });
});
