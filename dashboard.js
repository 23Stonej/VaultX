// Check auth state
auth.onAuthStateChanged(async user => {
  if (user) {
    document.getElementById("email").innerText = `Email: ${user.email}`;

    const doc = await db.collection("users").doc(user.uid).get();
    if (doc.exists) {
      document.getElementById("balance").innerText = doc.data().balance;
    } else {
      document.getElementById("balance").innerText = 0;
    }
  } else {
    window.location.href = "index.html";
  }
});

// Logout
function logout() {
  auth.signOut();
  window.location.href = "index.html";
}
