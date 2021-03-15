import "webextension-polyfill";

import { setPosition, togglePlay, getState } from "./radio.js";
import "./hook.js";

function getHandler(action) {
  switch (action) {
    case "SET_POSITION":
      return [setPosition];
    case "TOGGLE_PLAY":
      return [togglePlay];
    case "GET_STATE":
      return [getState, true];
    default:
      return [];
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

  return true;
});
