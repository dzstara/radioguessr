import { browser } from "webextension-polyfill-ts";

import { shuffle } from "../util/array";

interface RadioStation {
  url: string;
  country: string;
}

let radioStations: Array<RadioStation> = [];

(async () => {
  const cache = await browser.storage.local.get("radioStations");

  if (!!cache.radioStations) {
    try {
      const existingStations = parseCache(cache.radioStations);
      console.log("Found cache with " + existingStations.length + " stations");
      radioStations = existingStations;
      return;
    } catch (err) {
      console.error("Error parsing cache, continuing as if no cache exists");
      console.error(err);
    }
  }

  console.log("No cache found, downloading radio stations...");
  const stations = await getAllRadioStations();
  console.log("Found " + stations.length + " stations");

  await browser.storage.local.set({
    radioStations: translateToCache(stations),
  });

  radioStations = stations;
})();

function parseCache(cache: Array<[string, string]>) {
  return cache.map(([url, country]) => ({ url, country }));
}

function translateToCache(data: Array<RadioStation>) {
  return data.map(({ url, country }) => [url, country]);
}

async function getAllRadioStations() {
  const response = await fetch(
    "https://fr1.api.radio-browser.info/json/stations/search?lastcheckok=1",
    {
      headers: {
        "User-Agent": "RadioGuessr/0.1",
        "Content-Type": "application/json",
      },
    }
  );

  const array = await response.json();

  return array
    .map((radio: { countrycode: string; url_resolved: string }) => ({
      country: radio.countrycode,
      url: radio.url_resolved,
    }))
    .filter((radio: RadioStation) => radio.country !== "");
}

export async function getRandomStationFromCountry(countryCode: string) {
  let radio = null;

  const candidates = shuffle(getRadioStationsFromCountry(countryCode));
  console.log(candidates.length + " stations found for this country");

  while (radio === null && candidates.length) {
    const currentCandidate = candidates.pop();
    console.log("Verifying validity... (" + candidates.length + " left)");
    const radioIsValid = await isRadioValid(currentCandidate);

    if (radioIsValid) {
      radio = currentCandidate;
    } else {
      console.log("Radio was not valid, trying again.");
    }
  }

  if (!radio) {
    throw new Error("Could not find radio");
  }

  console.log("Got a valid candidate");

  return radio;
}

function getRadioStationsFromCountry(countryCode: string) {
  return radioStations
    .filter((radio) => radio.country === countryCode)
    .map((radio) => radio.url);
}

async function isRadioValid(radioUrl: string) {
  const testElement = document.createElement("audio");
  testElement.volume = 0;

  return new Promise(async (resolve) => {
    try {
      testElement.addEventListener("playing", () => {
        resolve(true);
      });

      testElement.addEventListener("error", () => {
        resolve(false);
      });

      testElement.src = radioUrl;

      await testElement.play();
    } catch {
      resolve(false);
    }
  }).finally(() => {
    testElement.removeAttribute("src");
    testElement.load();
    testElement.remove();
  });
}
