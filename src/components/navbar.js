import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "../redux/blockchain/blockchainActions";
import { fetchData } from "../redux/data/dataActions";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export default function Navbar() {
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);
	const data = useSelector((state) => state.data);
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
		<nav>
			<img className="nav--logo" src="/config/images/logo.png" />
			{blockchain.account === null || blockchain.contract === null ? 
				(<div>
					<button className="nav--button" onClick={connectClick}>Connect</button>
					<p>Connect to the {CONFIG.NETWORK.NAME} network</p> 
				</div>
				):
				(<div>
					<button className="nav--button"> {truncate(blockchain.account, 7)} </button>
					<p className="hero--text">{CONFIG.SYMBOL} : {data.balanceOf}</p>
				</div>
				)
			}
		</nav>
	)
}