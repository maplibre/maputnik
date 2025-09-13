import style from "./style";
import { StyleSpecificationWithId } from "./definitions";

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
