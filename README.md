#JunaAppin serveriohjelma

## Yleistä

Serverin kautta hallinnoidaan JunaAppin käyttäjätietoja: käyttäjien autentikointia, rekisteröitymistä, sekä poistamista. Lisäksi serverin kautta haetaan JunaAppin tarvitsemaa dataa avoimen datan Finntraffic / Digitraffic -palvelusta. Serveri ottaa talteen muistiinsa osan Finntraffic / Dgitraffic -palvelusta hakemastaan tiedosta, jotta sen ei tarvitse hakea kaikkea tietoja joka kerta FinnTraffic / Digitraffic -palvelusta. Tällaista tietoa on mm. staattisen luonteinen rautatieasematieto. Kun serveri käynnistetään uudelleen serveri hakee kyseiset staattisen luonteisetkin tiedot uudelleen muistiinsa.

Koodin kommenteista löytyy lisätietoa serverin toiminnasta. Koodeista löyty mm. urlit, miten eri serverin tarjoamia reittejä ja sitä kautta palveluja, voi käyttää.

Serveri on toteutettu Node.js :llä hyödyntäen Expressiä. Serveri käyttää lisäksi MongoDB-tietokantaa (MongoDB Atlas), jota käsitellään mongoosella. Serveri on asennettu Herokuun GitHubin kautta.

MongoDB-kantaan tehdään lisäyksiä (käyttäjien ja junavuorojen lisäyksiä), poistoja (käyttäjän poistoja). Adminilla on mahdollisuus poistaa junavuoroja yksitellen. Kantaan päivitetään serverin toimesta käyttäjän vierailujen määrää. Lisäksi kannasta haetaan tietoa, mm. käyttäjätietoa, sekä junavuoroja.

## Kehitysaskelia

Valitettavasti en saanut gittiä toimimaan normaalisti, vaan jouduin käyttämään Github Desktoppia siirtääkseni filet Githubiin. Nyt Githubissa on vain pari committia, mutta omalta työasemaltani löytyy lisää committeja, joiden siirto Githubiin ei onnistunut.

Lisäsin tietokantaan tiedon milloin käyttäjä on rekisteröitynyt, sekä seurannan kuinka monta kertaa käyttäjä on kirjautunut palveluun. Serveri palauttaa tiedot frontendille loginin yhteydessä, jotta frontend voi näyttää tiedot käyttäjälle.

Lisäsin serveriin myös koodia, jolla tarkastetaan onko rekisteröinnin yhteydessä tuleva käyttäjätunnus jo ennestään kannassa ja jos tulee, niin serveri kertoo sen fronendille, jotta käyttäjälle voi näyttää tilanteessa kuvaavan virheilmoituksen.

Paransin salasanan ja käyttäjätunnuksen validointia.

Lisäsin kommentteja.
