const firebaseConfig = {
  apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
  authDomain: "vaultx-43488.firebaseapp.com",
  projectId: "vaultx-43488",
  storageBucket: "vaultx-43488.appspot.com",
  messagingSenderId: "103145535155",
  appId: "1:103145535155:web:7afce57dac2c968c2122c6"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser;

// Listen for auth
auth.onAuthStateChanged(async function(user) {
  if (!user) {
    window.location.href = "index.html";
    return;
  }

  currentUser = user;
  document.getElementById("userEmail").innerText = user.email;

  loadBalance();
  loadTransactions();
});

// Load balance
async function loadBalance() {
  const doc = await db.collection("users").doc(currentUser.uid).get();
  if (doc.exists) {
    document.getElementById("balance").innerText = doc.data().balance;
  }
}

// Deposit
document.getElementById("depositBtn").addEventListener("click", async function() {
  const amount = parseFloat(document.getElementById("amount").value);
  if (amount <= 0) return alert("Invalid amount");

  const userRef = db.collection("users").doc(currentUser.uid);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    const newBalance = doc.data().balance + amount;

    transaction.update(userRef, { balance: newBalance });

    transaction.set(
      userRef.collection("transactions").doc(),
      {
        type: "Deposit",
        amount: amount,
        date: new Date()
      }
    );
  });

  loadBalance();
  loadTransactions();
});

// Withdraw
document.getElementById("withdrawBtn").addEventListener("click", async function() {
  const amount = parseFloat(document.getElementById("amount").value);
  if (amount <= 0) return alert("Invalid amount");

  const userRef = db.collection("users").doc(currentUser.uid);

  await db.runTransaction(async (transaction) => {
    const doc = await transaction.get(userRef);
    const currentBalance = doc.data().balance;

    if (currentBalance < amount) {
      alert("Insufficient funds");
      return;
    }

    const newBalance = currentBalance - amount;

    transaction.update(userRef, { balance: newBalance });

    transaction.set(
      userRef.collection("transactions").doc(),
      {
        type: "Withdraw",
        amount: amount,
        date: new Date()
      }
    );
  });

  loadBalance();
  loadTransactions();
});

// Load transactions
async function loadTransactions() {
  const list = document.getElementById("transactions");
  list.innerHTML = "";

  const snapshot = await db
    .collection("users")
    .doc(currentUser.uid)
    .collection("transactions")
    .orderBy("date", "desc")
    .get();

  snapshot.forEach(doc => {
    const li = document.createElement("li");
    li.innerText = `${doc.data().type} - $${doc.data().amount}`;
    list.appendChild(li);
  });
}

function logout() {
  auth.signOut();
  window.location.href = "index.html";
}
