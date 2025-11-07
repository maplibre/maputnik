import React from "react";
import { mount } from "cypress/react18";
import InputUrl from "../../../src/components/InputUrl";

/**
 * The InputUrl component is exported wrapped by withTranslation().
 * The HOC usually exposes the wrapped component on the .WrappedComponent property.
 * Fall back to the default export if not present.
 */
const InputUrlInternal = (InputUrl as any).WrappedComponent || InputUrl;

/**
 * Set window.location.protocol in the test window before mounting so the
 * component reads the intended protocol during its validation.
 */
function setWindowProtocol(protocol: string) {
  cy.window().then((win) => {
    Object.defineProperty(win, "location", {
      configurable: true,
      value: { protocol },
    });
  });
}

describe("InputUrl component (Cypress component tests)", () => {
  it("shows protocol-required error on https page when URL missing protocol", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="example.com"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("Must provide protocol").should("exist");
    cy.contains("https://").should("exist");
  });

  it("shows protocol-required (http or https) on http page when URL missing protocol", () => {
    setWindowProtocol("http:");
    mount(
      <InputUrlInternal
        value="example.com"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("Must provide protocol").should("exist");
    cy.contains("http://").should("exist");
    cy.contains("https://").should("exist");
  });

  it("shows CORS error when page is https and URL is http and not localhost", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="http://example.com"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("CORS policy").should("exist");
  });

  it("does NOT show CORS error for http localhost domain when page is https", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="http://localhost:3000"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("CORS policy").should("not.exist");
    cy.contains("Must provide protocol").should("not.exist");
  });

  it("does NOT show CORS error for 127.0.0.1 when page is https", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="http://127.0.0.1:8000"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("CORS policy").should("not.exist");
  });

  it("does NOT show CORS error for IPv6 localhost [::1] when page is https", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="http://[::1]:8000"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("CORS policy").should("not.exist");
  });

  it("no error for https URL when page is https", () => {
    setWindowProtocol("https:");
    mount(
      <InputUrlInternal
        value="https://example.com"
        onChange={() => {}}
        onInput={() => {}}
        t={(k: any) => k}
        i18n={{}}
        tReady
      />
    );

    cy.contains("CORS policy").should("not.exist");
    cy.contains("Must provide protocol").should("not.exist");
  });
});
