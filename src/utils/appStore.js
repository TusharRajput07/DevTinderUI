import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import matchesReducer from "./matchesSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    matches: matchesReducer,
  },
});

export default appStore;
