import { SET_LOGGED } from "../actions/ActionTypes";

const isLogged = false;

const LoggedReducer = (state = isLogged, action) => {
  switch (action.type) {
    case SET_LOGGED: {
      return action.payload.val;
    }
    default:
      return state;
  }
};

export default LoggedReducer;
