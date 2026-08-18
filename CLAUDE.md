# CLAUDE.md — Suivi du projet "Simulateur de déménagement"

> Ce fichier sert à suivre l'avancement du projet BTS et les concepts React/Git appris en cours de route.
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

| Côté        | Techno                                          |
| ----------- | ----------------------------------------------- |
| Front       | React.js (Vite)                                 |
| Back        | Node.js                                         |
| BDD         | MySQL / MariaDB                                 |
| Auth        | JWT ou OAuth2.0                                 |
| Lint        | ESLint (norme Airbnb) — en cours d'installation |
| Formatage   | Prettier — en cours d'installation              |
| Tests       | Vitest (tests unitaires)                        |
| Versionning | Git + GitHub                                    |

---

## ✅ Avancement général

| Module                   | Statut                                               |
| ------------------------ | ---------------------------------------------------- |
| Frontend                 | ✅ Terminé (accessibilité incluse)                   |
| Backend                  | 🟡 En cours (Étapes 1 à 3 faites)                    |
| Middleware               | ✅ `verifierToken` créé et testé                     |
| Base de données (schéma) | ✅ Créée (`schema.sql`, pool `db.js`)                |
| Documentation Swagger    | ⬜ Pas commencé                                      |
| ESLint + Prettier        | ✅ Installé et configuré (mergé dans `main`)         |
| Tests unitaires (Vitest) | ✅ Installé et configuré, `utils/calculs.js` couvert |
| Authentification         | ✅ JWT (register/login/middleware) fait et testé     |

---

## 📋 Conformité cahier des charges BTS

> ⚠️ Ces contraintes sont réparties entre 2 projets. Le 3e choix technique a été confirmé avec le référent.

| Exigence                                                         | Statut                     | Détail                                                                                                                   |
| ---------------------------------------------------------------- | -------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Environnement de dev + gestion de tests + framework + 2 langages | ✅ OK                      | VS Code + React = environnement/framework. **JavaScript + SQL** = les 2 langages. **Vitest** = outil de gestion de tests |
| Bibliothèque de composants logiciels                             | ✅ OK                      | `lucide-react` (icônes), `recharts` (graphiques)                                                                         |
| SGBD + langage associé                                           | ✅ OK                      | MySQL/MariaDB + SQL — schéma créé, pool de connexion `db.js`                                                             |
| Gestion de versions + suivi de problèmes                         | 🟡 Partiel                 | Git/GitHub ✅ — GitHub Issues à activer pour le suivi de problèmes                                                       |
| Solution pour tester comportements anormaux                      | ✅ OK                      | **Vitest** — ex : volume négatif, inventaire vide, distance négative testés dans `calculs.test.js`                       |
| 3 choix parmi 4 (client lourd / web / mobile / serveur)          | ✅ **Confirmé et complet** | 1. Web (React) — 2. Serveur (Node.js) — 3. Mobile (fait sur l'**autre projet**)                                          |
| Authentification                                                 | ✅ OK                      | JWT — register/login (bcrypt) + middleware `verifierToken`                                                               |
| Normes de code (ESLint Airbnb + Prettier)                        | ✅ OK                      | Voir section dédiée ci-dessous — mergé dans `main`                                                                       |

**Plus aucun point bloquant en attente côté répartition des projets.** ✅

---

## 🧹 ESLint + Prettier — mise en place

### C'est quoi, et pourquoi les deux ?

|              | Rôle                                                                                                            | Agit comment                                                           |
| ------------ | --------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **ESLint**   | Détecte les erreurs de **logique/qualité** (variable inutilisée, mauvaises pratiques, `==` au lieu de `===`...) | Affiche des **erreurs** dans le terminal → **à corriger manuellement** |
| **Prettier** | Reformate **automatiquement** la forme du code (espaces, guillemets, indentation...)                            | Corrige **silencieusement** à la sauvegarde, n'affiche jamais d'erreur |

> Prettier ne remplace pas ESLint : il ne corrige que la forme, jamais la logique. Après un passage de Prettier, ESLint peut très bien continuer à détecter des erreurs (imports inutilisés, hooks mal utilisés, etc.) — c'est normal, ce sont deux outils complémentaires.

`eslint-config-prettier` est installé en complément pour désactiver les règles de pure forme d'ESLint qui pourraient entrer en conflit avec Prettier (éviter qu'ils se contredisent).

### Premier test réalisé (avant Airbnb)

