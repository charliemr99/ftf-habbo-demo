import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/firestore";
import "firebase/functions";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyCdZWck4I0l8QKCzKc42WJ1cHL6k7vDvjg",
  authDomain: "ftf-habbo-demo.firebaseapp.com",
  projectId: "ftf-habbo-demo",
  storageBucket: "ftf-habbo-demo.appspot.com",
  messagingSenderId: "923482454686",
  appId: "1:923482454686:web:e40c1f7aace1366d2fd98f",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.database();
const firedb = firebase.firestore();
const auth = firebase.auth();
const functions = firebase.functions();
const storage = firebase.storage();

export { db, firedb, auth, firebase, functions, storage };
