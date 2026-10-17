// ==========================================================
// Connect Gym — interações
// ==========================================================

/* ---------- Menu mobile ---------- */
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  nav.classList.toggle('menu-open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('menu-open'));
});

/* ---------- Contador animado das estatísticas ---------- */
const statNumbers = document.querySelectorAll('.stat-num');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  if (reduceMotion) {
    el.textContent = target;
    return;
  }
  const duration = 1200;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      statNumbers.forEach(animateCount);
      statsObserver.disconnect();
    }
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

/* ---------- Revelação suave das seções ao rolar ---------- */
const revealTargets = document.querySelectorAll('.card, .plan, .testimonial, .about-list li');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => {
  if (!reduceMotion) {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  }
  revealObserver.observe(el);
});

/* ---------- Formulário de contato (demo local, sem backend) ---------- */
const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const nome = form.nome.value.trim();
  status.textContent = `Valeu, ${nome.split(' ')[0]}! Recebemos sua mensagem e vamos te chamar no WhatsApp em breve.`;
  form.reset();
});

/* ---------- Fundo animado: rede de nós conectados ---------- */
(function nodeBackground() {
  const canvas = document.getElementById('node-bg');
  const ctx = canvas.getContext('2d');
  let width, height, nodes;

  const NODE_COUNT_BASE = 60; // por 1000px de largura, ajustado abaixo
  const LINK_DIST = 130;
  const ACCENT = '#33C7A6';
  const ACCENT_2 = '#FF5A36';

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = document.querySelector('.hero').offsetHeight + 200;
    canvas.style.height = height + 'px';
    initNodes();
  }

  function initNodes() {
    const count = Math.floor((width / 1000) * NODE_COUNT_BASE);
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      accent: Math.random() < 0.12
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < LINK_DIST) {
          ctx.strokeStyle = `rgba(51, 199, 166, ${1 - dist / LINK_DIST})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.fillStyle = n.accent ? ACCENT_2 : ACCENT;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.accent ? 2.2 : 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    if (!reduceMotion) requestAnimationFrame(step);
  }

  window.addEventListener('resize', resize);
  resize();
  step(); // desenha ao menos um frame mesmo com reduced motion
})();
