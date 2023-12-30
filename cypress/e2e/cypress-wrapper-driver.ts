import { CypressHelper } from "@shellygo/cypress-test-utils";

export default class CypressWrapperDriver {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });

  public given = {
    ...this.helper.given,
  };

  public get = {
    ...this.helper.get,
    elementByClassOrType(slector: string) {
      return cy.get(slector);
    },
  };

  public when = {
    ...this.helper.when,
    confirmAlert() {
      cy.on("window:confirm", () => true);
    },
  };

  public beforeAndAfter = this.helper.beforeAndAfter;
}
