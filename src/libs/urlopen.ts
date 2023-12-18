// @ts-ignore
import style from './style'

export function initialStyleUrl() {
  const initialUrl = new URL(window.location.href);
  return initialUrl.searchParams.get('style');
}

export function loadStyleUrl(styleUrl: string, cb: (...args: any[]) => void) {
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

export function removeStyleQuerystring() {
  const initialUrl = new URL(window.location.href);
  initialUrl.searchParams.delete('style');
  window.history.replaceState({}, document.title, initialUrl.toString())
}
