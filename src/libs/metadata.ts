import type { SpriteSpecification } from "@maplibre/maplibre-gl-style-spec";
import { spriteSources, spriteURL, type Sprite } from "./sprites";

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

export async function downloadSpriteMetadata(sprite: SpriteSpecification | undefined): Promise<Sprite[]> {
  const catalogs = await Promise.all(spriteSources(sprite).map(async ({ id, url }) => {
    if (!url) return [];
    try {
      for (const [metadataExtension, imageExtension] of [["@2x.json", "@2x.png"], [".json", ".png"]] as const) {
        const metadata = await loadJSON<Record<string, Omit<Sprite, "id" | "imageUrl">> | null>(
          spriteURL(url, metadataExtension), null,
        );
        const entries = Object.entries(metadata ?? {}).filter(([, item]) => item &&
          [item.x, item.y, item.width, item.height, item.pixelRatio].every(Number.isFinite) &&
          item.x >= 0 && item.y >= 0 && item.width > 0 && item.height > 0 && item.pixelRatio > 0
        );
        if (entries.length) {
          const imageUrl = spriteURL(url, imageExtension);
          return entries.map(([name, item]) => ({ ...item, id: id === "default" ? name : `${id}:${name}`, imageUrl }));
        }
      }
    } catch {
      return [];
    }
    return [];
  }));
  return catalogs.flat();
}
