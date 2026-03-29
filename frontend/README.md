# DIT Library Frontend

Frontend React de l'application de gestion de bibliothèque du `Dakar Institute of Technology (DIT)`.

Cette interface consomme le backend `FastAPI` du projet pour gérer :
- les livres
- les utilisateurs
- les emprunts
- les retours
- l'affichage du profil connecté
- les indicateurs de suivi du catalogue et des retards

## Fonctionnalités développées

### Authentification
- landing page avec présentation de l'application
- formulaire de connexion
- gestion du token d'accès
- restauration de session au rechargement
- déconnexion

### Livres
- affichage paginé du catalogue
- recherche
- aperçu détaillé d'un livre
- ajout, modification et suppression pour l'administration
- affichage adapté selon le rôle connecté

### Utilisateurs
- affichage de la liste des utilisateurs pour l'administration
- création et modification d'utilisateurs
- formulaire aligné sur les types backend :
  - `ETUDIANT`
  - `PROFESSEUR`
  - `PERSONNEL ADMINISTRATIF`
- affichage conditionnel de la filière pour `ETUDIANT` et `PROFESSEUR`
- pour les non-admins : affichage d'une seule carte `Mon profil`

### Emprunts
- affichage paginé des emprunts
- création d'un emprunt
- enregistrement du retour d'un livre
- calcul visuel des retards

### Expérience utilisateur
- mode sombre / mode clair
- interface responsive
- messages d'erreur et de succès
- limitation à `10` éléments par page côté frontend

## Lancement avec Docker

Depuis le dossier `frontend/` :

```bash
docker build -t dit-library-front .
docker run --rm -p 3000:3000 dit-library-front
```

Application disponible sur :

```text
http://localhost:3000
```

## Démarrage du backend

Le frontend attend le backend sur `http://localhost:8000/api`.
Si le backend a bien été initialisé :

```text
email: admin@gmail.com
mot de passe: password
```

## Remarques

- certaines actions sont limitées par les permissions backend
- les profils `ETUDIANT` et `PROFESSEUR` ont une interface plus restreinte que `PERSONNEL ADMINISTRATIF`
- la création de comptes se fait côté administration, pas depuis la landing page
