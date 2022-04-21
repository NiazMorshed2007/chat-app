import { SET_CHATS } from "../actions/ActionTypes";

const chats = {
  owner: "",
  conversations: [],
};

const ChatsReducer = (state = chats, action) => {
  switch (action.type) {
    case SET_CHATS: {
      return {
        owner: action.payload.owner,
        conversations: action.payload.conversations,
      };
    }
    default:
      return state;
  }
};

export default ChatsReducer;
