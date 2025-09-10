/// <reference types="cypress-real-events" />
import { CypressHelper } from "@shellygo/cypress-test-utils";
import 'cypress-real-events/support';

export default class MaputnikCypressHelper {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });

  public given = {
    ...this.helper.given,
  };

  public get = {
    ...this.helper.get,
  };

  public when = {
    dragAndDropWithWait: (element: string, targetElement: string) => {
      this.helper.get.elementByTestId(element).realMouseDown({ button: "left", position: "center" });
      this.helper.get.elementByTestId(element).realMouseMove(0, 10, { position: "center" });
      this.helper.get.elementByTestId(targetElement).realMouseMove(0, 0, { position: "center" })
      this.helper.when.wait(1);
      this.helper.get.elementByTestId(targetElement).realMouseUp();
    },
    clickCenter: (element: string) => {
      this.helper.get.elementByTestId(element).realMouseDown({ button: "left", position: "center" });
      this.helper.when.wait(200);
      this.helper.get.elementByTestId(element).realMouseUp();
    },
    ...this.helper.when,
  };

  public beforeAndAfter = this.helper.beforeAndAfter;
}
