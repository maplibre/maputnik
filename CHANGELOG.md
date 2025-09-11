## main

### ✨ Features and improvements
- Added translation to "Links" in debug modal
- _...Add new stuff here..._

### 🐞 Bug fixes

- Fixed an issue when clicking on a popup and then clicking on the map again
- Fix modal close button possition
- Fixed an issue with the generation of tranlations
- Fix missing spec info when clicking next to a property
- _...Add new stuff here..._

## 3.0.0

### ✨ Features and improvements
- Fix radio/delete filter buttons styling regression
- Add german translation
- Use same version number for web and desktop versions
- Add scheme type options for vector/raster tile
- Add `tileSize` field for raster and raster-dem tile sources
- Update Protomaps Light gallery style to v4
- Add support to edit local files on the file system if supported by the browser
- Upgrade to MapLibre LG JS v5
- Upgrade Vite 6 and Cypress 14 ([#970](https://github.com/maplibre/maputnik/pull/970))
- Upgrade OpenLayers from v6 to v10
- When loading a style into localStorage that causes a QuotaExceededError, purge localStorage and retry
- Remove react-autobind dependency
- Remove usage of legacy `childContextTypes` API
- Refactor Field components to use arrow function syntax
- Replace react-autocomplete with Downshift in the autocomplete component
- Add LocationIQ as supported map provider with access token field and gallery style
- Use maputnik go binary for the docker image to allow file watching
- Revmove support for `debug` and `localport` url parameters
- Replace react-sortable-hoc with dnd-kit to avoid react console warnings and also use a maintained library

### 🐞 Bug fixes

- Fix incorrect handing of network error response (#944)
- Show an error when adding a layer with a duplicate ID
- Replace deprecated `ReactDOM.render` usage with `createRoot` and drop the
  `DOMNodeRemoved` cleanup hack

## 2.1.1

### ✨ Features and improvements

- Add GitHub workflows for releasing new versions
- Update desktop build to pull from this repo (#922)

## 2.0.0

- Update MapLibre to version 4 (#872)
- Start continuous deployment of maputnik website

## 1.7.0

- See release notes at https://maputnik.github.io/blog/2020/04/23/release-v1.7.0
