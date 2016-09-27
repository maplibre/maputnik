SOURCEDIR=.
SOURCES := $(shell find $(SOURCEDIR) -name '*.go')
BINARY=maputnik

all: $(BINARY)

$(BINARY): $(SOURCES)
	go build -o ${BINARY}

editor/node_modules:
	cd editor && npm install

editor/public: editor/node_modules
	cd editor && npm run build

bindata_assetfs.go: editor/public
	go-bindata-assetfs editor/public/

.PHONY: clean
clean:
	rm -rf editor/public && rm -rf maputnik
