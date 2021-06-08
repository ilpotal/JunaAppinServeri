/* UserController on Userin tietokantaoperaatiot ja autentikaation sisältävä kontrolleri.
Se sisältää kolme metodia: 1) registerUser jolla, luodaan uusi käyttäjä kantaan, 2) authenticateUser, jolla suoritetaan autentikaatio,
eli lähetetään tunnukset ja verrataan niitä kannassa oleviin, sekä deleteUser, jolla poistetaan käyttäjä kannasta. */

// Tähän on otettu koodia Tommi Tuikan luentoesimerkeistä. Olen lisännyt omaa koodia sekaan, ja olen pyrkinyt kommentoimaan omat koodini lisäämällä
// ko. kommentin perään IT tai tuomaan kommentissa muuten ilmi oman koodini.

const bcrypt = require('bcryptjs');
const User = require('../models/User.js');
const createToken = require('../createtoken.js');

// luodaan thisday -muuttuja tässä, jotta sitä voidaan käyttää kaikissa metodeissa sisältämään kuluvan päivän. IT
let thisday = new Date(); // asetetaan muuttujan thisday -arvoksi kuluva päivä. IT
thisday = thisday.toLocaleDateString('fi-FI');

const UserController = {
  // uuden käyttäjän rekisteröinti
  registerUser: function (req, res, next) {
    // passu kryptataan ennen kantaan laittamista
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.findOne(
      {
        username: req.body.username,
      },

      (err, user) => {
        if (user) {
          res.json({
            success: false, // rekisteröinti ei onnistunut, palautetaan false. IT
            message: 'Käyttäjä on jo olemassa', // Oteaan kiinni tapaus, jossa käyttäjä on jo olemassa, jotta voidaan antaa järkevä virheilmoitus frontendissä. IT
          });
        } else {
          // asetetaan thisday arvoksi lokalisoitu päivämäärä. IT
          User.create(
            {
              username: req.body.username,
              password: hashedPassword,
              isadmin: req.body.isadmin,
              visits: 0, // asetetaan vierailujen määräksi 0. IT
              regday: thisday, // asetetaan rekisteröitymispäiväksi kuluva päivä. IT
            },
            (err, user) => {
              if (err) {
                res.json({
                  success: false,
                  message:
                    'Rekisteröinti epäonnistui, yritä myöhemmin uudelleen', // tämä näytetään fronendissä, jos kirjautuminen epäonnistuu.
                });
              } else {
                const token = createToken(user); // tokenin luontimetodi
                // palautetaan token JSON-muodossa
                res.json({
                  success: true,
                  message: 'Voit kirjautua palveluun!', // tämä näytetään fronendissä, muokkasin. IT
                  token: token,
                });
              }
            }
          );
        }
      }
    );
  },
  // olemassa olevan käyttäjän autentikaatio
  // jos autentikaatio onnistuu, käyttäjälle luodaan token
  authenticateUser: function (req, res, next) {
    // etsitään käyttäjä kannasta http-pyynnöstä saadun käyttäjätunnuksen perusteella
    // alussa napataan virhe kiinni, käytännössä jos kantayhteys ei toimi, ja palautetaan sille oma virhe, joka näytetään frontendissä IT
    User.findOne(
      {
        username: req.body.username,
      },
      function (err, user) {
        if (err) {
          // tämä jossa tutkitaan että onko kantayhteys päällä, on omaa koodiani IT

          res.json({ success: false, message: 'Palvelinyhteys ei onnistunut' }); // Tämä virheilmoitus näytetään fronendissä. IT
        } else {
          if (!user) {
            res.json({
              success: false,
              message:
                'Autentikaatio epäonnistui, väärä käyttäjätunnus tai salasana.', // päivitin vähän virheilmoitusta geneeriseksi, näytän tämän fronendissä IT
            });
          } else if (user) {
            // console.log(req.body.password); // lomakkelle syötetty salasana
            // console.log(user.password); // kannassa oleva salasana
            // verrataan lomakkeelle syötettyä salasanaa kannassa olevaan salasanaan
            // jos vertailtavat eivät ole samat, palautetaan tieto siitä että salasana oli väärä
            if (
              bcrypt.compareSync(req.body.password, user.password) === false
            ) {
              res.json({
                success: false,
                message:
                  'Autentikaatio epäonnistui, väärä käyttäjätunnus tai salasana.', // päivitin vähän virheilmoitusta geneeriseksi, näytän tämän fronendissä IT
              });
            } else {
              // jos salasanat ovat samat, luodaan token

              const token = createToken(user); // tokenin luontimetodi
              // palautetaan token JSON-muodossa
              res.json({
                success: true,
                isadmin: user.isadmin,
                message: 'Tässä on valmis Token!',
                visits: user.visits + 1, // palautetaan käyttäjän käyntien määrä, mukaan lukien uusi käynti. IT
                //lastvisitday: user.lastvisitday, // palautetaan edellisen käynnin päivä. IT
                regday: user.regday, // palautetaan rekisteröintipäivä. IT
                token: token,
              });

              User.updateOne(
                // Tällä metodilla lisätään kantaan käyttäjätunnukselle yksi käyntikerta lisää.
                // ja päivitetään lisäksi viimeisin vierailupäivä kantaan.
                // Tämä metodi on kokonaan omaa koodiani. IT
                {
                  // eslint-disable-next-line quote-props
                  username: req.body.username,
                },

                { $inc: { visits: 1 } },
                (error, result) => {
                  if (error) {
                    throw error;
                  } else {
                    console.log(result);
                  }
                }
              );
            }
          }
        }
      }
    );
  },

  deleteUser: (req, res) => {
    // poistetaan taulusta käyttäjä usernamen perusteella. IT
    // tämä metodi on kokonaan omaa kooodiani. IT

    User.deleteOne({ username: req.params.username }, (error, result) => {
      if (error) {
        throw error;
      }
      res.json(result);
    });
  },
};

module.exports = UserController;
