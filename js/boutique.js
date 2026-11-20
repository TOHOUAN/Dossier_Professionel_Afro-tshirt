"use strict";

const boutiqueProducts = [
    {
        "id": "elephants",
        "name": "Les Éléphants de Côte d’Ivoire",
        "price": 35,
        "oldPrice": 45,
        "image": "image/elephants-bl.png",
        "alt": "T-shirt noir Éléphants de Côte d’Ivoire, motif éléphant orange et lettrage vert."
    },
    {
        "id": "lions",
        "name": "Les Lions du Sénégal",
        "price": 35,
        "oldPrice": 45,
        "image": "image/LIONS_MS_01_tee_N.png",
        "alt": "T-shirt noir Lions du Sénégal, motif lion vert et lettrage rouge."
    },
    {
        "id": "leopards",
        "name": "Les Léopards",
        "price": 45,
        "image": "image/BLK _leopards.png",
        "alt": "T-shirt noir Léopards, motif bleu et lettrage rouge au dos."
    },
    {
        "id": "ya-foye",
        "name": "YA FOYE",
        "price": 45,
        "image": null,
        "alt": ""
    },
    {
        "id": "monument-dkr",
        "name": "Monument DKR",
        "price": 45,
        "image": "image/DAKAR_PAIX_HOMME_PRES_BL.png",
        "alt": "Modèle portant le t-shirt blanc Monument DKR au motif violet."
    }
];

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
        if (product.image) {
            const image = document.createElement("img");
            image.className = "boutique-product-image";
            image.src = product.image;
            image.alt = product.alt;
            image.loading = "lazy";
            card.append(image);
        } else {
            const placeholder = document.createElement("div");
            placeholder.className = "boutique-product-image boutique-placeholder";
            placeholder.textContent = "Visuel à venir";
            card.append(placeholder);
        }
        const title = document.createElement("h2");
        title.textContent = product.name;
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
        button.disabled = true;
        button.setAttribute("aria-describedby", "boutique-cart-note");
        card.append(title, price, button);
        return card;
    });
    grid.replaceChildren(...cards);
    const labels = { initial: "ordre initial", ascending: "prix croissant", descending: "prix décroissant" };
    document.getElementById("boutique-status").textContent = `5 produits affichés, ${labels[order] || labels.initial}.`;
}

renderBoutiqueProducts("initial");
document.getElementById("boutique-sort").addEventListener("change", (event) => {
    renderBoutiqueProducts(event.target.value);
});
document.querySelector("[data-boutique-all]").addEventListener("click", () => {
    renderBoutiqueProducts(document.getElementById("boutique-sort").value);
});
