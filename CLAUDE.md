# CLAUDE.md — Suivi du projet "Simulateur de déménagement"

> Ce fichier sert à suivre l'avancement du projet BTS et les concepts React appris en cours de route.
> À mettre à jour à chaque étape terminée.

---

## 🎯 Objectif du projet

Webapp de simulation de déménagement (React / Node.js / MySQL) avec :
- Inventaire intelligent par pièce
- Calculs automatisés (volume, camion, cartons, budget, temps)
- Comparateur solo vs professionnel
- Checklist administrative personnalisée
- Gestion de projet + export PDF

---

## 🧱 Stack technique

| Côté | Techno |
|---|---|
| Front | React.js (Vite) |
| Back | Node.js |
| BDD | MySQL / MariaDB |
| Auth | JWT ou OAuth2.0 |
| Lint | ESLint (norme Airbnb) + Prettier |
| Doc API | Swagger |

---

## ✅ Avancement général

| Module | Statut |
|---|---|
| Frontend | 🟡 En cours |
| Backend | ⬜ Pas commencé |
| Middleware | ⬜ Pas commencé |
| Documentation Swagger | ⬜ Pas commencé |
| Tests unitaires | ⬜ Pas commencé |

---

## 📁 Structure actuelle du projet

```
simulateur-demenagement/
├── src/
│   ├── components/
│   │   ├── Header.jsx        ✅ créé
│   │   └── Navigation.jsx    🟡 en cours (étape 1/2 : composant vide créé)
│   ├── App.jsx                ✅ utilise Header + Navigation
│   ├── App.css                ⬜ vidé, non utilisé pour l'instant
│   ├── index.css              ✅ reset CSS global
│   └── main.jsx
├── CLAUDE.md                  ← ce fichier
```

---

## 🗂️ Avancement détaillé — Frontend

### ✅ Étape 0 — Setup du projet
- [x] Projet créé avec `npm create vite@latest simulateur-demenagement -- --template react`
- [x] Dépendances installées : `recharts`, `lucide-react`
- [x] Serveur de dev fonctionnel (`npm run dev`)

### ✅ Étape 1 — Premiers pas avec React
- [x] Composant `App.jsx` basique (un `<h1>`)
- [x] Compris : composant = fonction qui retourne du JSX
- [x] Compris : `useState` pour stocker une valeur qui change
- [x] Compris : `onClick` pour déclencher une fonction

### ✅ Étape 2 — CSS global
- [x] `index.css` : reset des marges (`* { margin: 0; padding: 0 }`)
- [x] Compris la différence `index.css` (global) vs `App.css` (par composant, non utilisé ici)
- [x] Décision : tous les styles en `style={{ }}` inline pour rester simple

### ✅ Étape 3 — Header en composant séparé
- [x] Créé `src/components/Header.jsx`
- [x] Compris les **props** : `App.jsx` passe `progression` à `<Header progression={progression} />`
- [x] Header reçoit la prop via `function Header({ progression })`
- [x] Header affiche : titre, progression, barre de progression, boutons PDF/Réinitialiser (visuel statique pour l'instant, pas encore fonctionnel)

### 🟡 Étape 4 — Navigation (EN COURS)
- [x] Fichier `Navigation.jsx` créé avec contenu minimal de test
- [x] Importé et affiché dans `App.jsx`
- [ ] Ajouter les 4 vrais boutons (Inventaire / Calculs / Comparaison / Check-list)
- [ ] Gérer quel onglet est actif avec `useState` dans `App.jsx`
- [ ] Passer `ongletActif` et `setOngletActif` en props à `Navigation`
- [ ] Style dynamique : bouton actif en bleu, les autres transparents

### ⬜ Étape 5 — Système de "pages" (SPA)
- [ ] Comprendre l'affichage conditionnel selon `ongletActif`
- [ ] Créer les composants vides : `Inventaire.jsx`, `Calculs.jsx`, `Comparaison.jsx`, `Checklist.jsx`
- [ ] Afficher le bon composant selon l'onglet sélectionné

### ⬜ Étape 6 — Panneau Profil (ProfilPanel.jsx)
- [ ] Champs : type de profil, distance, étage, ascenseur, parking
- [ ] State partagé entre tous les onglets (remonté dans `App.jsx`)

### ⬜ Étape 7 — Onglet Inventaire
- [ ] Formulaire d'ajout de pièce
- [ ] Liste des pièces ajoutées (`.map()`)
- [ ] Objets prédéfinis par pièce avec volumes
- [ ] Ajout/suppression d'objets

### ⬜ Étape 8 — Onglet Calculs
- [ ] Fonction de calcul du volume total
- [ ] Détermination taille camion / nb personnes / temps
- [ ] Estimation budgétaire solo vs pro

### ⬜ Étape 9 — Onglet Comparaison
- [ ] Graphique avec `recharts`
- [ ] Tableaux avantages/inconvénients

### ⬜ Étape 10 — Onglet Checklist
- [ ] Liste de tâches avec checkbox
- [ ] Génération selon profil utilisateur
- [ ] Calcul progression globale

### ⬜ Étape 11 — Fonctionnalités transverses
- [ ] Export PDF
- [ ] Bouton Réinitialiser fonctionnel
- [ ] Sauvegarde (localStorage ou backend)

---

## 📚 Concepts React appris (glossaire perso)

| Concept | Explication courte |
|---|---|
| **Composant** | Fonction JS qui retourne du JSX (= du HTML dans le JS) |
| **JSX** | Syntaxe qui mélange HTML et JavaScript |
| **useState** | Hook pour mémoriser une valeur qui peut changer (`const [val, setVal] = useState(initial)`) |
| **Props** | Paramètres passés d'un composant parent à un composant enfant |
| **SPA** | Single Page Application — une seule page HTML, React simule les changements de page |
| **Rendu conditionnel** | Afficher un composant ou un autre selon une condition (`if`, ternaire, etc.) |
| **.map()** | Transformer un tableau de données en une liste de composants JSX |

---

## 🔜 Prochaine étape immédiate

👉 Ajouter les 4 vrais boutons dans `Navigation.jsx` + connecter le `useState` de l'onglet actif depuis `App.jsx`.

---

## 📝 Notes / questions en attente

- (à compléter si des points restent flous)