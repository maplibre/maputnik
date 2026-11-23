import { describe, beforeEach, test } from "./utils/fixtures";
import { MaputnikDriver } from "./maputnik-driver";

describe("sprite picker", () => {
  const { given, when, get, then } = new MaputnikDriver();
  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("sprite");
    await when.openSpritePicker();
  });

  test("shows the catalog names and atlas crops in the option rows", async () => {
    await then(get.spriteOptions()).shouldHaveLength(4);
    await then(get.spritePixel("red", 8, 8)).shouldDeepNestedInclude([255, 0, 0, 255]);
    await then(get.spritePixel("green", 8, 8)).shouldDeepNestedInclude([0, 128, 0, 255]);
  });

  test("keeps the menu in the viewport when the field is near the bottom", async () => {
    await when.scrollSpritePickerToBottom();
    await then(get.elementByTestId("sprite-preview:red")).shouldBeInViewport();
    await then(get.elementByTestId("sprite-preview:retina-square")).shouldBeInViewport();
  });

  test("filters names without case sensitivity", async () => {
    await when.searchSprites("GrEeN");
    await then(get.spriteOptions()).shouldHaveLength(1);
    await then(get.spriteOptions()).shouldHaveText("green");
  });

  test("stores the selected sprite ID", async () => {
    await when.chooseSprite("green");
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "green" } }] });
  });

  test("selects a filtered sprite with the keyboard", async () => {
    await when.searchSprites("sdf");
    await when.chooseSpriteWithKeyboard();
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "sdf-circle" } }] });
    await then(get.spriteOptions()).shouldNotExist();
  });

  test("renders an SDF silhouette with transparent outside pixels", async () => {
    await then(get.spritePixel("sdf-circle", 16, 16)).shouldDeepNestedInclude([0, 0, 0, 255]);
    await then(get.spritePixel("sdf-circle", 0, 0)).shouldDeepNestedInclude([0, 0, 0, 0]);
  });

  test("respects the sprite pixel ratio", async () => {
    await then(get.elementByTestId("sprite-preview:retina-square")).shouldHaveCss("width", "16px");
    await then(get.spritePixel("retina-square", 16, 16)).shouldDeepNestedInclude([0, 0, 255, 255]);
  });

  test("keeps free-form sprite names", async () => {
    await when.searchSprites("custom-{type}");
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "custom-{type}" } }] });
  });

  test("Escape closes the menu without selecting an option", async () => {
    await when.searchSprites("gr");
    await when.closeSpritePicker();
    await then(get.spriteOptions()).shouldNotExist();
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "gr" } }] });
  });

  test("keeps expressions in the existing expression editor", async () => {
    await when.chooseSprite("green");
    await when.makeExpression("icon-image");
    await then(get.element("[data-wd-key='spec-field-container:icon-image'] .maputnik-expression-editor")).shouldBeVisible();
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": ["literal", "green"] } }] });
    await then(get.elementByTestId("spec-field-input:icon-image")).shouldNotExist();
  });

  test("replaces the catalog when a different sprite source is opened", async () => {
    await when.openSpriteStyle("sprite-alternate-style");
    await when.openSpritePicker();
    await then(get.spriteOptions()).shouldHaveLength(1);
    await then(get.spriteOptions()).shouldHaveText("blue");
  });

  test("clears the catalog when the next style has no sprite", async () => {
    await when.openSpriteStyle("sprite-empty-style");
    await when.openSpritePicker();
    await then(get.spriteOptions()).shouldHaveLength(0);
  });
});

describe("namespaced sprite picker", () => {
  const { given, when, get, then } = new MaputnikDriver();
  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await when.setStyle("sprite_namespaced");
    await when.openSpritePicker();
  });

  test("retains MapLibre sprite namespaces when selecting an ID", async () => {
    await when.chooseSprite("extra:blue");
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "extra:blue" } }] });
  });
});

describe("sprite image failures", () => {
  const { given, when, get, then } = new MaputnikDriver();
  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await given.interceptAndMockResponse({ url: /sprite-atlas\.png/, response: {} });
    await when.setStyle("sprite");
    await when.openSpritePicker();
  });

  test("can still select a name when the atlas fails to load", async () => {
    await when.chooseSprite("green");
    await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id: "symbols", layout: { "icon-image": "green" } }] });
  });
});

describe("late sprite metadata", () => {
  const { given, when, get, then } = new MaputnikDriver();
  beforeEach(async () => {
    await given.setupMockBackedResponses();
    await given.holdResponse(/sprite-atlas\.json/, "sprite-atlas.json", "old-sprite");
    await when.setStyle("sprite");
    await when.waitForResponse("old-sprite");
    await when.openSpriteStyle("sprite-alternate-style");
    await when.openSpritePicker();
    await then(get.spriteOptions()).shouldHaveText("blue");
  });

  test("does not restore an old catalog after the source changes", async () => {
    await when.releaseResponse("old-sprite");
    await then(get.spriteOptions()).shouldHaveLength(1);
    await then(get.spriteOptions()).shouldHaveText("blue");
  });
});
