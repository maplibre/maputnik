# Maputnik Desktop [![Build Status](https://travis-ci.org/maputnik/desktop.svg?branch=master)](https://travis-ci.org/maputnik/desktop) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/sepe9jhfs123dwk9?svg=true)](https://ci.appveyor.com/project/lukasmartinelli/desktop)

> :warning: The desktop build of Maputnik is no longer maintained.

![](https://camo.githubusercontent.com/ea32c1383049053bd0ceba2b31834841f229bf64/68747470733a2f2f63312e737461746963666c69636b722e636f6d2f352f343339362f33363730343333373739315f343236383236313038395f6e2e6a7067)

---

A Golang based cross platform executable for integrating Maputnik locally.
This binary packages up the JavaScript and CSS bundle produced by [maputnik/editor](https://github.com/maputnik/desktop)
and embeds it in the program for easy distribution. It also allows
exposing a local style file and work on it both in Maputnik and with your favorite
editor.

Report issues on [maputnik/editor](https://github.com/maputnik/editor).

## Install

You can download a single binary for Linux, OSX or Windows from [the latest releases of **maputnik/editor**](https://github.com/maputnik/editor/releases/latest).

### Usage

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

### API

`maputnik` exposes the configured styles via a HTTP API.

| Method                          | Description
|---------------------------------|---------------------------------------
| `GET /files`                    | List all configured style files
| `GET /files/{filename}`         | Get contents of a single style file
| `PUT GET /files/{filename}`     | Update contents of a style file
| `WEBSOCKET /ws`                 | Listen to change events for the configured style files

### Build

Clone the repository **recursively** since the Maputnik editor is embedded
as submodule. Make sure you clone it into the correct directory `$GOPATH/src/github.com/maputnik`.

```
git clone --recursive git@github.com:maputnik/desktop.git
```

Install the 3rd party dependencies.

```
go get -u golang.org/x/sys/...
go get github.com/gorilla/handlers
go get github.com/gorilla/mux
go get github.com/gorilla/websocket
go get github.com/fsnotify/fsnotify
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
