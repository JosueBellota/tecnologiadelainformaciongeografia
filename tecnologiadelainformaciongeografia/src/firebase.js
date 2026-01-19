// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCO2yUUIhbVHCm6c14beqI5VmhEA_TE4xo",
  authDomain: "tecnologias-geograficas.firebaseapp.com",
  projectId: "tecnologias-geograficas",
  storageBucket: "tecnologias-geograficas.firebasestorage.app",
  messagingSenderId: "181436458348",
  appId: "1:181436458348:web:a7f549aa36d51239aa3f49",
  measurementId: "G-BTQKB2X8J1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };
