# Maputnik Desktop [![Build Status](https://travis-ci.org/maputnik/desktop.svg?branch=master)](https://travis-ci.org/maputnik/desktop)

A Golang based cross platform executable for integrating Maputnik locally.
The idea is to package up the JavaScript and CSS bundle produced by [maputnik/editor](https://github.com/maputnik/desktop)
and embed it in the server program.

### Usage

*Not functional yet*

Simply start up a web server and access the Maputnik editor GUI at `localhost:8000`.

```
maputnik
```

Expose a local style file to Maputnik allowing the web based editor
to save to the local filesystem.

```
maputnik --file basic-v9.json
```

Watch the local style for changes and inform the editor via web socket.
This makes it possible to edit the style with a local text editor and still
use Maputnik.

```
maputnik --watch --file basic-v9.json
```

### Build

Clone the repository **recursively** since the Maputnik editor is embedded
as submodule. Make sure you clone it into the correct directory `$GOPATH/src/github.com/maputnik`.

```
git clone --recursive git@github.com:maputnik/desktop.git
```

Install the 3rd party dependencies.

```
go get github.com/gorilla/handlers
go get github.com/gorilla/mux
go get github.com/gorilla/websocket
go get github.com/urfave/cli
go get github.com/elazarl/go-bindata-assetfs/...
go get github.com/jteeuwen/go-bindata/...
```

Run `make` to build the app distribution bundle and create the `maputnik` binary
embedding the editor.

```
make
```

You should now find the `maputnik` binary in your directory.
