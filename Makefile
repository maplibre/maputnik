SOURCEDIR=.
SOURCES := $(shell find $(SOURCEDIR) -name '*.go')
BINARY=maputnik
EDITOR_VERSION ?= v1.7.0
GOPATH := $(if $(GOPATH),$(GOPATH),$(HOME)/go)
GOBIN := $(if $(GOBIN),$(GOBIN),$(HOME)/go/bin)

all: $(BINARY)

$(BINARY): $(GOBIN)/gox $(SOURCES) rice-box.go
	$(GOBIN)/gox -osarch "windows/amd64 linux/amd64 darwin/amd64" -output "bin/{{.OS}}/${BINARY}"

editor/create_folder:
	mkdir -p editor

editor/pull_release: editor/create_folder
        # if the directory /home/runner/work/editor/editor/build/build exists, we assume that we are are running the makefile within the editor ci workflow
	test -d /home/runner/work/editor/editor/build/build && echo "exists" && cd editor && cp -R /home/runner/work/editor/editor/build/build public/ || (echo "does not exist" && cd editor && rm -rf public && curl -L https://github.com/maputnik/editor/releases/download/$(EDITOR_VERSION)/public.zip --output public.zip && unzip public.zip && rm public.zip)

$(GOBIN)/gox:
	go install github.com/mitchellh/gox@v1.0.1

$(GOBIN)/rice:
	go install github.com/GeertJohan/go.rice/rice@v1.0.3

rice-box.go: $(GOBIN)/rice editor/pull_release
	$(GOBIN)/rice embed-go

.PHONY: clean
clean:
	rm -rf editor/public && rm -f rice-box.go && rm -rf bin
