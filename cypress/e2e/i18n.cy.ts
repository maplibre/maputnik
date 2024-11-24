import { MaputnikDriver } from "./maputnik-driver";

const selectorId = "maputnik-lang-select";

describe("i18n", () => {
  let { beforeAndAfter, get, when, then } = new MaputnikDriver();
  beforeAndAfter();

  describe("language detector", () => {
    it("English", () => {
      const url = "?lng=en";
      when.visit(url);
      then(get.elementByTestId(selectorId)).shouldHaveValue("en");
    });

    it("Japanese", () => {
      const url = "?lng=ja";
      when.visit(url);
      then(get.elementByTestId(selectorId)).shouldHaveValue("ja");
    });
  });

  describe("language switcher", () => {
    beforeEach(() => {
      when.setStyle("layer");
    });

    it("the language switcher switches to Japanese", () => {
      then(get.elementByTestId(selectorId)).shouldExist();
      when.select(selectorId, "ja");
      then(get.elementByTestId(selectorId)).shouldHaveValue("ja");

      then(get.elementByTestId("nav:settings")).shouldHaveText("スタイル設定");
    });
  });

  describe("load different style depending on selected language", () => {
    const testLang = (lang: string) => {
      cy.intercept('GET', `**/${lang}.json*`).as(`${lang}JsonRequest`);

      then(get.elementByTestId(selectorId)).shouldExist();
      when.select(selectorId, lang);
      then(get.elementByTestId(selectorId)).shouldHaveValue(lang);

      cy.get('[data-wd-key="nav:open"]')
        .should('exist')
        .click();

      cy.get('[aria-label="Protomaps Light"]')
        .should('exist')
        .click();

      cy.wait(`@${lang}JsonRequest`).then((interception) => {
        expect(interception).to.exist;
        cy.log(`Network request to ${lang}.json was made`);
      });
    }

    it("works with he", () => {
      testLang("he");
    });

    it("works with de", () => {
      testLang("de");
    });
  });
});
