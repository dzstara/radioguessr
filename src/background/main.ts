import { browser } from "webextension-polyfill-ts";

import { setPosition, togglePlay, getState } from "./radio";
import "./hook";

function getHandler(action: string): [(data: any) => unknown, boolean] {
  switch (action) {
    case "SET_POSITION":
      return [setPosition, false];
    case "TOGGLE_PLAY":
      return [togglePlay, false];
    case "GET_STATE":
      return [getState, true];
    default:
      return [() => {}, false];
  }
}

browser.runtime.onMessage.addListener(function handleMessages(request) {
  const [handler, shouldRespond] = getHandler(request.action);

  if (!handler) return;

  try {
    const result = handler(request.data);
    if (shouldRespond) return Promise.resolve(result);
  } catch (err) {
    console.error("Message handler error", err);
  }
});
