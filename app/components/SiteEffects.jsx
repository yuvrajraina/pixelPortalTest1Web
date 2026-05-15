"use client";

import { useEffect } from "react";

export default function SiteEffects() {
  useEffect(() => {
    const header = document.querySelector(".site-header");
    const progress = document.querySelector(".page-progress");
    const cursor = document.querySelector(".cursor");
    const cursorShader = document.querySelector(".cursor-shader");
    const cursorLabel = document.querySelector(".cursor-label");
    const canvas = document.querySelector("#field");
    const trailCanvas = document.querySelector("#pixel-trail");
    const ctx = canvas?.getContext("2d");
    const trailCtx = trailCanvas?.getContext("2d");

    if (!header || !progress || !cursor || !cursorShader || !cursorLabel || !canvas || !trailCanvas || !ctx || !trailCtx) {
      return undefined;
    }

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups = [];
    let width = 0;
    let height = 0;
    let particles = [];
    let trailPixels = [];
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let previousPointer = { ...pointer };
    let cursorPoint = { x: pointer.x, y: pointer.y };
    let shaderPoint = { x: pointer.x, y: pointer.y };
    let fieldFrame = 0;
    let cursorFrame = 0;
    let trailFrame = 0;

    const addListener = (target, event, handler, options) => {
      target.addEventListener(event, handler, options);
      cleanups.push(() => target.removeEventListener(event, handler, options));
    };

    function buildParticles() {
      const count = Math.min(110, Math.floor((width * height) / 14000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: 0.9 + Math.random() * 1.8,
        hue: Math.random() > 0.76 ? "rgba(185,255,56," : "rgba(245,245,239,",
      }));
    }

    function updateParallax() {
      if (reduceMotion) return;
      document.querySelectorAll("[data-parallax]").forEach((element) => {
        const factor = Number(element.dataset.parallax || 0);
        const rect = element.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const y = (viewportCenter - elementCenter) * factor;
        element.style.setProperty("--parallax-y", `${y.toFixed(2)}px`);
      });
    }

    function updateWallSpread() {
      document.querySelectorAll(".studio-wall").forEach((wall) => {
        const cards = Array.from(wall.querySelectorAll(".wall-card"));

        const setWallCopyState = (progress) => {
          const eased = progress * progress * (3 - 2 * progress);
          const stage = (start, end) => {
            const value = Math.max(0, Math.min(1, (progress - start) / (end - start)));
            return value * value * (3 - 2 * value);
          };

          wall.style.setProperty("--wall-copy-opacity", eased.toFixed(3));
          wall.style.setProperty("--wall-copy-y", `${((1 - eased) * 38).toFixed(2)}px`);
          wall.style.setProperty("--wall-copy-blur", `${((1 - eased) * 12).toFixed(2)}px`);
          wall.style.setProperty("--wall-copy-scale", (0.96 + eased * 0.04).toFixed(3));
          const label = stage(0, 0.38);
          const heading = stage(0.12, 0.68);
          const cta = stage(0.44, 1);

          wall.style.setProperty("--wall-copy-label", label.toFixed(3));
          wall.style.setProperty("--wall-copy-label-y", `${((1 - label) * 20).toFixed(2)}px`);
          wall.style.setProperty("--wall-copy-heading", heading.toFixed(3));
          wall.style.setProperty("--wall-copy-heading-y", `${((1 - heading) * 24).toFixed(2)}px`);
          wall.style.setProperty("--wall-copy-cta", cta.toFixed(3));
          wall.style.setProperty("--wall-copy-cta-y", `${((1 - cta) * 18).toFixed(2)}px`);
        };

        cards.forEach((card) => {
          card.style.setProperty("--wall-card-offset-x", "0px");
          card.style.setProperty("--wall-card-offset-y", "0px");
        });

        if (reduceMotion) {
          setWallCopyState(1);
          return;
        }

        const wallRect = wall.getBoundingClientRect();
        const start = window.innerHeight * 0.92;
        const end = window.innerHeight * 0.18;
        const rawProgress = (start - wallRect.top) / (start - end);
        const progress = Math.max(0, Math.min(1, rawProgress));
        const delayedProgress = Math.max(0, Math.min(1, (progress - 0.24) / 0.76));
        const eased = delayedProgress * delayedProgress * (3 - 2 * delayedProgress);
        const textProgress = Math.max(0, Math.min(1, (delayedProgress - 0.06) / 0.78));
        const collapse = 1 - eased;

        setWallCopyState(textProgress);

        if (collapse <= 0.001) return;

        const wallCenterX = wallRect.left + wallRect.width / 2;
        const wallCenterY = wallRect.top + wallRect.height / 2;

        cards.forEach((card) => {
          const cardRect = card.getBoundingClientRect();
          const cardCenterX = cardRect.left + cardRect.width / 2;
          const cardCenterY = cardRect.top + cardRect.height / 2;
          const offsetX = (wallCenterX - cardCenterX) * collapse;
          const offsetY = (wallCenterY - cardCenterY) * collapse;

          card.style.setProperty("--wall-card-offset-x", `${offsetX.toFixed(2)}px`);
          card.style.setProperty("--wall-card-offset-y", `${offsetY.toFixed(2)}px`);
        });
      });
    }

    function updateHeadingMotion() {
      if (reduceMotion) return;
      document.querySelectorAll(".is-kinetic-ready").forEach((heading) => {
        const rect = heading.getBoundingClientRect();
        const viewportCenter = window.innerHeight / 2;
        const elementCenter = rect.top + rect.height / 2;
        const normalized = Math.max(-1, Math.min(1, (viewportCenter - elementCenter) / window.innerHeight));
        const drift = normalized * 54;
        heading.style.setProperty("--heading-drift", `${drift.toFixed(2)}px`);
      });
    }

    function resizeCanvas() {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      trailCanvas.width = Math.floor(width * ratio);
      trailCanvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      trailCanvas.style.width = `${width}px`;
      trailCanvas.style.height = `${height}px`;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      trailCtx.setTransform(ratio, 0, 0, ratio, 0, 0);
      buildParticles();
      updateParallax();
      updateWallSpread();
      updateHeadingMotion();
    }

    function addTrailPixels(event) {
      if (reduceMotion) return;

      const velocityX = event.clientX - previousPointer.x;
      const velocityY = event.clientY - previousPointer.y;
      const speed = Math.min(Math.hypot(velocityX, velocityY), 56);
      const count = Math.max(4, Math.min(11, Math.round(speed / 6)));

      for (let index = 0; index < count; index += 1) {
        const ageOffset = index / count;
        const size = 8 + Math.random() * 16;
        const spread = 14 + speed * 0.48;

        trailPixels.push({
          x: event.clientX - velocityX * ageOffset + (Math.random() - 0.5) * spread,
          y: event.clientY - velocityY * ageOffset + (Math.random() - 0.5) * spread,
          vx: -velocityX * (0.018 + Math.random() * 0.018) + (Math.random() - 0.5) * 1.8,
          vy: -velocityY * (0.018 + Math.random() * 0.018) + (Math.random() - 0.5) * 1.8,
          size,
          createdAt: performance.now(),
          duration: 1000,
          shift: 2 + Math.random() * 6,
        });
      }

      if (trailPixels.length > 140) {
        trailPixels = trailPixels.slice(-140);
      }
    }

    function drawPixelTrail() {
      if (reduceMotion) return;

      const now = performance.now();
      trailCtx.clearRect(0, 0, width, height);
      trailCtx.globalCompositeOperation = "lighter";

      trailPixels = trailPixels.filter((pixel) => now - pixel.createdAt < pixel.duration);
      trailPixels.forEach((pixel) => {
        const elapsed = now - pixel.createdAt;
        const alpha = Math.max(0, 1 - elapsed / pixel.duration);

        pixel.x += pixel.vx;
        pixel.y += pixel.vy;

        const snapX = Math.round(pixel.x);
        const snapY = Math.round(pixel.y);
        const size = Math.max(1, Math.round(pixel.size * (0.72 + alpha * 0.5)));

        trailCtx.fillStyle = `rgba(185,255,56,${alpha * 0.96})`;
        trailCtx.fillRect(snapX - pixel.shift, snapY, size, size);
        trailCtx.fillStyle = `rgba(130,255,245,${alpha})`;
        trailCtx.fillRect(snapX + pixel.shift, snapY + 1, size, size);
        trailCtx.fillStyle = `rgba(245,245,239,${alpha * 0.9})`;
        trailCtx.fillRect(snapX, snapY - pixel.shift, Math.max(1, size - 1), Math.max(1, size - 1));
      });

      trailCtx.globalCompositeOperation = "source-over";
      trailFrame = requestAnimationFrame(drawPixelTrail);
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

      fieldFrame = requestAnimationFrame(drawField);
    }

    function onScroll() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.transform = `scaleX(${max > 0 ? scrollTop / max : 0})`;
      header.classList.toggle("is-scrolled", scrollTop > 24);
      updateParallax();
      updateWallSpread();
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
      cursorFrame = requestAnimationFrame(animateCursor);
    }

    function setupReveals() {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.16, rootMargin: "0px 0px -80px 0px" },
      );

      document.querySelectorAll("[data-reveal]").forEach((element) => observer.observe(element));
      cleanups.push(() => observer.disconnect());
    }

    function setupMagnetics() {
      document.querySelectorAll(".magnetic").forEach((element) => {
        const enter = () => {
          cursor.classList.add("is-active");
          cursorShader.classList.add("is-active");
        };
        const leave = () => {
          cursor.classList.remove("is-active");
          cursorShader.classList.remove("is-active");
          element.style.transform = "";
        };
        const move = (event) => {
          const rect = element.getBoundingClientRect();
          const x = event.clientX - rect.left - rect.width / 2;
          const y = event.clientY - rect.top - rect.height / 2;
          element.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        };

        addListener(element, "mouseenter", enter);
        addListener(element, "mouseleave", leave);
        addListener(element, "mousemove", move);
      });
    }

    function setupCursorLabels() {
      document.querySelectorAll("[data-cursor-label]").forEach((element) => {
        const enter = () => {
          cursorLabel.textContent = element.dataset.cursorLabel || "";
          cursorLabel.classList.add("is-visible");
          cursorShader.classList.add("is-active");
        };
        const leave = () => {
          cursorLabel.classList.remove("is-visible");
          cursorShader.classList.remove("is-active");
        };

        addListener(element, "mouseenter", enter);
        addListener(element, "mouseleave", leave);
      });
    }

    function setupDragScroll() {
      document.querySelectorAll("[data-drag-scroll]").forEach((track) => {
        let isDown = false;
        let startX = 0;
        let startScroll = 0;

        const down = (event) => {
          isDown = true;
          startX = event.clientX;
          startScroll = track.scrollLeft;
          track.classList.add("is-dragging");
          track.setPointerCapture(event.pointerId);
        };
        const move = (event) => {
          if (!isDown) return;
          track.scrollLeft = startScroll - (event.clientX - startX);
        };
        const release = (event) => {
          if (!isDown) return;
          isDown = false;
          track.classList.remove("is-dragging");
          if (track.hasPointerCapture(event.pointerId)) {
            track.releasePointerCapture(event.pointerId);
          }
        };

        addListener(track, "pointerdown", down);
        addListener(track, "pointermove", move);
        addListener(track, "pointerup", release);
        addListener(track, "pointercancel", release);
      });
    }

    function setupCarouselControls() {
      document.querySelectorAll("[data-carousel-control]").forEach((button) => {
        const click = () => {
          const track = document.querySelector(button.dataset.carouselTarget || "");
          if (!track) return;

          const firstCard = track.querySelector(".story-card");
          const styles = window.getComputedStyle(track);
          const gap = Number.parseFloat(styles.columnGap || styles.gap || "0") || 0;
          const distance = firstCard ? firstCard.getBoundingClientRect().width + gap : track.clientWidth * 0.8;
          const direction = Number(button.dataset.carouselDirection || 1);

          track.scrollBy({
            left: distance * direction,
            behavior: reduceMotion ? "auto" : "smooth",
          });
        };

        addListener(button, "click", click);
      });
    }

    function setupKineticHeadings() {
      const headings = document.querySelectorAll("[data-kinetic-heading]");

      headings.forEach((heading) => {
        const ghost = Array.from(heading.children).find((child) => child.tagName === "EM");
        const ghostClone = ghost ? ghost.cloneNode(true) : null;
        const directLines = Array.from(heading.children)
          .filter((child) => child.tagName === "SPAN")
          .map((child) => child.textContent.trim())
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
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-kinetic-visible");
            }
          });
        },
        { threshold: 0.22, rootMargin: "0px 0px -8% 0px" },
      );

      headings.forEach((heading) => observer.observe(heading));
      cleanups.push(() => observer.disconnect());
      updateHeadingMotion();
    }

    const pointerMove = (event) => {
      previousPointer = pointer;
      pointer = { x: event.clientX, y: event.clientY };
      addTrailPixels(event);
      document.body.classList.add("has-pointer");
    };
    const pointerLeave = () => {
      document.body.classList.remove("has-pointer");
    };

    addListener(window, "resize", resizeCanvas);
    addListener(window, "scroll", onScroll, { passive: true });
    addListener(window, "pointermove", pointerMove);
    addListener(document.documentElement, "pointerleave", pointerLeave);

    setupKineticHeadings();
    resizeCanvas();
    onScroll();
    setupReveals();
    setupDragScroll();
    setupCarouselControls();

    if (!reduceMotion) {
      document.body.classList.add("has-custom-cursor");
      drawField();
      animateCursor();
      drawPixelTrail();
      setupMagnetics();
      setupCursorLabels();
    }

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      cancelAnimationFrame(fieldFrame);
      cancelAnimationFrame(cursorFrame);
      cancelAnimationFrame(trailFrame);
      document.body.classList.remove("has-custom-cursor", "has-pointer");
    };
  }, []);

  return (
    <>
      <div className="page-progress" aria-hidden="true" />
      <div className="cursor-shader" aria-hidden="true" />
      <div className="cursor" aria-hidden="true" />
      <div className="cursor-label" aria-hidden="true">
        Drag
      </div>
      <canvas className="field" id="field" aria-hidden="true" />
      <canvas className="pixel-trail" id="pixel-trail" aria-hidden="true" />
    </>
  );
}
