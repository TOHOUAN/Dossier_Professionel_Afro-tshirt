"use strict";

(() => {
    const header = document.querySelector(".header-navigation");
    const toggle = header.querySelector(".menu-toggle");
    const nav = header.querySelector(".nav");
    const mobile = window.matchMedia("(max-width: 767px)");

    function setOpen(open, returnFocus = false) {
        toggle.setAttribute("aria-expanded", String(open));
        toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
        nav.hidden = mobile.matches && !open;
        if (returnFocus) toggle.focus();
    }

    function adapt() {
        const focusInside = nav.contains(document.activeElement);
        const focusOnToggle = document.activeElement === toggle;
        toggle.hidden = !mobile.matches;
        setOpen(false);
        if (mobile.matches && focusInside) toggle.focus();
        else if (!mobile.matches && focusOnToggle) nav.querySelector("a").focus();
    }

    toggle.addEventListener("click", () => {
        setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    header.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && mobile.matches && !nav.hidden) {
            event.preventDefault();
            setOpen(false, true);
        }
    });
    document.addEventListener("click", (event) => {
        if (mobile.matches && !nav.hidden && !header.contains(event.target)) {
            const focusInside = nav.contains(document.activeElement);
            setOpen(false, focusInside);
        }
    });
    nav.addEventListener("click", (event) => {
        if (mobile.matches && event.target.closest("a")) setOpen(false);
    });
    mobile.addEventListener("change", adapt);
    adapt();
})();
