# :shopping_cart: BIKESHOP :bike:

Mon premier projet web de type e-commerce que j'ai developpé pendant le bootcamp de la Capsule.
Il m'a permis de mettre en oeuvre les échanges entre un Frontend et un Backend qui est une base fondamentale du développement web.

## FONCTIONNALITES PRINCIPALES

- Mettre en place une interface utilisateur responsible
- Gérer un catalogue de produit
- Mettre en place un panier
  - Ajouter un produit
  - Modifier la quantité
  - Supprimer un produit
  - Calculer un montant total du panier
- Intégrer un moyen de paiement avec [Stripe](https://stripe.com/)

### Challenges achevés

- Gérer la mise en avant des produits dans la page de produits
- Mettre en place une mécanique de gestion des frais de port

### Challenges à faire

- Proposer différents modes de livraison (Standard, Express, Point Relais)
- Gérer les stocks des produits
- Appliquer certaines promotions sur des produits
- Mettre en place une gestion des codes promos sur votre panier
- Créer une base de données pour gérer les produits (y compris le stock)
- Gérer les commandes en base de données pour pour afficher des informations de récapitulatif de commande aux clients
- Gérer des produits de la commande en base de données
- Mettre en place un dashboard pour suivre les activités du site

## USAGE

Installer les modules définis dans `package.json` par `node package manager (npm)`

```node
npm install
```

Démarrer le projet en local

```node
npm start
```

Naviguer le navigateur vers <http://localhost:3000>. La page web s'actualise automatiquement si l'on change un des fichiers source.

## TECHNOLOGIES

- `html`, `css` et `bootstrap` pour créer un UI responsible
- `express` pour créer rapidement une infrastructure Web souple sous l'environment `node.js` et pour rendre dynamique les pages HTML.
- `api stripe` pour un service de paiement tiers

[![npm](https://img.shields.io/npm/v/npm)](https://npm.im/npm)

## A QUOI CE WEB RESSEMBLE ?

### :computer: "On the internet"

Le projet a été déployé sur `Heroku` et il se retrouve via le lien : <https://stormy-everglades-94002.herokuapp.com/>

### :clapper: Youtube

[![Demo projet sur ma chaîne youtube](https://img.youtube.com/vi/W6rSbMUcpHo/0.jpg)](https://youtu.be/W6rSbMUcpHo)

## LICENCE

![NPM](https://img.shields.io/npm/l/express)