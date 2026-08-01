import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import { getFirestore } from "firebase/firestore";

import { getStorage } from "firebase/storage";

const firebaseConfig = {

  apiKey: "AIzaSyAUhxIwBdc5KNbiYDrImWMkUzFnW8uaiRM",

  authDomain: "mediqueue-7f218.firebaseapp.com",

  projectId: "mediqueue-7f218",

  storageBucket: "mediqueue-7f218.firebasestorage.app",

  messagingSenderId: "302366265142",

  appId: "1:302366265142:web:99c70463121efa3fae2d97"

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);