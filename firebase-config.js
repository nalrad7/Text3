// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-storage.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// js/firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyCnPcxbJaG3kwBjU7QRmTwOYM6amuAjx1o",
  authDomain: "teste-eff5e.firebaseapp.com",
  projectId: "teste-eff5e",
  storageBucket: "teste-eff5e.firebasestorage.app",
  messagingSenderId: "272404465161",
  appId: "1:272404465161:web:260b0242408081a17c9ad8"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);