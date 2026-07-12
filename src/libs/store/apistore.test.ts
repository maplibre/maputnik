import { describe, it, expect, beforeEach, vi } from "vitest";

vi.stubGlobal("window", { location: { port: "8000" } });

// Avoid opening a real websocket in notifyLocalChanges().
const wsInstances: any[] = [];
vi.mock("reconnecting-websocket", () => ({
  default: class {
    onmessage: ((e: { data: string }) => void) | null = null;
    constructor(public url: string) {
      wsInstances.push(this);
    }
  },
}));

import { ApiStyleStore } from "./apistore";

const okJson = (body: any) => ({ ok: true, json: async () => body });

describe("ApiStyleStore", () => {
  beforeEach(() => {
    wsInstances.length = 0;
    vi.restoreAllMocks();
  });

  it("init fetches style ids and wires up local change notifications", async () => {
    const fetchMock = vi.fn(async () => okJson(["style-a", "style-b"]) as any);
    vi.stubGlobal("fetch", fetchMock);
    const onLocalStyleChange = vi.fn();
    const store = new ApiStyleStore({ onLocalStyleChange });

    await store.init();
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/styles", { mode: "cors" });
    expect(store.latestStyleId).toBe("style-a");

    // A websocket message triggers onLocalStyleChange with a valid style.
    expect(wsInstances.length).toBe(1);
    wsInstances[0].onmessage!({ data: JSON.stringify({ version: 8, sources: {}, layers: [] }) });
    expect(onLocalStyleChange).toHaveBeenCalledOnce();
    expect(onLocalStyleChange.mock.calls[0][0].id).toBeTruthy();
  });

  it("init throws a friendly error when the API is unreachable", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("boom"); }));
    const store = new ApiStyleStore({});
    await expect(store.init()).rejects.toThrow("Can not connect to style API");
  });

  it("getLatestStyle fetches the latest style and validates it", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => okJson(["s1"]) as any));
    const store = new ApiStyleStore({});
    await store.init();

    vi.stubGlobal("fetch", vi.fn(async () => okJson({ version: 8, id: "s1", sources: {}, layers: [] }) as any));
    const latest = await store.getLatestStyle();
    expect(latest.id).toBe("s1");
  });

  it("getLatestStyle throws when not initialised", async () => {
    const store = new ApiStyleStore({});
    await expect(store.getLatestStyle()).rejects.toThrow(/init the api backend/);
  });

  it("save PUTs the (token-stripped) style to the API", () => {
    const fetchMock = vi.fn(async () => okJson({}) as any);
    vi.stubGlobal("fetch", fetchMock);
    const store = new ApiStyleStore({});
    const mapStyle = { version: 8, id: "s1", sources: {}, layers: [] } as any;

    expect(store.save(mapStyle)).toBe(mapStyle);
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/styles/s1",
      expect.objectContaining({ method: "PUT", mode: "cors" })
    );
  });
});
