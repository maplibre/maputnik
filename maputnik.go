package main

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maputnik/desktop/filewatch"
	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "maputnik"
	app.Usage = "Server for integrating Maputnik locally"
	app.Version = "1.0.1"

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

		filename := c.String("file")
		if filename != "" {
			fmt.Printf("%s is accessible via Maputnik\n", filename)
			// Allow access to reading and writing file on the local system
			path, _ := filepath.Abs(filename)
			accessor := StyleFileAccessor(path)
			router.Path("/styles").Methods("GET").HandlerFunc(accessor.ListFiles)
			router.Path("/styles/{styleId}").Methods("GET").HandlerFunc(accessor.ReadFile)
			router.Path("/styles/{styleId}").Methods("PUT").HandlerFunc(accessor.SaveFile)

			// Register websocket to notify we clients about file changes
			if c.Bool("watch") {
				router.Path("/ws").HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
					filewatch.ServeWebsocketFileWatcher(filename, w, r)
				})
			}
		}

		router.PathPrefix("/").Handler(http.StripPrefix("/", gui))
		loggedRouter := handlers.LoggingHandler(os.Stdout, router)
		corsRouter := handlers.CORS(handlers.AllowedHeaders([]string{"Content-Type"}), handlers.AllowedMethods([]string{"GET", "PUT"}), handlers.AllowedOrigins([]string{"*"}), handlers.AllowCredentials())(loggedRouter)

		fmt.Println("Exposing Maputnik on http://localhost:8000")
		return http.ListenAndServe(":8000", corsRouter)
	}

	app.Run(os.Args)
}
