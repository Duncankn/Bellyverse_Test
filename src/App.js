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
  Line
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";

//spaceship
//================================================
const maxWidth = window.innerWidth * 0.98;
//const maxHeight = window.innerHeight * 0.98;
const width = 2016;
const height = 1296;
const ratio = height / width;

const Spaceship = () => {
  const [image] = useImage("/config/images/spaceshipBelly.png");
  return <Image image={image} height={maxWidth * ratio} width={maxWidth} />;
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

  const [isMarketHover, setMarketIsHover] = React.useState(false);
  const [isWalletHover, setWalletIsHover] = React.useState(false);
  const [isLabHover, setLabIsHover] = React.useState(false);
  const [isDiscordHover, setDiscordIsHover] = React.useState(false);
  const [isMintTextHover, setMintTextIsHover] = React.useState(false);
  const [isMintMinusHover, setMintMinusIsHover] = React.useState(false);
  const [isMintPlusHover, setMintPlusIsHover] = React.useState(false);

  const market = {
    x: 0,
    y: 0,
    width: 485,
    height: 410
  };

  const wallet = {
    x: 670,
    y: 0,
    width: 390,
    height: 220
  };

  const lab = {
    x: 766,
    y: 433,
    width: 580,
    height: 220,
    vertice: [
      766,
      433,
      860,
      433,
      860,
      382,
      1250,
      382,
      1250,
      433,
      1346,
      433,
      1346,
      650,
      766,
      650
    ]
  };

  const mintBox = {
    x: 200,
    y: 750,
    width: maxWidth * 0.8,
    height: 10
  };

  const discord = {
    x: 400,
    y: 400,
    width: 190,
    height: 130,
    vertice: [0, 870, 190, 870, 190, 910, 125, 910, 36, 1000, 0, 1000]
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
  };

  const handleMarketLeave = (e) => {
    setMarketIsHover(false);
  };

  const handleMarketClick = (e) => {
    window.open("https://testnets.opensea.io/collection/astrobelly", "_blank");
  };

  const handleWalletEnter = (e) => {
    setWalletIsHover(true);
  };

  const handleWalletLeave = (e) => {
    setWalletIsHover(false);
  };

  const handleWalletClick = (e) => {
    //connectWalletHandler();
    connectClick();
  };

  const handleLabEnter = (e) => {
    setLabIsHover(true);
  };

  const handleLabLeave = (e) => {
    setLabIsHover(false);
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
  };

  const handleDiscordLeave = (e) => {
    setDiscordIsHover(false);
  };

  const handleDiscordClick = (e) => {
    window.open("https://discord.gg/egDG48vUzU", "_blank");
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
        {/*<Text text="TEST" fontSize="20" fill="red" />*/}
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
            x={(800 * maxWidth) / width}
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
      </Layer>
    </Stage>
  );
}

export default App;
