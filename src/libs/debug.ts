interface DebugStore {
  [namespace: string]: {
    [key: string]: any
  }
}

const debugStore: DebugStore = {};

function enabled() {
  const qs = new URL(window.location.href).searchParams;
  const debugQs = qs.get("debug");
  if(debugQs) {
    return !!debugQs.match(/^(|1|true)$/);
  }
  else {
    return false;
  }
}

function genErr() {
  return new Error("Debug not enabled, enable by appending '?debug' to your query string");
}

function set(namespace: keyof DebugStore, key: string, value: any) {
  if(!enabled()) {
    throw genErr();
  }
  debugStore[namespace] = debugStore[namespace] || {};
  debugStore[namespace][key] = value;
}

function get(namespace: keyof DebugStore, key: string) {
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
};

(window as any).debug = mod;
export default mod;
