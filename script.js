function enterDashboard() {
  window.location.href = "dashboard.html";
}

function goHome() {
  window.location.href = "index.html";
}

document.addEventListener("mousemove", function(e) {
  const card = document.querySelector(".card");
  if (!card) return;

  const x = (window.innerWidth / 2 - e.pageX) / 25;
  const y = (window.innerHeight / 2 - e.pageY) / 25;

  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});
