/* eslint-disable camelcase */

/*
Tämä on kokonaan omaa koodiani. IT

Tämän tiedoston avulla ohjataan url-kutsut TrainControlleriin oikeisiin metodeihin.
Delete-metodi on suojattu, eli se vaatii että käyttäjä on kirjautunut frontendissa.

*/

const express = require('express');

const TrainController = require('../controllers/TrainController');
const authorize = require('../verifytoken');

// eslint-disable-next-line new-cap
const router = express.Router();

// Tällä reitillä haetaan contorollerista tai sen kautta asemien metatiedot.
// www.localhost:3000/trains/stationsmetadata/:stat

router.get('/stationsmetadata/:stat', TrainController.getStationsMetaData);

// Tällä reitillä haetaan contorollerista tai sen kautta käyttäjän sijaintia lähin asema.
// urlissa tulee lat ja lon, jotka ovat käyttäjän leveys- ja pituuspiiri.
// www.localhost:3000/trains/stations/:lat1/:lon1

router.get('/stations/:lat1/:lon1', TrainController.getStations);

// Tällä reitillä haetaan controllerin kautta seuraavat dep -asemalta arr -asemalle lähtevät junat.
// www.localhost:3000/trains/getnexttrains/:dep/:arr
router.get('/getnexttrains/:dep/:arr', TrainController.getNextTrains);

// Tällä reitillä haetaan tietokannasta controllerin kautta kaikki kannan rivit.
// www.localhost:3000/trains/

router.get('/', authorize, TrainController.findAllTrains);

// Tällä reitillä poistetaan tietokannasta controllerin kautta yksi rivi. Id kertoo mikä rivi poistetaan.
// www.localhost:3000/trains/id/:id

router.delete('/id/:id', authorize, TrainController.deleteTrainrow);

module.exports = router;
