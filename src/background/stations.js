import { shuffle } from "../util/array.js";

let radioStations = [];

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

function parseCache(cache) {
  return cache.map(([url, country]) => ({ url, country }));
}

function translateToCache(data) {
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
    .map((radio) => ({
      country: radio.countrycode,
      url: radio.url_resolved,
    }))
    .filter((radio) => radio.country !== "");
}

export async function getRandomStationFromCountry(countryCode) {
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

function getRadioStationsFromCountry(countryCode) {
  return radioStations
    .filter((radio) => radio.country === countryCode)
    .map((radio) => radio.url);
}

async function isRadioValid(radioUrl) {
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
