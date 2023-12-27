import { CypressHelper } from "@shellygo/cypress-test-utils";

export default class CypressWrapperDriver {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });

  public given = {
    ...this.helper.given,
    /**
         * 
         * @param url a url to a file, this assumes the file name is the last part of the url
         * @param alias 
         */
    interceptGetToFile(url: string) {
      let fileNameAndAlias = url.split('/').pop();
      cy.intercept('GET', url, { fixture: fileNameAndAlias }).as(fileNameAndAlias!);
    },

    interceptAndIgnore(url: string) {
      cy.intercept({ method: "GET", url }, []);
    }
  }

  public get = {
    ...this.helper.get,
    elementByClassOrType(slector: string) {
      return cy.get(slector);
    }
  }

  public when = {
    ...this.helper.when,
    visit(address: string) {
      cy.visit(address);
    },
    confirmAlert() {
      cy.on("window:confirm", () => true);
    }
  }

  public beforeAndAfter = this.helper.beforeAndAfter;
}