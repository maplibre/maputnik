import request from 'request'
import url from 'url'
import style from './style.js'

export function initialStyleUrl() {
  const initialUrl = url.parse(window.location.href, true)
  console.log(initialUrl)
  return (initialUrl.query || {}).style
}

export function loadStyleUrl(styleUrl, cb) {
  console.log('Loading style', styleUrl)
  request({
    url: styleUrl,
    withCredentials: false,
  }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        cb(style.ensureStyleValidity(JSON.parse(body)))
      } else {
        console.warn('Could not fetch default style', styleUrl)
        cb(style.emptyStyle)
      }
  })
}
