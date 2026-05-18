/// <reference types="cypress-real-events" />
import { CypressHelper } from "@shellygo/cypress-test-utils";
import "cypress-real-events/support";

export default class MaputnikCypressHelper {
  private helper = new CypressHelper({ defaultDataAttribute: "data-wd-key" });

  public given = {
    ...this.helper.given,
  };

  public get = {
    locationHash: (): Cypress.Chainable<string> => cy.location("hash"),
    ...this.helper.get,
  };

  public when = {
    dragAndDropWithWait: (element: string, targetElement: string) => {
      this.helper.get.elementByTestId(element).realMouseDown({ button: "left", position: "center" });
      this.helper.get.elementByTestId(element).realMouseMove(0, 10, { position: "center" });
      this.helper.get.elementByTestId(targetElement).realMouseMove(0, 0, { position: "center" });
      this.helper.when.wait(1);
      this.helper.get.elementByTestId(targetElement).realMouseUp();
    },
    clickCenter: (element: string) => {
      this.helper.get.elementByTestId(element).realMouseDown({ button: "left", position: "center" });
      this.helper.when.wait(200);
      this.helper.get.elementByTestId(element).realMouseUp();
    },
    openFileByFixture: (fixture: string, buttonTestId: string, inputTestId: string) => {
      cy.window().then((win) => {
        const file = {
          text: cy.stub().resolves(cy.fixture(fixture).then(JSON.stringify)),
        };
        const fileHandle = {
          getFile: cy.stub().resolves(file),
        };
        if (!win.showOpenFilePicker) {
          this.helper.get.elementByTestId(inputTestId).selectFile("cypress/fixtures/" + fixture, { force: true });
        } else {
          cy.stub(win, "showOpenFilePicker").resolves([fileHandle]);
          this.helper.get.elementByTestId(buttonTestId).click();
        }
      });
    },
    dropFileByFixture: (fixture: string, dropzoneTestId: string) => {
      this.helper.get.elementByTestId(dropzoneTestId).selectFile("cypress/fixtures/" + fixture, {
        action: "drag-drop",
        force: true,
      });
    },

    pointerDrag: (testId: string, deltaX: number) => {
      cy.get(`[data-wd-key="${testId}"]`).then(($el) => {
        const rect = $el[0].getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;

        cy.document().trigger("pointerdown", {
          clientX: startX,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointermove", {
          clientX: startX + deltaX,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 1,
          pointerType: "mouse",
          bubbles: true,
        });
        cy.document().trigger("pointerup", {
          clientX: startX + deltaX,
          clientY: startY,
          pointerId: 1,
          button: 0,
          buttons: 0,
          pointerType: "mouse",
          bubbles: true,
        });
      });
    },
    ...this.helper.when,
    visit: (url: string, options?: Partial<Cypress.VisitOptions>) => {
      cy.visit(url, options);
    },
  };

  public beforeAndAfter = this.helper.beforeAndAfter;
}
