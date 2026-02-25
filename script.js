async function signup(email, password) {
  const res = await fetch("/.netlify/functions/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  alert(data.message || data.error);
}

async function login(email, password) {
  const res = await fetch("/.netlify/functions/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (res.status === 200) {
    window.location.href = "dashboard.html";
  } else {
    alert(data.error);
  }
}
