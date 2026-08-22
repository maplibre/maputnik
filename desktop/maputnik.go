package main

import (
	"fmt"
	"net"
	"net/http"
	"os"
	"path/filepath"
    "github.com/GeertJohan/go.rice"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/maputnik/desktop/filewatch"
	"github.com/urfave/cli"
)

func main() {
	app := cli.NewApp()
	app.Name = "maputnik"
	app.Usage = "Server for integrating Maputnik locally"
	app.Version = Version

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
		&cli.StringFlag{
			Name:  "static",
			Usage: "Serve directory under /static/",
		},
		&cli.BoolFlag{
			Name:  "no-browser",
			Usage: "Do not automatically open the default browser",
		},
	}

	app.Action = func(c *cli.Context) error {
		gui := http.FileServer(rice.MustFindBox("editor").HTTPBox())

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

		listener, err := net.Listen("tcp", fmt.Sprintf(":%d", c.Int("port")))
		if err != nil {
			return err
		}

		url := fmt.Sprintf("http://localhost:%d", c.Int("port"))
		fmt.Printf("Exposing Maputnik on %s\n", url)

		// The listener above is already accepting connections at the OS level,
		// so opening the browser here can't race ahead of http.Serve below.
		if !c.Bool("no-browser") {
			if err := openBrowser(url); err != nil {
				fmt.Printf("Could not open browser automatically: %s\nPlease open %s manually.\n", err, url)
			}
		}

		return http.Serve(listener, corsRouter)
	}

	app.Run(os.Args)
}
