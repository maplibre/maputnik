Maputnik is a MapLibre style editor written using React and TypeScript.

To get started, install all npm packages:

```
npm install
```

Verify code correctness by running Biome:

```
npm run lint
```

Or try fixing lint issues with:

```
npx biome --write --unsafe
```

The project type checked and built with:

```
npm run build
```

To run the tests make sure that xvfb is installed:

```
apt install xvfb
```

Run the development server in the background with Vite:

```
nohup npm run start &
```

Then start the Cypress tests with:

```
xvfb-run -a npm run test
```

## Pull Requests

- Pull requests should update `CHANGELOG.md` with a short description of the change.
