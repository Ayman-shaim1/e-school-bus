import {
  LOCATION_GET_DIRECTION_FAIL,
  LOCATION_GET_DIRECTION_REQUEST,
  LOCATION_GET_DIRECTION_SUCCESS,
} from "./locationTypes";

export const locationGetDirectionReducer = (state = {}, action) => {
  switch (action.type) {
    case LOCATION_GET_DIRECTION_REQUEST:
      return { loading: true };
    case LOCATION_GET_DIRECTION_SUCCESS:
      return { loading: false, directionsData: action.payload };
    case LOCATION_GET_DIRECTION_FAIL:
      return { loading: false, error: action.payload };
    default:
      return state;
  }
};
