import { createSlice } from "@reduxjs/toolkit";

// state shape: { userId: { count, lastMessage, lastTime } }
const unreadSlice = createSlice({
  name: "unread",
  initialState: {},
  reducers: {
    // called on app load — sets all unread counts from server
    setAllUnread: (state, action) => {
      return action.payload || {};
    },
    // called when a new message arrives in real time
    incrementUnread: (state, action) => {
      const { userId, text, time } = action.payload;
      const existing = state[userId] || { count: 0 };
      state[userId] = {
        count: existing.count + 1,
        lastMessage: text,
        lastTime: time,
      };
    },
    // update last message preview without incrementing count (sent messages)
    markLastMessage: (state, action) => {
      const { userId, text, time } = action.payload;
      const existing = state[userId] || { count: 0 };
      state[userId] = {
        count: existing.count,
        lastMessage: text,
        lastTime: time,
      };
    },
    // called when user opens a chat
    clearUnread: (state, action) => {
      const userId = action.payload;
      if (state[userId]) {
        state[userId].count = 0;
      }
    },
    resetUnread: () => {
      return {};
    },
  },
});

export const {
  setAllUnread,
  incrementUnread,
  markLastMessage,
  clearUnread,
  resetUnread,
} = unreadSlice.actions;

export default unreadSlice.reducer;
