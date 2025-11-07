async function loadJSON<T>(url: string, defaultValue: T): Promise<T> {
  try {
    const response = await fetch(url, {
      mode: "cors",
      credentials: "same-origin"
    });
    if (!response.ok) {
      throw new Error("Failed to load metadata for " + url);
    }
    return await response.json();
  } catch {
    console.warn("Can not load metadata for " + url + ", using default value " + defaultValue);
    return defaultValue;
  }
}

export async function downloadGlyphsMetadata(urlTemplate: string): Promise<string[]> {
  if(!urlTemplate) return [];

  // Special handling because Tileserver GL serves the fontstacks metadata differently
  // https://github.com/klokantech/tileserver-gl/pull/104#issuecomment-274444087
  const urlObj = new URL(urlTemplate);
  const normPathPart = "/" + encodeURIComponent("{fontstack}") + "/" + encodeURIComponent("{range}") + ".pbf";
  if(urlObj.pathname === normPathPart) {
    urlObj.pathname = "/fontstacks.json";
  } else {
    urlObj.pathname = urlObj.pathname!.replace(normPathPart, ".json");
  }
  const url = urlObj.toString();
  const fonts = await loadJSON(url, [] as string[]);
  return [...new Set(fonts)];
}

export async function downloadSpriteMetadata(baseUrl: string): Promise<string[]> {
  if(!baseUrl) return [];
  const url = baseUrl + ".json";
  const glyphs = await loadJSON(url, {} as Record<string, string>);
  return Object.keys(glyphs);
}
