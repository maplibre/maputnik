package main

import (
	"fmt"
	"os/exec"
	"runtime"
)

// execCommand is overridden in tests so openBrowser can be exercised without
// actually launching (or failing to launch) a real browser.
var execCommand = exec.Command

// browserCommand returns the executable and arguments used to open url in the
// default browser on goos. It is a pure function so the mapping can be tested
// without spawning any process.
func browserCommand(goos, url string) (string, []string, error) {
	switch goos {
	case "windows":
		// rundll32 hands the URL to the registered default-browser handler
		// without going through a shell, so there is no injection risk.
		return "rundll32", []string{"url.dll,FileProtocolHandler", url}, nil
	case "darwin":
		return "open", []string{url}, nil
	case "linux":
		return "xdg-open", []string{url}, nil
	default:
		return "", nil, fmt.Errorf("opening a browser is not supported on %s", goos)
	}
}

// openBrowser launches the user's default browser at url. It does not block
// waiting for the browser to exit, and a failure to launch is returned to the
// caller rather than panicking, so the server can keep running either way.
func openBrowser(url string) error {
	name, args, err := browserCommand(runtime.GOOS, url)
	if err != nil {
		return err
	}

	cmd := execCommand(name, args...)
	if err := cmd.Start(); err != nil {
		return err
	}
	// Reap the child asynchronously so it doesn't linger as a zombie process.
	go cmd.Wait()
	return nil
}
