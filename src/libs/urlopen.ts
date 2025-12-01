import style from "./style";
import { type StyleSpecificationWithId } from "./definitions";

export function getStyleUrlFromAddressbarAndRemoveItIfNeeded(): string | null {
  const initialUrl = new URL(window.location.href);
  const styleUrl = initialUrl.searchParams.get("style");
  if (styleUrl) {
    initialUrl.searchParams.delete("style");
    window.history.replaceState({}, document.title, initialUrl.toString());
  }
  return styleUrl;
}

export async function loadStyleUrl(styleUrl: string): Promise<StyleSpecificationWithId> {
  console.log("Loading style", styleUrl);
  try {
    const response = await fetch(styleUrl, {
      mode: "cors",
      credentials: "same-origin"
    });
    const body = await response.json();
    return style.ensureStyleValidity(body);
  } catch {
    console.warn("Could not fetch default style: " + styleUrl);
    return style.emptyStyle;
  }
}

export const enum ErrorType {
  None,
  EmptyHttpsProtocol,
  EmptyHttpOrHttpsProtocol,
  CorsError
}

function getProtocolSafe(url: string): { protocol?: string, isLocal?: boolean } {
  try {
    const urlObj = new URL(url);
    const { protocol, hostname } = urlObj;
    const isLocal = /^(localhost|\[::1\]|127(.[0-9]{1,3}){3})/i.test(hostname);
    return { protocol, isLocal };
  }
  catch (_err) {
    return {};
  }
};

export function validate(url: string): ErrorType {
  if (url === "") {
    return ErrorType.None;
  }

  // allow root-relative URLs ("/static/style.json") but do not allow protocol-relative URLs ("//example.com")
  if (url.startsWith("/") && !url.startsWith("//")) {
    return ErrorType.None;
  }

  const { protocol, isLocal } = getProtocolSafe(url);
  const isSsl = window.location.protocol === "https:";

  if (!protocol && isSsl) {
    return ErrorType.EmptyHttpsProtocol;
  }
  if (!protocol) {
    return ErrorType.EmptyHttpOrHttpsProtocol;
  }
  if (protocol &&
    protocol === "http:" &&
    window.location.protocol === "https:" &&
    !isLocal) {
    return ErrorType.CorsError;
  }
  return ErrorType.None;
}
