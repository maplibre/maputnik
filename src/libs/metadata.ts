import npmurl from "url";

function loadJSON(
  url: string,
  defaultValue: any,
  cb: (...args: any[]) => void,
) {
  fetch(url, {
    mode: "cors",
    credentials: "same-origin",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to load metadata for ${url}`);
      }
      return response.json();
    })
    .then((body) => {
      cb(body);
    })
    .catch(() => {
      console.warn(
        "Can not load metadata for " +
          url +
          ", using default value " +
          defaultValue,
      );
      cb(defaultValue);
    });
}

export function downloadGlyphsMetadata(
  urlTemplate: string,
  cb: (...args: any[]) => void,
) {
  if (!urlTemplate) return cb([]);

  // Special handling because Tileserver GL serves the fontstacks metadata differently
  // https://github.com/klokantech/tileserver-gl/pull/104#issuecomment-274444087
  const urlObj = npmurl.parse(urlTemplate);
  const normPathPart = "/%7Bfontstack%7D/%7Brange%7D.pbf";
  if (urlObj.pathname === normPathPart) {
    urlObj.pathname = "/fontstacks.json";
  } else {
    urlObj.pathname = (urlObj.pathname ?? "").replace(normPathPart, ".json");
  }
  const url = npmurl.format(urlObj);

  loadJSON(url, [], cb);
}

export function downloadSpriteMetadata(
  baseUrl: string,
  cb: (...args: any[]) => void,
) {
  if (!baseUrl) return cb([]);
  const url = `${baseUrl}.json`;
  loadJSON(url, {}, (glyphs) => cb(Object.keys(glyphs)));
}
