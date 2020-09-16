import npmurl from 'url'

function loadJSON(url, defaultValue, cb) {
  return fetch(url, {
    mode: 'cors',
    credentials: "same-origin"
  })
  .then(function(response) {
    return response.json();
  })
  .catch(function() {
    console.warn('Can not metadata for ' + url)
    return defaultValue;
  })
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
    img.src = url;
  });
}

export function downloadGlyphsMetadata(urlTemplate, cb) {
  if(!urlTemplate) return cb([])

  // Special handling because Tileserver GL serves the fontstacks metadata differently
  // https://github.com/klokantech/tileserver-gl/pull/104#issuecomment-274444087
  let urlObj = npmurl.parse(urlTemplate);
  const normPathPart = '/%7Bfontstack%7D/%7Brange%7D.pbf';
  if(urlObj.pathname === normPathPart) {
    urlObj.pathname = '/fontstacks.json';
  } else {
    urlObj.pathname = urlObj.pathname.replace(normPathPart, '.json');
  }
  let url = npmurl.format(urlObj);

  loadJSON(url, []).then(cb);
}

export function downloadSpriteMetadata(baseUrl, cb) {
  if(!baseUrl) return cb([])
  const jsonUrl = baseUrl + '.json'
  const imageUrl = baseUrl + '.png'

  Promise.all([
    loadImage(imageUrl).catch(() => undefined),
    loadJSON(jsonUrl, {}),
  ])
  .then(([image, data]) => {
    const out = {
      jsonUrl,
      imageUrl,
      data
    };
    if (image) {
      out.image = {
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
    }
    cb(out);
  });
}
