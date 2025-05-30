// js/firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnPcxbJaG3kwBjU7QRmTwOYM6amuAjx1o",
  authDomain: "teste-eff5e.firebaseapp.com",
  projectId: "teste-eff5e",
  storageBucket: "teste-eff5e.firebasestorage.app",
  messagingSenderId: "272404465161",
  appId: "1:272404465161:web:260b0242408081a17c9ad8"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };
