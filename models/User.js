// kokonaan omaa koodia. Määrittelen mallin mitä tietoa ja missä muodossa kantaan voidaan viedä. IT
// Tässä on malli tiedolle, jota viedään tietokannan User-tauluun. IT

const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, min: 8, max: 15 },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 15,
  },
  isadmin: { type: Boolean, required: true },
  visits: { type: Number, require: true },
  lastvisitday: { type: String, required: false },
  regday: { type: String, required: true },

  // salasanaan pitää lisätä parempi validointi, eli sama mikä on frontendissä.
  // Suoraan samalla merkkijonolla ei lähtenyt serverissä toimimaan, joten jätin pois.
  // Nyt tarkastetaan serveripäässä vain pituus.
});

// Tässä tehdään Schemasta model, jonka metodeilla kantaoperaatioita voidaan suorittaa.
// Model on luokka, joka sisältää skeeman
const User = mongoose.model('User', UserSchema);

// tässä model exportataan. Se pitää ottaa käyttöön tiedostossa, jossa sitä käytetään. Tässä tapauksessa UserControllerissa.
module.exports = User;
