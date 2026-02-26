// 🔥 YOUR FIREBASE CONFIG (CHECK THIS CAREFULLY)
const firebaseConfig = {
  apiKey: "PASTE_YOURS_HERE",
  authDomain: "PASTE_YOURS_HERE",
  projectId: "PASTE_YOURS_HERE",
  storageBucket: "PASTE_YOURS_HERE",
  messagingSenderId: "PASTE_YOURS_HERE",
  appId: "PASTE_YOURS_HERE"
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
