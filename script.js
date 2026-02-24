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
const canvas = document.getElementById("stars");
if (canvas) {
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let stars = [];

  for (let i = 0; i < 120; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5
    });
  }

  function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";

    stars.forEach(star => {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fill();

      star.y += star.speed;
      if (star.y > canvas.height) star.y = 0;
    });

    requestAnimationFrame(animateStars);
  }

  animateStars();
}
