// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore'; // Corrected the function name

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCH57qXzV4KlbU92m3FkcN46PjEiImQC7I",
  authDomain: "inventory-management-fe72d.firebaseapp.com",
  projectId: "inventory-management-fe72d",
  storageBucket: "inventory-management-fe72d.appspot.com",
  messagingSenderId: "62042976289",
  appId: "1:62042976289:web:29462681dc179f53bb7360",
  measurementId: "G-5GM4D7MJR3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app); // Corrected function name
export { firestore };
