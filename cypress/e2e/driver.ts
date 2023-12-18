import {v1 as uuid} from "uuid";

export default {
    isMac() {
        return Cypress.platform === "darwin";
    },

    beforeEach() {
      this.setupInterception();
      this.setStyle('both');
    },

    setupInterception() {
      cy.intercept('GET', 'http://localhost:8888/example-style.json', { fixture: 'example-style.json' }).as('example-style.json');
      cy.intercept('GET', 'http://localhost:8888/example-layer-style.json', { fixture: 'example-layer-style.json' });
      cy.intercept('GET', 'http://localhost:8888/geojson-style.json', { fixture: 'geojson-style.json' });
      cy.intercept('GET', 'http://localhost:8888/raster-style.json', { fixture: 'raster-style.json' });
      cy.intercept('GET', 'http://localhost:8888/geojson-raster-style.json', { fixture: 'geojson-raster-style.json' });
      cy.intercept({method: 'GET', url: '*example.local/*' }, []);
      cy.intercept({method: 'GET', url: '*example.com/*' }, []);
    },

    setStyle(styleProperties: 'geojson' | 'raster' | 'both' | 'layer' | '', zoom? : number) {
        let url = "?debug";
        switch (styleProperties) {
          case "geojson":
            url += "&style=http://localhost:8888/geojson-style.json";
            break;
          case "raster":
            url += "&style=http://localhost:8888/raster-style.json";
            break;
          case "both":
            url += "&style=http://localhost:8888/geojson-raster-style.json";
            break;
          case "layer":
            url += "&style=http://localhost:8888/example-layer-style.json";
            break;
        }
        if (zoom) {
          url += `#${zoom}/41.3805/2.1635`;
        }
        cy.visit(`http://localhost:8888/${url}`);
        if (styleProperties) {
            cy.on('window:confirm', () => true)
        }
        cy.get(".maputnik-toolbar-link").should("be.visible");
      },

      getDataAttribute(key: string, selector?: string) {
        return `*[data-wd-key='${key}'] ${selector || ''}`;
      },

      closeModal(key: string) {
        const selector = this.getDataAttribute(key);
      
        this.isDisplayedInViewport(selector);
      
        this.click(this.getDataAttribute(`${key}.close-modal`));
      
        this.doesNotExists(selector);
      },

      openLayersModal() {
        cy.get(this.getDataAttribute('layer-list:add-layer')).click();
  
        cy.get(this.getDataAttribute('modal:add-layer')).should('exist');
        cy.get(this.getDataAttribute('modal:add-layer')).should('be.visible');
      },

      getStyleFromWindow(win: Window) {
        const styleId = win.localStorage.getItem("maputnik:latest_style");
        const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`)
        return JSON.parse(styleItem || "");
      },

      isStyleStoreEqual(getter: (obj:any) => any, styleObj: any) {
        cy.window().then((win: any) => {
          const obj = this.getStyleFromWindow(win);
          assert.deepEqual(getter(obj), styleObj);
        });
      },

      isStyleStoreEqualToExampleFileData() {
        cy.window().then((win: any) => {
          const obj = this.getStyleFromWindow(win);
          cy.fixture('example-style.json').should('deep.equal', obj);
        });
      },

      fillLayersModal(opts: any) {
        const type = opts.type;
        const layer = opts.layer;
        let id;
        if(opts.id) {
          id = opts.id
        }
        else {
          id = `${type}:${uuid()}`;
        }
  
        cy.get(this.getDataAttribute('add-layer.layer-type', "select")).select(type);
        cy.get(this.getDataAttribute("add-layer.layer-id", "input")).type(id);
        if(layer) {
            cy.get(this.getDataAttribute("add-layer.layer-source-block", "input")).type(layer);
        }
        cy.get(this.getDataAttribute("add-layer")).click();

        return id;
      },

      typeKeys(keys: string) {
        cy.get('body').type(keys);
      },

      click(selector: string) {
        cy.get(selector).click();
      },

      select(selector: string, value: string) {
        cy.get(selector).select(value);
      },

      isSelected(selector: string, value: string) {
        cy.get(selector).find(`option[value="${value}"]`).should("be.selected");
      },


      focus(selector: string) {
        cy.get(selector).focus();
      },

      isFocused(selector: string) {
        cy.get(selector).should('have.focus');
      },

      isDisplayedInViewport(selector: string) {
        cy.get(selector).should('be.visible');
      },

      isNotDisplayedInViewport(selector: string) {
        cy.get(selector).should('not.be.visible');
      },

      setValue(selector: string, text: string) {
        cy.get(selector).clear().type(text, {parseSpecialCharSequences: false});
      },

      isExists(selector: string) {
        cy.get(selector).should('exist');
      },

      doesNotExists(selector: string) {
        cy.get(selector).should('not.exist');
      },

      chooseExampleFile() {
        cy.get("input[type='file']").selectFile('cypress/fixtures/example-style.json', {force: true});
      },

      getExampleFileUrl() {
        return "http://localhost:8888/example-style.json";
      },

      waitForExampleFileRequest() {
        cy.wait('@example-style.json');
      }
}