Avec la config ESLint par défaut de Vite (sans Airbnb), un test sur du code volontairement "sale" (`var`, `==`, guillemets doubles) n'a remonté **aucune erreur de style** — seulement 2 erreurs de logique détectées dans le vrai code du projet :

- `App.jsx` : `setProgression` assigné mais jamais utilisé
- `Navigation.jsx` : `import React` inutile (plus nécessaire avec les versions récentes de React)

→ Ces 2 erreurs réelles seront corrigées une fois Airbnb installé, en même temps que toutes les nouvelles erreurs de style qu'Airbnb va probablement détecter.

### Workflow d'installation (branche `config/eslint-prettier`)

- [x] Test ESLint réalisé (config par défaut, avant Airbnb)
- [x] Fichier de test supprimé
- [x] Branche `config/eslint-prettier` créée
- [x] Paquets installés : `eslint-config-airbnb`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- [x] `eslint.config.js` adapté pour intégrer Airbnb
- [x] `.prettierrc` créé
- [x] Toutes les erreurs corrigées (imports inutiles, `setProgression` non utilisé, style reformaté)
- [x] VS Code configuré pour formater avec Prettier à la sauvegarde
- [x] Commit + push + Pull Request + merge dans `main`

### Règle pour la suite du projet

> Une fois cette base installée, les **nouvelles erreurs ESLint détectées sur du code en cours d'écriture** (dans une feature) se corrigent **directement dans la branche de cette feature** — pas besoin de recréer une branche `config/...` dédiée. Une branche `config/...` n'est nécessaire que si on modifie la configuration ESLint/Prettier elle-même (nouvelle règle, mise à jour de version...).

---

## 📁 Structure actuelle du projet

```
simulateur-demenagement/
├── src/
│   ├── components/
│   │   ├── Navigation/
│   │   │   ├── Navigation.jsx        ✅ terminé
│   │   │   └── Navigation.css        ✅ terminé
│   │   ├── ProfilPanel/
│   │   │   ├── ProfilPanel.jsx       ✅ terminé
│   │   │   └── ProfilPanel.css       ✅ terminé
│   │   ├── Inventaire/
│   │   │   ├── Inventaire.jsx        ✅ terminé
│   │   │   ├── Inventaire.css        ✅ terminé
│   │   │   ├── PieceCard.jsx         ✅ sous-composant avec states locaux
│   │   │   └── listes.js             ✅ OBJETS_PREDEFINIS + OBJETS_A_EMBALLER
│   │   ├── Calculs/
│   │   │   ├── Calculs.jsx           ✅ terminé
│   │   │   └── Calculs.css           ✅ terminé
│   │   ├── Comparaison/
│   │   │   ├── Comparaison.jsx       ✅ terminé
│   │   │   └── Comparaison.css       ✅ terminé
│   │   └── Checklist/
│   │       ├── Checklist.jsx         ✅ terminé
│   │       └── Checklist.css         ✅ terminé
│   ├── App.jsx                        ✅ state pieces + profil remontés ici
│   ├── App.css                        🗑️ supprimé (était le CSS de démo Vite)
│   ├── index.css                      ✅ styles globaux + classes partagées
│   ├── utils/
│   │   └── calculs.js                ✅ fonctions de calcul partagées
│   └── main.jsx
├── CLAUDE.md                          ← ce fichier
```

---

## 🌳 Workflow Git adopté

### Règle générale

> `main` reste toujours stable. On ne code jamais directement dessus. Chaque changement (feature OU config) = une branche.

### Cycle complet

```bash
# 1. Repartir de main à jour
git checkout main
git pull

# 2. Créer une branche
git checkout -b feature/nom-de-la-feature
# ou
git checkout -b config/nom-de-la-config

# 3. Coder + commits réguliers (Conventional Commits)
git add .
git commit -m "feat: description précise"

# 4. Une fois COMPLET et TESTÉ → push
git push origin nom-de-la-branche

# 5. Créer une Pull Request sur GitHub (base: main ← compare: nom-de-la-branche)

# 6. Merger la PR sur GitHub

# 7. Revenir sur main et mettre à jour en local
git checkout main
git pull

# 8. Supprimer la branche locale (optionnel)
git branch -d nom-de-la-branche
```

### Convention de nommage des branches

| Préfixe       | Usage                                                                             |
| ------------- | --------------------------------------------------------------------------------- |
| `feature/...` | Nouvelle fonctionnalité — ex: `feature/navigation`                                |
| `fix/...`     | Correction de bug                                                                 |
| `config/...`  | Mise en place ou changement d'outils/configuration — ex: `config/eslint-prettier` |
| `backlog/...` | Amélioration ou ajout mineur issu du backlog — ex: `backlog/profil-inventaire`    |
| `docs/...`    | Documentation                                                                     |

