package main

import (
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
)

func StyleFileAccessor(filename string) styleFileAccessor {
	file, err := os.OpenFile(filename, os.O_RDWR, 0666)
	if err != nil {
		log.Fatalf("Can not access style file: %s", err.Error())
	}

	return styleFileAccessor{file, styleId(file)}
}

func styleId(file *os.File) string {
	raw, err := ioutil.ReadAll(file)
	if err != nil {
		log.Panicln(err)
	}

	var spec styleSpec
	err = json.Unmarshal(raw, &spec)
	if err != nil {
		log.Panicln(err)
	}

	if spec.Id == "" {
		fmt.Println("No id in style")
	}
	return spec.Id
}

type styleSpec struct {
	Id string `json:"id"`
}

// Allows access to a single style file
type styleFileAccessor struct {
	file *os.File
	id   string
}

func (fa styleFileAccessor) ListFiles(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.Encode([]string{fa.id})
}

func (fa styleFileAccessor) ReadFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_ = vars["styleId"]

	//TODO: Choose right file
	// right now we just return the single file we know of
	w.Header().Set("Content-Type", "application/json")
	fa.file.Seek(0, 0)
	if _, err := io.Copy(w, fa.file); err != nil {
		log.Fatalf("Can not copy from file to request: %s", err.Error())
	}
}

func (fa styleFileAccessor) SaveFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_ = vars["styleId"]

	//TODO: Save to right file
	w.Header().Set("Content-Type", "application/json")

	if _, err := io.Copy(fa.file, r.Body); err != nil {
		log.Fatalf("Can not copy from request to file: %s", err.Error())
	}
}
