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
  const [spriteOptions, setSpriteOptions] = useState({
    image: null
  });

  const spriteRef = useRef();
  const [direction, setDirection] = useState({
    state: "walkDown"
  });

  useEffect(() => {
    const image = new window.Image();
    image.src = "/config/images/npc01.png";
    image.onload = () => {
      // set image only when it is loaded
      setSpriteOptions({
        image: image
      });
      spriteRef.current.start();
    };
  }, [direction.state]);

  const animations = {
    walkDown: [0, 0, 96, 96, 96, 0, 96, 96, 194, 0, 96, 96, 290, 0, 96, 96],
    walkUp: [0, 96, 96, 96, 96, 96, 96, 96, 194, 96, 96, 96, 290, 96, 96, 96],
    idleDown: [0, 0, 96, 96],
    idleUp: [0, 96, 96, 96]
  };

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (direction.state !== "walkDown") {
        return;
      }
      //spriteRef.current.y(frame.time / period);

      //Math.floor(frame.time / period) ? 20 * (frame.time / period) : 20;
      spriteRef.current.y() > (300 * maxWidth) / width
        ? setDirection({ state: "idleDown" })
        : spriteRef.current.y((50 * maxWidth) / width + frame.time / period);
      //spriteRef.current.y((frame.time) / period);
    }, spriteRef.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
      //setDirection({ state: "walkUp" });
    };
  }, [direction.state]);

  useEffect(() => {
    var anim = new Konva.Animation((frame) => {
      const period = 20;
      if (direction.state !== "walkUp") {
        return;
      }

      spriteRef.current.y() < (50 * maxWidth) / width
        ? setDirection({ state: "idleUp" })
        : spriteRef.current.y((300 * maxWidth) / width - frame.time / period);
    }, spriteRef.current.getLayer());

    anim.start();
    return () => {
      anim.stop();
    };
  }, [direction.state]);

  useEffect(() => {
    if (direction.state === "idleDown") {
      setDirection({ state: "walkUp" });
    }
    if (direction.state === "idleUp") {
      setDirection({ state: "walkDown" });
    }
  }, [direction.state]);

  const handleNpcClick = (e) => {
    setDirection({ state: "idleUp" });
  };

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
          ref={spriteRef}
          image={spriteOptions.image}
          animation={direction.state}
          frameRate={8}
          frameIndex={0}
          animations={animations}
          x={(620 * maxWidth) / width}
          y={(0 * maxWidth) / width}
          onClick={handleNpcClick}
        />
      </Layer>
    </Stage>
  );
}

export default App;