### Convention des messages de commit (Conventional Commits)

| Préfixe     | Signification                           |
| ----------- | --------------------------------------- |
| `feat:`     | nouvelle fonctionnalité                 |
| `fix:`      | correction de bug                       |
| `style:`    | changement visuel, pas de logique       |
| `docs:`     | documentation                           |
| `refactor:` | réécriture sans changer le comportement |

### ⚠️ Points importants à retenir

- Les commits sur une branche `feature/...` ou `config/...` **ne comptent PAS** dans le graphique de contributions GitHub tant qu'ils ne sont pas mergés dans `main`. Normal, pas un bug.
- La Pull Request ne se fait **qu'une fois le travail entièrement terminé et testé**, pas après chaque petit commit.
- Chaque commit ne contient QUE le diff (les changements) depuis le commit précédent — pas une copie complète du projet à chaque fois.
- `CLAUDE.md` est **versionné dans Git** (pas dans `.gitignore`) — c'est de la documentation utile à l'historique du projet, pas une donnée sensible.

### Branches en cours

- `feature/routes-crud` → en cours

---

## 🗂️ Avancement détaillé — Frontend

### ✅ Étape 0 — Setup du projet

- [x] Projet créé avec `npm create vite@latest simulateur-demenagement -- --template react`
- [x] Dépendances installées : `recharts`, `lucide-react`
- [x] Serveur de dev fonctionnel (`npm run dev`)
- [x] Git initialisé + dépôt GitHub créé + premier push sur `main`

### ✅ Étape 1 — Premiers pas avec React

- [x] Composant `App.jsx` basique (un `<h1>`)
- [x] Compris : composant = fonction qui retourne du JSX
- [x] Compris : `useState` pour stocker une valeur qui change
- [x] Compris : `onClick` pour déclencher une fonction

### ✅ Étape 2 — CSS global

- [x] `index.css` : reset des marges (`* { margin: 0; padding: 0 }`)
- [x] Compris la différence `index.css` (global) vs CSS par composant
- [x] `App.css` supprimé (fichier de démo Vite, inutile)
- [x] Styles inline remplacés par des classes CSS dans `index.css`
- [x] Convention adoptée : un fichier CSS par composant dans son propre dossier (`Navigation/Navigation.css`)
- [x] Variables CSS harmonisées en anglais dans `theme.css` (branche `config/css-variables`)
- [x] `--font-weight-*` ajoutés dans `theme.css`, valeurs hardcodées remplacées dans tous les CSS

### ✅ Étape 3 — Header en composant séparé

- [x] Header intégré directement dans `App.jsx` (pas de fichier séparé)
- [x] Compris les **props** : `useState` pour `progression`
- [x] Header affiche : titre, progression, barre de progression (dégradé), boutons PDF/Réinitialiser (visuel statique, pas encore fonctionnel)
- [x] Barre de progression globale du header supprimée (inutile — la checklist a la sienne)
- [x] Améliorations CSS (icône calendrier sortie du cadre, padding date wrapper aligné sur `.input`, couleur icône)
- [x] Titre principal modifiable par l'utilisateur (input stylisé comme le h1, soulignement bleu au focus)

### ✅ Étape 4 — Navigation (TERMINÉE)

- [x] Fichier `Navigation.jsx` créé dans `components/Navigation/`
- [x] `Navigation.css` créé dans le même dossier, importé dans `Navigation.jsx`
- [x] 4 boutons : Inventaire / Calculs / Comparaison / Check-list
- [x] `useState` pour `ongletActif` dans `App.jsx` (valeur par défaut : `'inventaire'`)
- [x] Props `ongletActif` et `setOngletActif` passées à `<Navigation />`
- [x] Style dynamique : bouton actif en bleu via ternaire sur `className`
- [x] CSS amélioré : ombres, transitions fluides, dégradé sur la barre de progression
- [x] Push + Pull Request + Merge dans `main`

### ✅ Étape 4bis — Mise en place ESLint + Prettier (TERMINÉE)

- Voir section dédiée plus haut — tous les points cochés, mergé dans `main`

### ✅ Étape 5 — Système de "pages" (SPA)

- [x] Compris l'affichage conditionnel avec `&&`
- [x] Créé les 4 composants vides dans leurs dossiers
- [x] Affichage conditionnel dans `App.jsx` selon `ongletActif`

