"use strict";

const contactForm = document.getElementById("contact-form");
const contactStatus = document.getElementById("contact-status");
const contactReasons = new Map([
    ["projet-textile", "Projet textile"],
    ["affiliation", "Demande d’affiliation"]
]);
const contactObject = new URLSearchParams(window.location.search).get("objet");

if (contactReasons.has(contactObject)) {
    const reason = document.getElementById("contact-reason");
    reason.textContent = `Motif : ${contactReasons.get(contactObject)}`;
    reason.hidden = false;
    const hiddenObject = document.getElementById("contact-object");
    hiddenObject.value = contactObject;
    hiddenObject.disabled = false;
}

function validateContactField(field) {
    const error = document.getElementById(`${field.id}-error`);
    let message = "";
    if (!field.value.trim()) {
        message = field.type === "email" ? "Indiquez votre adresse email." : "Indiquez votre numéro de téléphone.";
    } else if (field.validity.typeMismatch) {
        message = "Indiquez une adresse email valide, par exemple nom@exemple.fr.";
    }
    error.textContent = message;
    error.hidden = !message;
    if (message) {
        field.setAttribute("aria-invalid", "true");
    } else {
        field.removeAttribute("aria-invalid");
    }
    return !message;
}

const contactFields = [
    document.getElementById("contact-email"),
    document.getElementById("contact-phone")
];

contactFields.forEach((field) => {
    field.addEventListener("input", () => {
        contactStatus.textContent = "";
        if (field.hasAttribute("aria-invalid")) {
            validateContactField(field);
        }
    });
});

document.getElementById("contact-name").addEventListener("input", () => {
    contactStatus.textContent = "";
});

contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const invalidFields = contactFields.filter((field) => !validateContactField(field));
    if (invalidFields.length) {
        contactStatus.textContent = "Veuillez corriger les champs indiqués. Aucun message n’est envoyé.";
        invalidFields[0].focus();
        return;
    }
    contactStatus.textContent = "Les champs sont valides. Formulaire de démonstration : aucun message n’est envoyé.";
});

// La validation accessible remplace les bulles natives après initialisation.
contactForm.noValidate = true;
contactForm.querySelector("button[type=submit]").disabled = false;
