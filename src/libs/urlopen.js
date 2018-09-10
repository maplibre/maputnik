import url from 'url'
import style from './style.js'

export function initialStyleUrl() {
  const initialUrl = url.parse(window.location.href, true)
  return (initialUrl.query || {}).style
}

export function loadStyleUrl(styleUrl, cb) {
  console.log('Loading style', styleUrl)
  fetch(styleUrl, {
    mode: 'cors',
    credentials: "same-origin"
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(body) {
    cb(style.ensureStyleValidity(body))
  })
  .catch(function() {
    console.warn('Could not fetch default style', styleUrl)
    cb(style.emptyStyle)
  })
}

export function loadJSON(url, defaultValue, cb) {
  fetch(url, {
    mode: 'cors',
    credentials: "same-origin"
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(body) {
    try {
      cb(body)
    } catch(err) {
      console.error(err)
      cb(defaultValue)
    }
  })
  .catch(function() {
    console.error('Can not load JSON from ' + url)
    cb(defaultValue)
  })
}
