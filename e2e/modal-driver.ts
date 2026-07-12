import { v1 as uuid } from "uuid";
import { PlaywrightHelper } from "./playwright-helper";

export class ModalDriver {
  private readonly helper = new PlaywrightHelper();

  public when = {
    fillLayers: async (opts: { type: string; layer?: string; id?: string }) => {
      const { when, get, then } = this.helper;
      const id = opts.id ?? `${opts.type}:${uuid()}`;

      await when.select("add-layer.layer-type.select", opts.type);
      await when.type("add-layer.layer-id.input", id);

      if (opts.layer) {
        const input = get.elementByTestId("add-layer.layer-source-block").locator("input");
        await input.click();
        await input.fill(opts.layer);
        // The source input is a controlled downshift combobox; wait for React to
        // settle on the typed value before submitting.
        await then(input).shouldHaveValue(opts.layer);
        // Close the autocomplete menu so it does not intercept the add button.
        await get.elementByTestId("add-layer.layer-id.input").click();
      }
      await when.click("add-layer");

      return id;
    },

    open: async () => {
      await this.helper.when.click("layer-list:add-layer");
    },

    close: async (key: string) => {
      await this.helper.when.click(key + ".close-modal");
    },

    /**
     * Adds a source of the given type from the sources modal, keeping whatever
     * defaults that type's editor prefills.
     */
    addSource: async (sourceId: string, sourceType: string) => {
      const { when } = this.helper;
      await when.setValue("modal:sources.add.source_id", sourceId);
      await when.select("modal:sources.add.source_type", sourceType);
      await when.click("modal:sources.add.add_source");
      await when.wait(200);
    },

    /** Adds one of the predefined public sources listed in the sources modal. */
    addPublicSource: async (index = 0) => {
      await this.helper.get.element(".maputnik-public-source-select").nth(index).click();
    },

    deleteFirstActiveSource: async () => {
      await this.helper.get.element(".maputnik-active-source-type-editor-header-delete").first().click();
    },

    /** Fills one number box of a coordinate pair in the image/video source editor. */
    setCoordinateValue: async (index: number, value: string) => {
      const input = this.helper.get
        .elementByTestId("modal:sources")
        .locator(".maputnik-array input")
        .nth(index);
      await input.fill(value);
      await input.blur();
    },

    exportCreateHtml: async () => {
      await this.helper.get.element(".maputnik-modal-export-buttons button").last().click();
    },

    exportSaveStyle: async () => {
      await this.helper.stubSaveFilePicker();
      await this.helper.get.element(".maputnik-modal-export-buttons button").first().click();
    },
  };
}
