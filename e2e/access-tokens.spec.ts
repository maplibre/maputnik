import { test, expect, describe, beforeEach } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";
import tokens from "../src/config/tokens.json" with { type: "json" };

describe("access tokens", () => {
  const { given, when } = new MaputnikDriver();

  const tileJson = {
    tilejson: "2.2.0",
    tiles: ["https://example.local/{z}/{x}/{y}.pbf"],
    minzoom: 0,
    maxzoom: 14,
  };

  beforeEach(async () => {
    await given.setupMockBackedResponses();
  });

  test("uses the thunderforest token for a thunderforest source", async () => {
    await given.interceptAndMockResponse({
      method: "GET",
      url: /tile\.thunderforest\.com\/.*/,
      response: tileJson,
      alias: "thunderforest",
    });

    await when.setStyle("access_tokens");

    const request = await when.waitForResponse("thunderforest");
    expect(request.url()).toContain(`apikey=${tokens.thunderforest}`);
  });

  test("uses the locationiq token for a locationiq source", async () => {
    await given.interceptAndMockResponse({
      method: "GET",
      url: /tiles\.locationiq\.com\/.*/,
      response: tileJson,
      alias: "locationiq",
    });

    await when.setStyle("access_tokens");

    const request = await when.waitForResponse("locationiq");
    expect(request.url()).toContain(`key=${tokens.locationiq}`);
  });

  test("appends the stadia token as a query parameter", async () => {
    await given.interceptAndMockResponse({
      method: "GET",
      url: /tiles\.stadiamaps\.com\/.*/,
      response: tileJson,
      alias: "stadia",
    });

    await when.setStyle("access_tokens");

    const request = await when.waitForResponse("stadia");
    expect(request.url()).toContain("?api_key=stadia-test-token");
  });
});
