// kokonaan omaa koodia. Määrittelen mallin mitä tietoa ja missä muodossa kantaan voidaan viedä. IT
// Tässä on malli tiedolle, jota viedään tietokannan Train-tauluun. IT

const mongoose = require('mongoose');

const TrainSchema = new mongoose.Schema({
  trainnumber: {
    type: String,
    unique: false,
    required: true,
  },
  junatyyppi: { type: String, unique: false, required: true, max: 80 },
  lahtoasema: { type: String, unique: false, required: true, max: 80 },
  saapumisasema: {
    type: String,
    unique: false,
    required: true,
    max: 80,
  },
  haku_paiva: { type: String, unique: false, required: true, max: 80 },
  haku_kello: { type: String, unique: false, required: true, max: 80 },
});

// Tässä tehdään Schemasta model, jonka metodeilla kantaoperaatioita voidaan suorittaa.
// Model on luokka, joka sisältää skeeman

const Train = mongoose.model('Train', TrainSchema);

// tässä model exportataan. Se pitää ottaa käyttöön tiedostossa, jossa sitä käytetään. Tässä tapauksessa TrainControllerissa.
module.exports = Train;
