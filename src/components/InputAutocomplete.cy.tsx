import InputAutocomplete from "./InputAutocomplete";
import { mount } from "cypress/react";

const fruits = ["apple", "banana", "cherry"];

describe("<InputAutocomplete />", () => {
  it("filters options when typing", () => {
    mount(
      <InputAutocomplete aria-label="Fruit" options={fruits.map(f => [f, f])} />
    );
    cy.get("input").focus();
    cy.get(".maputnik-autocomplete-menu-item").should("have.length", 3);
    cy.get("input").type("ch");
    cy.get(".maputnik-autocomplete-menu-item").should("have.length", 1).and("contain", "cherry");
    cy.get(".maputnik-autocomplete-menu-item").click();
    cy.get("input").should("have.value", "cherry");
  });
});
