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

Run the unit and component tests with Vitest:

```
npm run test-unit
```

## Pull Requests

- Pull requests should update `CHANGELOG.md` with a short description of the change.
