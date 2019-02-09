# Maputnik Desktop [![Build Status](https://travis-ci.org/maputnik/desktop.svg?branch=master)](https://travis-ci.org/maputnik/desktop) [![Windows Build Status](https://ci.appveyor.com/api/projects/status/sepe9jhfs123dwk9?svg=true)](https://ci.appveyor.com/project/lukasmartinelli/desktop)

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

Clone the repository. Make sure you clone it into the correct directory `$GOPATH/src/github.com/maputnik`.

```
git clone git@github.com:maputnik/desktop.git
```

Run `make` to install the 3rd party dependencies and build the `maputnik` binary embedding the editor.

```
make
```

You should now find the `maputnik` binary in your `bin` directory.
