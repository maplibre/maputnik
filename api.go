package main

import (
	"encoding/json"
	"net/http"
)

// Return all current deployments
func foo(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	encoder := json.NewEncoder(w)
	encoder.Encode(map[string]string{
		"foo": "bar",
	})
}
