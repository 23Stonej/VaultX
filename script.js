
async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Create user document in Firestore
    await db.collection("users").doc(user.uid).set({
      email: email,
      balance: 0,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });

    alert("Signup successful!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await auth.signInWithEmailAndPassword(email, password);
    alert("Login successful!");
    window.location.href = "dashboard.html";
  } catch (err) {
    alert(err.message);
  }
}
