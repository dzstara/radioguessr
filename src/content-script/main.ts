import { browser } from "webextension-polyfill-ts";
import { Position } from "types";

async function fakeJsonP(uri: string) {
  const src = uri + "&callback=CB";
  const response = await fetch(src);
  const text = await response.text();
  return JSON.parse(text.slice(14, text.length - 2));
}

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

function resetLocation() {
  setLocation(null);
}

function resetIfNotInGame() {
  if (!window.location.pathname.startsWith("/game")) resetLocation();
}

window.addEventListener("beforeunload", resetLocation);
window.addEventListener("popstate", resetIfNotInGame);
setInterval(resetIfNotInGame, 100);

async function getPositionFromLastRequests() {
  const relevantRequests = captureNetworkRequests().filter((url) =>
    url.includes("GeoPhoto")
  );

  if (!relevantRequests.length) return;

  const data = await fakeJsonP(relevantRequests[relevantRequests.length - 1]);
  try {
    const [lat, lng] = data[1][0][5][0][1][0].slice(2, 4);

    const position = { lat, lng };
    setLocation(position);
  } catch (err) {
    console.error("Could not extract position from payload");
    console.error("Payload:", data);
    console.error(err);
  }
}

setInterval(async () => {
  try {
    await getPositionFromLastRequests();
  } catch (err) {
    console.error(err);
  }
}, 500);
