# desktop
A Golang based cross platform executable for integrating Maputnik locally


### Build

First you need a app bundle distribution of Maptunik and copy over `public`
to the `gui` folder in this project.

```
npm run dist
```

Package the the `gui` as binary assets.

```
go get github.com/elazarl/go-bindata-assetfs/...
go-bindata-assetfs gui/...
```

Install the go package.

```
go install
```

