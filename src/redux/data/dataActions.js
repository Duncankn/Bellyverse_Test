// log
import store from "../store";

const fetchDataRequest = () => {
  return {
    type: "CHECK_DATA_REQUEST",
  };
};

const fetchDataSuccess = (payload) => {
  return {
    type: "CHECK_DATA_SUCCESS",
    payload: payload,
  };
};

const fetchDataFailed = (payload) => {
  return {
    type: "CHECK_DATA_FAILED",
    payload: payload,
  };
};

export const fetchData = (payload) => {
  return async (dispatch) => {
    dispatch(fetchDataRequest());
    try {
      let symbol = await store
        .getState()
        .blockchain.smartContract.methods.symbol()
        .call();
      let totalSupply = await store
        .getState()
        .blockchain.smartContract.methods.totalSupply()
        .call();
      let maxSupply = await store
        .getState()
        .blockchain.smartContract.methods.maxSupply()
        .call();
      let cost = await store
        .getState()
        .blockchain.smartContract.methods.cost()
        .call();
      let balanceOf = await store
        .getState()
        .blockchain.smartContract.methods.balanceOf(payload)
        .call();
      let walletOfOwner = await store
        .getState()
        .blockchain.smartContract.methods.walletOfOwner(payload)
        .call();
      dispatch(
        fetchDataSuccess({
          symbol,
          totalSupply,
          maxSupply,
          cost,
          balanceOf,
          walletOfOwner
        })
      );
    } catch (err) {
      console.log(err);
      dispatch(fetchDataFailed("Could not load data from contract."));
    }
  };
};
