#JunaAppin serveriohjelma

## Yleistä

Serverin kautta hallinnoidaan JunaAppin käyttäjätietoja: käyttäjien autentikointia, rekisteröitymistä, sekä poistamista. Lisäksi serverin kautta haetaan JunaAppin tarvitsemaa dataa avoimen datan Finntraffic / Digitraffic -palvelusta. Serveri ottaa talteen muistiinsa osan Finntraffic / Dgitraffic -palvelusta hakemastaan tiedosta, jotta sen ei tarvitse hakea kaikkea tietoja joka kerta FinnTraffic / Digitraffic -palvelusta. Tällaista tietoa on mm. staattisen luonteinen rautatieasematieto. Kun serveri käynnistetään uudelleen serveri hakee kyseiset staattisen luonteisetkin tiedot uudelleen muistiinsa.

Koodin kommenteista löytyy lisätietoa serverin toiminnasta. Koodeista löyty mm. urlit, miten eri serverin tarjoamia reittejä ja sitä kautta palveluja, voi käyttää.

Serveri on toteutettu Node.js :llä hyödyntäen Expressiä. Serveri käyttää lisäksi MongoDB-tietokantaa, jota käsitellään mongoosella.

## Kehitysaskelia

Valitettavasi Gittin käyttö jäi alkuvaiheessa pois, mutta jonkin verran committeja on kuitenkin tullut. Tässä muutamia kehityskohteita, joita on tehty viime aikoina:

Lisäsin tietokantaan tiedon milloin käyttäjä on rekisteröitynyt, sekä seurannan kuinka monta kertaa käyttäjä on kirjautunut palveluun. Kantaan päivittyy myös viimeisin sisäänkirjautumisen päivämäärä. Serveri palauttaa tiedot frontendille loginin yhteydessä, jotta frontend voi näyttää tiedot käyttäjälle.

Lisäsin serveriin myös koodia, jolla tarkastetaan onko rekisteröinnin yhteydessä tuleva käyttäjätunnus jo ennestään kannassa ja jos tulee, niin serveri kertoo sen fronendille, jotta käyttäjälle voi näyttää tilanteessa kuvaavan virheilmoituksen.

Paransin salasanan ja käyttäjätunnuksen validointia.

Lisäsin kommentteja.
