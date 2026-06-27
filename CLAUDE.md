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

| Côté | Techno |
|---|---|
| Front | React.js (Vite) |
| Back | Node.js |
| BDD | MySQL / MariaDB |
| Auth | JWT ou OAuth2.0 |
| Lint | ESLint (norme Airbnb) — en cours d'installation |
| Formatage | Prettier — en cours d'installation |
| Tests | Vitest (tests unitaires) |
| Versionning | Git + GitHub |

---

## ✅ Avancement général

| Module | Statut |
|---|---|
| Frontend | 🟡 En cours |
| Backend | ⬜ Pas commencé |
| Middleware | ⬜ Pas commencé |
| Base de données (schéma) | 🟡 Réfléchi, pas encore créé |
| Documentation Swagger | ⬜ Pas commencé |
| ESLint + Prettier | 🟡 En cours d'installation (branche `config/eslint-prettier`) |
| Tests unitaires (Vitest) | ⬜ Pas commencé — prévu une fois Calculs.jsx codé |
| Authentification | ⬜ Pas commencé |

---

## 📋 Conformité cahier des charges BTS

> ⚠️ Ces contraintes sont réparties entre 2 projets. Le 3e choix technique a été confirmé avec le référent.

| Exigence | Statut | Détail |
|---|---|---|
| Environnement de dev + gestion de tests + framework + 2 langages | ✅ OK | VS Code + React = environnement/framework. **JavaScript + SQL** = les 2 langages. **Vitest** = outil de gestion de tests |
| Bibliothèque de composants logiciels | ✅ OK | `lucide-react` (icônes), `recharts` (graphiques) |
| SGBD + langage associé | ⬜ À faire | MySQL/MariaDB + SQL — confirmé comme 2e langage du projet |
| Gestion de versions + suivi de problèmes | 🟡 Partiel | Git/GitHub ✅ — GitHub Issues à activer pour le suivi de problèmes |
| Solution pour tester comportements anormaux | ⬜ À faire | **Confirmé : Vitest** (tests unitaires) — ex : volume négatif, inventaire vide, distance invalide |
| 3 choix parmi 4 (client lourd / web / mobile / serveur) | ✅ **Confirmé et complet** | 1. Web (React) — 2. Serveur (Node.js) — 3. Mobile (fait sur l'**autre projet**) |
| Authentification | ⬜ Prévu, pas codé | JWT ou OAuth2.0 |
| Normes de code (ESLint Airbnb + Prettier) | 🟡 En cours | Voir section dédiée ci-dessous |

**Plus aucun point bloquant en attente côté répartition des projets.** ✅

---

## 🧹 ESLint + Prettier — mise en place

### C'est quoi, et pourquoi les deux ?

| | Rôle | Agit comment |
|---|---|---|
| **ESLint** | Détecte les erreurs de **logique/qualité** (variable inutilisée, mauvaises pratiques, `==` au lieu de `===`...) | Affiche des **erreurs** dans le terminal → **à corriger manuellement** |
| **Prettier** | Reformate **automatiquement** la forme du code (espaces, guillemets, indentation...) | Corrige **silencieusement** à la sauvegarde, n'affiche jamais d'erreur |

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
- [ ] Branche `config/eslint-prettier` créée
- [ ] Paquets installés : `eslint-config-airbnb`, `eslint-config-airbnb-base`, `eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `prettier`, `eslint-config-prettier`, `eslint-plugin-prettier`
- [ ] `eslint.config.js` adapté pour intégrer Airbnb
- [ ] `.prettierrc` créé
- [ ] `.prettierignore` créé
- [ ] `npx eslint src` relancé → liste des erreurs à corriger
- [ ] Toutes les erreurs corrigées (y compris les 2 déjà identifiées)
- [ ] VS Code configuré pour formater avec Prettier à la sauvegarde
- [ ] Commit + push + Pull Request + merge dans `main`

### Règle pour la suite du projet
> Une fois cette base installée, les **nouvelles erreurs ESLint détectées sur du code en cours d'écriture** (dans une feature) se corrigent **directement dans la branche de cette feature** — pas besoin de recréer une branche `config/...` dédiée. Une branche `config/...` n'est nécessaire que si on modifie la configuration ESLint/Prettier elle-même (nouvelle règle, mise à jour de version...).

---

## 📁 Structure actuelle du projet

```
simulateur-demenagement/
├── src/
│   ├── components/
│   │   └── Navigation/
│   │       ├── Navigation.jsx        ✅ terminé
│   │       └── Navigation.css        ✅ terminé
│   ├── App.jsx                        ✅ utilise Navigation + header intégré
│   ├── App.css                        🗑️ supprimé (était le CSS de démo Vite)
│   ├── index.css                      ✅ styles globaux + composants header
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
| Préfixe | Usage |
|---|---|
| `feature/...` | Nouvelle fonctionnalité — ex: `feature/navigation` |
| `fix/...` | Correction de bug |
| `config/...` | Mise en place ou changement d'outils/configuration — ex: `config/eslint-prettier` |
| `docs/...` | Documentation |

### Convention des messages de commit (Conventional Commits)
| Préfixe | Signification |
|---|---|
| `feat:` | nouvelle fonctionnalité |
| `fix:` | correction de bug |
| `style:` | changement visuel, pas de logique |
| `docs:` | documentation |
| `refactor:` | réécriture sans changer le comportement |

### ⚠️ Pourquoi une branche même pour une "simple installation"
Une install (ESLint/Prettier) peut reformater plein de fichiers ou révéler des erreurs en cascade → le projet est dans un état instable pendant qu'on corrige. La branche permet de revenir à un `main` stable instantanément (`git checkout main`) si besoin, sans avoir à annuler les changements à la main.

### ⚠️ Points importants à retenir
- Les commits sur une branche `feature/...` ou `config/...` **ne comptent PAS** dans le graphique de contributions GitHub tant qu'ils ne sont pas mergés dans `main`. Normal, pas un bug.
- La Pull Request ne se fait **qu'une fois le travail entièrement terminé et testé**, pas après chaque petit commit.
- Chaque commit ne contient QUE le diff (les changements) depuis le commit précédent — pas une copie complète du projet à chaque fois.
- `CLAUDE.md` est **versionné dans Git** (pas dans `.gitignore`) — c'est de la documentation utile à l'historique du projet, pas une donnée sensible.

### Branches en cours
- `feature/navigation` → 3 commits, pas encore mergée (en attente de finir les 4 boutons + useState onglet actif)
- `config/eslint-prettier` → en cours de création (installation ESLint Airbnb + Prettier)

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

### ✅ Étape 3 — Header en composant séparé
- [x] Header intégré directement dans `App.jsx` (pas de fichier séparé)
- [x] Compris les **props** : `useState` pour `progression`
- [x] Header affiche : titre, progression, barre de progression (dégradé), boutons PDF/Réinitialiser (visuel statique, pas encore fonctionnel)

### 🟡 Étape 4 — Navigation (EN COURS)
- [x] Fichier `Navigation.jsx` créé dans `components/Navigation/`
- [x] `Navigation.css` créé dans le même dossier, importé dans `Navigation.jsx`
- [x] 4 boutons : Inventaire / Calculs / Comparaison / Check-list
- [x] `useState` pour `ongletActif` dans `App.jsx` (valeur par défaut : `'inventaire'`)
- [x] Props `ongletActif` et `setOngletActif` passées à `<Navigation />`
- [x] Style dynamique : bouton actif en bleu via ternaire sur `className`
- [x] CSS amélioré : ombres, transitions fluides, dégradé sur la barre de progression
- [ ] Push + Pull Request + Merge dans `main`

### 🟡 Étape 4bis — Mise en place ESLint + Prettier (branche config/eslint-prettier)
- Voir section dédiée plus haut

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
- [ ] **→ Une fois fait : mettre en place Vitest et écrire les premiers tests unitaires**

### ⬜ Étape 9 — Onglet Comparaison
- [ ] Graphique avec `recharts`
- [ ] Tableaux avantages/inconvénients

### ⬜ Étape 10 — Onglet Checklist
- [ ] Liste de tâches avec checkbox
- [ ] Génération selon profil utilisateur
- [ ] Calcul progression globale

### ⬜ Étape 11 — Tests unitaires (Vitest)
- [ ] `npm install -D vitest`
- [ ] Tests sur les fonctions de calcul (cas normaux)
- [ ] Tests sur les comportements anormaux : volume négatif, inventaire vide, distance invalide, etc.

### ⬜ Étape 12 — Fonctionnalités transverses
- [ ] Export PDF
- [ ] Bouton Réinitialiser fonctionnel
- [ ] Sauvegarde (localStorage ou backend)

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

| Concept | Explication courte |
|---|---|
| **Composant** | Fonction JS qui retourne du JSX (= du HTML dans le JS) |
| **JSX** | Syntaxe qui mélange HTML et JavaScript |
| **useState** | Hook pour mémoriser une valeur qui peut changer (`const [val, setVal] = useState(initial)`) |
| **Props** | Paramètres passés d'un composant parent à un composant enfant |
| **SPA** | Single Page Application — une seule page HTML, React simule les changements de page |
| **Rendu conditionnel** | Afficher un composant ou un autre selon une condition (`if`, ternaire, etc.) |
| **.map()** | Transformer un tableau de données en une liste de composants JSX |
| **className dynamique** | Choisir une classe CSS selon une condition avec un ternaire : `className={condition ? 'classe-a' : 'classe-b'}` |
| **CSS par composant** | Chaque composant a son propre fichier `.css` dans son dossier, importé directement dans le `.jsx` |

## 📚 Concepts Git appris (glossaire perso)

| Concept | Explication courte |
|---|---|
| **git init** | Démarre le suivi Git dans un dossier |
| **git remote** | Adresse du dépôt distant (ex: GitHub) où envoyer les commits |
| **git commit** | Sauvegarde un instantané (diff) des changements depuis le dernier commit |
| **git push** | Envoie les commits locaux vers le dépôt distant |
| **branche** | Une ligne de développement indépendante de `main` |
| **Pull Request (PR)** | Demande de fusionner une branche dans `main`, avec relecture du diff avant validation |
| **Conventional Commits** | Convention de message de commit (`feat:`, `fix:`, `style:`, `docs:`) |

## 📚 Concepts qualité de code appris (glossaire perso)

| Concept | Explication courte |
|---|---|
| **Linter (ESLint)** | Analyse le code et signale les erreurs de logique/qualité (variable inutilisée, mauvaise pratique...) — à corriger manuellement |
| **Norme Airbnb** | Ensemble de règles de bonnes pratiques JS/React qu'ESLint applique |
| **Prettier** | Reformate automatiquement le style du code (espaces, guillemets...) à la sauvegarde, sans afficher d'erreur |
| **eslint-config-prettier** | Désactive les règles de forme d'ESLint qui entreraient en conflit avec Prettier |

---

## 🔜 Prochaine étape immédiate

👉 **Étape 5 — Système de pages (SPA)** : créer les composants vides `Inventaire.jsx`, `Calculs.jsx`, `Comparaison.jsx`, `Checklist.jsx` et afficher le bon selon `ongletActif` (affichage conditionnel dans `App.jsx`).

En parallèle : finir la branche `config/eslint-prettier` (ESLint Airbnb + Prettier).

---

## 📝 Notes / questions en attente

- Aucune en attente actuellement — tous les points de conformité au cahier des charges sont clarifiés.