import { MaputnikDriver } from "./maputnik-driver";

describe("Load from URL modal — InputUrl validation (E2E)", () => {
  const { when, get, given } = new MaputnikDriver();

  beforeEach(() => {
    // Register mocked backend responses used by the app so the UI loads predictably
    given.setupMockBackedResponses();
    // Clear localStorage so tests start from a clean state
    cy.clearLocalStorage();
  });

  const openModal = () => {
    // Use the repo's driver to open the modal (keyboard/menu/button may vary across UI)
    when.click("nav:open");
    // Ensure the modal is open before continuing
    get.elementByTestId("modal:open").should("exist");
  };

  const setAndBlurUrl = (value: string) => {
    // Use driver's setValue which targets elements by data-wd-key
    when.setValue("modal:open.url.input", value);
    // Give the app a moment to run validation logic
    when.wait(100);
  };

  it("shows protocol-required error on https page when URL missing protocol", () => {
    cy.visit("/", {
      onBeforeLoad(win) {
        // Make the app believe it's served over https
        Object.defineProperty(win, "location", {
          configurable: true,
          value: { protocol: "https:" },
        });
      },
    });

    openModal();
    setAndBlurUrl("example.com");

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
    setAndBlurUrl("example.com");

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
    setAndBlurUrl("http://example.com");

    cy.contains("CORS policy").should("exist");
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
    setAndBlurUrl("http://localhost:3000");

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
    setAndBlurUrl("http://127.0.0.1:8000");

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
    setAndBlurUrl("http://[::1]:8000");

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
    setAndBlurUrl("https://example.com");

    cy.contains("CORS policy").should("not.exist");
    cy.contains("Must provide protocol").should("not.exist");
  });
});
