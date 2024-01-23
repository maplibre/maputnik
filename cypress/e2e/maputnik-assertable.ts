import { CypressHelper } from "@shellygo/cypress-test-utils";
import { Assertable, then } from "@shellygo/cypress-test-utils/assertable";

const styleFromWindow = (win: Window) => {
  const styleId = win.localStorage.getItem("maputnik:latest_style");
  const styleItem = win.localStorage.getItem(`maputnik:style:${styleId}`);
  const obj = JSON.parse(styleItem || "");
  return obj;
};

export class MaputnikAssertable<T> extends Assertable<T> {
  shouldEqualToStoredStyle = () =>
    then(
      new CypressHelper().get.window().then((win) => {
        const style = styleFromWindow(win);
        then(this.chainable).shouldDeepNestedInclude(style);
      })
    );
}
