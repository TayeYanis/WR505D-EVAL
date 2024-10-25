# Projet Vue.js - Gestion des Acteurs, Films et Catégories

## Description

Ce projet est une application web développée avec **Vue.js v2** qui permet de gérer une base de données d'acteurs, de films et de catégories associées. L'application fournit une interface pour effectuer des opérations de gestion, y compris la création, la lecture, la mise à jour et la suppression (CRUD). En plus de ces fonctionnalités de base, l'application propose également des options de recherche, de pagination et de filtrage, le tout en interagissant avec une API REST via **Axios**.

## Informations de connexion

Un utilisateur et un mot de passe sont présents dans le fichier `app fixtures`. Utilisez les identifiants suivants pour vous connecter :

- **Email** : user@gmail.com
- **Mot de passe** : password


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
   git clone https://github.com/TayeYanis/WR505D-EVAL.git

2. Naviguez dans le répertoire du projet :

  cd WR505D-EVAL
  cd wr505d-eval

3. Installez les dépendances :

  npm install

4. Récupérez le docker-compose.yml afin d'être sur de pouvoir démarer le projet Symfony :

  ```
  version: '3.8'
  services:
      web:
          image: mmi3docker/symfony-2024
          container_name : symfony-web
          hostname: symfony-web
          restart: always
          ports:
              - 8319:80
          depends_on:
              - db
  
          volumes:
              - ./www/:/var/www/
              - ./sites/:/etc/apache2/sites-enabled/
  
      db:
          image: mariadb:10.8
          container_name: symfony-db
          hostname: symfony-db
          restart: always
  
          volumes:
              - db-volume:/var/lib/mysql
  
          environment:
              MYSQL_ROOT_PASSWORD: PASSWORD
              MYSQL_DATABASE: symfony
              MYSQL_USER: symfony
              MYSQL_PASSWORD: PASSWORD
  
      phpmyadmin:
          image: phpmyadmin/phpmyadmin
          container_name: symfony-adminsql
          hostname: symfony-adminsql
          restart: always
          ports:
              - 8080:80
          environment:
              PMA_HOST: db
              MYSQL_ROOT_PASSWORD: PASSWORD
              MYSQL_USER: symfony
              MYSQL_PASSWORD: PASSWORD
              MYSQL_DATABASE: symfony    
              
      maildev:
          image: maildev/maildev
          container_name: symfony-mail
          hostname: symfony-mail
          command: bin/maildev --web 1080 --smtp 1025 --hide-extensions STARTTLS
          restart: always
     
          ports:
              - 1080:1080
  
  volumes:
      db-volume:
  
  ```

5. Démarrez le conteneur Docker :

Avant d'exécuter les commandes suivantes, assurez-vous que votre fichier docker-compose.yml est configuré comme décrit ci-dessus. Ensuite, démarrez votre conteneur Docker en utilisant :
```
docker-compose up -d
```

6. Accédez au terminal du conteneur Symfony :

Utilisez la commande suivante pour accéder au terminal de votre conteneur Symfony :
```
docker exec -ti symfony-web /bin/bash
```

7. Naviguez vers le répertoire du projet :
Dans le conteneur, allez dans le répertoire de votre projet :
```
cd /var/www/WR506D/wr506d
```

8. Chargez les fixtures dans la base de données :
Exécutez la commande suivante pour charger les fixtures dans la base de données (cela générera égalemment un utilisateur avec les données indiquer précédamment) :
```
php bin/console doctrine:fixtures:load
```

9. Personnalisez l'URL :
Assurez-vous que l'URL de votre projet est configurée comme suit : http://symfony.mmi-troyes.fr:8319/. Cela vous permettra d'accéder à l'application via votre navigateur.

## Utilisation

1. Connexion

- Ouvrez la page de connexion et entrez vos identifiants pour accéder à l'application.
- En cas de nouvel utilisateur, utilisez le formulaire d'inscription.

2. Gestion des Acteurs

- Naviguez vers la section des acteurs pour voir la liste complète des acteurs.
- Utilisez les fonctionnalités de recherche et de filtrage pour trouver des acteurs spécifiques.
- Cliquez sur "Ajouter un acteur" pour ouvrir le formulaire d'ajout.
- Pour chaque acteur, vous pouvez consulter ses détails, modifier ses informations ou le supprimer.

3. Gestion des Films

