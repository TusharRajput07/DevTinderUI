// export const BASE_URL = "http://localhost:7777";

export const BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:7777"
    : "http://192.168.1.73:7777";
