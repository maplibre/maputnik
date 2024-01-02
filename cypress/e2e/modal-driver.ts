import { v1 as uuid } from "uuid";
import MaputnikCypressHelper from "./maputnik-cypress-helper";

export default class ModalDriver {
  private helper = new MaputnikCypressHelper();

  public when = {
    fillLayers: (opts: { type: string; layer?: string; id?: string }) => {
      // Having logic in test code is an anti pattern.
      // This should be splitted to multiple single responsibility functions
      let type = opts.type;
      let layer = opts.layer;
      let id;
      if (opts.id) {
        id = opts.id;
      } else {
        id = `${type}:${uuid()}`;
      }
      this.helper.when.selectOption("add-layer.layer-type.select", type);
      this.helper.when.type("add-layer.layer-id.input", id);

      if (layer) {
        this.helper.when.within(() => {
          this.helper.get.element("input").type(layer!);
        }, "add-layer.layer-source-block");
      }
      this.helper.when.click("add-layer");

      return id;
    },

    open: () => {
      this.helper.when.click("layer-list:add-layer");
    },

    close: (key: string) => {
      this.helper.when.click(key + ".close-modal");
    },
  };
}
