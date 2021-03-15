import { getCountry } from "./geo";
import { getRandomStationFromCountry } from "./stations";

const radioAudioElement = document.createElement("audio");
radioAudioElement.volume = 0.1;

const tuningAudioElement = document.createElement("audio");
tuningAudioElement.volume = 0.2;
tuningAudioElement.preload = "auto";
tuningAudioElement.loop = true;
tuningAudioElement.src = "../../media/tuning.ogg";

const radioMap = new Map();

let state = {
  position: null,
  radio: null,
  playing: false,
  loading: false,
};

export function getState() {
  return state;
}

export function togglePlay() {
  setState((state) => ({
    ...state,
    playing: !state.playing,
  }));
}

export function setPosition(position) {
  setState((state) => ({
    ...state,
    position,
  }));
}

function setState(stateFn) {
  const previousState = state;
  state = stateFn(state);

  browser.runtime
    .sendMessage({
      action: "STATE_UPDATE",
      data: state,
    })
    .catch(() => {});

  if (previousState.playing !== state.playing) {
    console.log("playing change", state.playing);
    onPlayingIntentChange(state.playing);
  }

  if (previousState.loading !== state.loading) {
    console.log("loading change", state.loading);
    onLoadingChange(state.loading);
  }

  if (
    JSON.stringify(previousState.position) !== JSON.stringify(state.position)
  ) {
    onPositionChange(state.position);
  }

  if (previousState.radio !== state.radio) {
    console.log("radio change", state.radio);
    onRadioChange(state.radio);
  }
}

radioAudioElement.addEventListener("playing", () => {
  setState((state) => ({
    ...state,
    playing: true,
    loading: false,
  }));
});

radioAudioElement.addEventListener("ended", () => {
  setState((state) => ({
    ...state,
    playing: false,
  }));
});

function onLoadingChange(loading) {
  if (loading) {
    tuningAudioElement.play();
  } else {
    tuningAudioElement.pause();
  }
}

async function onPlayingIntentChange(playing) {
  if (playing) {
    await setupRadio();
  } else {
    radioAudioElement.removeAttribute("src");
    radioAudioElement.load();
  }
}

async function onPositionChange(position) {
  setState((state) => ({ ...state, radio: null }));
  if (state.playing && !!position) await setupRadio();
  if (position === null)
    setState((state) => ({ ...state, loading: false, playing: false }));
}

function onRadioChange(radio) {
  if (radio === null) return;

  radioAudioElement.setAttribute("src", radio);

  if (state.playing) radioAudioElement.play();
}

async function setupRadio() {
  setState((state) => ({ ...state, loading: true }));

  const radioCache = radioMap.get(state.position);

  if (!!radioCache) {
    setState((state) => ({ ...state, radio: radioCache }));
    return;
  }

  const { lat, lng } = state.position;
  const countryCode = getCountry(lat, lng);
  const url = await getRandomStationFromCountry(countryCode);
  radioMap.set(state.position, url);

  setState((state) => ({ ...state, radio: url }));
}
