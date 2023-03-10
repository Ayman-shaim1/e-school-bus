import { USER_LOGIN, USER_LOGOUT, USER_SET_EXPO_TOKEN } from "./userTypes";

export const login = user => {
  return { type: USER_LOGIN, payload: user };
};

export const logout = () => {
  return { type: USER_LOGOUT };
};

export const setToken = token => {
  return { type: USER_SET_EXPO_TOKEN, payload: token };
};
