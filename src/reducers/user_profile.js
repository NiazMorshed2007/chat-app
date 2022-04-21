import { SET_PROFILE } from "../actions/ActionTypes";

const profile = {
  displayName: "",
  email: "",
  photoUrl: "",
  emailVerified: false,
  uid: "",
};

const ProfileReducer = (state = profile, action) => {
  switch (action.type) {
    case SET_PROFILE: {
      return {
        displayName: action.payload.displayName,
        email: action.payload.email,
        photoUrl: action.payload.photoUrl,
        emailVerified: action.payload.emailVerified,
        uid: action.payload.uid,
      };
    }
    default:
      return state;
  }
};

export default ProfileReducer;
