import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    users: [],
    page: 1,
    hasMore: true,
  },
  reducers: {
    // appends new batch of users to the existing list, increments page
    addFeed: (state, action) => {
      state.users = [...state.users, ...action.payload];
      state.page = state.page + 1;
      state.hasMore = action.payload.length > 0;
    },
    // removes a single user after swipe
    removeUserFromFeed: (state, action) => {
      state.users = state.users.filter((user) => user._id !== action.payload);
    },
    // resets everything on logout
    resetFeed: () => {
      return { users: [], page: 1, hasMore: true };
    },
  },
});

export const { addFeed, removeUserFromFeed, resetFeed } = feedSlice.actions;
export default feedSlice.reducer;
