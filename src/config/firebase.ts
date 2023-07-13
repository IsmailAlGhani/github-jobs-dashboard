// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGciK2_uwN8Z5nWmmmOr8TXIIQjsJ9pf8",
  authDomain: "job-githubs-dashboard.firebaseapp.com",
  projectId: "job-githubs-dashboard",
  storageBucket: "job-githubs-dashboard.appspot.com",
  messagingSenderId: "288598893288",
  appId: "1:288598893288:web:9d3a50e696ca78d550df5d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
