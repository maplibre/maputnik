import { CypressHelper } from "@shellygo/cypress-test-utils";

export default class MaputnikCypressHelper {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });

  public given = {
    ...this.helper.given,
  };

  public get = {
    ...this.helper.get,
  };

  public when = {
    ...this.helper.when,
  };

  public beforeAndAfter = this.helper.beforeAndAfter;
}
