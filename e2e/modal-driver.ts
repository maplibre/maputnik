import { v1 as uuid } from "uuid";
import { expect } from "@playwright/test";
import type { MaputnikDriver } from "./maputnik-driver";

export class ModalDriver {
  constructor(private readonly driver: MaputnikDriver) {}

  public when = {
    fillLayers: async (opts: { type: string; layer?: string; id?: string }) => {
      const { when, get } = this.driver;
      const id = opts.id ?? `${opts.type}:${uuid()}`;

      await when.select("add-layer.layer-type.select", opts.type);
      await when.type("add-layer.layer-id.input", id);

      if (opts.layer) {
        await when.doWithin("add-layer.layer-source-block", async () => {
          const input = get.element("input");
          await input.click();
          await input.fill(opts.layer!);
          // The source input is a controlled downshift combobox; wait for React
          // to settle on the typed value before submitting.
          await expect(input).toHaveValue(opts.layer!);
        });
        // Close the autocomplete menu so it does not intercept the add button.
        await get.elementByTestId("add-layer.layer-id.input").click();
      }
      await when.click("add-layer");

      return id;
    },

    open: async () => {
      // No-op when the add-layer modal is already open (some specs call open()
      // both in a beforeEach and at the start of the test body).
      const modal = this.driver.get.elementByTestId("modal:add-layer").first();
      if (await modal.isVisible()) return;
      await this.driver.when.click("layer-list:add-layer");
    },

    close: async (key: string) => {
      await this.driver.when.click(key + ".close-modal");
    },
  };
}