### ✅ Étape 6 — Panneau Profil (ProfilPanel.jsx)

- [x] Champs : type de déménagement, distance, étage, ascenseur, parking
- [x] State `profil` remonté dans `App.jsx` et passé en props
- [x] Mise en page grid : contenu principal à gauche, ProfilPanel fixe à droite
- [x] Icônes lucide-react intégrées dans les labels
- [x] Une seule fonction `handleChange` gère tous les types de champs
- [x] Champ nombre de personnes aidantes (déménagement solo) → impact sur le temps estimé (`calculerTemps`)

### ✅ Étape 7 — Onglet Inventaire (TERMINÉE)

- [x] Formulaire d'ajout de pièce avec input + bouton
- [x] Liste des pièces affichée avec `.map()` et `key`
- [x] Remise à zéro de l'input après ajout (`setValue('')`)
- [x] Liste des objets prédéfinis avec volumes dans un `<select>` + placeholder "Sélectionner un objet"
- [x] Champ quantité à côté du select
- [x] Ajout d'un objet dans une pièce → apparaît en dessous avec nom, quantité et volume
- [x] Bouton supprimer sur chaque objet (`.filter()`)
- [x] Bouton supprimer sur chaque pièce (`.filter()`)
- [x] Bouton "Ajouter" grisé tant qu'aucun objet n'est sélectionné (`disabled={!objetSelectionne}`)
- [x] State `pieces` remonté dans `App.jsx` — données persistantes au changement d'onglet
- [x] CSS : classe `.inv-input` partagée, grilles `inv-grid` et `inv-piece-add`, cartes pièces
- [x] Deuxième section par pièce : objets à emballer (petit/standard/grand/penderie) avec type de carton
- [x] Listes externalisées dans `listes.js` (`OBJETS_PREDEFINIS`, `OBJETS_A_EMBALLER`) — importées là où besoin
- [x] Extraction en sous-composant `PieceCard.jsx` avec states locaux → corrige le bug du compteur partagé entre pièces
- [x] Bug suppression doublons corrigé : chaque objet ajouté reçoit un `id: Date.now()` unique, utilisé comme `key` et dans `.filter()`
- [x] Plus de catégories d'objets (meubles, objets divers…)
- [x] **Barre de recherche** (branche `backlog/inventaire-ameliore`) — champ texte qui filtre la liste d'objets en temps réel au fur et à mesure que l'utilisateur tape
- [x] **"Autre objet"** — formulaire global (hors pièce) avec nom + hauteur × largeur × longueur (cm) → volume calculé automatiquement. L'objet est ajouté à `listeObjets` ou `listeEmballer` selon le type choisi (meuble ou objet à emballer + taille de carton). Ces listes sont des copies dynamiques de `OBJETS_PREDEFINIS` et `OBJETS_A_EMBALLER`.

### ✅ Étape 8 — Onglet Calculs (TERMINÉE)

