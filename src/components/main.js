import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";
import { Stage, Layer, Image, Text, Rect } from "react-konva";
import useImage from "use-image";

export default function main() {
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
		  ID: 0,
		},
		NFT_NAME: "",
		SYMBOL: "",
		MAX_SUPPLY: 1,
		WEI_COST: 0,
		DISPLAY_COST: 0,
		GAS_LIMIT: 0,
		MARKETPLACE: "",
		MARKETPLACE_LINK: "",
		SHOW_BACKGROUND: false,
	});

    //spaceship
    //================================================
    const maxWidth = window.innerWidth * 0.98;
    //const maxHeight = window.innerHeight * 0.98;
    const width = 2048;
    const height = 1600;
    const ratio = height / width;

    const Spaceship = () => {
        const [image] = useImage('/config/images/spaceship_4x.png');
        return( <Image image={image} height={maxWidth * ratio} width={maxWidth}/>);
    }

    const gallery = {
        x: 55,
        y: 570,
        width: 460,
        height: 370
    }
      
    const wallet = {
        x: 900,
        y: 0,
        width: 510,
        height: 312
    }

    const lab = {
        x: 1020,
        y: 580,
        width: 400,
        height: 240
    }

    const [state, setState] = React.useState({cursor: {
        x: null,
        y: null
    }});

    const [isGalleryHover, setGalleryIsHover] = React.useState(false);
    const [isWalletHover, setWalletIsHover] = React.useState(false);
    const [isLabHover, setLabIsHover] = React.useState(false);

    const handleMouseMove = (e) => {
        var stage = e.currentTarget;
        stage = e.target.getStage();
        setState({
            cursor: stage.getPointerPosition()
        });  
    };

    const handleGalleryEnter = (e) => {
        setGalleryIsHover(true);
    }

    const handleGalleryLeave = (e) => {
        setGalleryIsHover(false);
    }

    const handleGalleryClick = (e) => {
        window.open("https://testnets.opensea.io/collection/astrobelly", "_blank")
    }

    const handleWalletEnter = (e) => {
        setWalletIsHover(true);
    }

    const handleWalletLeave = (e) => {
        setWalletIsHover(false);
    }

    const handleWalletClick = (e) => {
        //connectWalletHandler();
        connectClick();
    }

    const handleLabEnter = (e) => {
        setLabIsHover(true);
    }

    const handleLabLeave = (e) => {
        setLabIsHover(false);
    }

    const handleLabClick = (e) => {
        e.preventDefault();
        setMintAmount(1);
        claimNFTs();
        getData();
    }

    const absX = (state.cursor.x * width) / maxWidth;
    const absY = (state.cursor.y * width) / maxWidth;
    const text = `X: ${absX}, Y: ${absY}`;


    const aGallery = {
        x: gallery.x * maxWidth / width,
        y: gallery.y * maxWidth / width,
        width: gallery.width * maxWidth / width,
        height: gallery.height * maxWidth / width,
    }

    const aWallet = {
        x: wallet.x * maxWidth / width,
        y: wallet.y * maxWidth / width,
        width: wallet.width * maxWidth / width,
        height: wallet.height * maxWidth / width,
    }

    const aLab = {
        x: lab.x * maxWidth / width,
        y: lab.y * maxWidth / width,
        width: lab.width * maxWidth / width,
        height: lab.height * maxWidth / width,
    }

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
            value: totalCostWei,
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
    	}
  	};

  	const getConfig = async () => {
    	const configResponse = await fetch("/config/config.json", {
      	headers: { 
        	"Content-Type": "application/json",
        	Accept: "application/json",
      		},
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
		<div className="main-content">
            {/*================================================================*/}
            <Stage width={maxWidth} height={maxWidth * ratio} >
                <Layer>
                    {/*<Text text="TEST" fontSize="20" fill="red" />*/}
                    <Spaceship /> 
                    <Text text={text} fontSize="20" fill="red" />
                    <Rect
                        id='Gallery' 
                        width={aGallery.width} 
                        height={aGallery.height} 
                        x={aGallery.x} y={aGallery.y} 
                        fill="white" 
                        opacity={isGalleryHover?0.5:0} 
                        onMouseEnter={handleGalleryEnter} 
                        onMouseLeave={handleGalleryLeave}
                        onClick={handleGalleryClick}/>
                    <Rect 
                        width={aWallet.width} 
                        height={aWallet.height} 
                        x={aWallet.x} y={aWallet.y} 
                        fill="white" 
                        opacity={isWalletHover?0.5:0} 
                        onMouseEnter={handleWalletEnter} 
                        onMouseLeave={handleWalletLeave}
                        onClick={handleWalletClick}/>
                    <Rect 
                        width={aLab.width} 
                        height={aLab.height} 
                        x={aLab.x} y={aLab.y} 
                        fill="white" 
                        opacity={isLabHover?0.5:0} 
                        onMouseEnter={handleLabEnter} 
                        onMouseLeave={handleLabLeave}
                        onClick={(e) => {
                            setMintAmount(1);
                            claimNFTs();
                            getData();}}/>
                </Layer>
            </Stage>
            {/*================================================================*/}
            <div className="hero">
                <p className="hero--text">
                    It a template NFT minting DAPP.
                    Please connect the wallet to Harmony Testnet.
                    Try to mint some NFTs.
                </p>
                <p className="hero--text">
                    Contract Address: {CONFIG.CONTRACT_ADDRESS}
                </p>
            </div>
            <div className="mint--container">
                <h1 className="minted-amount">
                    {data.totalSupply} / {data.maxSupply}
                </h1>
                <h2>
                    1 {CONFIG.SYMBOL} costs {CONFIG.DISPLAY_COST}{" "}
                    {CONFIG.NETWORK.SYMBOL}.
                </h2>
                <div className="quantity--container">
                    <button className="round-button" 
                        onClick={(e) => {
                            e.preventDefault();
                            decrementMintAmount();
                        }
                    }>
                        -
                    </button>
                    <h3>
                        {mintAmount}
                    </h3>
                    <button className="round-button" 
                        onClick={(e) => {
                            e.preventDefault();
                            incrementMintAmount();
                        }
                    }>
                        +
                    </button>
                </div>
                <button 
                    className="nav--button"
                    disabled={claimingNft ? 1 : 0} 
                    onClick={(e) => {
                        e.preventDefault();
                        claimNFTs();
                        getData();
                    }}>
                        Mint
                </button>
            </div>
        </div>
	)
}