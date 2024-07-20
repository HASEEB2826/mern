import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyA3OPRXhgt7qNkE5_0Das91X4XyjBNQAek",
  authDomain: "alpine-tempo-403817.firebaseapp.com",
  projectId: "alpine-tempo-403817",
  storageBucket: "alpine-tempo-403817.appspot.com",
  messagingSenderId: "106415787632",
  appId: "1:106415787632:web:fb4414835f5f72656feeb5",
  measurementId: "G-PSXB6GKQ5T"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);