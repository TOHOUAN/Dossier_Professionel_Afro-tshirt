"use strict";

const cartItems = document.getElementById("panier-items");
const checkout = document.getElementById("panier-checkout");
const receipt = document.getElementById("panier-receipt");
let previewSignature = null;

function cartSignature(summary) {
    return JSON.stringify(summary.items.map(({ id, quantity }) => ({ id, quantity })));
}

function renderCart() {
    const summary = AfroCart.summary();
    const cards = summary.items.map((item) => {
        const card = document.createElement("article");
        card.className = "panier-item";
        const image = document.createElement("img");
        image.src = item.product.image;
        image.alt = item.product.alt;
        const information = document.createElement("div");
        const title = document.createElement("h2");
        const link = document.createElement("a");
        link.href = `produit.html?id=${encodeURIComponent(item.id)}`;
        link.textContent = item.product.name;
        title.append(link);
        const price = document.createElement("p");
        price.textContent = `Prix unitaire : ${AfroCart.money(item.unitCents)}`;
        const label = document.createElement("label");
        const id = `quantity-${item.id}`;
        label.htmlFor = id;
        label.textContent = `Quantité — ${item.product.name}`;
        const quantity = document.createElement("input");
        quantity.type = "number";
        quantity.id = id;
        quantity.min = "1";
        quantity.max = String(AfroCart.maxQuantity);
        quantity.step = "1";
        quantity.value = item.quantity;
        quantity.inputMode = "numeric";
        quantity.setAttribute("aria-describedby", `${id}-error`);
        const error = document.createElement("p");
        error.id = `${id}-error`;
        error.className = "contact-error";
        error.hidden = true;
        quantity.addEventListener("change", () => {
            if (!AfroCart.setQuantity(item.id, quantity.valueAsNumber)) {
                quantity.setAttribute("aria-invalid", "true");
                error.hidden = false;
                error.textContent = "Indiquez une quantité entière comprise entre 1 et 99.";
                AfroCart.announce(error.textContent);
                return;
            }
            document.getElementById(id)?.focus();
        });
        const lineTotal = document.createElement("p");
        lineTotal.textContent = `Total de la ligne : ${AfroCart.money(item.lineCents)}`;
        const remove = document.createElement("button");
        remove.type = "button";
        remove.className = "panier-link-button";
        remove.textContent = "Supprimer";
        remove.setAttribute("aria-label", `Supprimer : ${item.product.name}`);
        remove.addEventListener("click", () => {
            AfroCart.remove(item.id);
            (cartItems.querySelector("input") || document.querySelector(".panier-back")).focus();
        });
        information.append(title, price, label, quantity, error, lineTotal, remove);
        card.append(image, information);
        return card;
    });
    cartItems.replaceChildren(...cards);
    document.getElementById("panier-empty").hidden = summary.count !== 0;
    document.getElementById("panier-count").textContent = summary.count;
    document.getElementById("panier-total").textContent = AfroCart.money(summary.totalCents);
    document.getElementById("panier-start").disabled = summary.count === 0;
    document.getElementById("panier-clear").disabled = summary.count === 0;
    checkout.hidden = true;
    previewSignature = null;
}

function fillSummary(target, summary) {
    target.replaceChildren(...summary.items.map((item) => {
        const line = document.createElement("li");
        line.textContent = `${item.product.name} × ${item.quantity} : ${AfroCart.money(item.lineCents)}`;
        return line;
    }));
}

document.addEventListener("afro:cart-change", () => {
    receipt.hidden = true;
    renderCart();
});
document.getElementById("panier-clear").addEventListener("click", () => {
    AfroCart.clear();
    document.querySelector(".panier-back").focus();
});
document.getElementById("panier-start").addEventListener("click", () => {
    const invalid = cartItems.querySelector('[aria-invalid="true"]');
    if (invalid) { invalid.focus(); return; }
    const summary = AfroCart.summary();
    if (!summary.count) { renderCart(); return; }
    receipt.hidden = true;
    fillSummary(document.getElementById("panier-preview"), summary);
    document.getElementById("panier-preview-total").textContent = AfroCart.money(summary.totalCents);
    previewSignature = cartSignature(summary);
    checkout.hidden = false;
    document.getElementById("panier-checkout-title").focus();
});
document.getElementById("panier-cancel").addEventListener("click", () => {
    checkout.hidden = true;
    previewSignature = null;
    document.getElementById("panier-start").focus();
});
document.getElementById("panier-confirm").addEventListener("click", () => {
    const summary = AfroCart.summary();
    if (checkout.hidden || !summary.count || cartSignature(summary) !== previewSignature) {
        renderCart();
        AfroCart.announce("Le panier a changé. Vérifiez à nouveau la simulation.");
        return;
    }
    // Le récapitulatif reste en mémoire ; aucune donnée n’est transmise.
    fillSummary(document.getElementById("panier-receipt-items"), summary);
    document.getElementById("panier-receipt-total").textContent = AfroCart.money(summary.totalCents);
    AfroCart.clear();
    receipt.hidden = false;
    document.getElementById("panier-receipt-title").focus();
    AfroCart.announce("Simulation fictive terminée. Aucun paiement ni commande réelle.");
});
renderCart();
