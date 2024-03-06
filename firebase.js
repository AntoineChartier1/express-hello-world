// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBUqLnkWQ3tomu_2YfABQuIZCL-9IwAMn4",
  authDomain: "chats-laids.firebaseapp.com",
  projectId: "chats-laids",
  storageBucket: "chats-laids.appspot.com",
  messagingSenderId: "821771029642",
  appId: "1:821771029642:web:4568b48fdc6e68c8a8f173"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();
// export const auth = getAuth();