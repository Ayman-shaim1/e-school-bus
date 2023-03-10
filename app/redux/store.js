import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { getData, removeData, saveData } from "../services/storage";

import { locationGetDirectionReducer } from "./location/locationReducers";
import { userLoginReducer } from "./user/useReducers";


console.log(getData("userInfo"))

const userInfoFromStorage = getData("userInfo")
  ? JSON.parse(getData("userInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const reducer = combineReducers({
  locationGetDirection: locationGetDirectionReducer,
  userLogin: userLoginReducer,
});

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(thunk))
);
export default store;
