import { browser } from "webextension-polyfill-ts";

import { flushCountry } from "./radio";

browser.webRequest.onBeforeRequest.addListener(
  flushCountry,
  {
    urls: ["https://www.geoguessr.com/api/v3/games/*"],
    types: ["xmlhttprequest"],
  },
  ["blocking"]
);
