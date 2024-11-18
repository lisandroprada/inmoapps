import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyAOvMM5pHNHDYbcphvxEmXuwHyKU34-_sQ",
    authDomain: "inmoapp-181ee.firebaseapp.com",
    projectId: "inmoapp-181ee",
    storageBucket: "inmoapp-181ee.firebasestorage.app",
    messagingSenderId: "213198588497",
    appId: "1:213198588497:web:f3102603e5b587b3a20670",
    measurementId: "G-5CS75LQQGL"
  };

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)