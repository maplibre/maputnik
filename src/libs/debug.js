import querystring from 'querystring'


const debugStore = {};

function enabled() {
  const qs = querystring.parse(window.location.search.slice(1));
  if(qs.hasOwnProperty("debug")) {
    return !!qs.debug.match(/^(|1|true)$/);
  }
  else {
    return false;
  }
}

function genErr() {
  return new Error("Debug not enabled, enable by appending '?debug' to your query string");
}

function set(namespace, key, value) {
  if(!enabled()) {
    throw genErr();
  }
  debugStore[namespace] = debugStore[namespace] || {};
  debugStore[namespace][key] = value;
}

function get(namespace, key) {
  if(!enabled()) {
    throw genErr();
  }
  if(debugStore.hasOwnProperty(namespace)) {
    return debugStore[namespace][key];
  }
}

const mod = {
  enabled,
  get,
  set
}

window.debug = mod;
export default mod;
