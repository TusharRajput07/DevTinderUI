import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import matchesReducer from "./matchesSlice";
import requestsReducer from "./requestsSlice";

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    matches: matchesReducer,
    requests: requestsReducer,
  },
});

export default appStore;
