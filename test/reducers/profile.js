/** Action Types */
export const SET_PROFILE = "SET_PROFILE";
export const CLEAR_PROFILE = "CLEAR_PROFILE";

/** Action Creators */
export const setProfile = data => ({
  type: SET_PROFILE,
  payload: data
});

export const clearProfile = data => ({
  type: CLEAR_PROFILE
});

/** Reducer */
const profile = (state = {}, { type, payload }) => {
  switch (type) {
    case SET_PROFILE:
      return payload;

    case CLEAR_PROFILE:
      return {};

    default:
      return state;
  }
};

export default profile;
