# Maputnik [![Build Status](https://travis-ci.org/maputnik/editor.svg?branch=master)](https://travis-ci.org/maputnik/editor) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/anelbgv6jdb3qnh9/branch/master?svg=true)](https://ci.appveyor.com/project/lukasmartinelli/editor) [![License](https://img.shields.io/badge/license-MIT-blue.svg)](https://tldrlegal.com/license/mit-license)

<img width="200" align="right" alt="Maputnik" src="src/img/maputnik.png" />

A free and open visual editor for the [Mapbox GL styles](https://www.mapbox.com/mapbox-gl-style-spec/)
targeted at developers and map designers. Creating your own custom map is easy with **Maputnik**.

:link: Check it out at **http://maputnik.com/editor/**

## Videos

### Editing a local Style JSON

**:video_camera: https://youtu.be/vCFsrwocE9s**

[![Edit local Style JSON with Maputnik](https://j.gifs.com/JZK8yg.gif)](https://youtu.be/vCFsrwocE9s)

### Latest Status Update Video

**:video_camera: https://youtu.be/z9MVwvzshiE**

[![Latest Status Update for  Maputnik v0.2.2](https://j.gifs.com/g5XMgl.gif)](https://www.youtube.com/watch?v=z9MVwvzshiE)

## Develop

Maputnik is written in ES6 and is using [React](https://github.com/facebook/react), [Immutable.js](https://facebook.github.io/immutable-js/) and [Mapbox GL JS](https://www.mapbox.com/mapbox-gl-js/api/).

We ensure building and developing Maputnik works with

- Linux, OSX and Windows
- Node >4

Install the deps, start the dev server and open the web browser on `http://localhost:8888/`.

```bash
# install dependencies
npm install
# start dev server
npm start
```

Build a production package for distribution.

```
npm run build
```

Lint the JavaScript code.

```
# install lint dependencies
npm install --save-dev eslint eslint-plugin-react
# run linter
npm run lint
```

## Docker

Start a container using the official Docker image.
```
docker run --name maputnik -p 8888:8888 -d maputnik/editor
```

Stop the container

```
docker stop maputnik
```

## Sponsors

Thanks to the supporters of the **[Kickstarter campaign](https://www.kickstarter.com/projects/174808720/maputnik-visual-map-editor-for-mapbox-gl)**. This project would not be possible without these commercial and individual sponsors.

### Gold

[![Wemap](media/sponsors/wemap.jpg)](https://getwemap.com/)

[![Terranodo](media/sponsors/terranodo.png)](http://terranodo.io/)

### Silver

<a href="https://www.klokantech.com/">
  <img alt="Klokan Technologies" style="display:inline" src="media/sponsors/klokantech.png" />
</a>
<a href="https://www.dreipol.ch/">
  <img alt="Dreipol" style="display:inline" src="media/sponsors/dreipol.png" />
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

**Disclaimer** This project is not affiliated with Mapbox or Mapbox Studio. It is a independent style editor for the
open source technology in the Mapbox GL ecosystem.
As contributor please take extra care of not violating any Mapbox trademarks. Do not get inspired by Mapbox Studio and make your own decisions for a good style editor.
