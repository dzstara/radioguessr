import { browser } from "webextension-polyfill-ts";
import { Position } from "../types";

function captureNetworkRequests() {
  const list = performance
    .getEntriesByType("resource")
    .filter((resource: PerformanceResourceTiming) =>
      ["xmlhttprequest", "script", "img"].includes(resource.initiatorType)
    )
    .map((resource) => resource.name);

  performance.clearResourceTimings();

  return list;
}

function setLocation(location: Position | null) {
  browser.runtime.sendMessage({
    action: "SET_POSITION",
    data: location,
  });
}

function sendLocationReport(url: string) {
  browser.runtime.sendMessage({
    action: "POSITION_REPORT",
    data: url,
  });
}

function resetLocation() {
  performance.clearResourceTimings();
  setLocation(null);
}

function resetIfNotInGame() {
  if (!window.location.pathname.startsWith("/game")) resetLocation();
}

window.addEventListener("beforeunload", resetLocation);
window.addEventListener("popstate", resetIfNotInGame);
setInterval(resetIfNotInGame, 100);

async function getPositionFromLastRequests() {
  if (!window.location.pathname.startsWith("/game")) return;

  const relevantRequests = captureNetworkRequests().filter((url) =>
    url.includes("GeoPhoto")
  );

  if (!relevantRequests.length) return;

  sendLocationReport(relevantRequests[relevantRequests.length - 1]);
}

setInterval(async () => {
  try {
    await getPositionFromLastRequests();
  } catch (err) {
    console.error(err);
  }
}, 500);
