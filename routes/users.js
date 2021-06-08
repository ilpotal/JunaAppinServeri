/*
Tämä on kokonaan omaa koodiani. IT

Tämän tiedoston avulla ohjataan url-kutsut UserControlleriin oikeisiin metodeihin.
Delete-metodi on suojattu, eli se vaatii että käyttäjä on kirjautunut frontendissa.

*/

const express = require('express');
// eslint-disable-next-line new-cap
const router = express.Router();
const userCon = require('../controllers/UserController'); // user-reittien kontrolleri
const authorize = require('../verifytoken');

//Tässä on käyttäjän login ja rekisteröitysmis-, sekä poistoreitit.

router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// käyttäjän rekisteröityminen
// http://localhost:3000/users/register
router.post('/register', userCon.registerUser);
// käyttäjän kirjautuminen eli autentikaatio
// http://localhost:3000/users/login
router.post('/login', userCon.authenticateUser);

// Tällä reitillä poistetaan tietokannasta Usercontrollerin kautta käyttäjä, username kertoo mikä käyttäjä poistetaan
// http://localhost:3000/users/delete/:username

router.delete('/delete/:username', authorize, userCon.deleteUser);

module.exports = router;
