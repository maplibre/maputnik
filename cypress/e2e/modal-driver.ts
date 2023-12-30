import { v1 as uuid } from "uuid";
import CypressWrapperDriver from "./cypress-wrapper-driver";

export default class ModalDriver {
  private helper = new CypressWrapperDriver();

  public when = {
    fillLayers: (opts: { type: string; layer?: string; id?: string }) => {
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
