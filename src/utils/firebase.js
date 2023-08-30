import * as firebase from "firebase/app";
import "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDESbT__EdMZ4TrMS3IBMCa0U3-I1VdqOI",
  authDomain: "serviceshare-d9248.firebaseapp.com",
  databaseURL: "https://serviceshare-d9248-default-rtdb.firebaseio.com",
  projectId: "serviceshare-d9248",
  storageBucket: "serviceshare-d9248.appspot.com",
  messagingSenderId: "34361231146",
  appId: "1:34361231146:web:2e66cd76042c52770ec053",
  measurementId: "G-XL5W11Y04J"
};

export function initialize() {
  // Initialize Firebase
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
}

export function attachAuthListener(handler) {
  return firebase.auth().onAuthStateChanged(user => {
    handler(user);
  });
}

export async function createNewUser(email, password) {
  await firebase.auth().createUserWithEmailAndPassword(email, password);
}

export async function signIn(email, password) {
  await firebase.auth().signInWithEmailAndPassword(email, password);
}

export async function signOut() {
  await firebase.auth().signOut();
}