- Accédez à la section des films pour ajouter, modifier ou supprimer des films.
- Utilisez la fonction de recherche et de filtrage pour trouver des films facilement.
- Associez des films aux catégories existantes lors de leur ajout.

4. Gestion des Catégories

- Créez ou modifiez des catégories pour mieux organiser les films.
- Lors de l'ajout ou de la mise à jour d'un film, choisissez les catégories appropriées.

5. Détails de l'Acteur

- Cliquez sur un acteur pour afficher ses détails, y compris les films associés et les récompenses.

## Assertions (Validations)

L'application utilise des assertions pour garantir que les données saisies par les utilisateurs respectent certaines règles avant d'être stockées dans la base de données. Ces validations sont définies dans les entités de l'application Symfony. Voici les assertions mises en place pour les entités Acteur, Film et Catégorie :

- **Acteur :** 

Les validations pour l'entité Acteur sont définies dans le projet Symfony backend :
 - Nom et Prénom :
   - Doivent avoir entre 3 et 50 caractères.
 - Date de Naissance :
   - Doit être une date valide.
 - Récompenses :
   - Doit être un entier entre 0 et 10.
 - Biographie :
   - Doit être remplie et avoir entre 30 et 300 caractères.
- Nationalité :
  - Doit être un code ISO 3166-1 alpha-2 présent sur ce liens là, https://en.wikipedia.org/wiki/ISO_3166-1#Current_codes (ex: "FR" pour la France, "CN" pour la Chine).
- Média :
  - Doit être une URL valide.
- Genre :
  - Doit être soit "male" soit "female".
- Films Associés :
  - Possibilité d'associer plusieurs films à un acteur.

- **Film :** 

Les validations pour l'entité Film sont également définies dans le projet Symfony backend :
 - Titre :
   - Doit avoir entre 3 et 250 caractères.
 - Description :
   - Peut être vide mais doit être une chaîne valide.
 - Date de Sortie :
   - Doit être une date valide.
 - Durée :
   - Doit être un entier entre 50 et 200 minutes.
- Directeur :
  - Doit avoir entre 3 et 255 caractères.
- Évaluations :
  - Doit être un nombre entre 0 et 10.
- Catégories Associées :
  - Possibilité d'associer plusieurs catégories à un film.
- Acteurs Associés :
  - Possibilité d'associer plusieurs acteurss à un film.

- **Catégorie :** 

Les validations pour l'entité Catégorie proviennent également du projet Symfony backend :
 - Titre :
   - Doit avoir entre 3 et 150 caractères.
 - Films Associés :
   - Possibilité d'associer plusieurs films à une catégorie.

## API

L'application interagit avec une API REST pour effectuer les opérations suivantes :

- `GET /api/actors` : Récupérer la liste de tous les acteurs.
- `POST /api/actors` : Ajouter un nouvel acteur à la base de données.
- `GET /api/actors/{id}` : Récupérer les détails d'un acteur spécifique.
- `PATCH /api/actors/{id}` : Mettre à jour les informations d'un acteur existant.
- `DELETE /api/actors/{id}` : Supprimer un acteur de la base de données.

- `GET /api/movies` : Récupérer la liste de tous les films.
- `POST /api/movies` : Ajouter un nouveau film.
- `GET /api/movies/{id}` : Récupérer les détails d'un film spécifique.
- `PATCH /api/movies/{id}` : Mettre à jour les informations d'un film existant.
- `DELETE /api/movies/{id}` : Supprimer un film de la base de données.

- `GET /api/categories` : Récupérer la liste de toutes les catégories.
- `POST /api/categories` : Ajouter une nouvelle catégorie.
- `PATCH /api/categories/{id}` : Mettre à jour les informations d'une catégorie.
- `DELETE /api/categories/{id}` : Supprimer une catégorie.

## Gestion des Erreurs

L'application gère les erreurs lors des requêtes API. En cas d'erreur, un message d'erreur est affiché à l'utilisateur. Voici quelques erreurs courantes :

- **Erreur 400** : Requête mal formée, souvent liée à des données manquantes ou invalides.
- **Erreur 404** : Acteur ou film non trouvé lors de la récupération des détails.
- **Erreur 401** : Authentification requise pour accéder aux ressources.

## Remerciements

Professeurs référents :

- Minh Nhat THAI
- Romain Delon

## Auteurs

- **Yani Taye** - (https://github.com/TayeYanis)

Tous droits réservés © Yanis TAYE
