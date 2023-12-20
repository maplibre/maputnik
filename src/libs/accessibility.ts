import throttle from 'lodash.throttle'

export default {
  // Throttle for 3 seconds so when a user enables it they don't have to refresh the page.
  reducedMotionEnabled: throttle(() => {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }, 3000)
}
