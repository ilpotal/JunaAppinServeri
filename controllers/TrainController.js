/* eslint-disable new-cap */
/* eslint-disable camelcase */
/* eslint-disable indent */

// Tämä kontrolleri on kokonaan omaa koodiani*/

const Train = require('../models/Trains'); // tässä otetaan käyttöön Train-model
const fetch = require('node-fetch'); // otetaan käyttöön fetch.
const distancecalc = require('./distance'); // tässä otetaan käyttöön distancecalc, jolla lasketaan käyttöjän etäisyys eri asemista.
const helper = require('./helpers'); // tässä otetaan käyttöön helper, joka sisältää muutaman apumetodin, joita controlleri hyödyntää.
const myStations_del = new Map(); // tähän mappiin tallennetaan aseman lyhenne ja aseman nimi -pari, jotta nimi voidaan hakea helposti lyhenteellä.
const asemaTaulu = [];
// asemaTaulu-tauluun tallennetaan asemien metatiedot, josta niitä voidaan hyödyntää controllerin merodeissa. Metatiedot haetaan digitraffic-palvelusta,
//jos taulu on tyhjä, eli käytännössä silloin kun serveri joudutaan käynnistämään uudelleen.

const TrainController = {
  // findAllTrains -metodi hakee kaikki taulun rivin tietokannasta.
  findAllTrains: (req, res) => {
    Train.find((error, trains) => {
      if (error) {
        throw error;
      }
      res.json(trains);
    });
  },

  // deleteTrainrow -metodi poistaa annetun rivin tietokannasta.
  deleteTrainrow: (req, res) => {
    Train.deleteOne({ _id: req.params.id }, (error, result) => {
      if (error) {
        throw error;
        //res.json(error);
      }
      res.json('Trainrow deleted');
    });
  },

  // getStationsMetaData noutaa ja palauttaa asemien metatiedot.
  // Metodin noutaa metatiedot digitraffic-palvelusta vain, jos asemaTaulussa ei ole tietoja ennestään.
  // Tätä metodia kutsutaan kun Frontend-clientin JunaComponentti ladataan muistiin.
  getStationsMetaData: async (req, res) => {
    const passStations = [];
    stat = req.params.stat;

    if (asemaTaulu.length === 0) {
      const api_url = `https://rata.digitraffic.fi/api/v1/metadata/stations`;
      const fetch_stations_response = await fetch(api_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip',
        },
      }).catch((error) => {
        console.error(error);
        arrival_taulu = [{ info: 'Yhteys digitraffic-palveluun epäonnistui' }];
        res.json(arrival_taulu);
      });

      const stations_response = await fetch_stations_response
        .json()
        .catch((error) => {
          console.error(error);
        });

      for (asemat of stations_response) {
        myStations_del.set(
          asemat.stationShortCode, ///!!!!!!!!!!!!!!!!!!!!!!
          asemat.stationName ///!!!!!!!!!!!!!!!!!!!!!!!!!!!
        );

        asemaTaulu.push(asemat);
      }
    }

    for (passstat of asemaTaulu) {
      if (
        passstat.passengerTraffic &&
        JSON.stringify(passstat.stationShortCode) != JSON.stringify(stat)
      ) {
        passStations.push({
          aseman_UIC: passstat.stationUICCode,
          aseman_lyhenne: passstat.stationShortCode,
          aseman_nimi: passstat.stationName,
        });
      }
    }

    res.json(passStations);
  },

  // Metodi ottaa vastaan käyttäjän sijaintitiedot ja vertailee niitä asemien metatiedoissa oleviin asemien sijainteihin
  // Käyttäjän sijaintitiedot tulevat urlissa.
  // Metodin noutaa asemien metatiedot digitraffic-palvelusta vain, jos asemaTaulussa ei ole tietoja ennestään.

  getStations: async (req, res) => {
    const lat1 = req.params.lat1; // urlista poimitaan käyttäjän leveyspiiri
    const lon1 = req.params.lon1; // urlista poimitaan käyttäjän pituusspiiri

    let = distance = 0; // asetetaan distance -muuttujan arvoksi nolla. Tähän sijoitetaan käyttäjän sijanti suhteessa asemaan.
    let = nearestStation = ''; // asetetaan nearestStation -muuttujan arvoksi tyhjä merkkijono. Tähän sijoitetaan lähimmän aseman nimi.
    let shortestdistance = 2000; // tämä on lähtöarvo, kun vertaillaan käyttäjän sijaintia suhteessa asemiin.
    // töhän tauluun asetetaan kulloinkin lähempänä olevan aseman nimi ja etäisyys suhteessa käyttäjään. Lopuksi tähän tauluun jää lähimpänä
    // olevan aseman sijainti. Frontend-sovellus asettaa tämän tiedon perusteella aseman kartalle.
    // Taulussa palautetaan lisäksi lähimmän aseman nimi ja sen etäisyys käyttäjään.
    const taulu = [];

    if (asemaTaulu.length === 0) {
      // asemien metatiedot haetaan digitraffic-palvelusta vain, mikäli niitä ei ole ennestään asemaTaulu-taulussa.
      const api_url = `https://rata.digitraffic.fi/api/v1/metadata/stations`;
      const fetch_stations = await fetch(api_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip',
        },
      }).catch((error) => {
        console.error(error);
        arrival_taulu = [{ info: 'Yhteys digitraffic-palveluun epäonnistui' }];
        res.json(arrival_taulu);
      });
      const json_stations = await fetch_stations.json().catch((error) => {
        console.error(error);
      });

      // Alla viedään asemien lyhenne ja nimi -parit mappiin, jotta lyhenne voidaan mapata helposti aseman nimeen myöhemmin.
      // tässä jatkokehityksena olisi, että mapiin viedään aineistoa vain, jos map on tyhjä, kuten olen tehnyt asemaTaulun kanssa.
      // toisaalta tiedot mapataan tähän myStation_del -mappiin vain silloin kun asemaTaulukin on tyhjä. Eli käytännössä vain sen jälkeen
      // kun serveri on jouduttu käynnistämään uudelleen.
      for (asemat of json_stations) {
        myStations_del.set(
          asemat.stationShortCode, ///!!!!!!!!!!!!!!!!!!!!!!
          asemat.stationName ///!!!!!!!!!!!!!!!!!!!!!!!!!!!
        );

        asemaTaulu.push(asemat); // kukin asemarivi viedään asemaTaulu -tauluun.
      }
    }

    // Alla käydään asemaTaulu -taulu, ja jos asema on henkilöliikenneasema passengerTraffic = true, silloin kutsutaan metodia getDistanceFromLatLonKm ja viedään
    // sille argumentteina käyttäjän sijainti sekä kyseisen aseman sijanti. Metodin vastaus, eli aseman ja käyttäjän etäisyys sijoitetaan distance -muuttujaan.
    for (station of asemaTaulu) {
      if (station.passengerTraffic) {
        distance = distancecalc.getDistanceFromLatLonInKm(
          lat1,
          lon1,
          station.latitude,
          station.longitude
        );

        // Jos distance muuttujan arvo on pienempi kuin aiempi lyhin etäisyys, eli muuttujan shortestdistance, sijoitetaan distancen arvo shortestdistancen arvoksi
        // ja viedään aseman tiedot taulu -muuttujaan. Lisäksi muuttujaan viedään käyttäjän sijainti ja käyttäjän ja aseman etäisyys.
        if (distance < shortestdistance) {
          taulu[0] = {
            asema: station.stationName,
            koodi: station.stationShortCode,
            UICkoodi: station.stationUICCode,
            pituus: station.longitude,
            leveys: station.latitude,
            lahtopituus: lon1,
            lahtoleveys: lat1,
            etaisyys: distance,
          };

          shortestdistance = distance;
        }
      }
    }
    //
    // tässä taulu-muuttuja palautetaan jsonina. Taulu-muuttujan arvona on lähimmän aseman tiedot, sekä käyttäjän sekä aseman sijainti, sekä niiden etäisyys.
    res.json(taulu);
  },

  // getNextTrains palauttaa käyttäjää lähimmältä asemalta käyttäjän valitsemalle kohdeasemalle lähtevät suorat junayhteydet väliasemineen.
  getNextTrains: async (req, res) => {
    let departure = req.params.dep; // departure -muuttujan arvoksi sijoitetaan urlin parametrinä tullut lähtöaseman lyhenne.
    let arrival = req.params.arr; // arrival -muuttujan arvoksi sijoitetaan urlin parametrinä tullut kohdeaseman lyhenne.

    if (asemaTaulu.length === 0) {
      // asemien metatiedot haetaan digitraffic-palvelusta asemaTauluun vain, mikäli niitä ei ole ennestään asemaTaulu-taulussa.
      const api_url = `https://rata.digitraffic.fi/api/v1/metadata/stations`;
      const fetch_stations_del = await fetch(api_url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json; charset=iso-8859-1',
          'Accept-Encoding': 'gzip',
        },
      }).catch((error) => {
        console.error(error);
        arrival_taulu = [{ info: 'Yhteys digitraffic-palveluun epäonnistui' }];
        res.json(arrival_taulu);
      });
      const json_stations_del = await fetch_stations_del.json();

      for (asemat of json_stations_del) {
        myStations_del.set(asemat.stationShortCode, asemat.stationName);

        asemaTaulu.push(asemat);
      }
    }

    const lahtoasema = departure; // lahtoasema-muuttujan arvoksi viedään departure-muuttujan arvo
    const kohdeasema = arrival; // kohdeasema-muuttujan arvoksi viedään arrival-muuttujan arvo

    // Alla käydään läpi kukin asemalyhenne ja muutetaan skandinaaviset merkit Ä, Ö ja/tai Å digitraffic-palvelun ymmärtämään merkistöön.

    arrival = arrival.replace(/Ö/g, '%C3%96');
    arrival = arrival.replace(/Ä/g, '%C3%84');
    arrival = arrival.replace(/Å/g, '%C3%85');
    departure = departure.replace(/Ö/g, '%C3%96');
    departure = departure.replace(/Ä/g, '%C3%84');
    departure = departure.replace(/Å/g, '%C3%85');

    //let valiasema = ''; // esitellään ja alustetaan valiasema muuttuja tyhjäksi merkkijonoksi.
    const lahto = 'DEPARTURE'; // esitellään lahto-muuttuja ja asetetaan sen arvoksi 'DEPARTURE' -merkkijono
    const saapuminen = 'ARRIVAL'; // esitellään saapuminen-muuttuja ja asetetaan sen arvoksi 'ARRIVAL' -merkkijono
    let arrival_taulu = [{ info: 'ajanjaksolla vain tavarajunia' }];
    // Yllä alustetaan arrival_taulu -muuttujan. Jos muuttujaan ei päivitetä muuta, eli välillä ei kulje matkustajajunia lähimmän vuorokauden aikana, palautetaan
    // muuttujan arvoksi asetettu arvo.

    let valiasema_taulu = []; // alustetaan valiasema_taulu, johon sijoitetaan kunkin asemavälin väliasemat.

    const tavarajuna = 'Cargo'; // asetetaan tavarajuna -muuttujan arvoksi merkkijono 'Cargo'
    //let first_i = true; // esitellään ja asetetaan first_i -(boolean)muuttujan arvoksi true
    let first_j = true; // esitellään ja asetetaan first_j -(boolean)muuttujan arvoksi true

    let j; // esitellään j -muuttuja, jonka avulla viedään tietoja arrival_taulu -tauluun.
    let junanumero; // esitellään junanumero -muuttuja
    let lahtoaika; // esitellään lahtoaika -muuttuja
    let junalaji; // esitellään junalaji -muuttuja
    let junatyyppi; // esitellään junatyyppi -muuttuja
    let lahtoasemantapahtumantyyppi; // esitellään lahtoasemantapahtumantyyppi -muuttuja
    let edellinen_asema = true; // esitellään ja asetetaan edellinen_asema -(boolean)muuttujan arvoksi true
    let valiasema_status = false; // esitellään ja asetetaan valiasema_status -(boolean)muuttujan arvoksi false
    let valiasematapahtuma; // esitellään  valiasematapahtuma -muuttuja
    let v = 0; // esitellään v -muuttuja ja asetetaan sen arvoksi 0

    // alla urli, jota kutsutaan haettaessa departure ja arrival -muuttujien (asemien) välillä kulkevat suorat junavuorot
    // digitraffic -palvelu palauttaa seuraavan 24 tunnin aikana lähtevät junat. Urlin lopussa oleva limit-arvo rajoittaa palautettavia vuoroja
    const api_url_comp = `https://rata.digitraffic.fi/api/v1/live-trains/station/${departure}/${arrival}?&limit=10`;

    const fetch_comp = await fetch(api_url_comp, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Encoding': 'gzip',
      },
    }).catch((error) => {
      console.error(error);
      arrival_taulu = [{ info: 'Saatu vastaus virheellinen' }];
      res.json(arrival_taulu);
    });
    const json_comp = await fetch_comp.json().catch((error) => {
      console.error(error);
      arrival_taulu = [{ info: 'Saatu vastaus virheellinen' }];
      res.json(arrival_taulu);
    });

    if (JSON.stringify(json_comp.code)) {
      // jos digitraffic -palvelu palauttaa tiedon, että välillä ei kulje kyseisenä aikana junia, palauttaa se yksittäisen jsonin ja siitä löytyy kenttä
      // code. Jos code löytyy vastauksesta asetetaan arrival_taulu -muuttujan arvoksi alla oleva.

      arrival_taulu[0] = {
        junan_numero: '',
        junalaji: '',
        juna_tyyppi: '',
        lahtoaseman_nimi: myStations_del.get(lahtoasema), // tähän haetaan myStations_del -mapista aseman nimi lahtoasema-muuttujan arvolla (aseman lyhenne)
        lahtoaseman_lyhenne: lahtoasema, // tähän asetetaan lahtoasema -muuttujan arvo, eli lähtöaseman lyhenne. Lahtoasema -muuttujan arvo on saatu url-kutsussa
        lahtoaseman_UICkoodi: '',
        lahtoaseman_tapahtuma: '',
        lahtoaseman_lahtopaiva: '',
        lahtoaseman_lahtoaika: '',
        valiasemat: '',
        saapumisaseman_nimi: myStations_del.get(kohdeasema), // tähän haetaan myStations_del -mapista aseman nimi kohdeasema-muuttujan arvolla (aseman lyhenne)
        saapumisaseman_lyhenne: kohdeasema, // tähän asetetaan kohdeasema -muuttujan arvo, eli kohdeaseman lyhenne. Kohdeasema -muuttujan arvo on saatu url-kutsussa
        saapumisaseman_UICkoodi: '',
        saapumisaseman_tapahtuma: '',
        saapumisaseman_saapumispaiva: '',
        saapumisaseman_saapumisaika: '',
        info: `Ei suoria vuoroja välillä ${myStations_del.get(
          lahtoasema
        )} - ${myStations_del.get(kohdeasema)}`,
      };

      // Jos vastauksesta ei löydy code -kenttää, on kyseisellä välillä suoria junayhteyksiä seuravan 24 tunnin aikana
    } else {
      for (comp of json_comp) {
        v++;
        // Yllä lisätään v -muuttujan arvoa yhdellä. v -muuttujan arvo asetetaan arrival_taulu -tauluun ja valiasema_taulu -tauluun indeksiksi, jotta valiasemat voi kohdistaa
        // oikeaan lähtöasema - kohdeasema -väliin frontendissa.
        for (taulurow of comp.timeTableRows) {
          if (
            JSON.stringify(taulurow.stationShortCode) ===
              JSON.stringify(lahtoasema) &&
            JSON.stringify(taulurow.type) === JSON.stringify(lahto) &&
            JSON.stringify(comp.trainCategory) != JSON.stringify(tavarajuna)

            // Yllä: digitraffic -palvelu ei palauta suoraan haettua väliä, vaan esimerkiksi haulla JY - TPE voi palautua vuoroja, jotka ovat lähteneet Pieksamäeltä ja
            // jatkavat Helsinkiin. Siksi koodissa pitää etsiä digitraffic -palvelun vastauksesta kohta, jossa lahtoaseman type arvo = lahto (muuttujan arvoksi on asetettu
            // aiemmin 'DEPARTURE') JA junatyyppi ei ole tavarajuna (tavarajuna -muuttujan arvoksi on asetettu aiemmin 'Cargo'.
            // Kun ehto toteutuu, käsitellään riviä seuraavassa:
          ) {
            /*
            if (first_i) {
              //i = 0;
              first_i = false;
            }
            */

            lahtopaiva = new Date(taulurow.scheduledTime).toLocaleDateString(
              // tässä muutetaan digitraffic -palvelun palauttaam päiväys paikalliseksi
              'sq-AL',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }
            );
            //console.log(taulurow.scheduledTime);
            //lahtoaika = new Date(taulurow.scheduledTime).toLocaleTimeString(); // tässä muutetaan digitraffic -palvelun palauttama kellonaika paikalliseksi
            lahtoaika = taulurow.scheduledTime;
            junanumero = comp.trainNumber; // haetaan junanumero -muuttujan arvoksi trainNumber -kentän arvo.
            junatyyppi = comp.trainType; // haetaan junatyyppi (kuten Pendoliino) -muuttujan arvoksi trainType -kentän arvo.
            lahtoaika = lahtoaika; // ??????
            lahtopaiva = lahtopaiva; // ???????
            lahtoasemantapahtumantyyppi = helper.tapahtuma(taulurow.type); // tässä haetaan lähtäaseman tapahtumalle suomenkielinen vastine helperin tapahtuma -metodilla.
            junalaji = comp.trainCategory; // haetaan junalaji (kuten LongDistance) -muuttujan arvoksi trainCategory -kentän arvo.
            lahtoasemanUIC = taulurow.stationUICCode; // haetaan lahtoasemanUIC (aseman numerokoodi) -muuttujan arvoksi stationUICCode -kentän arvo.

            edellinen_asema = true; // tällä asetetaan päälle väliasemien keräys valiasema_taulu -tauluun
            valiasema_status = true; // tälle asetetaan arvoksi true tässä kohtaa kun lähtöasema on löytynyt.
          }

          // Alla olevalla if -rakenteella kerätään väliasemat valiasema_taulu -tauluun
          // Asema otetaan mukaan väliasema_taulu -tauluun, jos se ei ole kohdeasema, se ei ole tavarajuna ja lisäksi mukaan
          // otetaan se asema, jolla on type -arvona lahto-muuttujan arvo, eli 'DEPARTURE'. Lisäksi edellinen_asema -muuttujaen arvon pitää olla true.
          // Em. muuttujalla varmistetaan, se että mukaan ei oteta sellaisia väliasemia, joiden lähtöasema
          // ei täytä "lähtöaseman" ehtoja (mm. junavuoro ei saa olla tavarajuna ja lähtöseman pitää olla se, joka on tullut url-kutsussa.). valiasema_statuksen
          // tulee olla tässä kohtaa true, jotta väliasemiksi ei kerätä sellaisia asemia, jotka ovat jsonissa ennen varsinaista lähtöasemaa.
          if (
            JSON.stringify(taulurow.stationShortCode) !=
              JSON.stringify(kohdeasema) &&
            JSON.stringify(taulurow.stationShortCode) !=
              JSON.stringify(lahtoasema) &&
            JSON.stringify(taulurow.type) === JSON.stringify(lahto) &&
            JSON.stringify(comp.trainCategory) != JSON.stringify(tavarajuna) &&
            edellinen_asema &&
            valiasema_status
          ) {
            if (!taulurow.trainStopping) {
              valiasematapahtuma = 'OHITTAA'; // jos trainStopping -kentän arvo on false, valiasematapahtuman arvoksi asetetaan 'OHITTAA', eli juna ei pysähdy asemalla.
            } else {
              valiasematapahtuma = taulurow.type; // jos trainStopping -kentän arvo on true, otetaan valiasematapahtuman arvoksi type -kentän arvo (ARRIVAL tai DEPARTURE), eli
              // juna saapuu tai lähtee asemalta.
            }

            valiaseman_lahtopaiva = new Date(
              taulurow.scheduledTime
            ).toLocaleDateString('sq-AL', {
              // tässä muutetaan digitraffic -palvelun palauttama päiväys paikalliseksi
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            /*
            valiaseman_lahtoaika = new Date(
              taulurow.scheduledTime
            ).toLocaleTimeString(); // tässä muutetaan digitraffic -palvelun palauttama kellonaika paikalliseksi
*/
            valiaseman_lahtoaika = taulurow.scheduledTime;
            //valiasema = taulurow.stationShortCode; // asetetaan valiasema -muuttujan arvoksi aseman lyhenne.

            // Alla kootaan valiasema_taulu -muuttuja viemällä arvoja valiasema_taulu -tauluun.
            // väliasemalle tuodaan vain aemalta lähtötiedot tai ohitustiedot.

            valiasema_taulu.push({
              id: v, // id, jolla varmistetaan, että löydetään oikeaan lähtöasema-kohdeasema -pariin liittyvät välisemat frontendissä.
              valiaseman_lyhenne: taulurow.stationShortCode,
              valiaseman_nimi: myStations_del.get(taulurow.stationShortCode),

              valiasema_pysahdys: helper.pysahtyy(taulurow.trainStopping), // haetaan suomenkielinen vastine helperin metodilla trainStoppin -kentän arvolle true/false.
              kaupallinen_pysahdys: helper.ottaaMatkustajia(
                // tässä haetaan suomenkielinen vastine commercialStop -kentän arvolle helperin metodilla.
                taulurow.commercialStop // juna ottaa matkustajia tai ei ota matkustajia (commercialStop = true/false)
              ),
              valiaseman_tapahtuma: helper.tapahtuma(valiasematapahtuma), // joko juna ohittaa, lähtee tai saapuu asemalle. Suomenkielinen vastine haetaan helperin metodilla.
              valiaseman_tapahtumapaiva: valiaseman_lahtopaiva, // paikalliseksi muutettu lähtöpäivä
              valiaseman_tapahtumaaika: valiaseman_lahtoaika, // paikalliseksi muutettu lähtöaika
            });
          }

          // Jos asema onkin kohdeasema, kerätään siitä tiedot seuraavassa. Kohdeasema on kyseessä, jos aseman lyhenne on sama kuin url-kutsussa on tullut ja
          // juna saapuu asemalle ja juna ei ole tavarajuna.
          if (
            JSON.stringify(taulurow.stationShortCode) ===
              JSON.stringify(kohdeasema) &&
            JSON.stringify(taulurow.type) === JSON.stringify(saapuminen) &&
            JSON.stringify(comp.trainCategory) != JSON.stringify(tavarajuna)
          ) {
            if (first_j) {
              // tässä asetetaan j:lle ensimmäisellä kierroksella (first_j) arvo 0, jotta arrival_taulu -tauluun alkaa kertymään dataa rivistä 0 saakka ja samalla
              // kirjoitetaan yli alussa asetettu arrival_taulu[0] arvo [{ info: 'ajanjaksolla vain tavarajunia' }];
              j = 0;
              first_j = false;
            }

            saapumisaseman_saapumispaiva = new Date(
              taulurow.scheduledTime
            ).toLocaleDateString('sq-AL', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            });
            /*
            saapumisaseman_saapumisaika = new Date(
              taulurow.scheduledTime
            ).toLocaleTimeString();
*/
            saapumisaseman_saapumisaika = taulurow.scheduledTime;
            // tässä junavuoron tiedot koostetaan arrival_tauluun.
            // Arrival_taulu -taulun sisään viedään myös valiasema_taulu.
            // Joten arrival_taulu -taulun yksi "rivi" sisältää tiedot lähtöasemasta ja kohdeasemasta väliasemineen.
            arrival_taulu[j] = {
              id: v, // id, jolla varmistetaan, että löydetään oikeaan lähtöasema-kohdeasema -pariin liittyvät välisemat frontendissä.
              junan_numero: junanumero,
              junalaji: junalaji,
              juna_tyyppi: helper.junaTyyppi(junatyyppi),
              lahtoaseman_nimi: myStations_del.get(lahtoasema),
              lahtoaseman_lyhenne: lahtoasema,
              lahtoaseman_UICkoodi: lahtoasemanUIC,
              lahtoaseman_tapahtuma: lahtoasemantapahtumantyyppi,
              lahtoaseman_lahtopaiva: lahtopaiva,
              lahtoaseman_lahtoaika: lahtoaika,
              valiasemat: valiasema_taulu,
              saapumisaseman_nimi: myStations_del.get(kohdeasema),
              saapumisaseman_lyhenne: taulurow.stationShortCode,
              saapumisaseman_UICkoodi: taulurow.stationUICCode,
              saapumisaseman_tapahtuma: helper.tapahtuma(taulurow.type),
              saapumisaseman_saapumispaiva: saapumisaseman_saapumispaiva,
              saapumisaseman_saapumisaika: saapumisaseman_saapumisaika,
            };

            let aikaleima_paiva = new Date();
            aikaleima_paiva = aikaleima_paiva.toLocaleDateString();

            let aikaleima_kello = new Date();
            aikaleima_kello = aikaleima_kello.toLocaleTimeString();

            const NewTrain = Train({
              haku_paiva: aikaleima_paiva,
              //haku_kello: aikaleima_kello,
              trainnumber: junanumero,
              junatyyppi: helper.junaTyyppi(junatyyppi),
              lahtoasema: lahtoasema,
              saapumisasema: taulurow.stationShortCode,
            });

            try {
              NewTrain.save();
            } catch (error) {
              console.error(error);
            }

            edellinen_asema = false; // tällä asetetaan pois päältä väliasemien keräys taulukkoon, eli kohdeasema on löytynyt
            valiasema_status = false; // tällä asetetaan pois päältä väliasemien keräys taulukkoon, eli kohdeasema on löytynyt
            valiasema_taulu = []; // tässä tyhjennetään väliasemataulukko
            j++;
          }
        }
      }
    }
    //console.log(arrival_taulu);
    res.json(arrival_taulu);
  },
};

module.exports = TrainController;
