// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAb6wdyjvVtu2-5oGFZK3rV2mWlIJgzdgw",
  authDomain: "insugar-app.firebaseapp.com",
  projectId: "insugar-app",
  storageBucket: "insugar-app.appspot.com",
  messagingSenderId: "547489063975",
  appId: "1:547489063975:web:e0750ddadaa6abebcc9a02",
  measurementId: "G-39B9KVGCV7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);