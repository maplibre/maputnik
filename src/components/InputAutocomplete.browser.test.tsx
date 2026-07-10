import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { page } from "vitest/browser";
import InputAutocomplete from "./InputAutocomplete";

const fruits = ["apple", "banana", "cherry"];

test("filters options when typing", async () => {
  render(<InputAutocomplete aria-label="Fruit" options={fruits.map((f) => [f, f])} />);

  const input = page.getByLabelText("Fruit");
  await input.click();

  const menuItems = page.getByRole("option");
  await expect.element(menuItems.first()).toBeVisible();
  expect(menuItems.all()).toHaveLength(3);

  await input.fill("ch");
  await expect.element(page.getByText("cherry")).toBeVisible();
  expect(page.getByRole("option").all()).toHaveLength(1);

  await page.getByText("cherry").click();
  await expect.element(input).toHaveValue("cherry");
});
