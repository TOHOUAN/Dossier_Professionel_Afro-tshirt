"use strict";

async function runCartTests() {
    const output = document.getElementById("results");
    const frames = document.querySelectorAll("iframe");
    const frame = frames[0];
    const key = "afro-tshirt.panier.v1";
    const original = localStorage.getItem(key);
    const results = [];
    const pause = () => new Promise((resolve) => setTimeout(resolve, 100));
    const load = (page, width = 1440, target = frame) => new Promise((resolve) => {
        target.style.width = `${width}px`;
        target.onload = () => setTimeout(resolve, 100);
        target.src = `../${page}`;
    });
    const check = (name, passed, details = {}) => {
        results.push({ name, passed: Boolean(passed), ...details });
    };
    const seed = (items) => localStorage.setItem(key, JSON.stringify(items));
    try {
        localStorage.removeItem(key);
        await load("panier.html");
        let w = frame.contentWindow, d = frame.contentDocument;
        check("Panier vide", !d.getElementById("panier-empty").hidden && d.getElementById("panier-start").disabled);
        await load("boutique.html");
        w = frame.contentWindow; d = frame.contentDocument;
        const buttons = d.querySelectorAll(".boutique-add");
        buttons[0].click(); buttons[0].click(); buttons[2].click();
        check("Ajout boutique et fusion des articles", w.AfroCart.summary().count === 3 && w.AfroCart.summary().items.length === 2);
        check("Total 2 Éléphants + 1 Léopards = 115 €", w.AfroCart.summary().totalCents === 11500);
        check("Stockage limité aux ID et quantités", JSON.parse(localStorage.getItem(key)).every((item) => Object.keys(item).sort().join() === "id,quantity"));
        await load("produit.html?id=ya-foye");
        d = frame.contentDocument; w = frame.contentWindow;
        d.querySelector(".produit-add").click();
        check("Ajout fiche et persistance après navigation", w.AfroCart.summary().count === 4 && w.AfroCart.summary().totalCents === 16000);
        await load("panier.html");
        d = frame.contentDocument; w = frame.contentWindow;
        check("Persistance après rechargement", w.AfroCart.summary().count === 4);
        let quantity = d.getElementById("quantity-elephants");
        quantity.value = "3"; quantity.dispatchEvent(new w.Event("change"));
        check("Quantité et recalcul", w.AfroCart.summary().totalCents === 19500 && d.activeElement.id === "quantity-elephants");
        for (const value of ["", "0", "-1", "1.5", "100"]) {
            quantity = d.getElementById("quantity-elephants");
            quantity.value = value; quantity.dispatchEvent(new w.Event("change"));
            check(`Quantité invalide refusée : ${value || "vide"}`, quantity.getAttribute("aria-invalid") === "true" && w.AfroCart.summary().items[0].quantity === 3);
        }
        d.getElementById("panier-start").click();
        check("Erreur de quantité bloque la simulation", d.getElementById("panier-checkout").hidden);
        quantity.value = "3"; quantity.dispatchEvent(new w.Event("change"));
        d.querySelector('.panier-item button[aria-label*="Léopards"]').click();
        check("Suppression d’un article", w.AfroCart.summary().count === 4 && w.AfroCart.summary().totalCents === 15000);
        d.getElementById("panier-start").click();
        check("Prévisualisation fictive et focus", !d.getElementById("panier-checkout").hidden && d.activeElement.id === "panier-checkout-title");
        d.getElementById("panier-cancel").click();
        check("Annulation sans perte du panier", d.getElementById("panier-checkout").hidden && w.AfroCart.summary().count === 4);
        d.getElementById("panier-start").click();
        w.AfroCart.add("lions");
        check("Modification invalide la simulation", d.getElementById("panier-checkout").hidden);
        d.getElementById("panier-start").click();
        const totalBefore = w.AfroCart.summary().totalCents;
        d.getElementById("panier-confirm").click();
        check("Confirmation fictive et vidage", w.AfroCart.summary().count === 0 && !d.getElementById("panier-receipt").hidden && d.getElementById("panier-receipt-total").textContent === w.AfroCart.money(totalBefore));
        check("Pas de collecte personnelle", !d.querySelector("form") && !d.querySelector('input[type=email],input[type=tel]'));
        d.getElementById("panier-confirm").click();
        check("Pas de seconde commande", w.AfroCart.summary().count === 0 && d.getElementById("panier-start").disabled);
        await load("panier.html");
        check("Récapitulatif non stocké après rechargement", frame.contentDocument.getElementById("panier-receipt").hidden);
        localStorage.setItem(key, "JSON cassé");
        await load("panier.html");
        check("Stockage corrompu géré", frame.contentWindow.AfroCart.summary().count === 0);
        seed([{ id: "monument-dkr", quantity: 1 }, { id: "elephants", quantity: -2 }, { id: "lions", quantity: "3" }, { id: "ya-foye", quantity: 2, price: 1, email: "test" }]);
        await load("panier.html");
        w = frame.contentWindow;
        check("IDs retirés et données invalides ignorés, prix catalogue", w.AfroCart.summary().items.length === 1 && w.AfroCart.summary().totalCents === 9000);
        w.AfroCart.add("elephants");
        check("Écriture nettoyée des champs étrangers", JSON.parse(localStorage.getItem(key)).every((item) => Object.keys(item).sort().join() === "id,quantity"));
        seed([{ id: "lions", quantity: 99 }]);
        await load("panier.html");
        w = frame.contentWindow; w.AfroCart.add("lions");
        check("Limite technique de 99", w.AfroCart.summary().count === 99);
        seed([]);
        await load("boutique.html");
        await load("panier.html", 1440, frames[1]);
        frame.contentWindow.AfroCart.add("elephants"); await pause();
        check("Synchronisation entre deux pages ouvertes", frames[1].contentWindow.AfroCart.summary().count === 1 && frames[1].contentDocument.getElementById("panier-count").textContent === "1");
        await load("panier.html");
        w = frame.contentWindow; d = frame.contentDocument;
        const setItem = w.Storage.prototype.setItem;
        w.Storage.prototype.setItem = () => { throw new Error("Stockage bloqué pour test"); };
        w.AfroCart.add("lions");
        check("Échec d’écriture : mémoire et avertissement", w.AfroCart.summary().count === 2 && !d.getElementById("cart-storage-note").hidden);
        w.Storage.prototype.setItem = setItem;
        const getItem = w.Storage.prototype.getItem;
        w.Storage.prototype.getItem = () => { throw new Error("Lecture bloquée pour test"); };
        check("Échec de lecture géré sans exception", w.AfroCart.summary().count === 2);
        w.Storage.prototype.getItem = getItem;
        seed([{ id: "elephants", quantity: 2 }, { id: "ya-foye", quantity: 1 }]);
        for (const page of ["index.html", "boutique.html", "a-propos.html", "nous-rejoindre.html", "contact.html", "produit.html?id=ya-foye", "panier.html"]) {
            for (const width of [375, 768, 1440]) {
                await load(page, width); d = frame.contentDocument; w = frame.contentWindow;
                for (const image of d.images) image.loading = "eager";
                await pause();
                const cart = d.querySelector(".cart-link"), b = cart.getBoundingClientRect();
                const overlap = [...d.querySelectorAll(".nav-list a")].some((a) => { const r = a.getBoundingClientRect(); return r.left < b.right && r.right > b.left && r.top < b.bottom && r.bottom > b.top; });
                check(`Rendu ${page} à ${width}px`, d.documentElement.scrollWidth <= width && [...d.images].every((i) => i.complete && i.naturalWidth > 0) && !overlap && cart.querySelector(".cart-count").textContent === "3", { page, width });
            }
        }
        await load("boutique.html"); d = frame.contentDocument; w = frame.contentWindow;
        for (const order of ["ascending", "descending", "initial"]) {
            const select = d.getElementById("boutique-sort"); select.value = order; select.dispatchEvent(new w.Event("change"));
            const prices = [...d.querySelectorAll(".boutique-price span")].map((p) => p.textContent);
            check(`Tri ${order}`, prices.join() === (order === "descending" ? "45 €,45 €,35 €,35 €" : "35 €,35 €,45 €,45 €") && d.querySelectorAll(".boutique-card").length === 4);
        }
        for (const id of ["elephants", "lions", "leopards", "ya-foye", "monument-dkr", "inconnu"]) {
            await load(`produit.html?id=${id}`); d = frame.contentDocument;
            check(`Fiche ${id}`, id === "monument-dkr" ? !d.querySelector(".produit-add") && d.querySelector("h1").textContent === "Produit indisponible" : id === "inconnu" ? !d.querySelector(".produit-add") : Boolean(d.querySelector(".produit-add")));
        }
        for (const query of ["", "?objet=projet-textile", "?objet=affiliation", "?objet=inconnu"]) {
            await load(`contact.html${query}`, 375); d = frame.contentDocument; w = frame.contentWindow;
            const forms = [...d.forms].filter((f) => !f.hidden), form = forms[0];
            form.dispatchEvent(new w.Event("submit", { cancelable: true }));
            const required = [...form.querySelectorAll("[required]")];
            check(`Contact ${query || "général"}`, forms.length === 1 && required.length > 0 && required.every((f) => f.getAttribute("aria-invalid") === "true"));
        }
        await load("panier.html"); d = frame.contentDocument;
        d.getElementById("panier-clear").click();
        check("Vider le panier", frame.contentWindow.AfroCart.summary().count === 0 && !d.getElementById("panier-empty").hidden);
        const source = await (await fetch("../panier.html")).text();
        const instrumented = source.replace("<head>", `<head><base href="${new URL("../", location.href).href}"><script>Storage.prototype.getItem = () => { throw new Error("Lecture bloquée pour test"); };<\/script>`);
        await new Promise((resolve) => {
            frame.onload = () => setTimeout(resolve, 100);
            frame.srcdoc = instrumented;
        });
        d = frame.contentDocument; w = frame.contentWindow;
        check("Stockage bloqué dès initialisation", w.AfroCart.summary().count === 0 && !d.getElementById("cart-storage-note").hidden);
        w.AfroCart.add("ya-foye");
        check("Ajout avec lecture bloquée", w.AfroCart.summary().count === 1 && w.AfroCart.summary().totalCents === 4500);
    } catch (error) {
        results.push({ name: "Exception de test", passed: false, error: String(error), stack: error.stack });
    } finally {
        if (original === null) localStorage.removeItem(key);
        else localStorage.setItem(key, original);
        output.textContent = JSON.stringify(results, null, 2);
        document.title = results.every((r) => r.passed) ? "TESTS_OK" : "TESTS_ERREUR";
    }
}

document.getElementById("run").addEventListener("click", runCartTests);
if (new URLSearchParams(location.search).get("auto") === "1") runCartTests();
