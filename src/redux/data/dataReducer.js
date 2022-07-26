const initialState = {
  loading: false,
  symbol: "",
  totalSupply: 0,
  maxSupply: 0,
  cost: 0,
  balanceOf: 0,
  walletOfOwner: [],
  error: false,
  errorMsg: "",
};

const dataReducer = (state = initialState, action) => {
  switch (action.type) {
    case "CHECK_DATA_REQUEST":
      return {
        ...state,
        loading: true,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_SUCCESS":
      return {
        ...state,
        loading: false,
        symbol: action.payload.symbol,
        totalSupply: action.payload.totalSupply,
        maxSupply: action.payload.maxSupply,
        cost: action.payload.cost,
        balanceOf: action.payload.balanceOf,
        walletOfOwner: action.payload.walletOfOwner,
        error: false,
        errorMsg: "",
      };
    case "CHECK_DATA_FAILED":
      return {
        ...initialState,
        loading: false,
        error: true,
        errorMsg: action.payload,
      };
    default:
      return state;
  }
};

export default dataReducer;
