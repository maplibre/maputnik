<img width="200" alt="Maputnik logo" src="https://cdn.jsdelivr.net/gh/maputnik/design/logos/logo-color.png" />

# Maputnik
[![GitHub CI status](https://github.com/maputnik/editor/workflows/ci/badge.svg)][github-action-ci]
[![License](https://img.shields.io/badge/license-MIT-blue.svg)][license]

[github-action-ci]: https://github.com/maputnik/editor/actions?query=workflow%3Aci
[license]:          https://tldrlegal.com/license/mit-license

A free and open visual editor for the [MapLibre GL styles](https://maplibre.org/maplibre-style-spec/)
targeted at developers and map designers.


## Usage

- :link: Design your maps online at **<https://maputnik.github.io/editor/>** (all in local storage)
- :link: Use the [Maputnik CLI](https://github.com/maputnik/editor/wiki/Maputnik-CLI) for local style development
- In a Docker, run this command and browse to http://localhost:8888, Ctrl+C to stop the server.

```bash
docker run -it --rm -p 8888:8888 maputnik/editor
```

## Donations
Mapbox has built one of the best and most amazing OSS ecosystems. A key component to ensure its longevity and independence is an OSS map designer.
If you or your organisation has seen value from Maputnik, please consider donating at <https://maputnik.github.io/donate>

## Documentation

The documentation can be found in the [Wiki](https://github.com/maputnik/editor/wiki). You are welcome to collaborate!

- :link: **Study the [Maputnik Wiki](https://github.com/maputnik/editor/wiki)**
- :video_camera: Design a map from Scratch https://youtu.be/XoDh0gEnBQo

[![Design Map from Scratch](https://j.gifs.com/g5XMgl.gif)](https://youtu.be/XoDh0gEnBQo)

## Develop

Maputnik is written in ES6 and is using [React](https://github.com/facebook/react) and [MapLibre GL JS](https://maplibre.org/projects/maplibre-gl-js/).

We ensure building and developing Maputnik works with the [current active LTS Node.js version and above](https://github.com/nodejs/Release#release-schedule).

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
npm run lint-styles
```


## Tests
For E2E testing we use [Cypress](https://www.cypress.io/)

 [Cypress](https://www.cypress.io/) doesn't start a server, so you'll need to start one manually by running `npm run start`.

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


## Related Projects

- [maputnik-dev-server](https://github.com/nycplanning/labs-maputnik-dev-server) - An express.js server that allows for quickly loading the style from any mapboxGL map into mapuntnik.

## Sponsors

Thanks to the supporters of the **[Kickstarter campaign](https://www.kickstarter.com/projects/174808720/maputnik-visual-map-editor-for-mapbox-gl)**. This project would not be possible without these commercial and individual sponsors.

### Gold

- [Wemap](https://getwemap.com/)
- [Orbicon Informatik](https://www.orbiconinformatik.dk/)
- [Terranodo](http://terranodo.io/)

<a href="https://getwemap.com/">
  <img width="33%" alt="Wemap" style="display:inline" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/wemap.jpg" />
</a>
<a href="http://terranodo.io/">
  <img width="33%" alt="Terranodo" style="display:inline" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/terranodo.png" />
</a>
<a href="https://www.orbiconinformatik.dk/">
  <img width="32%" alt="Terranodo" style="display:inline" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/orbicon_informatik.png" />
</a>

<br/>

### Silver

- [Klokan Technologies](https://www.klokantech.com/)
- [Geofabrik](http://www.geofabrik.de/)
- [Dreipol](https://www.dreipol.ch/)

<a href="https://www.klokantech.com/">
  <img width="18%" alt="Klokan Technologies" style="display:inline-block" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/klokantech.png" />
</a>
<a href="http://www.geofabrik.de/">
  <img width="18%" alt="Geofabrik" style="display:inline-block" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/geofabrik.png" />
</a>
<a href="https://www.dreipol.ch/">
  <img width="18%" alt="Dreipol" style="display:inline-block" src="https://cdn.jsdelivr.net/gh/maputnik/editor@1.5.0/media/sponsors/dreipol.png" />
</a>

<br/>

### Individuals

**Influential Stakeholder**

Alan McConchie, Odi, Mats Norén, Uli [geOps](http://geops.ch/), Helge Fahrnberger ([Toursprung](http://www.toursprung.com/)), Kirusanth Poopalasingam

**Stakeholder**

Brian Flood, Vasile Coțovanu, Andreas Kalkbrenner, Christian Mäder, Gregor Wassmann, Lee Armstrong, Rafel, Jon Burgess, Lukas Lehmann, Joachim Ungar, Alois Ackermann, Zsolt Ero, Jordan Meek

**Supporter**

Sina Martinelli, Nicholas Doiron, Neil Cawse, Urs42, Benedikt Groß, Manuel Roth, Janko Mihelić, Moritz Stefaner, Sebastian Ahoi, Juerg Uhlmann, Tom Wider, Nadia Panchaud, Oliver Snowden, Stephan Heuel, Tobin Bradley, Adrian Herzog, Antti Lehto, Pascal Mages, Marc Gehling, Imre Samu, Lauri K., Visahavel Parthasarathy, Christophe Waterlot-Buisine, Max Galka, ubahnverleih, Wouter van Dam, Jakob Lobensteiner, Samuel Kurath, Brian Bancroft

## License

Maputnik is [licensed under MIT](LICENSE) and is Copyright (c) Lukas Martinelli and contributors.

**Disclaimer** This is an independent style editor.
As contributor please take extra care of not violating any Mapbox trademarks. Do not get inspired by Mapbox Studio and make your own decisions for a good style editor.
