// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {

    apiKey: "AIzaSyBKdXRgRkme2L_pTIguNCP3veWO9VP2QTM",
    authDomain: "is-shop-project.firebaseapp.com",
    projectId: "is-shop-project",
    storageBucket: "is-shop-project.firebasestorage.app",
    messagingSenderId: "914404370235",
    appId: "1:914404370235:web:887027c2cdc41f14deb91e",
    measurementId: "G-15070QS7WQ"
};


// Initialize Firebase

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);