// FitDevs Landing Page — Interactions

(function () {
  "use strict";

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
      message.textContent = "🎉 Você entrou na Lista VIP! Em breve mandamos novidades.";
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