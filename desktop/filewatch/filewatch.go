package filewatch

import (
	"io/ioutil"
	"log"
	"net/http"

	"github.com/fsnotify/fsnotify"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin:     func(r *http.Request) bool { return true },
}

func writer(ws *websocket.Conn, filename string) {
	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		log.Fatal(err)
	}
	defer watcher.Close()

	done := make(chan bool)
	go func() {
		for {
			select {
			case event := <-watcher.Events:
				if event.Op&fsnotify.Write == fsnotify.Write {
					log.Println("Modified file:", event.Name)
					var p []byte
					var err error

					p, err = ioutil.ReadFile(filename)
					if err != nil {
						log.Fatal(err)
					}

					if p != nil {
						if err := ws.WriteMessage(websocket.TextMessage, p); err != nil {
							return
						}
					}
				}
			case err := <-watcher.Errors:
				log.Println("Watch error:", err)
			}
		}
	}()

	if err = watcher.Add(filename); err != nil {
		log.Fatal(err)
	}
	<-done
}

func ServeWebsocketFileWatcher(filename string, w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		if _, ok := err.(websocket.HandshakeError); !ok {
			log.Println(err)
		}
		return
	}

	writer(ws, filename)
	defer ws.Close()
}
