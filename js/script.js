(function () {
  "use strict";

  /* ---------- Theme ---------- */
  var root = document.documentElement;
  var stored = localStorage.getItem("hb-theme");
  var prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  var initial = stored || (prefersLight ? "light" : "dark");
  root.setAttribute("data-theme", initial);

  function toggleTheme() {
    var current = root.getAttribute("data-theme");
    var next = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem("hb-theme", next);
  }

  document.querySelectorAll("[data-theme-toggle]").forEach(function (btn) {
    btn.addEventListener("click", toggleTheme);
  });

  /* ---------- Mobile nav ---------- */
  var menuBtn = document.querySelector("[data-menu-toggle]");
  var panel = document.querySelector("[data-mobile-panel]");
  if (menuBtn && panel) {
    menuBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = panel.classList.toggle("is-open");
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open);
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });
    document.addEventListener("click", function (e) {
      if (panel.classList.contains("is-open") && !panel.contains(e.target) && !menuBtn.contains(e.target)) {
        panel.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
        menuBtn.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- High-Performance Starfield ---------- */
  var canvas = document.getElementById("starfield");
  if (canvas) {
    var ctx = canvas.getContext("2d", { alpha: true });
    var stars = [];
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var animId = null;
    var lastW = 0;
    var lastH = 0;

    function resize() {
      var w = window.innerWidth;
      var h = window.innerHeight;
      if (Math.abs(w - lastW) < 10 && Math.abs(h - lastH) < 50 && stars.length > 0) return;
      lastW = w;
      lastH = h;

      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      buildStars(w, h);
      renderStatic();
    }

    function buildStars(w, h) {
      var count = Math.min(75, Math.max(30, Math.floor((w * h) / 18000)));
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: (Math.random() * 1.3 + 0.4) * DPR,
          a: Math.random() * 0.55 + 0.25,
          speed: Math.random() * 0.008 + 0.003,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function starColor() {
      return getComputedStyle(root).getPropertyValue("--star").trim() || "rgba(255,255,255,0.8)";
    }

    var t = 0;
    function renderStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var color = starColor();
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        ctx.beginPath();
        ctx.globalAlpha = s.a;
        ctx.fillStyle = color;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    function draw() {
      if (document.hidden) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var color = starColor();
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = s.a * (0.65 + 0.35 * Math.sin(t * s.speed * 8 + s.phase));
        ctx.beginPath();
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = color;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 1;
      animId = requestAnimationFrame(draw);
    }

    function startAnimation() {
      if (!reduceMotion && !animId) {
        animId = requestAnimationFrame(draw);
      }
    }

    function stopAnimation() {
      if (animId) {
        cancelAnimationFrame(animId);
        animId = null;
      }
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    });

    resize();
    window.addEventListener("resize", debounce(resize, 200), { passive: true });
    if (!reduceMotion) {
      startAnimation();
    }
  }

  function debounce(fn, wait) {
    var timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    };
  }

  /* ---------- Active nav link (GitHub Pages, custom domains & clean URL support) ---------- */
  function updateActiveNav() {
    var rawPath = window.location.pathname || "";
    var segments = rawPath.replace(/\/+$/, "").split("/").filter(Boolean);
    var currentFile = segments.length > 0 ? segments[segments.length - 1] : "index";
    var currentName = currentFile.replace(/\.html$/i, "").toLowerCase();
    if (!currentName || currentName === "index") {
      currentName = "index";
    }

    document.querySelectorAll("[data-nav] a").forEach(function (a) {
      var href = a.getAttribute("href");
      if (!href) return;
      var target = href.split("?")[0].split("#")[0];
      var targetFile = target.split("/").filter(Boolean).pop() || "index";
      var targetName = targetFile.replace(/\.html$/i, "").toLowerCase();
      if (!targetName || targetName === "index") {
        targetName = "index";
      }

      if (currentName === targetName) {
        a.classList.add("active");
        a.setAttribute("aria-current", "page");
      } else {
        a.classList.remove("active");
        a.removeAttribute("aria-current");
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateActiveNav);
  } else {
    updateActiveNav();
  }
  window.addEventListener("popstate", updateActiveNav);
})();
