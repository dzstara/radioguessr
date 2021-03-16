import json from "@geo-maps/countries-maritime-250m";
import whichPolygon from "which-polygon";
import iso3166 from "iso-3166-1";

const query = whichPolygon(json());

export function getCountry(lat: number, lng: number) {
  const result = query([lng, lat]);

  if (!result) {
    throw new Error(
      "Could not find country with these coordinates: " + lat + ", " + lng
    );
  }

  return iso3166.whereAlpha3(result.A3).alpha2;
}
