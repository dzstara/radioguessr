let countryCodes = [];
let positionData = [];

Promise.all([
  fetch("../../lib/countries.json")
    .then((response) => response.json())
    .then((data) => {
      countryCodes = data;
    }),
  fetch("../../lib/world.geo.json")
    .then((response) => response.json())
    .then((obj) => {
      positionData = obj.features;
    }),
]);

function code3toCode2(countryCode) {
  return countryCodes.find((country) => country["alpha-3"] === countryCode)[
    "alpha-2"
  ];
}

// This code comes from
// https://raw.githubusercontent.com/totemstech/country-reverse-geocoding/master/lib/country_reverse_geocoding.js
// https://github.com/totemstech/country-reverse-geocoding/

function isPointInPolygon(polygon, point) {
  const nvert = polygon.length;
  let c = false;
  for (let i = 0, j = nvert - 1; i < nvert; j = i++) {
    if (
      polygon[i][1] > point[1] != polygon[j][1] > point[1] &&
      point[0] <
        ((polygon[j][0] - polygon[i][0]) * (point[1] - polygon[i][1])) /
          (polygon[j][1] - polygon[i][1]) +
          polygon[i][0]
    ) {
      c = !c;
    }
  }
  return c;
}

export function getCountry(lat, lng) {
  if (typeof lat !== "number" || typeof lng !== "number") {
    return new Error("Wrong coordinates (" + lat + "," + lng + ")");
  }

  const point = [lng, lat];
  let i = 0;
  let found = false;

  do {
    const country = positionData[i];
    if (country.geometry.type === "Polygon") {
      found = isPointInPolygon(country.geometry.coordinates[0], point);
    } else if (country.geometry.type === "MultiPolygon") {
      let j = 0;
      do {
        found = isPointInPolygon(country.geometry.coordinates[j][0], point);
        j++;
      } while (j < country.geometry.coordinates.length && !found);
    }
    i++;
  } while (i < positionData.length && !found);

  if (!found) {
    return null;
  }

  return {
    code: code3toCode2(positionData[i - 1].id),
    name: positionData[i - 1].properties.name,
  };
}
