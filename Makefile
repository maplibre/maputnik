SOURCEDIR=.
SOURCES := $(shell find $(SOURCEDIR) -name '*.go')
BINARY=maputnik
EDITOR_VERSION ?= v1.5.0

all: $(BINARY)

$(BINARY): $(SOURCES) bindata_assetfs.go
	gox -osarch "windows/amd64 linux/amd64 darwin/amd64" -output "bin/{{.OS}}/${BINARY}"

editor/create_folder:
	mkdir -p editor

editor/pull_release: editor/create_folder
	cd editor && rm -rf public && curl -L https://github.com/maputnik/editor/releases/download/$(EDITOR_VERSION)/public.zip --output public.zip && unzip public.zip && rm public.zip

bindata_assetfs.go: editor/pull_release
	go-bindata-assetfs --prefix "editor/" editor/public/...

.PHONY: clean
clean:
	rm -rf editor/public && rm -f bindata.go && rm -f bindata_assetfs.go && rm -f bin
