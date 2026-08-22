package main

import (
	"fmt"

	"github.com/pkg/browser"
)

// openURL is swapped out in tests.
var openURL = browser.OpenURL

// openBrowser opens url in the default browser without blocking the caller.
// xdg-open is known to hang on some headless Linux setups, so this runs in
// its own goroutine to keep a stuck opener from stalling server startup.
func openBrowser(url string) {
	go func() {
		if err := openURL(url); err != nil {
			fmt.Printf("Could not open browser automatically: %s\nPlease open %s manually.\n", err, url)
		}
	}()
}
