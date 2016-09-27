package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "maputnik"
	app.Usage = "Server for integrating Maputnik locally"

	app.Action = func(c *cli.Context) error {
		gui := http.FileServer(assetFS())

		router := mux.NewRouter().StrictSlash(true)
		//router.Path("/api/v1/apps").Methods("GET").HandlerFunc(foo)
		router.PathPrefix("/").Handler(http.StripPrefix("/", gui))

		loggedRouter := handlers.LoggingHandler(os.Stdout, router)
		return http.ListenAndServe(":8000", loggedRouter)
	}

	app.Run(os.Args)
}
