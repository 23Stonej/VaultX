async function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const userCredential = await window.auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    await window.db.collection("users").doc(user.uid).set({
      email: email,
      balance: 0
    });

    alert("Signup successful!");
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}

async function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    await window.auth.signInWithEmailAndPassword(email, password);
    window.location.href = "dashboard.html";
  } catch (error) {
    alert(error.message);
  }
}
