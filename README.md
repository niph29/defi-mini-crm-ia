# Défi : un mini-CRM construit avec l'IA — 3 heures

Bonjour, et merci d'avoir accepté ce défi.

**Bridge** cherche un·e jeune développeur·se à Dakar pour construire un **CRM sur mesure** pour l'un de ses partenaires : fiches
clients, suivi des ventes, rôles et tableaux de bord. Nous travaillons **avec** des outils d'IA. Ce défi mesure deux choses :

1. ce que vous savez **construire vite** avec l'IA ;
2. ce que vous savez **vérifier** : un CRM contient les données personnelles des clients, et l'IA se trompe parfois, surtout sur
   les droits d'accès.

**L'IA est autorisée et attendue** : Cursor, Claude Code, Copilot, ChatGPT, v0, Bolt… celle(s) de votre choix. Les données de ce dépôt
sont **fictives**.

---

## 1. Démarrer

1. Créez votre copie **publique** de ce dépôt (bouton **Fork**) sur votre compte GitHub.
2. Clonez-la, faites un premier commit `Départ du défi` (par exemple en remplissant l'en-tête de `JOURNAL-IA.md`), poussez-le.
3. **Envoyez « Je commence » à la personne qui vous a invité·e**, avec le lien de votre dépôt. **Vous avez 3 heures à partir de ce
   message.**

Pour lancer l'application en local : `npm run serve` (ou `python3 -m http.server`), puis ouvrez l'adresse affichée.
Pour lancer les tests : `npm test` (Node 20 ou plus).

## 2. La mission

Le code de départ (`index.html`, `app.js`, `acces.js`, `tableau.js`, `donnees/`) affiche un pipeline de ventes. Partez de lui — vous
pouvez tout réécrire, avec le framework de votre choix, **tant que le résultat se publie en site statique**.

Le résultat attendu :

1. **Le pipeline** : les clients sont rangés par étape (prospect, qualifié, proposition, gagné, perdu). On peut **faire passer un
   client d'une étape à l'autre** (boutons ou glisser-déposer). Les changements **restent après un rechargement** (`localStorage`).
2. **La fiche client** : en cliquant sur un client, on voit sa fiche et on peut **modifier** le contact, le téléphone et le montant.
3. **Les droits** :
   - un **commercial** ne voit **que ses propres clients**, et ne peut modifier qu'eux ;
   - le **responsable** voit tous les clients et peut **réattribuer** un client à un commercial ;
   - le **tableau de bord** n'est visible que du responsable.
4. **Le tableau de bord** : le total du pipeline en cours (hors « perdu ») et le total par étape, **justes**, affichés en FCFA
   lisibles (par exemple `1 250 000 FCFA`).
5. **Les défauts du départ** : le code et les données de départ contiennent **plusieurs défauts**, dont au moins un défaut de
   **droits d'accès**. Trouvez-les, corrigez-les, et pour chacun écrivez **un test automatisé qui échouait avant votre correction**
   (dans `tests/`, lancés par `npm test`). Décrivez-les dans `JOURNAL-IA.md`.
6. **Le journal** : remplissez `JOURNAL-IA.md` **au fil de l'eau** (pas à la fin) : ce que vous avez demandé à l'IA, ce qu'elle a
   produit, ce que vous avez vérifié, ce que vous avez refusé ou corrigé.

## 3. Les règles de travail

- **Commitez souvent** : au moins **toutes les 30 minutes**, avec des messages clairs. Poussez au fur et à mesure.
- **Gardez la mention de l'outil d'IA** dans les commits quand votre outil l'ajoute lui-même (par exemple `Co-Authored-By:` d'un
  assistant) : c'est attendu, pas pénalisé.
- **Ne réécrivez pas l'historique** : pas de squash, pas de `push --force`. Nous lisons l'historique tel qu'il s'est fait.
- **Travail personnel** : l'IA oui, une autre personne non. Ne copiez pas le dépôt d'un autre candidat (les dépôts sont publics, et les
  historiques se comparent).
- Le dernier commit compté est celui poussé **avant la fin des 3 heures**.

## 4. Publier et rendre

1. **Le site** : publiez votre application sur **[here.now](https://here.now)** — le plus simple est de demander à votre agent IA de
   le faire (documentation : https://here.now/docs). Sans compte, un site reste en ligne **24 heures**, ce qui suffit pour
   l'évaluation.
2. **Les fichiers** que vous voulez montrer (capture d'écran, courte vidéo de démonstration, schéma) : publiez-les **aussi sur
   here.now** (un fichier seul s'y affiche avec une visionneuse), ou ajoutez-les au dépôt s'ils sont légers.
3. **Dans ce README**, remplissez la section *Livrables* ci-dessous et poussez.
4. **Envoyez « Terminé »** à la personne qui vous a invité·e, avec le lien du dépôt et celui du site.

## 5. Ce qui est évalué

| | |
|---|---|
| **Le résultat** | le site publié fonctionne, et fait ce qui est demandé |
| **Les droits d'accès et les défauts** | trouvés, corrigés, prouvés par des tests |
| **La qualité** | code lisible, tests utiles, pas de code mort |
| **L'usage de l'IA** | pertinence des demandes, esprit critique, vérifications, honnêteté du journal |
| **La célérité et la méthode** | une première version publiée tôt, des commits réguliers, un historique lisible, le délai tenu |

Le défi est suivi d'un **entretien de 20 minutes** : vous nous montrez votre travail et vous nous expliquez un passage du code produit
par l'IA.

---

## Livrables (à remplir par le candidat)

- Dépôt : https://github.com/niph29/defi-mini-crm-ia
- Site publié sur here.now : https://sonic-pagoda-qrm8.here.now/
- Fichiers publiés (facultatif) : captures d'écran dans [`captures/`](captures/) (vue responsable, fiche client, vue commercial)
- Outil(s) d'IA utilisé(s) : Claude Code
- Heure de départ / heure de fin : 10h22 / 
