<img width="200" alt="Maputnik logo" src="https://cdn.jsdelivr.net/gh/maputnik/design/logos/logo-color.png" />

# Maputnik
[![GitHub CI status](https://github.com/maplibre/maputnik/workflows/ci/badge.svg)][github-action-ci]
[![License](https://img.shields.io/badge/license-MIT-blue.svg)][license]

[github-action-ci]: https://github.com/maplibre/maputnik/actions?query=workflow%3Aci
[license]:          https://tldrlegal.com/license/mit-license

A free and open visual editor for the [MapLibre GL styles](https://maplibre.org/maplibre-style-spec/)
targeted at developers and map designers.


## Usage

- :link: Design your maps online at **<https://www.maplibre.org/maputnik/>** (all in local storage)
- :link: Use the [Maputnik CLI](https://github.com/maplibre/maputnik/wiki/Maputnik-CLI) for local style development
- In a Docker, run this command and browse to http://localhost:8888, Ctrl+C to stop the server.

```bash
docker run -it --rm -p 8888:80 ghcr.io/maplibre/maputnik:main
```

## Documentation

The documentation can be found in the [Wiki](https://github.com/maplibre/maputnik/wiki). You are welcome to collaborate!

- :link: **Study the [Maputnik Wiki](https://github.com/maplibre/maputnik/wiki)**
- :video_camera: Design a map from Scratch https://youtu.be/XoDh0gEnBQo

[![Design Map from Scratch](https://j.gifs.com/g5XMgl.gif)](https://youtu.be/XoDh0gEnBQo)

## Develop

Maputnik is written in typescript and is using [React](https://github.com/facebook/react) and [MapLibre GL JS](https://maplibre.org/projects/maplibre-gl-js/).

We ensure building and developing Maputnik works with the [current active LTS Node.js version and above](https://github.com/nodejs/Release#release-schedule).

Check out our [Internationalization guide](./src/locales/README.md) for UI text related changes. 

### Getting Involved
Join the #maplibre or #maputnik slack channel at OSMUS: get an invite at https://slack.openstreetmap.us/ Read the the below guide in order to get familiar with how we do things around here.

Install the deps, start the dev server and open the web browser on `http://localhost:8888/`.

```bash
# install dependencies
npm install
# start dev server
npm run start
```

If you want Maputnik to be accessible externally use the [`--host` option](https://vitejs.dev/config/server-options.html#server-host):

```bash
# start externally accessible dev server
npm run start -- --host 0.0.0.0
```

The build process will watch for changes to the filesystem, rebuild and autoreload the editor.

```
npm run build
```

Lint the JavaScript code.

```
# run linter
npm run lint
npm run lint-css
npm run sort-styles
```


## Tests
For E2E testing we use [Cypress](https://www.cypress.io/)

 [Cypress](https://www.cypress.io/) doesn't starts a server so you'll need to start one manually by running `npm run start`.

Now open a terminal and run the following using *chrome*:

```
npm run test
```
or *firefox*:
```
npm run test -- --browser firefox
```

See the following docs for more info: (Launching Browsers)[https://docs.cypress.io/guides/guides/launching-browsers]

You can also see the tests as they run or select which suites to run by executing:

```
npm run cy:open
```

## Release process

1. Review [`CHANGELOG.md`](/CHANGELOG.md)
   - Double-check that all changes included in the release are appropriately documented.
   - To-be-released changes should be under the "main" header.
   - Commit any final changes to the changelog.
2. Run [Create bump version PR](https://github.com/maplibre/maputnik/actions/workflows/create-bump-version-pr.yml) by manual workflow dispatch and set the version number in the input. This will create a PR that changes the changelog and `package.json` file to review and merge.
3. Once merged, an automatic process will kick in and creates a GitHub release and uploads release assets.


## Sponsors

Thanks to the supporters of the **[Kickstarter campaign](https://www.kickstarter.com/projects/174808720/maputnik-visual-map-editor-for-mapbox-gl)**. This project would not be possible without these commercial and individual sponsors.
You can see this file's history for previous sponsors of the original Maputnik repo.
Read more about the MapLibre Sponsorship Program at https://maplibre.org/sponsors/.

## License

Maputnik is [licensed under MIT](LICENSE) and is Copyright (c) Lukas Martinelli and Maplibre contributors.
As contributor please take extra care of not violating any Mapbox trademarks. Do not get inspired by other map studios and make your own decisions for a good style editor.
