/* ================= STARFIELD BACKGROUND ================= */

const canvas = document.getElementById("starfield");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let stars = [];

for (let i = 0; i < 200; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2,
        speed: Math.random() * 0.5 + 0.2
    });
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
        ctx.fillStyle = "#00E5FF";
        ctx.fillRect(star.x, star.y, star.size, star.size);

        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;
    });

    requestAnimationFrame(animateStars);
}

animateStars();

/* ================= SCROLL ANIMATIONS ================= */

document.addEventListener("scroll", () => {
    const pillars = document.querySelectorAll(".pillar");
    pillars.forEach((p, i) => {
        const rect = p.getBoundingClientRect();
        if (rect.top < window.innerHeight - 100) {
            p.style.opacity = "1";
            p.style.transform = "translateY(0)";
        }
    });
});
