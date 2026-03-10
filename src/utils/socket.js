import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

let socket = null;

export const getSocket = () => {
  if (!socket) {
    socket = io(BASE_URL, {
      withCredentials: true,
      autoConnect: false, // don't connect immediately
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
  return socket;
};

export const connectSocket = () => {
  const socket = getSocket();
  if (!socket.connected) {
    socket.connect(); // connect only when explicitly called
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
