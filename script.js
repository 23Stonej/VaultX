// 🔥 YOUR FIREBASE CONFIG (CHECK THIS CAREFULLY)
const firebaseConfig = {
 apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
  authDomain: "vaultx-43488.firebaseapp.com",
  projectId: "vaultx-43488",
  storageBucket: "vaultx-43488.firebasestorage.app",
  messagingSenderId: "103145535155",
  appId: "1:103145535155:web:7afce57dac2c968c2122c6",
  measurementId: "G-4WSJNZSQJ8"
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

// =======================
// SIGN UP
// =======================
document.getElementById("signupBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {

    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // 🔥 CREATE USER DOCUMENT IN FIRESTORE
    await db.collection("users").doc(user.uid).set({
      email: user.email,
      balance: 0,
      frozen: false,
      admin: false,
      createdAt: new Date()
    });

    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }

});

// =======================
// LOGIN
// =======================
document.getElementById("loginBtn").addEventListener("click", async () => {

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    alert("Enter email and password");
    return;
  }

  try {

    await auth.signInWithEmailAndPassword(email, password);
    window.location.href = "dashboard.html";

  } catch (error) {
    alert(error.message);
  }

});
