# Afro T-Shirt — Projet Front-End

Site vitrine et catalogue de démonstration **Afro T-Shirt**, réalisé en **HTML5, CSS3 et JavaScript natif** dans le cadre de la préparation du dossier professionnel de formation.

> **Important :** ce dépôt constitue une reconstruction pédagogique en code. Il est distinct du site commercial [afroteeshirt.com](https://www.afroteeshirt.com/) réalisé avec Hostinger Site Builder.

## Pages du projet

| Page | Fichier | Fonction |
| --- | --- | --- |
| Accueil | `index.html` | Présentation de la marque, de son univers et du parcours partenaire |
| Boutique | `boutique.html` | Catalogue de cinq produits, tri par prix |
| À propos | `a-propos.html` | Mission, valeurs, production et engagements |
| Nous rejoindre | `nous-rejoindre.html` | Présentation des offres projet textile et affiliation |
| Contact | `contact.html` | Formulaire de démonstration et coordonnées |

## Structure actuelle

```text
/
├── index.html
├── boutique.html
├── a-propos.html
├── nous-rejoindre.html
├── contact.html
├── style.css
├── js/
│   ├── boutique.js
│   └── contact.js
├── image/
│   └── ... images et icônes du site
└── README.md
```

## Lancer le projet en local

1. Cloner le dépôt :

```bash
git clone https://github.com/TOHOUAN/Dossier_Professionel_Afro-tshirt.git
cd Dossier_Professionel_Afro-tshirt
```

2. Ouvrir le dossier dans **Visual Studio Code**.
3. Lancer un serveur local, par exemple avec l'extension **Live Server** (ouvrir `index.html` avec Live Server). Aucune compilation ni installation de dépendances JavaScript n'est nécessaire pour cette version statique.
4. Depuis la page d'accueil, tester les liens vers les quatre autres pages.

## Fonctionnalités actuellement codées

- Navigation entre les cinq pages HTML.
- Présentation d'un catalogue de cinq produits.
- Tri des produits en ordre initial, prix croissant ou prix décroissant dans `js/boutique.js`.
- Liens de la page Nous rejoindre vers le formulaire Contact avec le paramètre `objet` pour préremplir le motif.
- Vérification côté navigateur des champs du formulaire Contact dans `js/contact.js`.

## Limites fonctionnelles connues

- Les boutons « Ajouter au panier » sont **désactivés** : il n'existe pas de panier ni de paiement opérationnel dans cette démonstration.
- Le formulaire Contact valide des champs mais **n'envoie aucun message**. Aucun service d'envoi ni back-end n'est connecté.
- Certaines fiches produits peuvent comporter un visuel temporaire ou un espace réservé.
- La compatibilité responsive, les parcours au clavier et le déploiement doivent faire l'objet de tests enregistrés ; ils ne sont pas déclarés validés sur la seule présence du code.

## Contrôles qualité prioritaires

- Vérifier le chargement des images et de la feuille `style.css` sur toutes les pages.
- Tester la navigation et les ancres internes de `nous-rejoindre.html`.
- Vérifier l'exécution de `js/boutique.js` et de `js/contact.js` dans la console du navigateur.
- Tester le rendu à 375 px, 768 px et 1440 px.
- Vérifier les parcours clavier, la visibilité du focus, les libellés des champs et les alternatives textuelles.
- Conserver des captures de tests et les commits correspondants pour le dossier professionnel.

## Hébergement / déploiement

Le site est un ensemble de fichiers statiques. Il peut être hébergé sur une plateforme de sites statiques telle que **Vercel**. Lors de l'import du dépôt, définir la racine du projet comme dossier de publication et ne pas configurer une commande de build inutile pour ces fichiers HTML/CSS/JS.

Un déploiement Vercel fonctionnel et son URL ne sont **pas confirmés** par ce README : ils doivent être vérifiés séparément. Ne pas confondre cette démonstration avec le domaine commercial existant.

## Références du dossier professionnel

- [Documentation technique](https://app.notion.com/p/33d37b1bb18c80bab58bd1ef4cac3c37)
- [Scénarios de test](https://app.notion.com/p/33d37b1bb18c80aebf21f54137ada383)
- [Registre des preuves RNCP](https://app.notion.com/p/41e37b1bb18c819b8c74e065356b74da)
- [Backlog](https://app.notion.com/p/33d37b1bb18c80409cafdb2d0855940b)

## Évolution et traçabilité

Les corrections sont effectuées par commits dédiés. La branche de travail destinée aux ajustements d'images et à ce README est `fix/assets-readme-rncp-20261120`. L'intégration dans `main` est distincte de la préparation de ces corrections.

Projet de démonstration technique Afro T-Shirt — novembre 2026.
