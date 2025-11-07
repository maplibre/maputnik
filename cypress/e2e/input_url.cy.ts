/**
 * E2E tests for InputUrl validation (Load from URL modal).
 *
 * This file uses pure Cypress E2E style (no JSX) and sets window.location.protocol
 * via onBeforeLoad so the app reads the intended protocol during initialization.
 *
 * The tests open the "Open Style" modal in the running app and interact with the
 * input whose data-wd-key is "modal:open.url.input" (as defined in the ModalOpen component).
 *
 * Adjust selectors/text if your i18n/localized strings or data-wd-key attributes differ.
 */

describe("Load from URL modal — InputUrl validation", () => {
  const openModal = () => {
    // Click an element that opens the "Open Style" modal.
    // The repo's ModalOpen title is "Open Style" so this targets that UI affordance.
    // If your app has a different control to open the modal, replace this selector.
    cy.contains("Open Style").click();
  };

  const typeUrlAndBlur = (value: string) => {
    cy.get('[data-wd-key="modal:open.url.input"]')
      .clear()
      .type(value)
      // blur to ensure change/input handlers run
      .blur();
  };

  it("shows protocol-required error on https page when URL missing protocol", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // ensure component sees an https: page protocol
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("example.com");

    cy.contains("Must provide protocol").should("exist");
    cy.contains("https://").should("exist");
  });

  it("shows protocol-required (http or https) on http page when URL missing protocol", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "http:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("example.com");

    cy.contains("Must provide protocol").should("exist");
    cy.contains("http://").should("exist");
    cy.contains("https://").should("exist");
  });

  it("shows CORS error when page is https and URL is http and not localhost", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("http://example.com");

    cy.contains("CORS policy").should("exist");
    cy.contains("http://").should("exist");
  });

  it("does NOT show CORS error for http localhost domain when page is https", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("http://localhost:3000");

    cy.contains("CORS policy").should("not.exist");
    cy.contains("Must provide protocol").should("not.exist");
  });

  it("does NOT show CORS error for 127.0.0.1 when page is https", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("http://127.0.0.1:8000");

    cy.contains("CORS policy").should("not.exist");
  });

  it("does NOT show CORS error for IPv6 localhost [::1] when page is https", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("http://[::1]:8000");

    cy.contains("CORS policy").should("not.exist");
  });

  it("no error for https URL when page is https", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    typeUrlAndBlur("https://example.com");

    cy.contains("CORS policy").should("not.exist");
    cy.contains("Must provide protocol").should("not.exist");
  });
});
