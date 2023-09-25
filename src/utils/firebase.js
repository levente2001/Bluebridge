import * as firebase from "firebase/app";
import "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyAAtaJ0ifuqQOKQ3Ay0ISkDiQl5b7tJfQQ",
  authDomain: "servicesharenew.firebaseapp.com",
  databaseURL: "https://servicesharenew-default-rtdb.firebaseio.com",
  projectId: "servicesharenew",
  storageBucket: "servicesharenew.appspot.com",
  messagingSenderId: "718128398318",
  appId: "1:718128398318:web:512e8bb1264a390626d8ff",
  measurementId: "G-Q7F9MJX7V4"
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
