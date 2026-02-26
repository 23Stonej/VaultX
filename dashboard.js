const firebaseConfig = {
  apiKey: "AIzaSyD03N3_jRsw0l4a56WH6F75Zj0_zHipkIo",
  authDomain: "vaultx-43488.firebaseapp.com",
  projectId: "vaultx-43488"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();
const db = firebase.firestore();

let currentUser;

auth.onAuthStateChanged(user => {
  if (!user) return window.location.href = "index.html";

  currentUser = user;
  document.getElementById("userEmail").innerText = user.email;

  listenForBalance();
  listenForTransactions();
});

// 🔴 REALTIME BALANCE
function listenForBalance() {
  db.collection("users").doc(currentUser.uid)
    .onSnapshot(doc => {
      if (doc.exists) {
        document.getElementById("balance").innerText = doc.data().balance;
      }
    });
}

// 🔴 REALTIME TRANSACTIONS
function listenForTransactions() {
  db.collection("users")
    .doc(currentUser.uid)
    .collection("transactions")
    .orderBy("date", "desc")
    .onSnapshot(snapshot => {

      const list = document.getElementById("transactions");
      list.innerHTML = "";

      snapshot.forEach(doc => {
        const li = document.createElement("li");
        const data = doc.data();
        li.innerText = `${data.type} - $${data.amount}`;
        list.appendChild(li);
      });
    });
}

// 🔵 Deposit
document.getElementById("depositBtn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  if (amount <= 0) return alert("Invalid amount");

  const userRef = db.collection("users").doc(currentUser.uid);

  await db.runTransaction(async t => {
    const doc = await t.get(userRef);
    const newBalance = doc.data().balance + amount;

    t.update(userRef, { balance: newBalance });
    t.set(userRef.collection("transactions").doc(), {
      type: "Deposit",
      amount,
      date: new Date()
    });
  });
});

// 🔴 Withdraw
document.getElementById("withdrawBtn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  if (amount <= 0) return alert("Invalid amount");

  const userRef = db.collection("users").doc(currentUser.uid);

  await db.runTransaction(async t => {
    const doc = await t.get(userRef);
    const balance = doc.data().balance;

    if (balance < amount) return alert("Insufficient funds");

    t.update(userRef, { balance: balance - amount });
    t.set(userRef.collection("transactions").doc(), {
      type: "Withdraw",
      amount,
      date: new Date()
    });
  });
});

// 🟢 Transfer Between Users
document.getElementById("transferBtn").addEventListener("click", async () => {
  const amount = parseFloat(document.getElementById("amount").value);
  const email = document.getElementById("transferEmail").value;

  if (!email || amount <= 0) return alert("Invalid transfer");

  const senderRef = db.collection("users").doc(currentUser.uid);

  const receiverQuery = await db.collection("users")
    .where("email", "==", email)
    .get();

  if (receiverQuery.empty) return alert("User not found");

  const receiverRef = receiverQuery.docs[0].ref;

  await db.runTransaction(async t => {
    const senderDoc = await t.get(senderRef);
    const receiverDoc = await t.get(receiverRef);

    if (senderDoc.data().balance < amount)
      return alert("Insufficient funds");

    t.update(senderRef, {
      balance: senderDoc.data().balance - amount
    });

    t.update(receiverRef, {
      balance: receiverDoc.data().balance + amount
    });

    t.set(senderRef.collection("transactions").doc(), {
      type: "Transfer Sent",
      amount,
      date: new Date()
    });

    t.set(receiverRef.collection("transactions").doc(), {
      type: "Transfer Received",
      amount,
      date: new Date()
    });
  });
});

function logout() {
  auth.signOut();
}