- [x] Fonction de calcul du volume total (meubles + volume physique des cartons, marge 15% sur le camion)
- [x] Détermination taille camion selon seuils de volume
- [x] Nombre de personnes recommandées selon volume
- [x] Temps estimé : emballage + chargement + trajet, formaté en `Xh00`
- [x] Calcul du nombre de cartons par pièce et par type (petit/standard/grand) avec taux de remplissage 80%
- [x] Estimation du coût des cartons (1,50 €/unité)
- [x] CSS : grille de cartes colorées, section cartons avec total
- [x] Estimation budgétaire solo vs pro (location camion + carburant + cartons / prix au m³ pro)
- [x] Fonctions de calcul extraites dans `src/utils/calculs.js` et partagées avec App.jsx et Comparaison.jsx
- [x] Case à cocher "mélanger les cartons entre pièces" → affiche les cartons par taille uniquement, réduit le nombre total par meilleur remplissage
- [x] 3 formules de prix pro au choix : **Économique** (transport seul, 35–60 €/m³), **Standard** (démontage/montage inclus, 50–100 €/m³), **Tout compris** (emballage + installation, 60–160 €/m³)
- [x] Calcul de la distance par tranches (coût additif au coût volume) : 0–50 km → 2,50 €/km, 51–200 km → 2,00 €/km, 201–500 km → 1,70 €/km, > 500 km → 1,40 €/km
- [x] Majoration si parking non accessible : ×1.15 (même logique que l'étage sans ascenseur ×1.30)

### ✅ Étape 9 — Onglet Comparaison (TERMINÉE)

- [x] Graphique barres avec `recharts` (budget min/max solo vs pro)
- [x] Encart dynamique : économie / surcoût / équivalence avec icône `TrendingUp` / `TrendingDown` / `Scale`
- [x] Tableaux avantages/inconvénients avec icônes `Check` / `X` (lucide-react)
- [x] CSS : grille 2 colonnes, titres colorés par modificateur (`--blue` / `--green`)

### ✅ Étape 10 — Onglet Checklist (TERMINÉE)

- [x] Tâches prédéfinies avec dates calculées selon la date de déménagement
- [x] Cases à cocher avec animation, badges statut (urgent/retard) et badges type (Résiliation/Souscription/Démarche)
- [x] Formulaire d'ajout de tâches personnalisées fusionnées avec les prédéfinies, triées par date
- [x] Suppression des tâches (prédéfinies et personnalisées)
- [x] Barre de progression et décompte des tâches complétées
- [x] Date de déménagement dans le header (input date partagé via profil)

### ✅ Étape 11 — Tests unitaires (Vitest)

- [x] `npm install -D vitest` (avec `--legacy-peer-deps`, conflit préexistant entre ESLint 10 et `eslint-plugin-jsx-a11y`)
- [x] Tests sur les fonctions de calcul (cas normaux) : `calculerVolume`, `determinerCamion`, `determinerPersonne`, `calculerTemps`, `calculerCartons`, `calculerCartonsGlobal`, `calculerBudgetSolo`, `calculerBudgetPro`
- [x] Tests sur les comportements anormaux : volume négatif, inventaire vide, distance négative, majoration parking
- [x] Script `npm run test` ajouté dans `package.json`

### ✅ Étape 12 — Fonctionnalités transverses (`feature/transverses`)

> Sauvegarde persistante volontairement non faite en `localStorage` — déplacée vers la feuille de route Backend (ÉTAPE 7 : connexion frontend ↔ backend), pour ne pas faire un travail qui serait jeté une fois la vraie persistance en place.

- [x] Export PDF (jsPDF + jspdf-autotable) — couvre profil, résumé des calculs, inventaire par pièce, cartons, budget et checklist
- [x] Bouton Réinitialiser fonctionnel — remet `pieces`, `profil`, `titre`, `formule` et la checklist à leur valeur de départ
- [x] Confirmation de suppression — composant réutilisable `ConfirmModal`, branché sur la suppression de pièce/objet/tâche et sur le bouton Réinitialiser
- [x] Mode sombre — variables CSS redéfinies sous `[data-theme='dark']` dans `theme.css`, toggle soleil/lune dans le Header, state persisté en `localStorage`. Couleurs codées en dur remplacées par des variables (`calc-card--*`, `chk-card--late/urgent`) pour rester lisibles dans les deux thèmes.

### ✅ Étape 13 — Accessibilité (TERMINÉE)

- [x] Rendre le site accessible (aria-label, contrastes, navigation clavier, lecteurs d'écran)
- [x] `aria-label` sur les boutons icône-seule et les champs sans `<label>`
- [x] `.sr-only` pour le texte caché mais lisible (badges Checklist, résumé du graphique Comparaison)
- [x] `ConfirmModal` : sémantique de dialogue complète (`role="dialog"`, focus trap, fermeture Échap)
- [x] Recherche d'objets (`PieceCard`) : sélection utilisable au clavier, HTML valide
- [x] Régions de page : `header`/`nav`/`main`/`form`, `aria-current` sur l'onglet actif
- [x] `lang="fr"` sur `<html>`
- [x] Testé en conditions réelles avec Narrator et NVDA
- [x] Push + Pull Request + Merge dans `main`

---

## 🔧 Backend & Middleware — feuille de route

> Suivre les étapes dans l'ordre : chaque étape dépend de la précédente. À chaque étape, viser le fonctionnel avant le parfait, et tester avant de continuer.

### Contexte du projet

Backend d'une webapp de simulation de déménagement. Le frontend (React/Vite) est déjà construit et stocke actuellement les données en local (state React). Objectif du backend : persister les données par utilisateur, sécuriser l'accès, documenter l'API.

Stack imposée : Node.js + Express, MySQL/MariaDB, JWT, Swagger. Tests avec Vitest.

### Conventions à respecter

- Requêtes SQL préparées uniquement (paramètres `?`), jamais de concaténation directe → protection injection SQL.
- Mots de passe hachés avec bcrypt, jamais en clair.
- JWT contient uniquement `userId`, aucune donnée sensible.
- Secrets (identifiants BDD, clé JWT) dans `.env`, jamais dans le code.
- Chaque route protégée filtre les données par `req.userId` (jamais les données d'autres utilisateurs).
- Workflow Git : une branche par étape (`feature/...`), commits en Conventional Commits, PR avant merge dans `main`.

### ✅ ÉTAPE 1 — Setup serveur Node/Express (TERMINÉE)

**But** : socle fonctionnel sur lequel tout se construit.

- [x] Dossier `server/`, `npm init -y`
- [x] Installé : `express cors dotenv`, et en dev `nodemon`
- [x] `server.js` : app Express, `cors()`, `express.json()`, route de test `GET /api/test`
- [x] Script `"dev": "nodemon server.js"` dans package.json
- [x] Variables sensibles dans `.env`
- [x] Push + Pull Request + Merge dans `main`

Critère de réussite : `http://localhost:3000/api/test` renvoie un JSON de test. ✅

### ✅ ÉTAPE 2 — Base de données MySQL/MariaDB (TERMINÉE)

**But** : stockage permanent des données. Exigence cahier des charges (SGBD + SQL).

- [x] Base et tables créées (`server/database/schema.sql`)
- [x] `mysql2` installé, `db.js` avec un pool de connexion lisant les variables `.env`
- [x] Toutes les clés étrangères en `ON DELETE CASCADE`
- [x] Push + Pull Request + Merge dans `main`

Schéma des tables :

```sql
users (id, email UNIQUE, mot_de_passe [hash bcrypt], nom, date_creation)
demenagements (id, user_id FK, date_demenagement, type_profil, distance_km, etage, ascenseur, parking, date_creation)
pieces (id, demenagement_id FK, nom)
objets_inventaire (id, piece_id FK, nom, volume, quantite)
objets_personnels (id, user_id FK, nom, volume)
checklist_items (id, demenagement_id FK, titre, description, date_limite, type, complete)
```

Rappel : le catalogue des ~500 objets prédéfinis RESTE dans un fichier frontend (donnée de référence statique), il ne va PAS en BDD. Seules les données créées par l'utilisateur sont persistées.

Critère de réussite : une route de test lit la BDD sans erreur. ✅ (testée puis supprimée, comme convenu pour les routes jetables)

### ✅ ÉTAPE 3 — Authentification JWT (TERMINÉE)

**But** : sécuriser l'accès, chaque utilisateur ne voit que ses données. Exigence cahier des charges.

- [x] `bcrypt jsonwebtoken` installés
- [x] `POST /api/auth/register` : hache le mot de passe avec bcrypt, insère en BDD
- [x] `POST /api/auth/login` : récupère l'user par email, compare avec `bcrypt.compare()`, génère un JWT (`jwt.sign({ userId }, JWT_SECRET, { expiresIn: '24h' })`)
- [x] Middleware `verifierToken` (`server/middleware/verifierToken.js`) : lit le token dans `Authorization: Bearer ...`, le vérifie, met `req.userId`, appelle `next()` ; sinon 401
- [x] Push + Pull Request + Merge dans `main`

Regex mot de passe complexe (min 8 car, majuscule, minuscule, chiffre, spécial) — prévue, pas encore branchée sur `/register` :

```js
/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
```

Critère de réussite : inscription, connexion, réception d'un token, accès à une route protégée avec ce token. ✅ (testé avec Thunder Client)

### 🟡 ÉTAPE 4 — Routes API (CRUD) — en cours (`feature/routes-crud`)

**But** : cœur fonctionnel — créer/lire/modifier/supprimer les données utilisateur.

À faire, pour chaque ressource (`demenagements`, `pieces`, `objets_inventaire`, `objets_personnels`, `checklist_items`) :

```
GET    /api/<ressource>       → lire (filtré par req.userId)
GET    /api/<ressource>/:id   → lire un élément
POST   /api/<ressource>       → créer
PUT    /api/<ressource>/:id   → modifier
DELETE /api/<ressource>/:id   → supprimer
```

Règles :

- Toutes protégées par le middleware `verifierToken`
- Filtrer systématiquement par `req.userId`
- Requêtes préparées (paramètres `?`)
- try/catch avec code d'erreur approprié (400 données invalides, 401 non authentifié, 404 introuvable, 500 erreur serveur)

Critère de réussite : CRUD complet testable via Postman/Thunder Client.

### ⬜ ÉTAPE 5 — Middlewares transverses

**But** : robustesse et sécurité de l'API.

À faire :

- CORS (déjà en place étape 1) — restreindre au domaine du front en production
- Validation des données entrantes (manuelle ou `express-validator`) : renvoyer 400 si invalide
- Middleware de gestion d'erreurs centralisé en fin de chaîne (log + réponse propre, pas de crash)

Critère de réussite : des données invalides renvoient un message clair, pas un crash.

### ⬜ ÉTAPE 6 — Documentation Swagger

**But** : exigence cahier des charges. Page interactive documentant l'API.

À faire :

- Installer `swagger-ui-express swagger-jsdoc`
- Configurer Swagger dans `server.js`
- Documenter chaque route via commentaires `@swagger`
- Exposer sur `/api-docs`

Critère de réussite : `/api-docs` affiche et permet de tester toutes les routes.

### ⬜ ÉTAPE 7 — Connexion frontend ↔ backend

**But** : relier les deux mondes, remplacer le stockage local par la BDD.

À faire :

- Remplacer les `useState` de données par des appels `fetch` à l'API
- Stocker le token JWT côté front après login, l'envoyer dans le header `Authorization` des requêtes protégées
- Gérer états de chargement et erreurs
- Le catalogue d'objets reste dans le fichier front (ne passe pas par l'API)

Critère de réussite : créer un déménagement, rafraîchir la page, il est toujours là.

### ⬜ ÉTAPE 8 — Tests unitaires (Vitest)

**But** : exigence cahier des charges ("tester les comportements anormaux").

À faire :

- Installer `vitest` (dev)
- Tester en priorité les fonctions de calcul (volume, cartons, budget) — elles sont pures, faciles à tester
- Se concentrer sur les cas anormaux : inventaire vide, valeurs négatives, données manquantes
- Ne pas viser 100% de couverture : une dizaine de tests pertinents suffit

Critère de réussite : `npm run test` tout en vert.

### Ordre & dépendances

```
1 Serveur → 2 BDD → 3 Auth → 4 CRUD → 5 Middlewares → 6 Swagger → 7 Connexion front-back
8 Tests : en parallèle dès que des fonctions existent
```

Tester chaque étape (Postman/Thunder Client pour les routes) avant de passer à la suivante.

---

## 🗄️ Schéma de base de données (réflexion)

> Pas encore créé en SQL, juste la réflexion des tables nécessaires.

```
users
- id, email, mot_de_passe (hashé), nom, date_creation

demenagements
- id, user_id (FK), date_demenagement, type_profil,
  distance_km, etage, ascenseur, parking, date_creation

pieces
- id, demenagement_id (FK), nom

objets_inventaire
- id, piece_id (FK), nom, volume, quantite

objets_predefinis (catalogue fixe)
- id, nom, categorie, volume_standard

checklist_items
- id, demenagement_id (FK), titre, description,
  date_limite, type, complete
```

Relations :

```
users (1) ──→ (N) demenagements
demenagements (1) ──→ (N) pieces
pieces (1) ──→ (N) objets_inventaire
demenagements (1) ──→ (N) checklist_items
```

**Prochaine étape BDD :** dessiner un vrai MCD/MLD une fois le frontend des onglets Inventaire/Calculs terminé.

---

## 📚 Concepts React appris (glossaire perso)

| Concept                       | Explication courte                                                                                                                                             |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Composant**                 | Fonction JS qui retourne du JSX (= du HTML dans le JS)                                                                                                         |
| **JSX**                       | Syntaxe qui mélange HTML et JavaScript                                                                                                                         |
| **useState**                  | Hook pour mémoriser une valeur qui peut changer (`const [val, setVal] = useState(initial)`)                                                                    |
| **Props**                     | Paramètres passés d'un composant parent à un composant enfant                                                                                                  |
| **SPA**                       | Single Page Application — une seule page HTML, React simule les changements de page                                                                            |
| **Rendu conditionnel**        | Afficher un composant ou un autre selon une condition (`if`, ternaire, etc.)                                                                                   |
| **.map()**                    | Transformer un tableau de données en une liste de composants JSX                                                                                               |
| **className dynamique**       | Choisir une classe CSS selon une condition avec un ternaire : `className={condition ? 'classe-a' : 'classe-b'}`                                                |
| **CSS par composant**         | Chaque composant a son propre fichier `.css` dans son dossier, importé directement dans le `.jsx`                                                              |
| **Extraction sous-composant** | Déplacer du JSX répété dans un composant enfant avec ses propres `useState` — évite le state partagé dans `.map()`                                             |
| **Constante de module**       | `const` déclarée en dehors du composant (au niveau du fichier) — partageable entre plusieurs fonctions, recréée à chaque rendu si elle était dans le composant |

## 📚 Méthodes JavaScript utilisées

| Méthode                        | Ce qu'elle fait                                                                                             |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------- |
| **.map()**                     | Parcourt un tableau et retourne un nouveau tableau transformé — en React : transforme des données en JSX    |
| **.filter()**                  | Parcourt un tableau et retourne un nouveau tableau avec seulement les éléments qui passent la condition     |
| **.reduce()**                  | Parcourt un tableau et accumule un résultat unique (ex : somme des volumes)                                 |
| **spread `...`**               | Copie tous les éléments d'un tableau ou d'un objet : `[...pieces, nouvelle]` ajoute sans écraser            |
| **`e.preventDefault()`**       | Empêche le comportement par défaut du navigateur (ex: rechargement de page à la soumission d'un formulaire) |
| **`Date.now()`**               | Retourne le timestamp actuel en ms — utilisé pour générer un id unique à chaque ajout                       |
| **déstructuration `{}`**       | Extrait des propriétés d'un objet : `const { name, value } = e.target`                                      |
| **ternaire `? :`**             | Condition en une ligne : `condition ? valeurSiVrai : valeurSiFaux`                                          |
| **`&&` conditionnel**          | Affiche quelque chose seulement si la condition est vraie : `{condition && <Composant />}`                  |
| **`Math.ceil()`**              | Arrondit vers le haut — ex : nombre de cartons nécessaires (on ne peut pas avoir un demi-carton)            |
| **`Math.floor()`**             | Arrondit vers le bas — ex : partie entière des heures dans un temps formaté                                 |
| **`Math.round()`**             | Arrondit au plus proche — ex : minutes dans un temps formaté                                                |
| **`.padStart(n, '0')`**        | Complète une chaîne à gauche jusqu'à n caractères : `'5'` → `'05'` (pour afficher `1h05` et non `1h5`)      |
| **`String()`**                 | Convertit une valeur en chaîne de caractères — nécessaire avant `.padStart()` qui n'existe que sur string   |
| **Arrow fn dans une variable** | `const fn = (param) => { ... }` — permet de déclarer une fonction locale à l'intérieur d'une autre fonction |

## 📚 Concepts Git appris (glossaire perso)

| Concept                  | Explication courte                                                                    |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **git init**             | Démarre le suivi Git dans un dossier                                                  |
| **git remote**           | Adresse du dépôt distant (ex: GitHub) où envoyer les commits                          |
| **git commit**           | Sauvegarde un instantané (diff) des changements depuis le dernier commit              |
| **git push**             | Envoie les commits locaux vers le dépôt distant                                       |
| **branche**              | Une ligne de développement indépendante de `main`                                     |
| **Pull Request (PR)**    | Demande de fusionner une branche dans `main`, avec relecture du diff avant validation |
| **Conventional Commits** | Convention de message de commit (`feat:`, `fix:`, `style:`, `docs:`)                  |

## 📚 Concepts qualité de code appris (glossaire perso)

| Concept                    | Explication courte                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Linter (ESLint)**        | Analyse le code et signale les erreurs de logique/qualité (variable inutilisée, mauvaise pratique...) — à corriger manuellement |
| **Norme Airbnb**           | Ensemble de règles de bonnes pratiques JS/React qu'ESLint applique                                                              |
| **Prettier**               | Reformate automatiquement le style du code (espaces, guillemets...) à la sauvegarde, sans afficher d'erreur                     |
| **eslint-config-prettier** | Désactive les règles de forme d'ESLint qui entreraient en conflit avec Prettier                                                 |

---

## 📝 Notes / questions en attente

- Aucune en attente actuellement — tous les points de conformité au cahier des charges sont clarifiés.

---

## 📦 Références tarifaires (sources 2026)

### Déménagement professionnel — prix au m³

- Fourchette : **30 à 90 €/m³** selon volume, distance et services inclus
- Formule retenue : `proMin = volume * 35` / `proMax = volume * 90`
- Ajustement distance : > 100 km → ×1.5 / > 300 km → ×2
- Ajustement étage sans ascenseur : ×1.30 (+25 à 35%)

### Déménagement solo — location camion

- Camionnette (~10m³) : 70–170 €/jour
- Camion 20m³ : 120–200 €/jour
- Camion 30m³ : 150–250 €/jour
- Carburant estimé : distance × 0.55 + 25 € (péages inclus, base 15L/100km à 1.8€/L, aller-retour)
