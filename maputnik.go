package main

import (
	"net/http"
	"os"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maputnik/desktop/filewatch"
	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "maputnik"
	app.Usage = "Server for integrating Maputnik locally"

	app.Flags = []cli.Flag{
		cli.StringFlag{
			Name:  "file, f",
			Usage: "Allow access to JSON style from web client",
		},
		cli.BoolFlag{
			Name:  "watch",
			Usage: "Notify web client about JSON style file changes",
		},
	}

	app.Action = func(c *cli.Context) error {
		gui := http.FileServer(assetFS())

		router := mux.NewRouter().StrictSlash(true)

		// Register websocket to notify we clients about file changes
		filename := c.String("file")

		if filename != "" {
			/*
				router.Path("/files").Methods("GET").HandlerFunc(listFiles)
				router.Path("/files/{filename}").Methods("PUT").HandlerFunc(saveFile)
			*/

			if c.Bool("watch") {
				router.Path("/ws").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					filewatch.ServeWebsocketFileWatcher(filename, w, r)
				})
			}

		}

		router.PathPrefix("/").Handler(http.StripPrefix("/", gui))

		loggedRouter := handlers.LoggingHandler(os.Stdout, router)
		return http.ListenAndServe(":8000", loggedRouter)
	}

	app.Run(os.Args)
}
