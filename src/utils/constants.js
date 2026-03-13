export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:7777"
    : window.location.hostname === "192.168.1.73"
      ? "http://192.168.1.73:7777"
      : "https://devtinder-opx5.onrender.com";
