import { USER_LOGIN, USER_LOGOUT, USER_SET_EXPO_TOKEN } from "./userTypes";

export const userLoginReducer = (state = {}, action) => {
  switch (action.type) {
    case USER_LOGIN:
      return { userInfo: action.payload };
    case USER_SET_EXPO_TOKEN:
      return { userInfo: { ...state.userInfo, expotoken: action.payload  } };
    case USER_LOGOUT:
      return {};
    default:
      return state;
  }
};
