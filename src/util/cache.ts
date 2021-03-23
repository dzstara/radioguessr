import { browser } from "webextension-polyfill-ts";

const registeredKeys = new Set<string>();
const cacheData = new Map<string, any>();

export function getCachedGetter<T>(
  key: string,
  getFn: () => Promise<T>,
  preload: boolean = true
) {
  if (registeredKeys.has(key))
    throw new Error("This key is already registered: " + key);

  const getter = () => getCache(key, getFn);
  registeredKeys.add(key);

  if (preload) {
    getter();
  }

  return getter;
}

async function getCache<T>(key: string, getFn: () => Promise<T>): Promise<T> {
  if (cacheData.has(key)) {
    return cacheData.get(key);
  }

  async function setCache(data: any) {
    await browser.storage.local.set({
      [key]: JSON.stringify(data),
    });

    cacheData.set(key, data);
  }

  const cache = await browser.storage.local.get(key);

  if (cache[key] !== undefined) {
    console.log(`Found cache for '${key}'`);

    try {
      const parsed = JSON.parse(cache[key]);
      await setCache(parsed);
      return parsed;
    } catch (err) {
      console.error("Error parsing cache, continuing as if no cache exists");
      console.error(err);
    }
  }

  console.log(`No cache found, downloading data '${key}'...`);
  const fresh = await getFn();
  await setCache(fresh);
  console.log(`Data '${key}' was downloaded.`);

  return fresh;
}
