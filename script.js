// 🔥 Replace with your Firebase config
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
const stripe = Stripe("pk_test_51T3k3g7fijcsyllCGQ0oZpTjraFmKqGSj9dtUJ3tCmi7cV2tRV9TCPreCppKTBYlG6WzXwW2x4H4mi070vXPX7lo00Pv0EV27H");

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

// Deposit with Stripe Checkout (client-only test mode)
depositBtn.addEventListener("click", async () => {
  const amount = parseFloat(depositAmount.value);
  if (!amount || amount <= 0) return alert("Enter a valid amount");

  const user = auth.currentUser;
  if (!user) return alert("Not logged in");

  // Create a client-only Checkout session (Stripe test)
  // ⚡ Stripe requires prices or products; for demo we simulate $ amount
  const sessionData = {
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: 'VaultX Deposit' },
        unit_amount: amount * 100
      },
      quantity: 1
    }],
    mode: 'payment',
    success_url: window.location.href + '?success=true&amount=' + amount,
    cancel_url: window.location.href + '?canceled=true'
  };

  try {
    // Open Stripe Checkout directly (client-only)
    const { error } = await stripe.redirectToCheckout(sessionData);
    if (error) {
      alert(error.message);
    }
  } catch (err) {
    alert(err.message);
  }
});

// Listen for success URL and increment balance
window.addEventListener("load", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const success = urlParams.get('success');
  const amount = parseFloat(urlParams.get('amount'));

  if (success && amount > 0 && auth.currentUser) {
    // Increment Firestore balance
    const userRef = db.collection("users").doc(auth.currentUser.uid);
    await userRef.update({
      balance: firebase.firestore.FieldValue.increment(amount)
    });

    const doc = await userRef.get();
    cardBalance.innerText = `$${doc.data().balance}`;

    // Clean URL to avoid duplicate increments
    window.history.replaceState({}, document.title, window.location.pathname);
    alert(`Deposit of $${amount} successful!`);
  }
});
