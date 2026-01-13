import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Your Firebase config from Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyD1u9jVuJ2B9IAyZCvPvi2VFvEUXEL8EMw",
    authDomain: "photocollection-aaacb.firebaseapp.com",
    projectId: "photocollection-aaacb",
    storageBucket: "photocollection-aaacb.firebasestorage.app",
    messagingSenderId: "1098153185069",
    appId: "1:1098153185069:web:d3dfe08093d65662c88da4",
    measurementId: "G-RY04QP408L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, storage, googleProvider };
