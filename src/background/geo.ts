import whichPolygon from "which-polygon";
import iso3166 from "iso-3166-1";
import { fakeJsonP } from "../util/jsonp";
import { setPosition } from "./radio";
import { GeoJSON } from "../types";
import { getCachedGetter } from "../util/cache";

async function fetchGeo(): Promise<GeoJSON<{ A3: string }>> {
  const result = await fetch(
    "https://unpkg.com/@geo-maps/countries-maritime-250m@0.6.0/map.geo.json"
  );

  return result.json();
}

const getGeo = getCachedGetter("geo", fetchGeo);

export async function getCountry(lat: number, lng: number) {
  const json = await getGeo();
  const query = whichPolygon(json);
  const result = query([lng, lat]);

  if (!result) {
    throw new Error(
      "Could not find country with these coordinates: " + lat + ", " + lng
    );
  }

  return iso3166.whereAlpha3(result.A3).alpha2;
}

export async function processPositionReport(url: string) {
  const data = await fakeJsonP(url);
  try {
    const [lat, lng] = data[1][0][5][0][1][0].slice(2, 4);

    const position = { lat, lng };
    setPosition(position);
  } catch (err) {
    console.error("Could not extract position from payload");
    console.error("Payload:", data);
    console.error(err);
  }
}
