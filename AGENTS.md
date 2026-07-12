Maputnik is a MapLibre style editor written using React and TypeScript.

To get started, install all npm packages:

```
npm install
```

Verify code correctness by running ESLint:

```
npm run lint
```

Or try fixing lint issues with:

```
npm run lint -- --fix
```

The project type checked and built with:

```
npm run build
```

Install the Playwright browser (first time only):

```
npx playwright install --with-deps chromium
```

Then run the end-to-end tests (Playwright starts the dev server automatically):

```
npm run test
```

Run the unit tests with Vitest:

```
npm run test-unit
```

## Pull Requests

- Pull requests should update `CHANGELOG.md` with a short description of the change.

## Testing

### Prefer end-to-end tests

Most of this codebase is React components, and they are only reachable from an
end-to-end test. E2E coverage is the primary signal.

Reach for a unit test only for pure logic that e2e cannot cheaply reach (parsers,
sorting, watchers, stores). Before writing one, check whether e2e already covers
the file — a unit test that duplicates existing e2e coverage adds test code and
almost no coverage:

```
npx nyc report --reporter=text --include="src/libs/style.ts"
```

Do **not** merge the Vitest (v8) and e2e (istanbul) coverage reports locally. They
produce conflicting statement maps for the same files and the combined percentage
is meaningless. Codecov merges the two uploads server-side; that is the number to
trust. Locally, read them separately:

- e2e: `npx playwright test` then `npx nyc report --reporter=text-summary` (reads `.nyc_output/`)
- unit: `npx vitest run --coverage` (writes `coverage/`)

### E2E layering

Three layers, and the boundaries matter:

- `e2e/playwright-helper.ts` — generic, app-agnostic browser actions. **The only
  file allowed to import `@playwright/test`** (besides `e2e/utils/fixtures.ts`).
- `e2e/maputnik-driver.ts` — domain actions (layers, filters, functions, the
  style). Knows nothing about `page` or Playwright.
- `e2e/modal-driver.ts` — actions scoped to a modal, exposed as `when.modal.*`.

Specs get a driver at describe scope and assert fluently:

```ts
describe("layer editor", () => {
  const { given, get, when, then } = new MaputnikDriver();
  ...
  await then(get.styleFromLocalStorage()).shouldDeepNestedInclude({ layers: [{ id, type: "fill" }] });
});
```

New UI interactions belong in a driver, not inline in a spec.

### Writing assertions

- `shouldDeepNestedInclude` is a recursive partial match (`toMatchObject`): nested
  objects are matched as subsets, arrays and primitives must match exactly
  (including array length).
- Assert against the whole style, not an extracted slice. Avoid
  `get.styleFromLocalStorage().then(style => style.layers.find(...))` — it moves
  test logic into the test. Compare the real object instead.
- `Query.then()` is lazy and returns a new `Query`, **not** a Promise. `await
  get.styleFromLocalStorage()` hangs forever. Use `.get()` to await it directly,
  or pass the Query to `then(...)`.

### One behaviour per test

If a test needs comments narrating "and now this…", it is several tests. Split it,
and hoist the shared setup into a nested `describe` + `beforeEach`.

### Test ids

Test ids use the `data-wd-key` attribute and are read via `get.elementByTestId`.

The `Input*` components already accept `data-wd-key` and render it on the real
`<input>`; the `Field*` wrappers forward it through their `{...props}` spread. So
passing `data-wd-key` to a `Field*` component is usually enough. Do **not** also
add it to `Block`/`Fieldset` — the id then matches two elements and locators fail
in strict mode.

Note `InputNumber` renders `<key>-text` and `<key>-range` when `allowRange` is set,
and `<key>` otherwise.

### Input commit semantics (common source of "the value didn't save")

- `InputString` only fires its `onChange` on **blur** or **Enter**. Typing alone
  fires `onInput`. A driver that calls `fill()` must then call `blur()`, or the
  value never reaches the style.
- `InputNumber` commits on every change; no blur needed.
- The autocomplete inputs (layer source, add-layer source) are controlled
  downshift comboboxes. Keystroke typing is dropped/reordered — `{selectall}` then
  typing `raster` yields `"exampleaster"`. Use `fill()`, which dispatches a single
  input event, then pick from the filtered menu.
- CodeMirror auto-closes brackets and quotes, and types over its own closers, so
  inserting a well-formed JSON fragment stays well-formed. To break JSON on
  purpose, insert a bare word.

### Fixtures

Style fixtures live in `e2e/fixtures/`. A new one must be registered in two places
in `maputnik-driver.ts`: the list in `given.setupMockBackedResponses` and the
`styleFileByKey` map in `when.setStyle`.

### Verify a new test can fail

A test that passes for the wrong reason is worse than no test. After writing one,
mutate the expected value and confirm it fails. This has caught real mistakes
(e.g. a driver that never committed its input, so the assertion was matching a
value written by the *previous* step).
