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

  const mintBox = {
    x: 50,
    y: 400,
    width: maxWidth * 0.95,
    height: 1.5
  };

  const tube = {
    width: 480,
    height: 480
  };

  const discord = {
    x: 190,
    y: 870,
    width: 190,
    height: 130,
    vertice: [0, 920, 190, 920, 190, 960, 125, 960, 36, 1050, 0, 1050]
  };

  const twitter = {
    x: 45,
    y: 480,
    width: 295,
    height: 410
  };

  return { wallet, market, gallery, lab, discord, twitter, mintBox, tube };
}
