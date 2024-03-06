const firebase = require("firebase/app");
require("firebase/firestore");

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
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
module.exports = { db };