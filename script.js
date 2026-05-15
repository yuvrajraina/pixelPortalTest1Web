const header = document.querySelector(".site-header");
const progress = document.querySelector(".page-progress");
const cursor = document.querySelector(".cursor");
const cursorShader = document.querySelector(".cursor-shader");
const cursorLabel = document.querySelector(".cursor-label");
const canvas = document.querySelector("#field");
const ctx = canvas.getContext("2d");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

let width = 0;
let height = 0;
let particles = [];
let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let cursorPoint = { x: pointer.x, y: pointer.y };
let shaderPoint = { x: pointer.x, y: pointer.y };

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = Math.floor(width * ratio);
  canvas.height = Math.floor(height * ratio);
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  buildParticles();
  updateParallax();
  updateHeadingMotion();
}

function buildParticles() {
  const count = Math.min(110, Math.floor((width * height) / 14000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.28,
    vy: (Math.random() - 0.5) * 0.28,
    size: 0.9 + Math.random() * 1.8,
    hue: Math.random() > 0.76 ? "rgba(185,255,56," : "rgba(245,245,239,"
  }));
}

function drawField() {
  if (reduceMotion) return;
  ctx.clearRect(0, 0, width, height);

  particles.forEach((particle, index) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 160) {
      particle.x -= dx * 0.0025;
      particle.y -= dy * 0.0025;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    ctx.beginPath();
    ctx.fillStyle = `${particle.hue}0.48)`;
    ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    ctx.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const link = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (link < 112) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(185,255,56,${(1 - link / 112) * 0.13})`;
        ctx.lineWidth = 1;
        ctx.moveTo(particle.x, particle.y);
        ctx.lineTo(other.x, other.y);
        ctx.stroke();
      }
    }
  });

  requestAnimationFrame(drawField);
}

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrollTop / max : 0})`;
  header.classList.toggle("is-scrolled", scrollTop > 24);
  updateParallax();
  updateHeadingMotion();
}

function animateCursor() {
  cursorPoint.x += (pointer.x - cursorPoint.x) * 0.2;
  cursorPoint.y += (pointer.y - cursorPoint.y) * 0.2;
  shaderPoint.x += (pointer.x - shaderPoint.x) * 0.13;
  shaderPoint.y += (pointer.y - shaderPoint.y) * 0.13;

  const dx = pointer.x - shaderPoint.x;
  const dy = pointer.y - shaderPoint.y;
  const drag = Math.min(Math.hypot(dx, dy), 140);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);
  const stretch = 1 + drag / 230;
  const squash = Math.max(0.72, 1 - drag / 620);

  cursor.style.transform = `translate3d(${cursorPoint.x}px, ${cursorPoint.y}px, 0) translate(-50%, -50%)`;
  cursorShader.style.transform = `translate3d(${shaderPoint.x}px, ${shaderPoint.y}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${stretch}, ${squash})`;
  cursorLabel.style.transform = `translate3d(${cursorPoint.x}px, ${cursorPoint.y}px, 0) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}

function setupReveals() {
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -80px 0px" }
  );

  document.querySelectorAll("[data-reveal]").forEach(element => observer.observe(element));
}

function setupCounts() {
  const counters = document.querySelectorAll("[data-count]");
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const element = entry.target;
        const target = Number(element.dataset.count);
        const start = performance.now();
        const duration = 1200;

        function tick(now) {
          const progressValue = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progressValue, 3);
          element.textContent = Math.round(target * eased);
          if (progressValue < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
        observer.unobserve(element);
      });
    },
    { threshold: 0.4 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function setupMagnetics() {
  document.querySelectorAll(".magnetic").forEach(element => {
    element.addEventListener("mouseenter", () => {
      cursor.classList.add("is-active");
      cursorShader.classList.add("is-active");
    });
    element.addEventListener("mouseleave", () => {
      cursor.classList.remove("is-active");
      cursorShader.classList.remove("is-active");
      element.style.transform = "";
    });
    element.addEventListener("mousemove", event => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
  });
}

function setupTilts() {
  document.querySelectorAll("[data-tilt]").forEach(card => {
    card.addEventListener("mousemove", event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1200px) rotateX(${y * -3}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}

function setupCursorLabels() {
  document.querySelectorAll("[data-cursor-label]").forEach(element => {
    element.addEventListener("mouseenter", () => {
      cursorLabel.textContent = element.dataset.cursorLabel || "";
      cursorLabel.classList.add("is-visible");
      cursorShader.classList.add("is-active");
    });
    element.addEventListener("mouseleave", () => {
      cursorLabel.classList.remove("is-visible");
      cursorShader.classList.remove("is-active");
    });
  });
}

function setupDragScroll() {
  document.querySelectorAll("[data-drag-scroll]").forEach(track => {
    let isDown = false;
    let startX = 0;
    let startScroll = 0;

    track.addEventListener("pointerdown", event => {
      isDown = true;
      startX = event.clientX;
      startScroll = track.scrollLeft;
      track.classList.add("is-dragging");
      track.setPointerCapture(event.pointerId);
    });

    track.addEventListener("pointermove", event => {
      if (!isDown) return;
      track.scrollLeft = startScroll - (event.clientX - startX);
    });

    function release(event) {
      if (!isDown) return;
      isDown = false;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture(event.pointerId)) {
        track.releasePointerCapture(event.pointerId);
      }
    }

    track.addEventListener("pointerup", release);
    track.addEventListener("pointercancel", release);
  });
}

function setupKineticHeadings() {
  const headings = document.querySelectorAll("[data-kinetic-heading]");

  headings.forEach(heading => {
    const ghost = Array.from(heading.children).find(child => child.tagName === "EM");
    const ghostClone = ghost ? ghost.cloneNode(true) : null;
    const directLines = Array.from(heading.children)
      .filter(child => child.tagName === "SPAN")
      .map(child => child.textContent.trim())
      .filter(Boolean);
    const fallbackLines = heading.textContent.trim().split(/\s+/).filter(Boolean);
    const lines = directLines.length ? directLines : fallbackLines;
    const label = lines.join(" ");

    heading.textContent = "";
    heading.setAttribute("aria-label", label);

    lines.forEach((line, lineIndex) => {
      const lineElement = document.createElement("span");
      lineElement.className = "kinetic-line";
      lineElement.setAttribute("aria-hidden", "true");
      lineElement.style.setProperty("--line-index", lineIndex);

      Array.from(line).forEach((char, charIndex) => {
        const charElement = document.createElement("span");
        charElement.className = "kinetic-char";
        charElement.style.setProperty("--char-index", charIndex);
        charElement.textContent = char === " " ? "\u00a0" : char;
        lineElement.appendChild(charElement);
      });

      heading.appendChild(lineElement);
    });

    if (ghostClone) heading.appendChild(ghostClone);
    heading.classList.add("is-kinetic-ready");
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-kinetic-visible");
        }
      });
    },
    { threshold: 0.22, rootMargin: "0px 0px -8% 0px" }
  );

  headings.forEach(heading => observer.observe(heading));
  updateHeadingMotion();
}

function updateHeadingMotion() {
  if (reduceMotion) return;
  document.querySelectorAll(".is-kinetic-ready").forEach(heading => {
    const rect = heading.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const normalized = Math.max(-1, Math.min(1, (viewportCenter - elementCenter) / window.innerHeight));
    const drift = normalized * 54;
    heading.style.setProperty("--heading-drift", `${drift.toFixed(2)}px`);
  });
}

function updateParallax() {
  if (reduceMotion) return;
  document.querySelectorAll("[data-parallax]").forEach(element => {
    const factor = Number(element.dataset.parallax || 0);
    const rect = element.getBoundingClientRect();
    const viewportCenter = window.innerHeight / 2;
    const elementCenter = rect.top + rect.height / 2;
    const y = (viewportCenter - elementCenter) * factor;
    element.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
  });
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("pointermove", event => {
  pointer = { x: event.clientX, y: event.clientY };
  document.body.classList.add("has-pointer");
});
document.documentElement.addEventListener("pointerleave", () => {
  document.body.classList.remove("has-pointer");
});

setupKineticHeadings();
resizeCanvas();
onScroll();
setupReveals();
setupCounts();
setupDragScroll();

if (!reduceMotion) {
  document.body.classList.add("has-custom-cursor");
  drawField();
  animateCursor();
  setupMagnetics();
  setupCursorLabels();
  setupTilts();
}
