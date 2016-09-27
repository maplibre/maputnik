# Maputnik Desktop

A Golang based cross platform executable for integrating Maputnik locally.

### Build

Clone the repository recursively since the Maputnik editor is embedded
as submodule.

```
git clone --recursive git@github.com:maputnik/desktop.git
```

Run `make` to build the app distribution bundle and create the `maputnik` binary
embedding the editor.

```
make
```

You should now find the `maputnik` binary in your directory.
