import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { validate, ErrorType } from "./urlopen";

describe("validate", () => {
  let originalProtocol: string;

  beforeEach(() => {
    // Save original protocol
    originalProtocol = window.location.protocol;
  });

  afterEach(() => {
    // Restore original protocol
    Object.defineProperty(window.location, "protocol", {
      writable: true,
      value: originalProtocol,
    });
  });

  describe("when URL is empty", () => {
    it("should return ErrorType.None", () => {
      expect(validate("")).toBe(ErrorType.None);
    });
  });

  describe("when window.location.protocol is https:", () => {
    beforeEach(() => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "https:",
      });
    });

    it("should return EmptyHttpsProtocol when URL has no protocol", () => {
      expect(validate("example.com")).toBe(ErrorType.EmptyHttpsProtocol);
      expect(validate("www.example.com/path")).toBe(ErrorType.EmptyHttpsProtocol);
    });

    it("should return None for valid https URLs", () => {
      expect(validate("https://example.com")).toBe(ErrorType.None);
      expect(validate("https://www.example.com/path")).toBe(ErrorType.None);
    });

    it("should return CorsError for http URLs pointing to non-local hosts", () => {
      expect(validate("http://example.com")).toBe(ErrorType.CorsError);
      expect(validate("http://api.example.com/endpoint")).toBe(ErrorType.CorsError);
    });

    it("should return None for http URLs pointing to localhost", () => {
      expect(validate("http://localhost")).toBe(ErrorType.None);
      expect(validate("http://localhost:3000")).toBe(ErrorType.None);
      expect(validate("http://127.0.0.1")).toBe(ErrorType.None);
      expect(validate("http://127.0.0.1:8080")).toBe(ErrorType.None);
      expect(validate("http://127.255.255.255")).toBe(ErrorType.None);
    });

    it("should return None for http URLs pointing to IPv6 localhost", () => {
      expect(validate("http://[::1]")).toBe(ErrorType.None);
      expect(validate("http://[::1]:3000")).toBe(ErrorType.None);
    });

    it("should return None for other protocols", () => {
      expect(validate("ftp://example.com")).toBe(ErrorType.None);
      expect(validate("ws://example.com")).toBe(ErrorType.None);
      expect(validate("wss://example.com")).toBe(ErrorType.None);
    });
  });

  describe("when window.location.protocol is http:", () => {
    beforeEach(() => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "http:",
      });
    });

    it("should return EmptyHttpOrHttpsProtocol when URL has no protocol", () => {
      expect(validate("example.com")).toBe(ErrorType.EmptyHttpOrHttpsProtocol);
      expect(validate("www.example.com/path")).toBe(ErrorType.EmptyHttpOrHttpsProtocol);
    });

    it("should return None for valid http URLs", () => {
      expect(validate("http://example.com")).toBe(ErrorType.None);
      expect(validate("http://www.example.com/path")).toBe(ErrorType.None);
    });

    it("should return None for valid https URLs", () => {
      expect(validate("https://example.com")).toBe(ErrorType.None);
      expect(validate("https://www.example.com/path")).toBe(ErrorType.None);
    });

    it("should return None for localhost URLs", () => {
      expect(validate("http://localhost")).toBe(ErrorType.None);
      expect(validate("http://127.0.0.1")).toBe(ErrorType.None);
    });
  });

  describe("edge cases", () => {
    it("should handle URLs with ports", () => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "https:",
      });

      expect(validate("https://example.com:8443")).toBe(ErrorType.None);
      expect(validate("http://example.com:8080")).toBe(ErrorType.CorsError);
      expect(validate("http://localhost:3000")).toBe(ErrorType.None);
    });

    it("should handle URLs with paths and query strings", () => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "https:",
      });

      expect(validate("https://example.com/path?query=value")).toBe(ErrorType.None);
      expect(validate("http://example.com/path?query=value")).toBe(ErrorType.CorsError);
    });

    it("should handle malformed URLs that cannot be parsed", () => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "https:",
      });

      expect(validate("not a url at all")).toBe(ErrorType.EmptyHttpsProtocol);
      expect(validate("://")).toBe(ErrorType.EmptyHttpsProtocol);
    });

    it("should handle localhost variations case-insensitively", () => {
      Object.defineProperty(window.location, "protocol", {
        writable: true,
        value: "https:",
      });

      expect(validate("http://LOCALHOST")).toBe(ErrorType.None);
      expect(validate("http://LocalHost:3000")).toBe(ErrorType.None);
    });
  });
});
