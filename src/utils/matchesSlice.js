import { createSlice } from "@reduxjs/toolkit";

const matchesSlice = createSlice({
  name: "matches",
  initialState: [],
  reducers: {
    addMatches: (state, action) => {
      return action.payload;
    },
    // removes a single match by user ID
    removeMatch: (state, action) => {
      return state.filter((match) => match._id !== action.payload);
    },
    resetMatches: () => {
      return [];
    },
  },
});

export const { addMatches, removeMatch, resetMatches } = matchesSlice.actions;
export default matchesSlice.reducer;
