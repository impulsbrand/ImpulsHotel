
import { initializeApp } from "firebase/app";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB7atrjqedK7IwELxXoK04lnTZ6U8aGy60",
    authDomain: "impulshotel.firebaseapp.com",
    projectId: "impulshotel",
    storageBucket: "impulshotel.firebasestorage.app",
    messagingSenderId: "1022032466406",
    appId: "1:1022032466406:web:654f81be5ec9b7dd898627",
    measurementId: "G-3PCZ8497CR"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

enableIndexedDbPersistence(db).catch(err => {
  if (err.code === 'failed-precondition') console.log("Múltiples pestañas abiertas");
  else if (err.code === 'unimplemented') console.log("Navegador no soporta IndexedDB");
});

export { db };
