// Tämä kontrolleri on kokonaan omaa koodiani. IT
// Kontrollerilla suomennetaan erinäisiä digitraffin palauttamia termeja. IT
// En ole aivan varma onko tämä arkkitehtuurillisesti kontrolleri. IT

function pysahtyy(value) {
  if (value) {
    return 'Pysähtyy';
  } else {
    return 'Ei pysähdy';
  }
}

function tapahtuma(value) {
  if (value == 'OHITTAA') {
    return 'Ohittaa';
  }

  if (value == 'DEPARTURE') {
    return 'Lähtö asemalta';
  } else {
    return 'Saapuminen asemalle';
  }
}

function ottaaMatkustajia(value) {
  if (value) {
    return 'Ottaa ja jättää matkustajia';
  } else {
    return 'Ei ota, eikä jätä matkustajia';
  }
}

function junaTyyppi(value) {
  if (value == 'S') {
    return 'Pendolino';
  } else {
    return value;
  }
}

module.exports = { pysahtyy, tapahtuma, ottaaMatkustajia, junaTyyppi };
