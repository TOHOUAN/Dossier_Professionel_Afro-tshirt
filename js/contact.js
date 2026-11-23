"use strict";

const contactTitles = new Map([
    ["general", "Contactez-nous"],
    ["projet-textile", "Parlez-nous de votre projet textile"],
    ["affiliation", "Rejoindre le réseau Afro T-Shirt"]
]);
const requestedPath = new URLSearchParams(window.location.search).get("objet");
const selectedPath = contactTitles.has(requestedPath) ? requestedPath : "general";
const contactForms = document.querySelectorAll("[data-contact-path]");

function validateContactField(field) {
    const error = document.getElementById(`${field.id}-error`);
    const label = field.labels[0].textContent.replace(/\s*\*$/, "");
    const value = field.value.trim();
    let message = "";

    if (field.required && !value && !field.validity.badInput) {
        message = `Veuillez renseigner le champ « ${label} ».`;
    } else if (field.type === "number" && (field.validity.badInput ||
        (value && (!Number.isSafeInteger(field.valueAsNumber) || field.valueAsNumber <= 0)))) {
        message = "Indiquez une quantité entière supérieure à zéro.";
    } else if (value && field.validity.typeMismatch) {
        message = field.type === "email"
            ? "Indiquez une adresse email valide, par exemple nom@exemple.fr."
            : "Indiquez une URL complète, par exemple https://exemple.fr/profil.";
    } else if (!field.validity.valid) {
        message = `Vérifiez la valeur du champ « ${label} ».`;
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

function initializeContactForm(form, active) {
    form.hidden = !active;
    form.querySelector("fieldset").disabled = !active;
    const fields = [...form.querySelectorAll("input:not([type=hidden]), select, textarea")];
    const status = form.querySelector("[role=status]");

    fields.forEach((field) => {
        field.required = active && field.dataset.required === "true";
        ["input", "change"].forEach((eventName) => {
            field.addEventListener(eventName, () => {
                status.textContent = "";
                if (field.hasAttribute("aria-invalid")) {
                    validateContactField(field);
                }
            });
        });
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        if (form.hidden) return;
        const invalidFields = fields.filter((field) => !validateContactField(field));
        if (invalidFields.length) {
            status.textContent = "Veuillez corriger les champs indiqués. Aucun message n'est envoyé.";
            invalidFields[0].focus();
            return;
        }
        status.textContent = "Les champs sont valides. Formulaire de démonstration : aucun message n'est envoyé.";
    });

    // Les erreurs associées aux champs remplacent les bulles de validation natives.
    form.noValidate = true;
    form.querySelector("button[type=submit]").disabled = !active;
}

contactForms.forEach((form) => {
    initializeContactForm(form, form.dataset.contactPath === selectedPath);
});
document.getElementById("contact-title").textContent = contactTitles.get(selectedPath);
