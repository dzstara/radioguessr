import rg from "fast-reverse-geocoder";
import iso3166 from "iso-3166-1";

export function getCountry(lat, lng) {
  const result = rg.search(lng, lat);
  return iso3166.whereAlpha3(result.code).alpha2;
}
