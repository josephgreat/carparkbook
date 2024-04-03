// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-analytics.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB-leDBqXEKi9SK9Ewstbilssdh76zpn0U",
  authDomain: "car-pack-book.firebaseapp.com",
  projectId: "car-pack-book",
  storageBucket: "car-pack-book.appspot.com",
  messagingSenderId: "165066461044",
  appId: "1:165066461044:web:2e6176486699bd1c4e6621",
  measurementId: "G-W9HFMW6W9J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export default app