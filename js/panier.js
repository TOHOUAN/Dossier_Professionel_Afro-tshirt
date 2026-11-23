"use strict";

window.AfroCart = (() => {
    const key = "afro-tshirt.panier.v1";
    const maxQuantity = 99; // Limite technique de la démonstration, pas un stock.
    let persistent = true;
    let memory = [];
    const money = (cents) => new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(cents / 100);

    function sanitize(value) {
        if (!Array.isArray(value)) return [];
        const result = new Map();
        value.forEach((item) => {
            if (!item || !produitsCatalogue.some((product) => product.id === item.id) ||
                !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > maxQuantity) return;
            result.set(item.id, { id: item.id, quantity: item.quantity });
        });
        return [...result.values()];
    }

    function read() {
        if (!persistent) return memory.map((item) => ({ ...item }));
        try {
            const raw = localStorage.getItem(key);
            try {
                memory = sanitize(raw ? JSON.parse(raw) : []);
            } catch {
                memory = [];
            }
        } catch {
            persistent = false;
        }
        return memory.map((item) => ({ ...item }));
    }

    function summary() {
        const items = read().map((item) => {
            const product = produitsCatalogue.find((entry) => entry.id === item.id);
            const unitCents = Math.round(product.price * 100);
            return { ...item, product, unitCents, lineCents: unitCents * item.quantity };
        });
        return { items, count: items.reduce((sum, item) => sum + item.quantity, 0),
            totalCents: items.reduce((sum, item) => sum + item.lineCents, 0) };
    }

    function announce(message) {
        document.getElementById("cart-status").textContent = message;
    }

    function updateHeaders() {
        const count = summary().count;
        document.querySelectorAll(".cart-link").forEach((link) => {
            link.setAttribute("aria-label", `Voir le panier, ${count} article${count > 1 ? "s" : ""}`);
            link.querySelector(".cart-count").textContent = count;
        });
        document.getElementById("cart-storage-note").hidden = persistent;
    }

    function save(items, message) {
        memory = sanitize(items);
        if (persistent) {
            try { localStorage.setItem(key, JSON.stringify(memory)); }
            catch { persistent = false; }
        }
        updateHeaders();
        document.dispatchEvent(new CustomEvent("afro:cart-change"));
        if (message) announce(message);
    }

    function add(id) {
        if (!produitsCatalogue.some((product) => product.id === id)) return;
        const items = read();
        const item = items.find((entry) => entry.id === id);
        if (item && item.quantity >= maxQuantity) {
            announce("Limite technique atteinte : 99 exemplaires par modèle pour cette démonstration.");
            return;
        }
        if (item) item.quantity += 1;
        else items.push({ id, quantity: 1 });
        save(items, "Article ajouté au panier de démonstration.");
    }

    function setQuantity(id, quantity) {
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > maxQuantity) return false;
        const items = read();
        const item = items.find((entry) => entry.id === id);
        if (!item) return false;
        item.quantity = quantity;
        save(items, "Quantité mise à jour.");
        return true;
    }

    function remove(id) {
        save(read().filter((item) => item.id !== id), "Article supprimé du panier.");
    }

    const status = document.createElement("p");
    status.id = "cart-status";
    status.className = "boutique-sr-only";
    status.setAttribute("role", "status");
    status.setAttribute("aria-atomic", "true");
    document.body.append(status);
    const note = document.createElement("p");
    note.id = "cart-storage-note";
    note.className = "cart-storage-note";
    note.textContent = "Stockage local indisponible : le panier reste temporaire sur cette page et ne sera pas conservé après navigation.";
    note.hidden = true;
    document.querySelector("main").prepend(note);
    document.querySelectorAll(".cart-link").forEach((link) => {
        const badge = document.createElement("span");
        badge.className = "cart-count";
        badge.setAttribute("aria-hidden", "true");
        link.append(badge);
    });
    updateHeaders();
    window.addEventListener("storage", (event) => {
        if (event.key === key || event.key === null) {
            updateHeaders();
            document.dispatchEvent(new CustomEvent("afro:cart-change"));
            announce("Panier actualisé depuis un autre onglet.");
        }
    });
    return { add, setQuantity, remove, summary, money, maxQuantity,
        clear: () => save([], "Panier vidé."), announce };
})();
