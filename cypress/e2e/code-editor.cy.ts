import { MaputnikDriver } from "./maputnik-driver";

describe("code editor", () => {
    const { beforeAndAfter, when, get, then } = new MaputnikDriver();
    beforeAndAfter();
    
    it("open code editor", () => {
        when.click("nav:code-editor");
        then(get.element(".maputnik-code-editor")).shouldExist();
    });

    it("closes code editor", () => {
        when.click("nav:code-editor");
        then(get.element(".maputnik-code-editor")).shouldExist();
        when.click("nav:code-editor");
        then(get.element(".maputnik-code-editor")).shouldNotExist();
    });
});