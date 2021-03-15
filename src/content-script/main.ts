import { browser } from "webextension-polyfill-ts";
import { Position } from "types";

function setLocation(location: Position | null) {
  browser.runtime.sendMessage({
    action: "SET_POSITION",
    data: location,
  });
}

function resetLocation() {
  setLocation(null);
}

window.addEventListener("beforeunload", () => {
  resetLocation();
});

window.addEventListener("popstate", () => {
  if (!window.location.pathname.startsWith("/game")) resetLocation();
});

setInterval(() => {
  if (!window.location.pathname.startsWith("/game")) resetLocation();
}, 100);

try {
  const raw = document.querySelectorAll("#__NEXT_DATA__")[0].innerHTML;
  const json = JSON.parse(raw);
  const rounds = json.props.pageProps.game.rounds;
  const currentRound = rounds[rounds.length - 1];
  const { lat, lng } = currentRound;

  setLocation({ lat, lng });
} catch (err) {
  console.error(err);
}
