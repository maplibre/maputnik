var assert = require("assert");
import driver from "./driver";
import { v1 as uuid } from 'uuid';

describe("layers", () => {
  beforeEach(() => {
    driver.beforeEach();
    driver.setStyle('both');
    driver.openLayersModal();
  });

  describe("ops", () => {
    it("delete", () => {
      var id = driver.fillLayersModal({
        type: "background"
      })

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":delete", ""))

      driver.isStyleStoreEqual((a: any) => a.layers, []);
    });

    it("duplicate", () => {
      var styleObj;
      var id = driver.fillLayersModal({
        type: "background"
      })

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":copy", ""));

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id+"-copy",
          "type": "background"
        },
        {
          "id": id,
          "type": "background"
        },
      ]);
    });

    it("hide", () => {
      var styleObj;
      var id = driver.fillLayersModal({
        type: "background"
      })

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'background'
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":toggle-visibility", ""));

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "none"
          }
        },
      ]);

      driver.click(driver.getDataAttribute("layer-list-item:"+id+":toggle-visibility", ""));

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "background",
          "layout": {
            "visibility": "visible"
          }
        },
      ]);
    })
  })


  describe('background', () => {

    it("add", () => {
      var id = driver.fillLayersModal({
        type: "background"
      })

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'background'
        }
      ]);
    });

    describe("modify", () => {
      function createBackground() {
        // Setup
        var id = uuid();

        driver.select(driver.getDataAttribute("add-layer.layer-type", "select"), "background");
        driver.setValue(driver.getDataAttribute("add-layer.layer-id", "input"), "background:"+id);

        driver.click(driver.getDataAttribute("add-layer"));

        driver.isStyleStoreEqual((a: any) => a.layers, [
          {
            "id": 'background:'+id,
            "type": 'background'
          }
        ]);
        return id;
      }

      // ====> THESE SHOULD BE FROM THE SPEC
      describe("layer", () => {
        it("expand/collapse");
        it("id", () => {
          var bgId = createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var id = uuid();
          driver.setValue(driver.getDataAttribute("layer-editor.layer-id", "input"), "foobar:"+id)
          driver.click(driver.getDataAttribute("min-zoom"));

          driver.isStyleStoreEqual((a: any) => a.layers, [
            {
              "id": 'foobar:'+id,
              "type": 'background'
            }
          ]);
        });

        it("min-zoom", () => {
          var bgId = createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          driver.setValue(driver.getDataAttribute("min-zoom", 'input[type="text"]'), "1");

          driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          driver.isStyleStoreEqual((a: any) => a.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "minzoom": 1
            }
          ]);

          // AND RESET!
          // driver.setValue(driver.getDataAttribute("min-zoom", "input"), "")
          // driver.click(driver.getDataAttribute("max-zoom", "input"));

          // driver.isStyleStoreEqual((a: any) => a.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("max-zoom", () => {
          var bgId = createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          driver.setValue(driver.getDataAttribute("max-zoom", 'input[type="text"]'), "1")

          driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          driver.isStyleStoreEqual((a: any) => a.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              "maxzoom": 1
            }
          ]);
        });

        it("comments", () => {
          var bgId = createBackground();
          var id = uuid();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));
          driver.setValue(driver.getDataAttribute("layer-comment", "textarea"), id);

          driver.click(driver.getDataAttribute("layer-editor.layer-id", "input"));

          driver.isStyleStoreEqual((a: any) => a.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background',
              metadata: {
                'maputnik:comment': id
              }
            }
          ]);

          // Unset it again.
          // TODO: This fails
          // driver.setValue(driver.getDataAttribute("layer-comment", "textarea"), "");
          // driver.click(driver.getDataAttribute("min-zoom", "input"));

          // driver.isStyleStoreEqual((a: any) => a.layers, [
          //   {
          //     "id": 'background:'+bgId,
          //     "type": 'background'
          //   }
          // ]);
        });

        it("color", () => {
          var bgId = createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          driver.click(driver.getDataAttribute("spec-field:background-color", "input"));

          driver.isStyleStoreEqual((a: any) => a.layers, [
            {
              "id": 'background:'+bgId,
              "type": 'background'
            }
          ]);

        })
      })

      describe("filter", () => {
        it("expand/collapse");
        it("compound filter");
      })

      describe("paint", () => {
        it("expand/collapse");
        it("color");
        it("pattern");
        it("opacity");
      })
      // <=====

      describe("json-editor", () => {
        it("expand/collapse");
        it("modify");

        // TODO
        it.skip("parse error", () => {
          var bgId = createBackground();

          driver.click(driver.getDataAttribute("layer-list-item:background:"+bgId));

          var errorSelector = ".CodeMirror-lint-marker-error";
          driver.doesNotExists(errorSelector);

          driver.click(".CodeMirror");
          driver.typeKeys("\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013\uE013 {");
          driver.isExists(errorSelector);

          driver.click(driver.getDataAttribute("layer-editor.layer-id"));
        });
      });
    })
  });

  describe('fill', () => {
    it("add", () => {

      var id = driver.fillLayersModal({
        type: "fill",
        layer: "example"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'fill',
          "source": "example"
        }
      ]);
    })

    // TODO: Change source
    it("change source")
  });

  describe('line', () => {
    it("add", () => {
      var id = driver.fillLayersModal({
        type: "line",
        layer: "example"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "line",
          "source": "example",
        }
      ]);
    });

    it("groups", () => {
      // TODO
      // Click each of the layer groups.
    })
  });

  describe('symbol', () => {
    it("add", () => {
      var id = driver.fillLayersModal({
        type: "symbol",
        layer: "example"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "symbol",
          "source": "example",
        }
      ]);
    });
  });

  describe('raster', () => {
    it("add", () => {
      var id = driver.fillLayersModal({
        type: "raster",
        layer: "raster"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "raster",
          "source": "raster",
        }
      ]);
    });
  });

  describe('circle', () => {
    it("add", () => {
      var id = driver.fillLayersModal({
        type: "circle",
        layer: "example"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": "circle",
          "source": "example",
        }
      ]);
    });

  });

  describe('fill extrusion', () => {
    it("add", () => {
      var id = driver.fillLayersModal({
        type: "fill-extrusion",
        layer: "example"
      });

      driver.isStyleStoreEqual((a: any) => a.layers, [
        {
          "id": id,
          "type": 'fill-extrusion',
          "source": "example"
        }
      ]);
    });
  });


  describe("groups", () => {
    it("simple", () => {
      driver.setStyle("geojson");

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo",
        type: "background"
      })

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo_bar",
        type: "background"
      })

      driver.openLayersModal();
      driver.fillLayersModal({
        id: "foo_bar_baz",
        type: "background"
      })

      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo"));
      driver.isNotDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar"));
      driver.isNotDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz"));

      driver.click(driver.getDataAttribute("layer-list-group:foo-0"));

      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo"));
      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar"));
      driver.isDisplayedInViewport(driver.getDataAttribute("layer-list-item:foo_bar_baz"));
    })
  })
});
