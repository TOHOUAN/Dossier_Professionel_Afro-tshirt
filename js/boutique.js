"use strict";

const boutiqueProducts = produitsCatalogue;

function sortBoutiqueProducts(order) {
    const products = [...boutiqueProducts];
    if (order === "ascending") {
        products.sort((a, b) => a.price - b.price);
    } else if (order === "descending") {
        products.sort((a, b) => b.price - a.price);
    }
    return products;
}

function renderBoutiqueProducts(order) {
    const grid = document.getElementById("boutique-products");
    const formatPrice = (price) => `${price} €`;
    const cards = sortBoutiqueProducts(order).map((product) => {
        const card = document.createElement("article");
        card.className = "boutique-card";
        const productUrl = `produit.html?id=${encodeURIComponent(product.id)}`;
        const imageLink = document.createElement("a");
        imageLink.href = productUrl;
        imageLink.className = "boutique-product-link";
        imageLink.setAttribute("aria-label", `Voir la fiche : ${product.name}`);
        if (product.image) {
            const image = document.createElement("img");
            image.className = "boutique-product-image";
            image.src = product.image;
            image.alt = product.alt;
            image.loading = "lazy";
            imageLink.append(image);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "boutique-product-image boutique-placeholder";
            placeholder.textContent = "Visuel à venir";
            imageLink.append(placeholder);
        }
        const title = document.createElement("h2");
        const nameLink = document.createElement("a");
        nameLink.href = productUrl;
        nameLink.textContent = product.name;
        title.append(nameLink);
        const price = document.createElement("p");
        price.className = "boutique-price";
        if (product.oldPrice) {
            const oldPrice = document.createElement("del");
            oldPrice.textContent = formatPrice(product.oldPrice);
            oldPrice.setAttribute("aria-label", `Ancien prix : ${formatPrice(product.oldPrice)}`);
            price.append(oldPrice, " ");
        }
        const currentPrice = document.createElement("span");
        currentPrice.textContent = formatPrice(product.price);
        price.append(currentPrice);
        const button = document.createElement("button");
        button.type = "button";
        button.className = "boutique-add";
        button.textContent = "Ajouter au panier";
        button.setAttribute("aria-label", `Ajouter au panier : ${product.name}`);
        button.addEventListener("click", () => AfroCart.add(product.id));
        button.setAttribute("aria-describedby", "boutique-cart-note");
        card.append(imageLink, title, price, button);
        return card;
    });
    grid.replaceChildren(...cards);
    const labels = { initial: "ordre initial", ascending: "prix croissant", descending: "prix décroissant" };
    document.getElementById("boutique-status").textContent = `${boutiqueProducts.length} produits affichés, ${labels[order] || labels.initial}.`;
}

renderBoutiqueProducts("initial");
document.getElementById("boutique-sort").addEventListener("change", (event) => {
    renderBoutiqueProducts(event.target.value);
});
document.querySelector("[data-boutique-all]").addEventListener("click", () => {
    renderBoutiqueProducts(document.getElementById("boutique-sort").value);
});
