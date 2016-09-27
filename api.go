package main

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/mux"
)

func StyleFileAccessor(filename string) styleFileAccessor {
	file, err := os.Open(filename)
	if err != nil {
		log.Fatalf("Can not access style file: %s", err.Error())
	}

	return styleFileAccessor{file}
}

// Allows access to a single style file
type styleFileAccessor struct {
	file *os.File
}

func (fa styleFileAccessor) ListFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.Encode([]string{filepath.Base(fa.file.Name())})
}

func (fa styleFileAccessor) ReadFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_ = vars["filename"]

	//TODO: Choose right file
	// right now we just return the single file we know of
	w.Header().Set("Content-Type", "application/json")
	if _, err := io.Copy(w, fa.file); err != nil {
		log.Fatalf("Can not copy from file to request: %s", err.Error())
	}
}

func (fa styleFileAccessor) SaveFile(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if _, err := io.Copy(fa.file, r.Body); err != nil {
		log.Fatalf("Can not copy from request to file: %s", err.Error())
	}
}
