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
    menuBtn.addEventListener("click", function () {
      var open = panel.classList.toggle("is-open");
      menuBtn.classList.toggle("is-open", open);
      menuBtn.setAttribute("aria-expanded", open);
    });
    panel.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        panel.classList.remove("is-open");
        menuBtn.classList.remove("is-open");
      });
    });
  }

  /* ---------- Starfield ---------- */
  var canvas = document.getElementById("starfield");
  if (canvas) {
    var ctx = canvas.getContext("2d");
    var stars = [];
    var DPR = Math.min(window.devicePixelRatio || 1, 2);
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function resize() {
      canvas.width = window.innerWidth * DPR;
      canvas.height = document.documentElement.scrollHeight * DPR;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = document.documentElement.scrollHeight + "px";
      buildStars();
    }

    function buildStars() {
      var count = Math.floor((window.innerWidth * document.documentElement.scrollHeight) / 9000);
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.6 * DPR + 0.3,
          a: Math.random() * 0.6 + 0.2,
          speed: Math.random() * 0.015 + 0.004,
          phase: Math.random() * Math.PI * 2
        });
      }
    }

    function starColor() {
      return getComputedStyle(root).getPropertyValue("--star").trim() || "rgba(255,255,255,0.8)";
    }

    var t = 0;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var color = starColor();
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var twinkle = reduceMotion ? s.a : s.a * (0.6 + 0.4 * Math.sin(t * s.speed * 10 + s.phase));
        ctx.beginPath();
        ctx.globalAlpha = twinkle;
        ctx.fillStyle = color;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      t += 1;
      if (!reduceMotion) requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", debounce(resize, 200));
    draw();
  }

  function debounce(fn, wait) {
    var timeout;
    return function () {
      clearTimeout(timeout);
      timeout = setTimeout(fn, wait);
    };
  }

  /* ---------- Active nav link ---------- */
  var path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll("[data-nav] a").forEach(function (a) {
    var href = a.getAttribute("href");
    if (href === path || (path === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });
})();
