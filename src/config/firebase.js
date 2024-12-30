import { initializeApp } from 'firebase/app'
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyAOvMM5pHNHDYbcphvxEmXuwHyKU34-_sQ",
    authDomain: "inmoapp-181ee.firebaseapp.com",
    projectId: "inmoapp-181ee",
    storageBucket: "inmoapp-181ee.firebasestorage.app",
    messagingSenderId: "213198588497",
    appId: "1:213198588497:web:f3102603e5b587b3a20670",
    measurementId: "G-5CS75LQQGL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Auth with persistence
const auth = getAuth(app)
setPersistence(auth, browserLocalPersistence)
    .catch((error) => {
        console.error("Error setting auth persistence:", error);
    });

// Initialize Firestore
const db = getFirestore(app)

export { app, auth, db }