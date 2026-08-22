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

  document.querySelectorAll("[data-theme-toggle], .theme-toggle, #theme-toggle").forEach(function (btn) {
    btn.addEventListener("click", toggleTheme);
  });

  /* ---------- Robo Popup & 45deg Rotation ---------- */
  function initRoboPopup() {
    var roboBtn = document.querySelector("[data-robo-toggle], #robo-btn");
    if (!roboBtn) return;

    var overlay = document.querySelector("[data-robo-overlay]");
    var popup = document.querySelector("[data-robo-popup]");

    // Universal base path detection (works across local file://, subfolders, and live web)
    var base = "";
    var styleLink = document.querySelector("link[rel='stylesheet'][href*='style.css']");
    var scriptLink = document.querySelector("script[src*='script.js']");
    if (styleLink && /^\.\.\//.test(styleLink.getAttribute("href") || "")) {
      base = "../";
    } else if (scriptLink && /^\.\.\//.test(scriptLink.getAttribute("src") || "")) {
      base = "../";
    } else {
      var pathname = decodeURIComponent(window.location.pathname || "");
      if (/app[ -_]?policy/i.test(pathname) || /app%20policy/i.test(window.location.pathname || "")) {
        base = "../";
      }
    }

    if (!popup) {
      overlay = document.createElement("div");
      overlay.className = "robo-popup-overlay";
      overlay.setAttribute("data-robo-overlay", "");

      popup = document.createElement("div");
      popup.className = "robo-popup";
      popup.setAttribute("data-robo-popup", "");
      popup.innerHTML = `
        <div class="robo-popup-header">
          <div class="robo-popup-title">
            <img src="${base}ROBO.webp" alt="Robo" class="robo-popup-avatar" width="32" height="32" style="width:32px;height:32px;object-fit:contain;border-radius:50%;background:transparent;">
            <div>
              <h4>Robo</h4>
              <span>Online • Studio Bot</span>
            </div>
          </div>
          <button class="robo-close-btn" data-robo-close aria-label="Close popup">&times;</button>
        </div>
        <div class="robo-popup-body">
          <div class="robo-msg-bubble">
            👋 <strong>Hi! I'm Robo.</strong> Welcome to PixelCraftin Studio! Explore our minimal apps and games, or get in touch with our team.
          </div>
          <div class="robo-actions-grid">
            <div class="robo-dropdown-item">
              <button class="robo-action-link robo-dropdown-btn" type="button" aria-expanded="false" data-robo-mockup-toggle>
                <span>🎨 Mockup Editor</span>
                <span class="robo-dropdown-arrow" style="color:var(--accent); font-size:.7rem; transition:transform .25s var(--ease);">▼</span>
              </button>
              <div class="robo-dropdown-menu" data-robo-mockup-menu>
                <a href="${base}Mockups/ios-mockup.html" class="robo-sub-action-link" data-mockup-target="ios" data-mockup-title="iOS Frame Mockup" data-mockup-icon="📱">
                  <span>📱 iOS Frame Mockup</span>
                  <span style="color:var(--accent); font-weight:bold; font-size:.75rem;">↗</span>
                </a>
                <a href="${base}Mockups/phone-tab-mockup.html" class="robo-sub-action-link" data-mockup-target="tab" data-mockup-title="Phone &amp; Tablet Mockup" data-mockup-icon="💻">
                  <span>💻 Phone &amp; Tablet Mockup</span>
                  <span style="color:var(--accent); font-weight:bold; font-size:.75rem;">↗</span>
                </a>
              </div>
            </div>
            <a href="${base}apps.html" class="robo-action-link">
              <span>📱 All Apps &amp; Tools</span>
              <span style="color:var(--accent); font-weight:bold;">→</span>
            </a>
            <a href="https://github.com/pixelcraftin" target="_blank" rel="noopener" class="robo-action-link">
              <span>💻 GitHub Source</span>
              <span style="color:var(--accent); font-weight:bold;">→</span>
            </a>
            <a href="${base}contact.html" class="robo-action-link">
              <span>✉️ Contact Developer</span>
              <span style="color:var(--accent); font-weight:bold;">→</span>
            </a>
            <a href="${base}privacy.html" class="robo-action-link">
              <span>🔒 Privacy Policy</span>
              <span style="color:var(--accent); font-weight:bold;">→</span>
            </a>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
      document.body.appendChild(popup);

      // Mockup dropdown toggle inside popup
      var mockupToggle = popup.querySelector("[data-robo-mockup-toggle]");
      var mockupMenu = popup.querySelector("[data-robo-mockup-menu]");
      if (mockupToggle && mockupMenu) {
        mockupToggle.addEventListener("click", function (e) {
          e.stopPropagation();
          var isExpanded = mockupMenu.classList.toggle("is-open");
          mockupToggle.classList.toggle("is-active", isExpanded);
          mockupToggle.setAttribute("aria-expanded", isExpanded);
        });
      }

      // Mockup popup modal click triggers
      popup.querySelectorAll("[data-mockup-target]").forEach(function (link) {
        link.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var targetUrl = link.getAttribute("href");
          var title = link.getAttribute("data-mockup-title");
          var icon = link.getAttribute("data-mockup-icon");
          toggleRobo(false);
          openMockupModal(targetUrl, title, icon);
        });
      });
    }

    function toggleRobo(state) {
      var isOpen = typeof state === "boolean" ? state : !popup.classList.contains("is-open");
      roboBtn.classList.toggle("is-active", isOpen);
      roboBtn.setAttribute("aria-expanded", isOpen);
      overlay.classList.toggle("is-open", isOpen);
      popup.classList.toggle("is-open", isOpen);
    }

    roboBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      toggleRobo();
    });

    var closeBtn = popup.querySelector("[data-robo-close]");
    if (closeBtn) {
      closeBtn.addEventListener("click", function () {
        toggleRobo(false);
      });
    }

    overlay.addEventListener("click", function () {
      toggleRobo(false);
    });

    popup.querySelectorAll("a:not([data-mockup-target])").forEach(function (link) {
      link.addEventListener("click", function () {
        toggleRobo(false);
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && popup.classList.contains("is-open")) {
        toggleRobo(false);
      }
    });

    document.addEventListener("click", function (e) {
      if (popup.classList.contains("is-open") && !popup.contains(e.target) && !roboBtn.contains(e.target)) {
        toggleRobo(false);
      }
    });
  }

  /* ---------- Mockup Centered Modal Window ---------- */
  var mockupOverlay = null;
  var mockupIframe = null;
  var mockupTitleEl = null;
  var mockupFullscreenBtn = null;
  var mockupIconEl = null;

  function initMockupModal() {
    if (mockupOverlay || document.querySelector("[data-mockup-modal-overlay]")) return;

    mockupOverlay = document.createElement("div");
    mockupOverlay.className = "mockup-modal-overlay";
    mockupOverlay.setAttribute("data-mockup-modal-overlay", "");
    mockupOverlay.innerHTML = `
      <div class="mockup-modal-window" data-mockup-modal-window>
        <div class="mockup-modal-header">
          <div class="mockup-modal-title">
            <span class="mockup-modal-icon" data-mockup-icon>🎨</span>
            <h3 data-mockup-title>Mockup Generator</h3>
          </div>
          <div class="mockup-modal-controls">
            <a href="#" target="_blank" rel="noopener" class="mockup-modal-btn" data-mockup-fullscreen title="Open in new window" aria-label="Open in new window">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
            <button class="mockup-modal-close" data-mockup-close aria-label="Close mockup window">&times;</button>
          </div>
        </div>
        <div class="mockup-modal-body">
          <iframe class="mockup-iframe" data-mockup-iframe title="Mockup Editor" src="about:blank" allow="clipboard-write"></iframe>
        </div>
      </div>
    `;
    document.body.appendChild(mockupOverlay);

    mockupIframe = mockupOverlay.querySelector("[data-mockup-iframe]");
    mockupTitleEl = mockupOverlay.querySelector("[data-mockup-title]");
    mockupFullscreenBtn = mockupOverlay.querySelector("[data-mockup-fullscreen]");
    mockupIconEl = mockupOverlay.querySelector("[data-mockup-icon]");
    var closeBtn = mockupOverlay.querySelector("[data-mockup-close]");

    function closeMockupModal() {
      mockupOverlay.classList.remove("is-open");
      document.body.style.overflow = "";
      setTimeout(function () {
        if (!mockupOverlay.classList.contains("is-open")) {
          mockupIframe.src = "about:blank";
        }
      }, 300);
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", closeMockupModal);
    }

    mockupOverlay.addEventListener("click", function (e) {
      if (e.target === mockupOverlay) {
        closeMockupModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mockupOverlay && mockupOverlay.classList.contains("is-open")) {
        closeMockupModal();
      }
    });
  }

  function openMockupModal(url, title, icon) {
    if (!mockupOverlay) {
      initMockupModal();
    }
    if (mockupTitleEl) mockupTitleEl.textContent = title || "Mockup Editor";
    if (mockupFullscreenBtn) mockupFullscreenBtn.href = url;
    if (mockupIconEl && icon) mockupIconEl.textContent = icon;
    if (mockupIframe) mockupIframe.src = url;

    mockupOverlay.classList.add("is-open");
    document.body.style.overflow = "hidden";
  }

  /* ---------- The Team Modal ---------- */
  function initTeamModal() {
    var teamOverlay = document.querySelector("[data-team-modal-overlay]");
    if (!teamOverlay) return;

    var triggers = document.querySelectorAll("[data-open-team-modal]");
    var closeBtn = teamOverlay.querySelector("[data-team-modal-close]");

    function openTeamModal(e) {
      if (e) e.preventDefault();
      teamOverlay.classList.add("is-open");
      teamOverlay.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }

    function closeTeamModal() {
      teamOverlay.classList.remove("is-open");
      teamOverlay.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    triggers.forEach(function (btn) {
      btn.addEventListener("click", openTeamModal);
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", closeTeamModal);
    }

    teamOverlay.addEventListener("click", function (e) {
      if (e.target === teamOverlay) {
        closeTeamModal();
      }
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && teamOverlay.classList.contains("is-open")) {
        closeTeamModal();
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () {
      initRoboPopup();
      initTeamModal();
    });
  } else {
    initRoboPopup();
    initTeamModal();
  }

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

  /* ---------- Google Analytics (GA4) ---------- */
  var GA_ID = window.GA_MEASUREMENT_ID || "G-XXXXXXXXXX";
  if (GA_ID && GA_ID !== "G-XXXXXXXXXX" && !window.gtag) {
    var gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA_ID);
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag("js", new Date());
    gtag("config", GA_ID, {
      anonymize_ip: true,
      send_page_view: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateActiveNav);
  } else {
    updateActiveNav();
  }
  window.addEventListener("popstate", updateActiveNav);
})();

