import request from 'request'
import npmurl from 'url'

function loadJSON(url, defaultValue, cb) {
  request({
    url: url,
    withCredentials: false,
  }, (error, response, body) => {
    if (!error && body && response.statusCode == 200) {
      try {
        cb(JSON.parse(body))
      } catch(err) {
        console.error(err)
        cb(defaultValue)
      }
    } else {
      console.warn('Can not metadata for ' + url)
      cb(defaultValue)
    }
  })
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

  loadJSON(url, [], cb)
}

export function downloadSpriteMetadata(baseUrl, cb) {
  if(!baseUrl) return cb([])
  const url = baseUrl + '.json'
  loadJSON(url, {}, glyphs => cb(Object.keys(glyphs)))
}
