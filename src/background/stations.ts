import { getCachedGetter } from "../util/cache";
import { shuffle } from "../util/array";
import { RadioStation } from "../types";
import pkg from "../../package.json";

async function fetchRadioStations(): Promise<Array<RadioStation>> {
  const response = await fetch(
    "https://fr1.api.radio-browser.info/json/stations/search?lastcheckok=1",
    {
      headers: {
        "User-Agent": "RadioGuessr/" + pkg.version,
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

const getStations = getCachedGetter("stations", fetchRadioStations);

export async function getRandomStationFromCountry(countryCode: string) {
  const stations = await getRadioStationsFromCountry(countryCode);
  const candidates = shuffle(stations);
  console.log(candidates.length + " stations found for this country");

  while (candidates.length) {
    const currentCandidate = candidates.pop();
    console.log("Verifying validity... (" + candidates.length + " left)");
    const radioIsValid = await isRadioValid(currentCandidate);

    if (radioIsValid) {
      console.log("Got a valid candidate");

      return currentCandidate;
    }

    console.log("Radio was not valid, trying again.");
  }

  throw new Error("Could not find radio");
}

async function getRadioStationsFromCountry(countryCode: string) {
  const stations = await getStations();

  return stations
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
