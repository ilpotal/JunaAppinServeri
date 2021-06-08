/*
This function copied from https://stackoverflow.com/questions/18883601/function-to-calculate-distance-between-two-coordinates
Origin from here http://jsfiddle.net/edgren/gAHJB/
*/

// Kuten yllä totean, tämä koodi on lainattu, muutin koodiin vain varin constiksi. IT
// Tämä palauttaa kahden koorninaatiopisteen välisen etäisyyden kilometreinä. IT
// Tällä saan käyttäjän ja rautatieaseman välisen etäisyyden selville. IT

/* eslint-disable no-var */

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  // eslint-disable-next-line no-var
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

module.exports = { getDistanceFromLatLonInKm, deg2rad };
