import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAfM8U5XadzeWOr3p6A-ZIOdZOWFQxtzsQ",
  authDomain: "devtinder-c7644.firebaseapp.com",
  projectId: "devtinder-c7644",
  storageBucket: "devtinder-c7644.firebasestorage.app",
  messagingSenderId: "717797651167",
  appId: "1:717797651167:web:31d4f86584702f25366f6a",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
