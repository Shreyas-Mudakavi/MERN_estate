// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_CONFIG_API_KEY,
  authDomain: "mern-estate-f2fdf.firebaseapp.com",
  projectId: "mern-estate-f2fdf",
  storageBucket: "mern-estate-f2fdf.appspot.com",
  messagingSenderId: "469715925272",
  appId: "1:469715925272:web:476b0cb3bc1f518a48066d",
  measurementId: "G-RERJTMF0W2",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
