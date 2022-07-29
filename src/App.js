import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import { Stage, Layer, Image, Text, Rect } from "react-konva";
import useImage from "use-image";

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
  const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
  const [mintAmount, setMintAmount] = useState(1);
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
    height: 220
  };

  const [state, setState] = React.useState({
    cursor: {
      x: null,
      y: null
    }
  });

  const [isMarketHover, setMarketIsHover] = React.useState(false);
  const [isWalletHover, setWalletIsHover] = React.useState(false);
  const [isLabHover, setLabIsHover] = React.useState(false);

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
    setMintAmount(1);
    claimNFTs();
    getData();
    return false;
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
    height: (lab.height * maxWidth) / width
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

        <Text text={text} fontSize="20" fill="red" />
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
        />
        <Rect
          width={aLab.width}
          height={aLab.height}
          x={aLab.x}
          y={aLab.y}
          fill="white"
          opacity={isLabHover ? 0.5 : 0}
          onMouseEnter={handleLabEnter}
          onMouseLeave={handleLabLeave}
          onClick={handleLabClick}
        />
      </Layer>
    </Stage>
  );
}

export default App;
