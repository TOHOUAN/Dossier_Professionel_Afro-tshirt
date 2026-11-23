"use strict";

async function runResponsiveTests() {
    const frame = document.querySelector("iframe");
    const key = "afro-tshirt.panier.v1";
    const original = localStorage.getItem(key);
    const results = [];
    const pages = ["index.html", "boutique.html", "a-propos.html", "nous-rejoindre.html", "contact.html", "contact.html?objet=projet-textile", "contact.html?objet=affiliation", "contact.html?objet=inconnu", "produit.html?id=elephants", "produit.html?id=lions", "produit.html?id=leopards", "produit.html?id=ya-foye", "produit.html?id=inconnu", "produit.html?id=monument-dkr", "panier.html#vide", "panier.html#rempli", "panier.html#simulation", "panier.html#bilan"];
    const check = (name, passed, details = {}) => results.push({ name, passed: Boolean(passed), ...details });
    const pause = () => new Promise((resolve) => setTimeout(resolve, 80));
    let loadIndex = 0;
    const load = (page, width, height = 1000) => new Promise((resolve) => {
        frame.style.width = `${width}px`;
        frame.style.height = `${height}px`;
        frame.onload = () => setTimeout(resolve, 80);
        const [path, hash] = page.split("#");
        frame.src = `../${path}${path.includes("?") ? "&" : "?"}responsiveCase=${++loadIndex}${hash ? `#${hash}` : ""}`;
    });
    try {
        for (const page of pages) {
            for (const width of [320, 375, 390, 430, 768, 1024, 1440]) {
                localStorage.setItem(key, JSON.stringify(page.endsWith("#vide") ? [] : [{ id: "elephants", quantity: 2 }, { id: "ya-foye", quantity: 1 }]));
                await load(page, width);
                const d = frame.contentDocument, w = frame.contentWindow;
                if (page.endsWith("#simulation") || page.endsWith("#bilan")) d.getElementById("panier-start").click();
                if (page.endsWith("#bilan")) d.getElementById("panier-confirm").click();
                [...d.images].forEach((image) => { image.loading = "eager"; });
                await pause();
                const clipped = [...d.querySelectorAll("main h1,main h2,main h3,main p,button,label,legend,figcaption")].filter((e) => e.getClientRects().length && !e.classList.contains("boutique-sr-only") && (e.scrollWidth > e.clientWidth + 2 || e.scrollHeight > e.clientHeight + 2)).map((e) => ({ tag: e.tagName, className: e.className, text: e.textContent.slice(0, 55) }));
                const imageErrors = [...d.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.getAttribute("src"));
                const tiny = [...d.querySelectorAll("main p")].filter((p) => p.getClientRects().length && parseFloat(w.getComputedStyle(p).fontSize) < 15.9).map((p) => p.className);
                check(`${page} à ${width}px`, d.documentElement.scrollWidth <= width && clipped.length === 0 && imageErrors.length === 0 && tiny.length === 0, { page, width, overflow: d.documentElement.scrollWidth > width, clipped, imageErrors, tiny });
                const toggle = d.querySelector(".menu-toggle"), nav = d.querySelector(".header-navigation .nav");
                if (width < 768) {
                    const closed = nav.hidden && !toggle.hidden && toggle.getAttribute("aria-expanded") === "false";
                    toggle.click();
                    const open = !nav.hidden && toggle.getAttribute("aria-expanded") === "true" && d.documentElement.scrollWidth <= width;
                    const links = [...nav.querySelectorAll("a")];
                    const vertical = links.every((a, index) => !index || a.getBoundingClientRect().top >= links[index - 1].getBoundingClientRect().bottom);
                    links[0].focus();
                    nav.dispatchEvent(new w.KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
                    check(`Menu ${page} à ${width}px`, closed && open && vertical && nav.hidden && d.activeElement === toggle, { page, width });
                } else {
                    check(`Navigation desktop ${page} à ${width}px`, toggle.hidden && !nav.hidden, { page, width });
                }
            }
        }
        for (const page of pages) {
            for (const width of [667, 844, 1024]) {
                localStorage.setItem(key, JSON.stringify(page.endsWith("#vide") ? [] : [{ id: "elephants", quantity: 2 }]));
                await load(page, width, 390);
                const d = frame.contentDocument;
                if (page.endsWith("#simulation") || page.endsWith("#bilan")) d.getElementById("panier-start").click();
                if (page.endsWith("#bilan")) d.getElementById("panier-confirm").click();
                check(`Paysage ${page} ${width}×390`, d.documentElement.scrollWidth <= width, { page, width, height: 390 });
            }
            localStorage.setItem(key, JSON.stringify(page.endsWith("#vide") ? [] : [{ id: "elephants", quantity: 2 }]));
            await load(page, 1440);
            const d = frame.contentDocument;
            if (page.endsWith("#simulation") || page.endsWith("#bilan")) d.getElementById("panier-start").click();
            if (page.endsWith("#bilan")) d.getElementById("panier-confirm").click();
            d.documentElement.style.zoom = "2";
            await pause();
            check(`Zoom CSS 200 % ${page}`, d.documentElement.scrollWidth <= 1440, { page, method: "CSS zoom, distinct du zoom de l’interface navigateur" });
        }
    } catch (error) {
        results.push({ name: "Exception", passed: false, error: String(error), stack: error.stack });
    } finally {
        if (original === null) localStorage.removeItem(key);
        else localStorage.setItem(key, original);
        document.getElementById("results").textContent = JSON.stringify(results, null, 2);
        document.title = results.every((r) => r.passed) ? "TESTS_OK" : "TESTS_ERREUR";
    }
}
document.getElementById("run").addEventListener("click", runResponsiveTests);
if (new URLSearchParams(location.search).get("auto") === "1") runResponsiveTests();
