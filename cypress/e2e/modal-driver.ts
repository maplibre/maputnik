import { v1 as uuid } from "uuid";
import { CypressHelper } from "@shellygo/cypress-test-utils";
import ThirdPartyDriver from "./thirs-party-driver";

export default class ModalDriver {
    private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });
    private thirdPartyDriver = new ThirdPartyDriver();

    public when = {
        fillLayers: (opts: {type: string, layer?: string, id?: string}) => {
            let type = opts.type;
            let layer = opts.layer;
            let id;
            if (opts.id) {
                id = opts.id;
            } else {
                id = `${type}:${uuid()}`;
            }
        
            this.helper.get.element("add-layer.layer-type.select").select(type);
            this.helper.get.element("add-layer.layer-id.input").type(id);
            if (layer) {
                this.helper.when.within(() => {
                this.thirdPartyDriver.get.element("input").type(layer!);
                }, "add-layer.layer-source-block")
            }
            this.helper.when.click("add-layer");
        
            return id;
        },

        open: () => {
            this.helper.when.click("layer-list:add-layer");
      
            this.helper.get.element("modal:add-layer").should("exist");
            this.helper.get.element("modal:add-layer").should("be.visible");
        },

        close: (key: string) => {
            this.helper.when.waitUntil(() => this.helper.get.element(key));
            this.helper.when.click(key + ".close-modal");
          },
    }
}