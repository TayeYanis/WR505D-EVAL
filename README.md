# Projet Vue.js - Gestion des Acteurs, Films et Catégories

## Description

Ce projet est une application web développée avec **Vue.js v2** qui permet de gérer une base de données d'acteurs, de films et de catégories associées. L'application fournit une interface pour effectuer des opérations de gestion, y compris la création, la lecture, la mise à jour et la suppression (CRUD). En plus de ces fonctionnalités de base, l'application propose également des options de recherche, de pagination et de filtrage, le tout en interagissant avec une API REST via **Axios**.

## Fonctionnalités

### Gestion des Acteurs, Films et Catégories

- **Ajout d'acteurs :** 
  - Formulaire d'ajout avec des champs obligatoires : prénom, nom, nationalité, date de naissance, récompenses, biographie, date de décès (facultatif), image de profil, genre, et films associés.
  
- **Mise à jour d'acteurs :** 
  - Interface permettant de modifier les informations des acteurs existants. Les changements sont enregistrés via une requête PATCH à l'API.

- **Suppression d'acteurs :** 
  - Option pour supprimer un acteur avec confirmation pour éviter les suppressions accidentelles.

- **Ajout de films :**
  - Formulaire pour ajouter de nouveaux films avec des champs tels que le titre, la date de sortie, la durée, et la catégorie.

- **Mise à jour de films :**
  - Permet de modifier les détails des films existants.

- **Suppression de films :**
  - Option pour supprimer un film avec confirmation.

- **Ajout de categories :**
  - Formulaire pour ajouter de nouvelles categories avec un champ titre.

- **Mise à jour de categories :**
  - Permet de modifier le champ titre des categories existants.

- **Suppression de categories :**
  - Option pour supprimer une categories avec confirmation.


- **Association acteurs/films/catégories :**
  - Lors de l'ajout ou de la modification d'un film, possibilité de choisir une ou plusieurs catégories ainsi que un où un plusieurs acteurs.

### Recherche et Filtrage

- **Recherche d'acteurs :** 
  - Champ de recherche pour rechercher les acteurs par nom et/où prénom .

- **Recherche de films :**
  - Fonctionnalité de recherche pour trouver des films par titre.

- **Filtrage :** 
  - Filtrage par date de sortie d'un film et par id d'un acteur pour faciliter la recherche d'acteurs et de films spécifiques.

### Pagination

- **Navigation par pagination :** 
  - Affichage des résultats par page pour une meilleure lisibilité, avec des options pour changer le nombre d'acteurs et de films affichés par page,.

### Authentification

- **Gestion de la session :** 
  - Utilisation de **JSON Web Tokens (JWT)** pour sécuriser l'accès à l'application. Les utilisateurs doivent se connecter pour accéder aux fonctionnalités de gestion.

## Technologies utilisées

- **Vue.js v2 :** Framework JavaScript progressif pour la construction d'interfaces utilisateur réactives.
- **Vue Router :** Bibliothèque pour la gestion des routes de l'application, permettant une navigation fluide entre les composants.
- **Axios :** Client HTTP basé sur les promesses, utilisé pour effectuer des requêtes API de manière simple et efficace.
- **HTML/CSS :** Langages de balisage et de style pour structurer et styliser l'application.

## Installation

### Prérequis

- Node.js (version 14 ou supérieure)
- npm (version 6 ou supérieure)

### Étapes d'installation

1. Clonez le dépôt sur votre machine locale :

   ```bash
   git clone https://github.com/username/repo-name.git

2. Naviguez dans le répertoire du projet :

  cd repo-name

3. Installez les dépendances :

  npm install

4. Lancez l'application :

  npm run de 

5. Ouvrez votre navigateur et allez au http  indiquer pour voir l'application en action
