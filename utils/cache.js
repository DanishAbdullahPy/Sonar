const CACHE = {};

// key: string, value: any, ms: how long to cache it (ms)
export function setCache(key, value, ms) {
  CACHE[key] = { value, expires: Date.now() + ms };
}
export function getCache(key) {
  const entry = CACHE[key];
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    delete CACHE[key];
    return null;
  }
  return entry.value;
}
