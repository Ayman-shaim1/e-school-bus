import axios from "axios";
import environment from "../../../environment";
import {
  LOCATION_GET_DIRECTION_FAIL,
  LOCATION_GET_DIRECTION_REQUEST,
  LOCATION_GET_DIRECTION_SUCCESS,
} from "./locationTypes";

export const getDirection = (start, destination) => {
  return async dispatch => {
    try {
      dispatch({ type: LOCATION_GET_DIRECTION_REQUEST });
      const { data } = await axios(
        `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${environment.openrouteapikey}&start=${start}&end=${destination}`
      );
      dispatch({ type: LOCATION_GET_DIRECTION_SUCCESS, payload: data });
    } catch (error) {
      const err =
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message;
      dispatch({ type: LOCATION_GET_DIRECTION_FAIL, payload: err });
    }
  };
};
