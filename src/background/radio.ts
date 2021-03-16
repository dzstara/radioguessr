import { browser } from "webextension-polyfill-ts";

import { Position, StatusData } from "types";
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

let state: StatusData = {
  country: null,
  radio: null,
  playing: false,
  intent: false,
  loading: false,
};

export function getState() {
  return state;
}

export function togglePlay() {
  setState((state) => ({
    ...state,
    intent: !state.intent,
  }));
}

export function setPosition(position: Position) {
  let newCountry: string | null;

  if (!position) {
    newCountry = null;
  } else {
    const { lat, lng } = position;
    newCountry = getCountry(lat, lng);
  }

  setState((state) => ({
    ...state,
    country: newCountry,
  }));
}

export function flushCountry() {
  setState((state) => ({
    ...state,
    country: null,
  }));
}

function setState(stateFn: (state: StatusData) => StatusData) {
  const previousState = state;
  state = stateFn(state);

  browser.runtime
    .sendMessage({
      action: "STATE_UPDATE",
      data: state,
    })
    .catch(() => {});

  if (previousState.intent !== state.intent) {
    console.log("intent change", state.intent);
    onPlayingIntentChange(state.intent);
  }

  if (previousState.country !== state.country) {
    onCountryChange(previousState.country, state.country);
  }

  if (previousState.radio !== state.radio) {
    console.log("radio change", state.radio);
    onRadioChange(state.radio);
  }

  if (
    (state.radio === null || state.loading) &&
    state.country !== null &&
    state.intent
  ) {
    tuningAudioElement.play();
  } else {
    tuningAudioElement.pause();
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

async function onPlayingIntentChange(intent: boolean) {
  if (intent && !!state.country) {
    await setupRadio();
  }

  if (!intent) {
    radioAudioElement.removeAttribute("src");
    radioAudioElement.load();

    setState((state) => ({
      ...state,
      playing: false,
    }));
  }
}

async function onCountryChange(
  previousCountry: string | null,
  newCountry: string | null
) {
  if (!!previousCountry) radioMap.delete(previousCountry);

  setState((state) => ({ ...state, radio: null }));

  if (state.intent && !!newCountry) await setupRadio();

  if (newCountry === null)
    setState((state) => ({ ...state, loading: false, playing: false }));
}

function onRadioChange(radio: string | null) {
  if (radio === null) {
    radioAudioElement.removeAttribute("src");
    radioAudioElement.load();
  } else {
    radioAudioElement.setAttribute("src", radio);

    if (state.intent) radioAudioElement.play();
  }
}

async function setupRadio() {
  if (state.country === null) return;

  setState((state) => ({ ...state, loading: true }));

  const radioCache = radioMap.get(state.country);

  if (!!radioCache) {
    setState((state) => ({ ...state, radio: radioCache }));
    return;
  }

  const url = await getRandomStationFromCountry(state.country);
  radioMap.set(state.country, url);

  setState((state) => ({ ...state, radio: url }));
}
