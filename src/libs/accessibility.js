import throttle from 'lodash.throttle'


// Throttle for 3 seconds so when a user enables it they don't have to refresh the page.
const reducedMotionEnabled = throttle(() => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}, 3000);


export default {
  reducedMotionEnabled
}
