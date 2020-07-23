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
	app.Version = "Editor: 1.7.0; Desktop: 1.0.6"

	app.Flags = []cli.Flag{
		&cli.StringFlag{
			Name:  "file, f",
			Usage: "Allow access to JSON style from web client",
		},
		&cli.BoolFlag{
			Name:  "watch",
			Usage: "Notify web client about JSON style file changes",
		},
		&cli.IntFlag{
			Name: "port",
			Value: 8000,
			Usage: "TCP port to listen on",
		},
		cli.StringFlag{
			Name:  "static",
			Usage: "Serve directory under /static/",
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

		staticDir := c.String("static")
    if staticDir != "" {
	    h := http.StripPrefix("/static/", http.FileServer(http.Dir(staticDir)))
	    router.PathPrefix("/static/").Handler(h)
    }

		router.PathPrefix("/").Handler(http.StripPrefix("/", gui))
		loggedRouter := handlers.LoggingHandler(os.Stdout, router)
		corsRouter := handlers.CORS(handlers.AllowedHeaders([]string{"Content-Type"}), handlers.AllowedMethods([]string{"GET", "PUT"}), handlers.AllowedOrigins([]string{"*"}), handlers.AllowCredentials())(loggedRouter)

		fmt.Printf("Exposing Maputnik on http://localhost:%d\n", c.Int("port"))
		return http.ListenAndServe(fmt.Sprintf(":%d", c.Int("port")), corsRouter)
	}

	app.Run(os.Args)
}
