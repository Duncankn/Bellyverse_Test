const maxWidth = window.innerWidth * 0.99;

export default function Facilities() {
  const market = {
    x: 0,
    y: 0,
    width: 575,
    height: 462
  };

  const wallet = {
    x: 765,
    y: 0,
    width: 390,
    height: 220
  };

  const gallery = {
    x: 1580,
    y: 430,
    width: 440,
    height: 270
  };

  const lab = {
    x: 766,
    y: 483,
    width: 580,
    height: 220,
    vertice: [
      766,
      483,
      860,
      483,
      860,
      432,
      1250,
      432,
      1250,
      483,
      1346,
      483,
      1346,
      700,
      766,
      700
    ]
  };

  const tube = {
    width: 1536,
    height: 744
  };

  const mintBox = {
    width: tube.width,
    height: tube.height
  };

  const discord = {
    x: 0,
    y: 910,
    width: 380,
    height: 230
  };

  const twitter = {
    x: 45,
    y: 480,
    width: 295,
    height: 410
  };

  return { wallet, market, gallery, lab, discord, twitter, mintBox, tube };
}
