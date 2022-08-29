import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";

import {
  Stage,
  Layer,
  Image,
  Text,
  Rect,
  Circle,
  Group,
  Line,
  Sprite
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import Tooltip from "./components/tooltip";
import useAudio from "./components/useAudio";

//spaceship
//================================================
const maxWidth = window.innerWidth * 0.98;
//const maxHeight = window.innerHeight * 0.98;
const width = 2160;
const height = 1440;
const ratio = height / width;

const Spaceship = () => {
  const [image] = useImage("/config/images/spaceshipBelly.png");
  return (
    <Image
      className="spaceship"
      image={image}
      height={maxWidth * ratio}
      width={maxWidth}
    />
  );
};

function App() {
  const dialogRef = React.useRef();
  const logoRef = React.useRef();
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const [isWalletConnected, setWalletIsConnected] = useState(false);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
  const [mintDialog, setMintDialog] = useState(false);
  const [dialogAnimeStarted, setDialogAnimeStarted] = useState(false);
  const [dialogAnimeEnded, setDialogAnimeEnded] = useState(false);
  const [logo] = useImage("/config/images/polygon.svg");
  const [music] = useImage("/config/images/music-icon.png");
  const [noMusic] = useImage("/config/images/music-off-icon.png");
  const bgmUrl = "/config/06 Kowloon.mp3";
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: "",
    SCAN_LINK: "",
    NETWORK: {
      NAME: "",
      SYMBOL: "",
      ID: 0
    },
    NFT_NAME: "",
    SYMBOL: "",
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: "",
    MARKETPLACE_LINK: "",
    SHOW_BACKGROUND: false
  });

  const [state, setState] = React.useState({
    cursor: {
      x: null,
      y: null
    }
  });
  //======================================================================
  //BGM player

  const [playing, toggle] = useAudio(bgmUrl);

  //======================================================================
  //NPC Sprite

  const animations = {
    walkDown: [0, 0, 96, 96, 96, 0, 96, 96, 194, 0, 96, 96, 290, 0, 96, 96],
    walkUp: [0, 96, 96, 96, 96, 96, 96, 96, 194, 96, 96, 96, 290, 96, 96, 96],
    idleDown: [0, 0, 96, 96],
    idleUp: [0, 96, 96, 96],
    walkLeft: [0, 0, 96, 96, 96, 0, 96, 96, 194, 0, 96, 96, 290, 0, 96, 96],
    walkRight: [
      0,
      96,
      96,
      96,
      96,
      96,
      96,
      96,
      194,
      96,
      96,
      96,
      290,
      96,
      96,
      96
    ],
    idleLeft: [0, 0, 96, 96],
    idleRight: [0, 96, 96, 96]
  };

  const [npc1Options, setNpc1Options] = useState({ image: null });
  const [npc2Options, setNpc2Options] = useState({ image: null });
  const [npc3Options, setNpc3Options] = useState({ image: null });
  const [npc4Options, setNpc4Options] = useState({ image: null });
  const [npc5Options, setNpc5Options] = useState({ image: null });
  const [npc6Options, setNpc6Options] = useState({ image: null });
  const [npc7Options, setNpc7Options] = useState({ image: null });
  const [npc8Options, setNpc8Options] = useState({ image: null });
  const [npc9Options, setNpc9Options] = useState({ image: null });
  const [npc10Options, setNpc10Options] = useState({ image: null });

  const range = 100;
  const npc1position = { x: 620, y: 380 };
  const npc2position = { x: 1800, y: 200 };
  const npc3position = { x: 1400, y: 600 };
  const npc4position = { x: 1600, y: 1000 };
  const npc5position = { x: 450, y: 850 };
  const npc6position = { x: 1200, y: 300 };
  const npc7position = { x: 1100, y: 750 };
  const npc8position = { x: 150, y: 540 };
  const npc9position = { x: 1100, y: 1300 };
  const npc10position = { x: 300, y: 300 };

  const npc1Ref = useRef();
  const npc2Ref = useRef();
  const npc3Ref = useRef();
  const npc4Ref = useRef();
  const npc5Ref = useRef();
  const npc6Ref = useRef();
  const npc7Ref = useRef();
  const npc8Ref = useRef();
  const npc9Ref = useRef();
  const npc10Ref = useRef();

  const [npc1Direction, setNpc1Direction] = useState({ state: "walkDown" });
  const [npc2Direction, setNpc2Direction] = useState({ state: "walkDown" });
  const [npc3Direction, setNpc3Direction] = useState({ state: "walkDown" });
  const [npc4Direction, setNpc4Direction] = useState({ state: "walkDown" });
  const [npc5Direction, setNpc5Direction] = useState({ state: "walkDown" });
  const [npc6Direction, setNpc6Direction] = useState({ state: "walkLeft" });
  const [npc7Direction, setNpc7Direction] = useState({ state: "walkLeft" });
  const [npc8Direction, setNpc8Direction] = useState({ state: "walkLeft" });
  const [npc9Direction, setNpc9Direction] = useState({ state: "walkLeft" });
  const [npc10Direction, setNpc10Direction] = useState({ state: "walkLeft" });

  //NPC1
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc01.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc1Options({
        image: image
      });
      npc1Ref.current.start();
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc1Direction.state !== "walkDown") {
        return;
      }

      npc1Ref.current.y() > ((npc1position.y + range) * maxWidth) / width
        ? setNpc1Direction({ state: "idleDown" })
        : npc1Ref.current.y(
            ((npc1position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc1Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc1Direction.state !== "walkUp") {
        return;
      }

      npc1Ref.current.y() < ((npc1position.y - range) * maxWidth) / width
        ? setNpc1Direction({ state: "idleUp" })
        : npc1Ref.current.y(
            ((npc1position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc1Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc1Direction.state]);

  useEffect(() => {
    if (npc1Direction.state === "idleDown") {
      setNpc1Direction({ state: "walkUp" });
    }
    if (npc1Direction.state === "idleUp") {
      setNpc1Direction({ state: "walkDown" });
    }
  }, [npc1Direction.state]);

  //NPC2
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc02.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc2Options({ image: image });
      npc2Ref.current.start();
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc2Direction.state !== "walkDown") {
        return;
      }

      npc2Ref.current.y() > ((npc2position.y + range) * maxWidth) / width
        ? setNpc2Direction({ state: "idleDown" })
        : npc2Ref.current.y(
            ((npc2position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc2Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc2Direction.state !== "walkUp") {
        return;
      }

      npc2Ref.current.y() < ((npc2position.y - range) * maxWidth) / width
        ? setNpc2Direction({ state: "idleUp" })
        : npc2Ref.current.y(
            ((npc2position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc2Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc2Direction.state]);

  useEffect(() => {
    if (npc2Direction.state === "idleDown") {
      setNpc2Direction({ state: "walkUp" });
    }
    if (npc2Direction.state === "idleUp") {
      setNpc2Direction({ state: "walkDown" });
    }
  }, [npc2Direction.state]);

  //NPC3
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc03.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc3Options({
        image: image
      });
      npc3Ref.current.start();
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc3Direction.state !== "walkDown") {
        return;
      }

      npc3Ref.current.y() > ((npc3position.y + range) * maxWidth) / width
        ? setNpc3Direction({ state: "idleDown" })
        : npc3Ref.current.y(
            ((npc3position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc3Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc3Direction.state !== "walkUp") {
        return;
      }

      npc3Ref.current.y() < ((npc3position.y - range) * maxWidth) / width
        ? setNpc3Direction({ state: "idleUp" })
        : npc3Ref.current.y(
            ((npc3position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc3Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc3Direction.state]);

  useEffect(() => {
    if (npc3Direction.state === "idleDown") {
      setNpc3Direction({ state: "walkUp" });
    }
    if (npc3Direction.state === "idleUp") {
      setNpc3Direction({ state: "walkDown" });
    }
  }, [npc3Direction.state]);

  //NPC4
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc04.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc4Options({ image: image });
      npc4Ref.current.start();
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc4Direction.state !== "walkDown") {
        return;
      }

      npc4Ref.current.y() > ((npc4position.y + range) * maxWidth) / width
        ? setNpc4Direction({ state: "idleDown" })
        : npc4Ref.current.y(
            ((npc4position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc4Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc4Direction.state !== "walkUp") {
        return;
      }

      npc4Ref.current.y() < ((npc4position.y - range) * maxWidth) / width
        ? setNpc4Direction({ state: "idleUp" })
        : npc4Ref.current.y(
            ((npc4position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc4Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc4Direction.state]);

  useEffect(() => {
    if (npc4Direction.state === "idleDown") {
      setNpc4Direction({ state: "walkUp" });
    }
    if (npc4Direction.state === "idleUp") {
      setNpc4Direction({ state: "walkDown" });
    }
  }, [npc4Direction.state]);

  //NPC5
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc05.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc5Options({ image: image });
      npc5Ref.current.start();
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc5Direction.state !== "walkDown") {
        return;
      }

      npc5Ref.current.y() > ((npc5position.y + range) * maxWidth) / width
        ? setNpc5Direction({ state: "idleDown" })
        : npc5Ref.current.y(
            ((npc5position.y - range) * maxWidth) / width + frame.time / period
          );
    }, npc5Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (npc5Direction.state !== "walkUp") {
        return;
      }

      npc5Ref.current.y() < ((npc5position.y - range) * maxWidth) / width
        ? setNpc5Direction({ state: "idleUp" })
        : npc5Ref.current.y(
            ((npc5position.y + range) * maxWidth) / width - frame.time / period
          );
    }, npc5Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc5Direction.state]);

  useEffect(() => {
    if (npc5Direction.state === "idleDown") {
      setNpc5Direction({ state: "walkUp" });
    }
    if (npc5Direction.state === "idleUp") {
      setNpc5Direction({ state: "walkDown" });
    }
  }, [npc5Direction.state]);

  //NPC6
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc06.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc6Options({ image: image });
      npc6Ref.current.start();
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc6Direction.state !== "walkRight") {
        return;
      }

      npc6Ref.current.x() > ((npc6position.x + range) * maxWidth) / width
        ? setNpc6Direction({ state: "idleRight" })
        : npc6Ref.current.x(
            ((npc6position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc6Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc6Direction.state !== "walkLeft") {
        return;
      }

      npc6Ref.current.x() < ((npc6position.x - range) * maxWidth) / width
        ? setNpc6Direction({ state: "idleLeft" })
        : npc6Ref.current.x(
            ((npc6position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc6Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc6Direction.state]);

  useEffect(() => {
    if (npc6Direction.state === "idleLeft") {
      setNpc6Direction({ state: "walkRight" });
    }
    if (npc6Direction.state === "idleRight") {
      setNpc6Direction({ state: "walkLeft" });
    }
  }, [npc6Direction.state]);

  //NPC7
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc07.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc7Options({ image: image });
      npc7Ref.current.start();
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc7Direction.state !== "walkRight") {
        return;
      }

      npc7Ref.current.x() > ((npc7position.x + range) * maxWidth) / width
        ? setNpc7Direction({ state: "idleRight" })
        : npc7Ref.current.x(
            ((npc7position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc7Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc7Direction.state !== "walkLeft") {
        return;
      }

      npc7Ref.current.x() < ((npc7position.x - range) * maxWidth) / width
        ? setNpc7Direction({ state: "idleLeft" })
        : npc7Ref.current.x(
            ((npc7position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc7Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc7Direction.state]);

  useEffect(() => {
    if (npc7Direction.state === "idleLeft") {
      setNpc7Direction({ state: "walkRight" });
    }
    if (npc7Direction.state === "idleRight") {
      setNpc7Direction({ state: "walkLeft" });
    }
  }, [npc7Direction.state]);

  //NPC8
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc08.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc8Options({ image: image });
      npc8Ref.current.start();
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc8Direction.state !== "walkRight") {
        return;
      }

      npc8Ref.current.x() > ((npc8position.x + range) * maxWidth) / width
        ? setNpc8Direction({ state: "idleRight" })
        : npc8Ref.current.x(
            ((npc8position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc8Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc8Direction.state !== "walkLeft") {
        return;
      }

      npc8Ref.current.x() < ((npc8position.x - range) * maxWidth) / width
        ? setNpc8Direction({ state: "idleLeft" })
        : npc8Ref.current.x(
            ((npc8position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc8Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc8Direction.state]);

  useEffect(() => {
    if (npc8Direction.state === "idleLeft") {
      setNpc8Direction({ state: "walkRight" });
    }
    if (npc8Direction.state === "idleRight") {
      setNpc8Direction({ state: "walkLeft" });
    }
  }, [npc8Direction.state]);

  //NPC9
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc09.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc9Options({ image: image });
      npc9Ref.current.start();
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc9Direction.state !== "walkRight") {
        return;
      }

      npc9Ref.current.x() > ((npc9position.x + range) * maxWidth) / width
        ? setNpc9Direction({ state: "idleRight" })
        : npc9Ref.current.x(
            ((npc9position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc9Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc9Direction.state !== "walkLeft") {
        return;
      }

      npc9Ref.current.x() < ((npc9position.x - range) * maxWidth) / width
        ? setNpc9Direction({ state: "idleLeft" })
        : npc9Ref.current.x(
            ((npc9position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc9Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc9Direction.state]);

  useEffect(() => {
    if (npc9Direction.state === "idleLeft") {
      setNpc9Direction({ state: "walkRight" });
    }
    if (npc9Direction.state === "idleRight") {
      setNpc9Direction({ state: "walkLeft" });
    }
  }, [npc9Direction.state]);

  //NPC10
  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc10.png";
    image.onload = () => {
      // set image only when it is loaded
      setNpc10Options({ image: image });
      npc10Ref.current.start();
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc10Direction.state !== "walkRight") {
        return;
      }

      npc10Ref.current.x() > ((npc10position.x + range) * maxWidth) / width
        ? setNpc10Direction({ state: "idleRight" })
        : npc10Ref.current.x(
            ((npc10position.x - range) * maxWidth) / width + frame.time / period
          );
    }, npc10Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 30;
      if (npc10Direction.state !== "walkLeft") {
        return;
      }

      npc10Ref.current.x() < ((npc10position.x - range) * maxWidth) / width
        ? setNpc10Direction({ state: "idleLeft" })
        : npc10Ref.current.x(
            ((npc10position.x + range) * maxWidth) / width - frame.time / period
          );
    }, npc10Ref.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [npc10Direction.state]);

  useEffect(() => {
    if (npc10Direction.state === "idleLeft") {
      setNpc10Direction({ state: "walkRight" });
    }
    if (npc10Direction.state === "idleRight") {
      setNpc10Direction({ state: "walkLeft" });
    }
  }, [npc10Direction.state]);
  //==========================================================================

  const [isTooltipVisible, setTooltipVisible] = React.useState(false);
  const [tooltipText, setTooltipText] = React.useState("");

  const [isMarketHover, setMarketIsHover] = React.useState(false);
  const [isWalletHover, setWalletIsHover] = React.useState(false);
  const [isLabHover, setLabIsHover] = React.useState(false);
  const [isDiscordHover, setDiscordIsHover] = React.useState(false);
  const [isBarHover, setBarIsHover] = React.useState(false);
  const [isMintTextHover, setMintTextIsHover] = React.useState(false);
  const [isMintMinusHover, setMintMinusIsHover] = React.useState(false);
  const [isMintPlusHover, setMintPlusIsHover] = React.useState(false);
  const [isBgmHover, setBgmIsHover] = React.useState(false);

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
    x: 200,
    y: 750,
    width: maxWidth * 0.8,
    height: 10
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

  const musicPlayer = {
    x: 690,
    y: 880,
    width: 96,
    height: 62
  };

  const handleMouseMove = (e) => {
    var stage = e.currentTarget;
    stage = e.target.getStage();
    setState({
      cursor: stage.getPointerPosition()
    });
  };

  const handleMarketEnter = (e) => {
    setMarketIsHover(true);
    setTooltipText("Market");
    setTooltipVisible(true);
  };

  const handleMarketLeave = (e) => {
    setMarketIsHover(false);
    setTooltipVisible(false);
  };

  const handleMarketClick = (e) => {
    window.open("https://testnets.opensea.io/collection/astrobelly", "_blank");
  };

  const handleWalletEnter = (e) => {
    setWalletIsHover(true);
    setTooltipText("Connect");
    setTooltipVisible(true);
  };

  const handleWalletLeave = (e) => {
    setWalletIsHover(false);
    setTooltipVisible(false);
  };

  const handleWalletClick = (e) => {
    //connectWalletHandler();
    connectClick();
  };

  const handleLabEnter = (e) => {
    setLabIsHover(true);
    setTooltipText("Belly Lab");
    setTooltipVisible(true);
  };

  const handleLabLeave = (e) => {
    setLabIsHover(false);
    setTooltipVisible(false);
  };

  const handleLabClick = (e) => {
    //setMintAmount(1);
    //claimNFTs();
    //getData();
    setMintDialog(true);
  };

  const handleMintClick = (e) => {
    setMintAmount(1);
    claimNFTs();
    getData();
  };

  const closeDialogHandler = (e) => {
    setMintDialog(false);
    setDialogAnimeStarted(false);
    setDialogAnimeEnded(false);
  };

  const handleMintTextEnter = (e) => {
    setMintTextIsHover(true);
  };

  const handleMintTextLeave = (e) => {
    setMintTextIsHover(false);
  };

  const handleMintMinusEnter = (e) => {
    setMintMinusIsHover(true);
  };

  const handleMintMinusLeave = (e) => {
    setMintMinusIsHover(false);
  };

  const handleMintPlusEnter = (e) => {
    setMintPlusIsHover(true);
  };

  const handleMintPlusLeave = (e) => {
    setMintPlusIsHover(false);
  };

  const handleDiscordEnter = (e) => {
    setDiscordIsHover(true);
    setTooltipText("Discord");
    setTooltipVisible(true);
  };

  const handleDiscordLeave = (e) => {
    setDiscordIsHover(false);
    setTooltipVisible(false);
  };

  const handleDiscordClick = (e) => {
    window.open("https://discord.gg/egDG48vUzU", "_blank");
  };

  const handleBarEnter = (e) => {
    setBarIsHover(true);
    setTooltipText("Twitter");
    setTooltipVisible(true);
  };

  const handleBarLeave = (e) => {
    setBarIsHover(false);
    setTooltipVisible(false);
  };

  const handleBarClick = (e) => {
    window.open(
      "https://twitter.com/BellyCustomNFT?s=20&t=y05Mv05oV5A8Fhg9yaBcOA",
      "_blank"
    );
  };

  const handleBgmEnter = (e) => {
    setBgmIsHover(true);
    setTooltipText("Music");
    setTooltipVisible(true);
  };

  const handleBgmLeave = (e) => {
    setBarIsHover(false);
    setTooltipVisible(false);
  };

  const handleBgmClick = (e) => {
    toggle();
  };

  const absX = (state.cursor.x * width) / maxWidth;
  const absY = (state.cursor.y * width) / maxWidth;
  const text = `X: ${absX}, Y: ${absY}`;

  const aMarket = {
    x: (market.x * maxWidth) / width,
    y: (market.y * maxWidth) / width,
    width: (market.width * maxWidth) / width,
    height: (market.height * maxWidth) / width
  };

  const aWallet = {
    x: (wallet.x * maxWidth) / width,
    y: (wallet.y * maxWidth) / width,
    width: (wallet.width * maxWidth) / width,
    height: (wallet.height * maxWidth) / width
  };

  const aLab = {
    x: (lab.x * maxWidth) / width,
    y: (lab.y * maxWidth) / width,
    width: (lab.width * maxWidth) / width,
    height: (lab.height * maxWidth) / width,
    vertice: lab.vertice.map((data) => {
      return (data * maxWidth) / width;
    })
  };

  const aDiscord = {
    x: (discord.x * maxWidth) / width,
    y: (discord.y * maxWidth) / width,
    vertice: discord.vertice.map((data) => {
      return (data * maxWidth) / width;
    })
  };

  const aTwitter = {
    x: (twitter.x * maxWidth) / width,
    y: (twitter.y * maxWidth) / width,
    width: (twitter.width * maxWidth) / width,
    height: (twitter.height * maxWidth) / width
  };
  ///////Minting dialog
  const aMintBox = {
    x: (mintBox.x * maxWidth) / width,
    y: (mintBox.y * maxWidth) / width,
    width: mintBox.width,
    height: (mintBox.height * maxWidth) / width
  };

  const aMintText = {
    x: (mintBox.x * maxWidth) / width + mintBox.width - 100,
    y: (mintBox.y * maxWidth) / width + aMintBox.height * 20 - 30,
    width: mintBox.width,
    height: (mintBox.height * maxWidth) / width
  };

  const aMintQty = {
    x: (mintBox.x * maxWidth) / width + aMintBox.width / 2,
    y: (mintBox.y * maxWidth) / width + (aMintBox.height * 20) / 2
  };

  const aMintMinus = {
    x: (mintBox.x * maxWidth) / width + aMintBox.width / 2 - 50,
    y: (mintBox.y * maxWidth) / width + (aMintBox.height * 20) / 2
  };

  const aMintPlus = {
    x: (mintBox.x * maxWidth) / width + aMintBox.width / 2 + 50,
    y: (mintBox.y * maxWidth) / width + (aMintBox.height * 20) / 2
  };

  const aMintCross = {
    x: (mintBox.x * maxWidth) / width + mintBox.width,
    y: (mintBox.y * maxWidth) / width + aMintBox.height
  };

  const aMusicPlayer = {
    x: (musicPlayer.x * maxWidth) / width,
    y: (musicPlayer.y * maxWidth) / width,
    width: (musicPlayer.width * maxWidth) / width,
    height: (musicPlayer.height * maxWidth) / width
  };

  //================================================

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
    setClaimingNft(true);
    blockchain.smartContract.methods
      .mint(mintAmount)
      .send({
        gasLimit: String(totalGasLimit),
        gasPrice: String(CONFIG.GAS_PRICE),
        to: CONFIG.CONTRACT_ADDRESS,
        from: blockchain.account,
        value: totalCostWei
      })
      .once("error", (err) => {
        console.log(err);
        setFeedback("Sorry, something went wrong please try again later.");
        setClaimingNft(false);
      })
      .then((receipt) => {
        console.log(receipt);
        setFeedback(
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
        );
        setClaimingNft(false);
        dispatch(fetchData(blockchain.account));
      });
  };

  const decrementMintAmount = () => {
    let newMintAmount = mintAmount - 1;
    if (newMintAmount < 1) {
      newMintAmount = 1;
    }
    setMintAmount(newMintAmount);
  };

  const incrementMintAmount = () => {
    let newMintAmount = mintAmount + 1;
    if (newMintAmount > 10) {
      newMintAmount = 10;
    }
    setMintAmount(newMintAmount);
  };

  const getData = () => {
    if (blockchain.account !== "" && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
      setWalletIsConnected(true);
    } else {
      dispatch(connect());
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch("/config/config.json", {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

  function connectClick() {
    dispatch(connect());
    getData();
  }

  useEffect(() => {
    if (!isWalletConnected) {
      return;
    }
    var anim = new Konva.Animation((frame) => {
      const centerY = (50 * maxWidth) / width;
      const period = 3000;
      const offset = (20 * maxWidth) / width;
      logoRef.current.y(
        centerY + offset * Math.sin((frame.time * 2 * Math.PI) / period)
      );
    }, logoRef.current.getLayer());

    anim.start();
  }, [isWalletConnected]);

  useEffect(() => {
    if (!mintDialog) {
      return;
    }
    var period = 300;
    var anim = new Konva.Animation((frame) => {
      var scale = frame.time / period <= 1 ? 20 * (frame.time / period) : 20;
      dialogRef.current.scale({ y: scale });
    }, dialogRef.current.getLayer());

    anim.start();
    setDialogAnimeStarted(true);

    return () => {
      anim.stop();
      setDialogAnimeEnded(true);
    };
  }, [mintDialog]);

  return (
    <Stage
      width={maxWidth}
      height={maxWidth * ratio}
      onMouseMove={handleMouseMove}
    >
      <Layer>
        <Spaceship />
      </Layer>
      <Layer>
        <Image
          image={playing ? noMusic : music}
          width={playing ? (80 * maxWidth) / width : (64 * maxWidth) / width}
          height={(64 * maxWidth) / width}
          x={(45 * maxWidth) / width}
          y={(1350 * maxWidth) / width}
          onMouseEnter={handleBgmEnter}
          onMouseLeave={handleBgmLeave}
          onClick={handleBgmClick}
          onTap={handleBgmClick}
        />
        <Text
          text={text}
          fontFamily="Press Start 2P"
          fontSize="20"
          fill="red"
        />
        <Rect
          id="Market"
          width={aMarket.width}
          height={aMarket.height}
          x={aMarket.x}
          y={aMarket.y}
          fill="white"
          opacity={isMarketHover ? 0.5 : 0}
          onMouseEnter={handleMarketEnter}
          onMouseLeave={handleMarketLeave}
          onClick={handleMarketClick}
          onTap={handleMarketClick}
        />
        <Rect
          width={aWallet.width}
          height={aWallet.height}
          x={aWallet.x}
          y={aWallet.y}
          fill="white"
          opacity={isWalletHover ? 0.5 : 0}
          onMouseEnter={handleWalletEnter}
          onMouseLeave={handleWalletLeave}
          onClick={handleWalletClick}
          onTap={handleWalletClick}
        />
        {isWalletConnected && (
          <Image
            ref={logoRef}
            image={logo}
            width={(120 * maxWidth) / width}
            height={(90 * maxWidth) / width}
            x={(900 * maxWidth) / width}
            y={(50 * maxWidth) / width}
          />
        )}
        <Line
          points={aLab.vertice}
          closed
          fill="white"
          opacity={isLabHover ? 0.5 : 0}
          onMouseEnter={handleLabEnter}
          onMouseLeave={handleLabLeave}
          onClick={handleLabClick}
          onTap={handleLabClick}
        />
        {mintDialog && (
          <Group>
            <Rect
              ref={dialogRef}
              width={aMintBox.width}
              height={aMintBox.height}
              x={aMintBox.x}
              y={aMintBox.y}
              fill="black"
              opacity={0.7}
            />
            <Text
              x={aMintBox.x}
              y={aMintBox.y}
              text="Mint Belly NFT"
              fontSize={18}
              fontStyle="bold"
              fontFamily="Press Start 2P"
              fill="white"
              width={aMintBox.width}
              padding={5}
              align="left"
            />
            <Text
              x={aMintMinus.x}
              y={aMintMinus.y}
              text="-"
              fontSize={18}
              fontFamily="Press Start 2P"
              fill={isMintMinusHover ? "red" : "white"}
              padding={5}
              verticalAlign="middle"
              align="center"
              onClick={decrementMintAmount}
              onTap={decrementMintAmount}
              onMouseEnter={handleMintMinusEnter}
              onMouseLeave={handleMintMinusLeave}
            />
            <Text
              x={aMintQty.x}
              y={aMintQty.y}
              text={mintAmount}
              fontSize={18}
              fontFamily="Press Start 2P"
              fill="white"
              padding={5}
              verticalAlign="middle"
              align="center"
            />
            <Text
              x={aMintPlus.x}
              y={aMintPlus.y}
              text="+"
              fontSize={18}
              fontFamily="Press Start 2P"
              fill={isMintPlusHover ? "red" : "white"}
              padding={5}
              verticalAlign="middle"
              align="center"
              onClick={incrementMintAmount}
              onTap={incrementMintAmount}
              onMouseEnter={handleMintPlusEnter}
              onMouseLeave={handleMintPlusLeave}
            />
            <Text
              x={aMintText.x}
              y={aMintText.y}
              text="Mint"
              fontSize={18}
              fontFamily="Press Start 2P"
              fill={isMintTextHover ? "red" : "white"}
              padding={5}
              verticalAlign="bottom"
              align="right"
              onClick={handleMintClick}
              onTap={handleMintClick}
              onMouseEnter={handleMintTextEnter}
              onMouseLeave={handleMintTextLeave}
            />
            <Circle
              x={aMintCross.x}
              y={aMintCross.y}
              radius={10}
              fill="black"
              onClick={closeDialogHandler}
              onTap={closeDialogHandler}
            />
            <Text
              x={aMintCross.x - 6}
              y={aMintCross.y - 8}
              text="X"
              fontSize={18}
              fontStyle="bold"
              fill="white"
              verticalAlign="top"
              align="left"
              opacity={0.7}
              onClick={closeDialogHandler}
              onTap={closeDialogHandler}
            />
          </Group>
        )}
        <Line
          points={aDiscord.vertice}
          closed
          fill="white"
          opacity={isDiscordHover ? 0.5 : 0}
          onMouseEnter={handleDiscordEnter}
          onMouseLeave={handleDiscordLeave}
          onClick={handleDiscordClick}
          onTap={handleDiscordClick}
        />
        <Rect
          id="twitter"
          width={aTwitter.width}
          height={aTwitter.height}
          x={aTwitter.x}
          y={aTwitter.y}
          fill="white"
          opacity={isBarHover ? 0.5 : 0}
          onMouseEnter={handleBarEnter}
          onMouseLeave={handleBarLeave}
          onClick={handleBarClick}
          onTap={handleBarClick}
        />
        <Tooltip
          x={state.cursor.x}
          y={state.cursor.y - 15}
          text={tooltipText}
          isVisible={isTooltipVisible}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc1Ref}
          image={npc1Options.image}
          animation={npc1Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc1position.x * maxWidth) / width}
          y={(npc1position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc2Ref}
          image={npc2Options.image}
          animation={npc2Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc2position.x * maxWidth) / width}
          y={(npc2position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc3Ref}
          image={npc3Options.image}
          animation={npc3Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc3position.x * maxWidth) / width}
          y={(npc3position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc4Ref}
          image={npc4Options.image}
          animation={npc4Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc4position.x * maxWidth) / width}
          y={(npc4position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc5Ref}
          image={npc5Options.image}
          animation={npc5Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc5position.x * maxWidth) / width}
          y={(npc5position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc6Ref}
          image={npc6Options.image}
          animation={npc6Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc6position.x * maxWidth) / width}
          y={(npc6position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc7Ref}
          image={npc7Options.image}
          animation={npc7Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc7position.x * maxWidth) / width}
          y={(npc7position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc8Ref}
          image={npc8Options.image}
          animation={npc8Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc8position.x * maxWidth) / width}
          y={(npc8position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc9Ref}
          image={npc9Options.image}
          animation={npc9Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc9position.x * maxWidth) / width}
          y={(npc9position.y * maxWidth) / width}
        />
        <Sprite
          scaleX={maxWidth / width}
          scaleY={maxWidth / width}
          height={1}
          ref={npc10Ref}
          image={npc10Options.image}
          animation={npc10Direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(npc10position.x * maxWidth) / width}
          y={(npc10position.y * maxWidth) / width}
        />
      </Layer>
    </Stage>
  );
}

export default App;
