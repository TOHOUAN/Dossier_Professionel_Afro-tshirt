// ============================
// AFRO TSHIRT - SCRIPT GLOBAL
// ============================

document.addEventListener("DOMContentLoaded", () => {

  // ==========================
  // 1. Gestion des boutons vides
  // ==========================
  const buttons = document.querySelectorAll("a, button");

  buttons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      if (btn.getAttribute("href") === "#" || btn.type === "button") {
        e.preventDefault();
      }
    });
  });


  // ==========================
  // 2. Simulation panier (UX)
  // ==========================
  const cartButtons = document.querySelectorAll(".product button");

  cartButtons.forEach(button => {
    button.addEventListener("click", () => {
      alert("Produit ajouté au panier (simulation V1)");
    });
  });


  // ==========================
  // 3. Scroll smooth CTA
  // ==========================
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(link => {
    link.addEventListener("click", function(e) {
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });


  // ==========================
  // 4. Animation apparition au scroll
  // ==========================
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  });

  const sections = document.querySelectorAll("section");

  sections.forEach(section => {
    observer.observe(section);
  });


  // ==========================
  // 5. Header dynamique (scroll)
  // ==========================
  const header = document.querySelector(".header");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header.style.background = "#ffffff";
      header.style.boxShadow = "0 2px 10px rgba(0,0,0,0.1)";
    } else {
      header.style.background = "transparent";
      header.style.boxShadow = "none";
    }
  });


  // ==========================
  // 6. Console signature projet
  // ==========================
  console.log("AFRO T-SHIRT — Plateforme en cours de développement 🚀");

});