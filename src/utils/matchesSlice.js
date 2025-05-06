import { createSlice } from "@reduxjs/toolkit";

const matchesSlice = createSlice({
  name: "matches",
  initialState: null,
  reducers: {
    addMatches: (state, action) => {
      return action.payload;
    },
    removeMatches: (state, action) => {
      return null;
    },
  },
});

export const { addMatches, removeMatches } = matchesSlice.actions;

export default matchesSlice.reducer;
