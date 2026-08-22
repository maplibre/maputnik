package main

import (
	"errors"
	"testing"
	"time"
)

func TestOpenBrowser_FailureIsNonFatalAndNonBlocking(t *testing.T) {
	orig := openURL
	defer func() { openURL = orig }()

	called := make(chan string, 1)
	openURL = func(url string) error {
		called <- url
		return errors.New("no opener available")
	}

	openBrowser("http://localhost:8123") // must return immediately

	select {
	case url := <-called:
		if url != "http://localhost:8123" {
			t.Errorf("url = %q, want %q", url, "http://localhost:8123")
		}
	case <-time.After(time.Second):
		t.Fatal("openURL was never called")
	}
}
