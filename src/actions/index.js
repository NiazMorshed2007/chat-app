import {
  SET_ALLUSERS,
  SET_CHATS,
  SET_LOGGED,
  SET_PROFILE,
} from "./ActionTypes";

export const setLogged = (bool) => {
  return {
    type: SET_LOGGED,
    payload: {
      val: bool,
    },
  };
};

export const setProfile = (obj) => {
  return {
    type: SET_PROFILE,
    payload: {
      ...obj,
    },
  };
};

export const setAllUsers = (arr) => {
  return {
    type: SET_ALLUSERS,
    arr,
  };
};

export const setChats = (obj) => {
  return {
    type: SET_CHATS,
    payload: {
      ...obj,
    },
  };
};
