// FitDevs Landing Page — Interactions

(function () {
  "use strict";

  // Theme toggle (light/dark)
  const THEME_KEY = "fitdevs-theme";
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme);
    if (themeToggle) {
      const label =
        theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro";
      themeToggle.setAttribute("aria-label", label);
      themeToggle.setAttribute("title", label);
    }
  }

  applyTheme(root.getAttribute("data-theme") || "dark");

  if (themeToggle) {
    themeToggle.addEventListener("click", function () {
      const next =
        root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {}
    });
  }

  // Follow the OS preference until the user picks a theme explicitly
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", function (e) {
      let saved = null;
      try {
        saved = localStorage.getItem(THEME_KEY);
      } catch (err) {}
      if (!saved) applyTheme(e.matches ? "light" : "dark");
    });

  // Smooth scroll for anchor links (fallback for browsers without CSS support)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Lista VIP form handling
  const form = document.getElementById("vip-form");
  const emailInput = document.getElementById("email");
  const message = document.getElementById("form-message");

  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const email = emailInput.value.trim();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        message.textContent = "Por favor, insira um e-mail válido.";
        message.classList.remove("hidden", "text-brand");
        message.classList.add("text-red-400");
        return;
      }

      // Simulate submission success
      message.textContent =
        "🎉 Você entrou na Lista VIP! Em breve mandamos novidades.";
      message.classList.remove("hidden", "text-red-400");
      message.classList.add("text-brand");
      emailInput.value = "";

      // Optional: log to console for debugging
      console.log("Novo lead VIP:", email);
    });
  }

  // Simple navbar hide/show on scroll
  let lastScroll = 0;
  const nav = document.querySelector("nav");

  window.addEventListener("scroll", function () {
    const currentScroll = window.pageYOffset;
    if (currentScroll <= 0) {
      nav.style.transform = "translateY(0)";
      return;
    }
    if (currentScroll > lastScroll && currentScroll > 80) {
      nav.style.transform = "translateY(-100%)";
    } else {
      nav.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll;
  });
})();
