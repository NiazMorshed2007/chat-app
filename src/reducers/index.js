import { combineReducers } from "redux";
import AllUsersReducer from "./all_users";
import ChatsReducer from "./chats";
import LoggedReducer from "./isLogged";
import ProfileReducer from "./user_profile";

const rootReducer = combineReducers({
  isLogged: LoggedReducer,
  user_profile: ProfileReducer,
  chats: ChatsReducer,
  all_users: AllUsersReducer,
});

export default rootReducer;
