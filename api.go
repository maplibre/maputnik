package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func StyleFileAccessor(filename string) styleFileAccessor {
	return styleFileAccessor{filename, styleId(filename)}
}

func styleId(filename string) string {
	raw, err := ioutil.ReadFile(filename)
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
	filename string
	id       string
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

	raw, err := ioutil.ReadFile(fa.filename)
	if err != nil {
		log.Panicln(err)
	}
	w.Write(raw)
}

func (fa styleFileAccessor) SaveFile(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	_ = vars["styleId"]

	//TODO: Save to right file
	w.Header().Set("Content-Type", "application/json")

	body, _ := ioutil.ReadAll(r.Body)
	var out bytes.Buffer
	json.Indent(&out, body, "", "  ")

	if err := ioutil.WriteFile(fa.filename, out.Bytes(), 0666); err != nil {
		log.Fatalf("Can not copy from request to file: %s", err.Error())
	}
}
