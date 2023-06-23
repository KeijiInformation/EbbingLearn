import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from "firebase/firestore";






const firebaseConfig = {
    apiKey: "AIzaSyBZf7Pw39V6zB2WR7L2ACakFhVUBl2M4Vc",
    authDomain: "ebbinglearn.firebaseapp.com",
    projectId: "ebbinglearn",
    storageBucket: "ebbinglearn.appspot.com",
    messagingSenderId: "605674867045",
    appId: "1:605674867045:web:b7a60dde21f74df604398c",
    measurementId: "G-K2DLD3BRH7"
};






// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();
const analytics = getAnalytics(app);
const db = getFirestore();


export { auth, db };