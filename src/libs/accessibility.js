import lodash from 'lodash'


// Throttle for 3 seconds so when a user enables it they don't have to refresh the page.
const reducedMotionEnabled = lodash.throttle(() => {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
}, 3000);


export default {
  reducedMotionEnabled
}
