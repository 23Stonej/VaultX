// 🔹 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
  authDomain: "vaultx-43488.firebaseapp.com",
  projectId: "vaultx-43488",
  storageBucket: "vaultx-43488.appspot.com",
  messagingSenderId: "103145535155",
  appId: "1:103145535155:web:7afce57dac2c968c2122c6",
  measurementId: "G-4WSJNZSQJ8"
};

// 🔹 Initialize Firebase
firebase.initializeApp(firebaseConfig);

// 🔹 Make auth and db global
var auth = firebase.auth();
var db = firebase.firestore();

// 🔹 Optional: Enable offline persistence
db.enablePersistence()
  .catch(function(err) {
    if (err.code === 'failed-precondition') {
      console.warn("Persistence failed: multiple tabs open?");
    } else if (err.code === 'unimplemented') {
      console.warn("Persistence not available in this browser.");
    }
  });
