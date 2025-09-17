import { MaputnikDriver } from "./maputnik-driver";
import { v1 as uuid } from "uuid";

describe("layer editor", () => {
  const { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();
  beforeEach(() => {
    when.setStyle("both");
    when.modal.open();
  });

  function createBackground() {
    const id = uuid();

    when.selectWithin("add-layer.layer-type", "background");
    when.setValue("add-layer.layer-id.input", "background:" + id);

    when.click("add-layer");

    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "background:" + id,
          type: "background",
        },
      ],
    });
    return id;
  }

  it("expand/collapse");
  it("id", () => {
    const bgId = createBackground();

    when.click("layer-list-item:background:" + bgId);

    const id = uuid();
    when.setValue("layer-editor.layer-id.input", "foobar:" + id);
    when.click("min-zoom");

    then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
      layers: [
        {
          id: "foobar:" + id,
          type: "background",
        },
      ],
    });
  });

  describe("source", () => {
    it("should show error when the source is invalid", () => {
      when.modal.fillLayers({
        type: "circle",
        layer: "invalid",
      });
      then(get.element(".maputnik-input-block--error .maputnik-input-block-label")).shouldHaveCss("color", "rgb(207, 74, 74)");
    });
  });

  describe("min-zoom", () => {
    let bgId: string;

    beforeEach(() => {
      bgId = createBackground();
      when.click("layer-list-item:background:" + bgId);
      when.setValue("min-zoom.input-text", "1");
      when.click("layer-editor.layer-id");
    });

    it("should update min-zoom in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            minzoom: 1,
          },
        ],
      });
    });

    it("when clicking next layer should update style on local storage", () => {
      when.type("min-zoom.input-text", "{backspace}");
      when.click("max-zoom.input-text");
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            minzoom: 1,
          },
        ],
      });
    });
  });

  describe("max-zoom", () => {
    let bgId: string;

    beforeEach(() => {
      bgId = createBackground();
      when.click("layer-list-item:background:" + bgId);
      when.setValue("max-zoom.input-text", "1");
      when.click("layer-editor.layer-id");
    });

    it("should update style in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            maxzoom: 1,
          },
        ],
      });
    });
  });

  describe("comments", () => {
    let bgId: string;
    const comment = "42";

    beforeEach(() => {
      bgId = createBackground();
      when.click("layer-list-item:background:" + bgId);
      when.setValue("layer-comment.input", comment);
      when.click("layer-editor.layer-id");
    });

    it("should update style in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
            metadata: {
              "maputnik:comment": comment,
            },
          },
        ],
      });
    });

    describe("when unsetting", () => {
      beforeEach(() => {
        when.clear("layer-comment.input");
        when.click("min-zoom.input-text");
      });

      it("should update style in local storage", () => {
        then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
          layers: [
            {
              id: "background:" + bgId,
              type: "background",
            },
          ],
        });
      });
    });
  });

  describe("color", () => {
    let bgId: string;
    beforeEach(() => {
      bgId = createBackground();
      when.click("layer-list-item:background:" + bgId);
      when.click("spec-field:background-color");
    });

    it("should update style in local storage", () => {
      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: "background:" + bgId,
            type: "background",
          },
        ],
      });
    });
  });

  describe("opacity", () => {
    let bgId: string;
    beforeEach(() => {
      bgId = createBackground();
      when.click("layer-list-item:background:" + bgId);
      when.type("spec-field-input:background-opacity", "0.");
    });

    it("should keep '.' in the input field", () => {
      then(get.elementByTestId("spec-field-input:background-opacity")).shouldHaveValue("0.");
    });

    it("should revert to a valid value when focus out", () => {
      when.click("layer-list-item:background:" + bgId);
      then(get.elementByTestId("spec-field-input:background-opacity")).shouldHaveValue("0");
    });
  });



  describe("filter", () => {
    it("expand/collapse");
    it("compound filter");
  });

  describe("paint", () => {
    it("expand/collapse");
    it("color");
    it("pattern");
    it("opacity");
  });

  describe("json-editor", () => {
    it("add", () => {
      const id = when.modal.fillLayers({
        type: "circle",
        layer: "example",
      });

      then(get.styleFromLocalStorage()).shouldDeepNestedInclude({
        layers: [
          {
            id: id,
            type: "circle",
            source: "example",
          },
        ],
      });

      const sourceText = get.elementByText('"source"');

      sourceText.click();
      sourceText.type("\"");

      then(get.element(".cm-lint-marker-error")).shouldExist();
    });


    it("expand/collapse");
    it("modify");

    it("parse error", () => {
      const bgId = createBackground();

      when.click("layer-list-item:background:" + bgId);
      when.collapseGroupInLayerEditor();
      when.collapseGroupInLayerEditor(1);
      then(get.element(".cm-lint-marker-error")).shouldNotExist();

      when.appendTextInJsonEditor(
        "\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {"
      );
      then(get.element(".cm-lint-marker-error")).shouldExist();
    });
  });
});
