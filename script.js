// 🔥 REPLACE THIS CONFIG WITH YOUR FIREBASE PROJECT
const firebaseConfig = {
apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
authDomain: "[vaultx-43488.firebaseapp.com](http://vaultx-43488.firebaseapp.com/)",
projectId: "vaultx-43488",
storageBucket: "vaultx-43488.firebasestorage.app",
messagingSenderId: "103145535155",
appId: "1:103145535155:web:7afce57dac2c968c2122c6",
measurementId: "G-4WSJNZSQJ8"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Stripe publishable key
const stripe = Stripe("PASTE_YOUR_STRIPE_PUBLISHABLE_KEY");

// DOM Elements
const loginSection = document.getElementById("loginSection");
const dashboardSection = document.getElementById("dashboardSection");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");
const cardBalance = document.getElementById("cardBalance");
const cardEmail = document.getElementById("cardEmail");
const depositAmount = document.getElementById("depositAmount");
const depositBtn = document.getElementById("depositBtn");

// Login
loginBtn.addEventListener("click", async () => {
  try {
    const userCred = await auth.signInWithEmailAndPassword(emailInput.value, passwordInput.value);
    const user = userCred.user;

    const userDoc = await db.collection("users").doc(user.uid).get();
    if (!userDoc.exists) {
      await db.collection("users").doc(user.uid).set({
        email: user.email,
        balance: 0
      });
    }

    showDashboard(user.uid);
  } catch (err) {
    alert(err.message);
  }
});

// Logout
logoutBtn.addEventListener("click", () => {
  auth.signOut();
  loginSection.style.display = "block";
  dashboardSection.style.display = "none";
});

// Show dashboard
async function showDashboard(uid) {
  loginSection.style.display = "none";
  dashboardSection.style.display = "block";

  const doc = await db.collection("users").doc(uid).get();
  const data = doc.data();

  cardBalance.innerText = `$${data.balance}`;
  cardEmail.innerText = data.email;
}

// Deposit with Stripe Checkout Simulation
depositBtn.addEventListener("click", async () => {
  const amount = parseFloat(depositAmount.value);
  if (!amount || amount <= 0) return alert("Enter valid amount");

  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  // 🔹 Simple Stripe Checkout redirect simulation
  // You can replace this with real Stripe Checkout later
  alert(`This would open Stripe Checkout for $${amount}`);

  // Update balance in Firestore
  await db.collection("users").doc(user.uid).update({
    balance: firebase.firestore.FieldValue.increment(amount)
  });

  const doc = await db.collection("users").doc(user.uid).get();
  cardBalance.innerText = `$${doc.data().balance}`;
  depositAmount.value = "";
});
