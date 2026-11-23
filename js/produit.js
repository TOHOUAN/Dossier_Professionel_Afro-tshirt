"use strict";

const productId = new URLSearchParams(window.location.search).get("id");
const selectedProduct = produitsCatalogue.find((product) => product.id === productId);
const productTitle = document.getElementById("produit-title");
const productNotice = document.getElementById("produit-notice");

function createProductVisual(product, className) {
    if (!product.image) {
        const placeholder = document.createElement("div");
        placeholder.className = `${className} produit-placeholder`;
        placeholder.setAttribute("role", "img");
        placeholder.setAttribute("aria-label", `Visuel non disponible pour ${product.name}`);
        placeholder.textContent = "Visuel à venir";
        return placeholder;
    }
    const image = document.createElement("img");
    image.className = className;
    image.src = product.image;
    image.alt = product.alt;
    return image;
}

function renderProductPrice(product) {
    const price = document.getElementById("produit-price");
    if (product.oldPrice) {
        const oldPrice = document.createElement("del");
        oldPrice.textContent = `${product.oldPrice} €`;
        oldPrice.setAttribute("aria-label", `Ancien prix : ${product.oldPrice} €`);
        price.append(oldPrice, " ");
    }
    const currentPrice = document.createElement("span");
    currentPrice.textContent = `${product.price} €`;
    price.append(currentPrice);
    price.hidden = false;
}

function renderOptionalInformation(product) {
    if (product.description) {
        const description = document.getElementById("produit-description");
        const paragraph = document.createElement("p");
        paragraph.textContent = product.description;
        description.append(paragraph);
        description.hidden = false;
    }
    // Aucune caractéristique ou variante n’est déduite d’une photographie.
    if (product.specifications && Object.keys(product.specifications).length) {
        const section = document.getElementById("produit-specifications");
        const title = document.createElement("h2");
        title.textContent = "Caractéristiques";
        const list = document.createElement("dl");
        Object.entries(product.specifications).forEach(([label, value]) => {
            const term = document.createElement("dt");
            term.textContent = label;
            const detail = document.createElement("dd");
            detail.textContent = value;
            list.append(term, detail);
        });
        section.append(title, list);
        section.hidden = false;
    }
}

function renderRelatedProducts(product) {
    const grid = document.getElementById("produit-related-grid");
    produitsCatalogue.filter((item) => item.id !== product.id).forEach((item) => {
        const card = document.createElement("article");
        const link = document.createElement("a");
        link.href = `produit.html?id=${encodeURIComponent(item.id)}`;
        link.className = "produit-related-link";
        const visual = createProductVisual(item, "produit-related-image");
        if (visual.tagName === "IMG") visual.loading = "lazy";
        const title = document.createElement("h3");
        title.textContent = item.name;
        link.append(visual, title);
        card.append(link);
        grid.append(card);
    });
    document.getElementById("produit-related").hidden = false;
}

if (selectedProduct) {
    productTitle.textContent = selectedProduct.name;
    document.getElementById("produit-breadcrumb-name").textContent = selectedProduct.name;
    document.title = `${selectedProduct.name} | Afro T-Shirt`;
    document.querySelector('meta[name="description"]').content =
        `${selectedProduct.name} — ${selectedProduct.price} €. Découvrez ce modèle de la boutique Afro T-Shirt.`;
    const gallery = document.getElementById("produit-gallery");
    gallery.append(createProductVisual(selectedProduct, "produit-main-image"));
    gallery.hidden = false;
    renderProductPrice(selectedProduct);
    renderOptionalInformation(selectedProduct);
    productNotice.textContent = "Panier et commande de démonstration : aucune transaction. Paiement prévu en V2.";
    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.className = "btn btn-dark produit-add";
    addButton.textContent = "Ajouter au panier";
    addButton.setAttribute("aria-describedby", "produit-notice");
    addButton.addEventListener("click", () => AfroCart.add(selectedProduct.id));
    productNotice.after(addButton);
    renderRelatedProducts(selectedProduct);
} else {
    const unavailable = productId === "monument-dkr";
    const stateTitle = unavailable ? "Produit indisponible" : "Produit introuvable";
    const stateMessage = unavailable
        ? "Ce produit n’est plus proposé dans le catalogue. Découvrez les autres modèles dans la boutique."
        : "Ce lien ne correspond à aucun produit du catalogue. Retrouvez les modèles disponibles dans la boutique.";
    productTitle.textContent = stateTitle;
    document.getElementById("produit-breadcrumb-name").textContent = stateTitle;
    document.title = `${stateTitle} | Afro T-Shirt`;
    document.querySelector('meta[name="description"]').content = stateMessage;
    productNotice.textContent = stateMessage;
    document.querySelector(".produit-layout").classList.add("produit-layout-empty");
}
