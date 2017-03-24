/** Action Types */
export const SET_DUMMY = "SET_DUMMY";

/** Action Creators */
export const setDummy = value => ({
  type: SET_DUMMY,
  payload: value
});

/** Reducer */
const dummy = (state = "DUNNO", action) => {
  switch (action.type) {
    case SET_DUMMY:
      return action.payload;
    default:
      return state;
  }
};

export default dummy;
