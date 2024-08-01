// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB0_N14Q0BY2T9432N0QsOMg11wPVMwBZk",
  authDomain: "inventory-management-4970e.firebaseapp.com",
  projectId: "inventory-management-4970e",
  storageBucket: "inventory-management-4970e.appspot.com",
  messagingSenderId: "158689631203",
  appId: "1:158689631203:web:6f8b5fefdb395d3da9ded6",
  measurementId: "G-1B5X8T79SZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export{firestore}