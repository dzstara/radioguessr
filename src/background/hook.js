import { createResponseListener } from "../util/response-listener.js";
import { setPosition } from "./radio.js";

function apiHandler(_, responseStr) {
  const response = JSON.parse(responseStr);
  const rounds = response.rounds;
  const lastRound = rounds[rounds.length - 1];
  const { lat, lng } = lastRound;
  setPosition({ lat, lng });
}

browser.webRequest.onBeforeRequest.addListener(
  createResponseListener(apiHandler),
  {
    urls: ["https://www.geoguessr.com/api/v3/games/*"],
    types: ["xmlhttprequest"],
  },
  ["blocking"]
);
