window.auth.onAuthStateChanged(async function(user) {
  if (user) {
    document.getElementById("userEmail").innerText = "Email: " + user.email;

    const doc = await window.db.collection("users").doc(user.uid).get();

    if (doc.exists) {
      document.getElementById("balance").innerText = doc.data().balance;
    } else {
      document.getElementById("balance").innerText = "0";
    }

  } else {
    window.location.href = "index.html";
  }
});

function logout() {
  window.auth.signOut();
  window.location.href = "index.html";
}
