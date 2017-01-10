import request from 'request'
import url from 'url'
import style from './style.js'

export function initialStyleUrl() {
  const initialUrl = url.parse(window.location.href, true)
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

export function loadJSON(url, defaultValue, cb) {
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
      console.error('Can not load JSON from ' + url)
      cb(defaultValue)
    }
  })
}
