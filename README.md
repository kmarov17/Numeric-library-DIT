# 📚 Bibliothèque Numérique – Projet DevOps
## 🚀 Présentation
Ce projet a été réalisé dans le cadre du Master 1 Intelligence Artificielle – Dakar Institute of Technology.
Il s’agit d’une application web moderne permettant de gérer une bibliothèque académique grâce à une architecture microservices.
L’application intègre :
- Un backend FastAPI pour les microservices (Livres, Utilisateurs, Emprunts)
- Un frontend React pour l’interface utilisateur
- Une base de données PostgreSQL 15 pour la persistance des données
- Une pipeline CI/CD avec Jenkins pour l’automatisation du déploiement
- Une conteneurisation avec Docker et orchestration via Docker Compose

## 🏗️ Architecture
- Frontend : React (interface web moderne et responsive)
- Backend : FastAPI (microservices REST)
- Base de données : PostgreSQL 15
- Conteneurisation : Docker + Docker Compose
- CI/CD : Jenkins (pipeline automatisé)

## ⚙️ Fonctionnalités
### 📖 Livres
- Ajouter, modifier, supprimer, rechercher et lister les livres
### 👤 Utilisateurs
- Création et gestion des profils (Étudiant, Professeur, Personnel administratif)
- Consultation du profil utilisateur
### 📅 Emprunts
- Emprunter et retourner un livre
- Historique des emprunts
- Détection des retards

## 🐳 Installation et lancement avec Docker Compose
### 1. Cloner le projet
```bash
git clone https://github.com/dit/library-microservices.git
cd library-microservices
```

### 2. Construire et lancer les conteneurs
```bash
docker-compose up --build -d
```

### 3. Accéder à l’application
- Frontend React : `http://localhost:80` 
- Backend FastAPI : `http://localhost:8000/docs` 
- Base PostgreSQL : port 5432

### 🔄 Pipeline CI/CD avec Jenkins
Le pipeline est défini dans le fichier Jenkinsfile et comprend :
- Récupération du code depuis GitHub
- Build du backend FastAPI et du frontend React
- Exécution des tests unitaires et d’intégration
- Construction des images Docker
- Déploiement automatique via Docker Compose

## 📂 Structure du projet
```
library-microservices/
│── backend/          # Microservices FastAPI
│   ├── Dockerfile
│   └── ...
│── frontend/         # Interface React
│   ├── Dockerfile
│   └── ...
│── docker-compose.yml
│── Jenkinsfile
│── README.md
```


✅ Conclusion

Ce projet démontre la mise en œuvre des pratiques DevOps dans un contexte académique :
- Modularité grâce aux microservices
- Automatisation avec Jenkins
- Portabilité via Docker
- Fiabilité grâce aux tests et au CI/CD
