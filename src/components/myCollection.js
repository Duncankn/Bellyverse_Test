import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Switch from "react-input-switch";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import Card from "./card/card";
import Tile from "./card/imageTile";

const myCollection = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.data);
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

  const [isSelectedAll, selectAllCollection] = useState(false);
  const [value, setValue] = useState(0);

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

  //const collection = data.walletOfOwner;
  const collection = isSelectedAll
    ? Array.from({ length: CONFIG.MAX_SUPPLY }, (_, i) => i + 1)
    : data.walletOfOwner;

  const handleChange = () => {
    if (value === 0) {
      setValue(1);
      selectAllCollection(true);
    } else if (value === 1) {
      setValue(0);
      selectAllCollection(false);
    }
  };

  return (
    <div>
      <div className="switch">
        <p className="switch--label">My Collection</p>
        <Switch
          className="collection--switch"
          onChange={handleChange}
          value={value}
          styles={{
            container: {
              width: 80,
              height: 30
            },
            track: {
              borderRadius: 20
            },
            trackChecked: {
              backgroundColor: "wheat"
            },
            button: {
              top: 3,
              bottom: 3,
              right: 50,
              left: 3,
              borderRadius: 20
            },
            buttonChecked: {
              right: 3,
              left: 50
            }
          }}
        />
        <p className="switch--label">Full collection</p>
        <div
          style={{
            width: "fit-content",
            margin: "auto"
          }}
        >
          <ToggleButtonGroup
            color="primary"
            value={value}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="1" aria-label="full">
              Full collection
            </ToggleButton>
            <ToggleButton value="0" aria-label="owned">
              My collection
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>

      {isSelectedAll && (
        <div className="myCollection">
          {collection.map((item) => {
            return (
              <>
                {/*<Card id={item} />*/}
                <Tile id={item} />
              </>
            );
          })}
        </div>
      )}
      {!isSelectedAll && (
        <div className="myCollection">
          {collection.map((item) => {
            return (
              <>
                <Tile id={item} />
              </>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default myCollection;
