import { SET_ALLUSERS } from "../actions/ActionTypes";

const all_users = [];

const AllUsersReducer = (state = all_users, action) => {
  switch (action.type) {
    case SET_ALLUSERS: {
      return action.arr;
    }
    default:
      return state;
  }
};

export default AllUsersReducer;
