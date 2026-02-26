// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
  authDomain: "vaultx-43488.firebaseapp.com",
  projectId: "vaultx-43488",
  storageBucket: "vaultx-43488.appspot.com",
  messagingSenderId: "103145535155",
  appId: "1:103145535155:web:7afce57dac2c968c2122c6",
  measurementId: "G-4WSJNZSQJ8"
};

// Initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

auth.onAuthStateChanged(async function(user) {
  if (user) {
    document.getElementById("userEmail").innerText = "Email: " + user.email;

    const doc = await db.collection("users").doc(user.uid).get();

    if (doc.exists) {
      document.getElementById("balance").innerText = doc.data().balance;
    }

  } else {
    window.location.href = "index.html";
  }
});

function logout() {
  auth.signOut();
  window.location.href = "index.html";
}
