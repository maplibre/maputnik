package main

import (
	"os/exec"
	"testing"
)

func TestBrowserCommand(t *testing.T) {
	cases := []struct {
		goos    string
		wantCmd string
	}{
		{"windows", "rundll32"},
		{"darwin", "open"},
		{"linux", "xdg-open"},
	}
	url := "http://localhost:8123"

	for _, tc := range cases {
		t.Run(tc.goos, func(t *testing.T) {
			name, args, err := browserCommand(tc.goos, url)
			if err != nil {
				t.Fatalf("unexpected error: %v", err)
			}
			if name != tc.wantCmd {
				t.Errorf("command = %q, want %q", name, tc.wantCmd)
			}
			found := 0
			for _, a := range args {
				if a == url {
					found++
				}
			}
			if found != 1 {
				t.Errorf("expected url %q to appear exactly once in args %v", url, args)
			}
		})
	}
}

func TestBrowserCommand_UnsupportedOS(t *testing.T) {
	_, _, err := browserCommand("plan9", "http://localhost:8000")
	if err == nil {
		t.Fatal("expected error for unsupported OS, got nil")
	}
}

func TestOpenBrowser_StartFailureIsNonFatal(t *testing.T) {
	orig := execCommand
	defer func() { execCommand = orig }()
	execCommand = func(name string, args ...string) *exec.Cmd {
		return exec.Command("maputnik-definitely-not-a-real-binary-xyz")
	}

	if err := openBrowser("http://localhost:8000"); err == nil {
		t.Fatal("expected an error when the opener binary does not exist")
	}
}

func TestOpenBrowser_Success(t *testing.T) {
	orig := execCommand
	defer func() { execCommand = orig }()
	execCommand = func(name string, args ...string) *exec.Cmd {
		// A stand-in for the real opener that exits immediately without
		// popping any UI, so the test stays hermetic.
		return exec.Command("go", "version")
	}

	if err := openBrowser("http://localhost:8000"); err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
}
