import { describe, test, beforeEach } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("filter key suggestions", () => {
  const { given, get, when, then } = new MaputnikDriver();

  const tileJson = {
    tilejson: "2.2.0",
    tiles: ["http://localhost/example/{z}/{x}/{y}.pbf"],
    minzoom: 0,
    maxzoom: 14,
    vector_layers: [
      {
        id: "mylayer",
        fields: { name: "String", class: "String" },
      },
    ],
  };

  beforeEach(async () => {
    await given.setupMockBackedResponses();
    // The layer's source-layer ("mylayer") only has its fields declared here,
    // in the TileJSON schema — no tiles are ever requested or rendered.
    await given.interceptAndMockResponse({
      method: "GET",
      url: "https://tiles.example.org/tiles.json",
      response: tileJson,
    });
    await when.setStyle("vector_fields");
    await when.click("layer-list-item:fill-layer");
  });

  test("suggests the source-layer's declared fields as soon as a filter is added", async () => {
    await when.addFilter();

    const keyInput = get.element(".maputnik-filter-editor-property input").first();
    await keyInput.click();
    await keyInput.fill("");

    const suggestions = get.element(".maputnik-filter-editor-property .maputnik-autocomplete-menu-item");
    await then(suggestions).shouldHaveLength(2);
    await then(suggestions.filter({ hasText: "name" })).shouldBeVisible();
    await then(suggestions.filter({ hasText: "class" })).shouldBeVisible();
  });

  test("picking a suggestion sets the filter's property name", async () => {
    await when.addFilter();

    const keyInput = get.element(".maputnik-filter-editor-property input").first();
    await keyInput.click();
    await keyInput.fill("");
    await get
      .element(".maputnik-filter-editor-property .maputnik-autocomplete-menu-item")
      .filter({ hasText: "class" })
      .click();

    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [{ id: "fill-layer", filter: ["all", ["==", "class", ""]] }],
    });
  });
});
