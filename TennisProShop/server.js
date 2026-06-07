const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

let kosarica = [];
app.use(express.static('public'));

const proizvodi = [
  {
    id: 1,
    naziv: 'Wilson Pro Staff v14',
    cijena: 249,
    zaliha: 15,
    kategorija: 'Reketi',
    slika: '/proizvodi/wilson.jpg'
  },
  {
    id: 2,
    naziv: 'Babolat Pure Aero 2023',
    cijena: 229,
    zaliha: 10,
    kategorija: 'Reketi',
    slika: '/proizvodi/babolat.jpg'
  },
  {
    id: 3,
    naziv: 'Head Speed MP',
    cijena: 219,
    zaliha: 12,
    kategorija: 'Reketi',
    slika: '/proizvodi/head.jpg'
  },
  {
    id: 4,
    naziv: 'Nike Court Air Zoom Vapor',
    cijena: 119,
    zaliha: 7,
    kategorija: 'Obuća',
    slika: '/proizvodi/nike.jpg'
  },
  {
    id: 5,
    naziv: 'Adidas Barricade',
    cijena: 109,
    zaliha: 9,
    kategorija: 'Obuća',
    slika: '/proizvodi/adidas.jpg'
  },
  {
    id: 6,
    naziv: 'Wilson US Open Teniske loptice',
    cijena: 11,
    zaliha: 50,
    kategorija: 'Loptice',
    slika: '/proizvodi/lopte.jpg'
  },
  {
    id: 7,
    naziv: 'Head Championship Teniske loptice',
    cijena: 10,
    zaliha: 45,
    kategorija: 'Loptice',
    slika: '/proizvodi/HeadLopte.jpg'
  },
  {
    id: 8,
    naziv: 'Wilson Super Tour Torba',
    cijena: 89,
    zaliha: 8,
    kategorija: 'Torbe',
    slika: '/proizvodi/WilsonTorba.jpg'
  },
  {
    id: 9,
    naziv: 'Babolat Pure Drive Torba',
    cijena: 79,
    zaliha: 10,
    kategorija: 'Torbe',
    slika: '/proizvodi/BabolatTorba.jpg'
  },
  {
    id: 10,
    naziv: 'Head Tour Team Torba',
    cijena: 69,
    zaliha: 12,
    kategorija: 'Torbe',
    slika: '/proizvodi/HeadTorba.jpg'
}
];

app.get('/api/proizvodi', (req, res) => {

  let rezultat = [...proizvodi];

 if (req.query.pretraga) {

  let pojam = req.query.pretraga.toLowerCase();

const sinonimi = {
  loptice: ['lopte'],
  lopte: ['loptice'],
  tenisice: ['obuća'],
  obuca: ['obuća'],
  reket: ['reketi'],
  reketi: ['reket']
};

  rezultat = rezultat.filter(proizvod => {

    const tekst =
      `${proizvod.naziv} ${proizvod.kategorija}`
      .toLowerCase();

    if (tekst.includes(pojam)) {
      return true;
    }

    if (sinonimi[pojam]) {
      return sinonimi[pojam].some(rijec =>
        tekst.includes(rijec)
      );
    }

    return false;
  });
}

  if (req.query.kategorija) {
    rezultat = rezultat.filter(
      proizvod => proizvod.kategorija === req.query.kategorija
    );
  }

  res.json(rezultat);
});

app.get('/api/proizvodi/xml', (req, res) => {

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<proizvodi>`;

  proizvodi.forEach(proizvod => {
    xml += `
  <proizvod>
    <id>${proizvod.id}</id>
    <naziv>${proizvod.naziv}</naziv>
    <cijena>${proizvod.cijena}</cijena>
    <zaliha>${proizvod.zaliha}</zaliha>
    <kategorija>${proizvod.kategorija}</kategorija>
  </proizvod>`;
  });

  xml += `
</proizvodi>`;

  res.set('Content-Type', 'application/xml');
  res.send(xml);
});
app.post('/api/kosarica', (req, res) => {

  const proizvod = proizvodi.find(
    p => p.id === req.body.id
  );

  if (!proizvod) {
    return res.status(404).json({
      poruka: 'Proizvod nije pronađen'
    });
  }
app.get('/api/kosarica', (req, res) => {
  res.json(kosarica);
});
app.delete('/api/kosarica/:id', (req, res) => {

  const id = Number(req.params.id);

  kosarica = kosarica.filter(
    proizvod => proizvod.id !== id
  );

  res.json({
    poruka: 'Proizvod uklonjen iz košarice'
  });
});
  kosarica.push(proizvod);

  res.json({
    poruka: 'Proizvod dodan u košaricu'
  });
});

app.post('/api/narudzba', (req, res) => {

  const ukupno = kosarica.reduce(
    (suma, proizvod) => suma + proizvod.cijena,
    0
  );

  const narudzba = {
    datum: new Date(),
    ukupno,
    proizvodi: kosarica
  };

  kosarica = [];

  res.json({
    poruka: 'Narudžba uspješno kreirana',
    narudzba
  });
});
app.listen(port, () => {
  console.log(`Server pokrenut na http://localhost:${port}`);
});