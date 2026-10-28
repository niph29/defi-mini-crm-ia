# Journal d'usage de l'IA

*À remplir au fil de l'eau, pas à la fin. Soyez honnête : une erreur de l'IA que vous avez repérée compte plus qu'un code parfait
dont vous ne savez pas d'où il vient.*

- **Nom :** niph
- **Outil(s) d'IA utilisé(s), et pour quoi :** Claude Code (lecture du dépôt, plan, écriture du code et des tests, revue). Je relis et valide chaque étape.
- **Heure de départ :** 10h22 (commit « Départ du défi »)

## Chronologie

| Heure | Ce que j'ai demandé à l'IA (en résumé) | Ce qu'elle a produit | Ce que j'ai vérifié, corrigé ou refusé |
|---|---|---|---|
| 10h25 | Lire le dépôt, résumer les modalités, repérer les défauts, proposer un plan | Résumé, 7 défauts suspectés, plan en 6 étapes | J'ai validé le plan. Je lui ai demandé de passer à Python + PostgreSQL : l'IA a refusé à juste titre (le README impose un site statique, here.now ne fait que du statique, la persistance attendue est `localStorage`). On reste en JS vanilla |
| 10h36 | Écrire d'abord les tests des défauts, les lancer, puis corriger | 7 tests, tous rouges sur le code de départ (commit `test: ... tests rouges`), puis corrections | J'ai vérifié la sortie rouge (ex. total `'10000090000'` au lieu de `190000`), puis 8/8 verts après correction. J'ai gardé un commit séparé pour les tests rouges, comme preuve dans l'historique |
| 10h37 | Actions métier testables (`crm.js`) : changer d'étape, modifier la fiche, réattribuer, persister | Module + 10 tests | Exigé : chaque action revérifie les droits (pas seulement les boutons masqués) et la fiche n'accepte qu'une liste blanche de champs, sinon un commercial pourrait s'attribuer un client en ajoutant `proprietaire` |
| 10h39 | Interface : pipeline (boutons + glisser-déposer), fiche en `<dialog>`, tableau de bord | `index.html`, `app.js` réécrits | Test de bout en bout dans un navigateur (Playwright) : 16 / 7 / 30 clients visibles selon l'utilisateur, persistance après rechargement, réattribution. **Bug trouvé** : le champ « Commercial attribué » restait visible pour un commercial (la règle CSS `display: block` écrasait `hidden`), corrigé. Totaux recalculés à part : 17 650 000 FCFA, identiques |
| 10h54 | Installer le skill here.now, publier le site | Publication anonyme (24 h) des seuls fichiers du site, depuis un dossier temporaire (sans `.git`, tests ni journal) | J'ai relu le script de publication avant de le lancer. L'IA ne peut pas ouvrir le site publié (sous-domaine bloqué par le proxy de sa session) : vérification faite par moi dans mon navigateur. Captures d'écran ajoutées dans `captures/` |
| 11h00 | Rendre le site permanent sur mon compte here.now | Connexion par code e-mail, clé API nommée `claude-code` (gardée hors du dépôt), site rattaché à mon compte : même URL, sans expiration | Fichiers en ligne comparés à ceux du dépôt par empreinte sha256 : identiques |
| 11h00 | Relecture critique de tout le code produit | 4 problèmes trouvés dans **son propre code** (voir « erreurs de l'IA »), corrigés, site republié au même lien | Test rouge commité avant la correction du montant vide. Fuite du tableau de bord prouvée dans le navigateur avant / après (voir tableau des défauts) |

## Les erreurs de l'IA que j'ai repérées

- Proposition d'un backend Python + PostgreSQL (à ma demande) : contraire au règlement (site statique), écarté.
- Champ de réattribution visible pour un commercial (CSS qui écrase `hidden`). Sans conséquence sur les droits car `reattribuer()` vérifie le rôle, mais l'interface était trompeuse. Repéré par le test navigateur, pas par les tests unitaires.
- L'IA a rempli la chronologie avec des heures **estimées** (10h50, 11h05) au lieu des heures réelles. Repéré en comparant avec `git log`, corrigé avec les heures des commits.
- Relecture de son propre code : (1) le tableau de bord était seulement **masqué** pour un commercial, les totaux globaux restaient dans la page (lisibles avec l'inspecteur) ; (2) `Number("")` vaut 0, donc un montant vide était enregistré à 0 FCFA ; (3) l'état en mémoire changeait avant la sauvegarde ; (4) les erreurs de déplacement étaient ignorées sans message. Tous corrigés.

## Les défauts trouvés dans le code et les données de départ

| Défaut | Où | Pourquoi c'est un problème | Ma correction | Le test qui le prouve |
|---|---|---|---|---|
| **Droits** : `\|\| !c.proprietaire` rend les 7 clients sans propriétaire visibles par **tous** les commerciaux | `acces.js` | Fuite de données personnelles (contact, téléphone) vers des commerciaux non concernés | Condition supprimée : un commercial ne voit que `proprietaire === son id` | `tests/acces.test.js` : « ne voit pas les clients sans propriétaire » |
| **Droits** : comparaison laxiste `==` | `acces.js` | `1 == "1"` est vrai : un identifiant d'un autre type donne accès | Comparaison stricte `===` | `tests/acces.test.js` : « propriétaire de type différent » |
| **Droits** : pas de refus par défaut ; un utilisateur absent fait planter, un rôle inconnu voit les clients sans propriétaire | `acces.js` | Une règle d'accès doit refuser ce qu'elle ne connaît pas | `u?.role`, seuls `commercial` et `responsable` ont des droits | `tests/acces.test.js` : « refus par défaut » |
| Montants en texte (`"90000"`) : la somme concatène les chaînes | `clients.json` (c04, c12, c25), `tableau.js` | Totaux du tableau de bord faux (`'10000090000'`) | Données corrigées + `Number()` dans les calculs | `tests/tableau.test.js`, `tests/donnees.test.js` |
| Propriétaire `"u1 "` avec une espace | `clients.json` (c16) | Awa ne voit pas son propre client Yoff Digital | Donnée corrigée | `tests/donnees.test.js` : « propriétaire existant ou null » |
| **Droits** : le tableau de bord était affiché à tous, et calculé sur **tous** les clients | `app.js` | Un commercial voyait le chiffre d'affaires global | Section masquée et non calculée hors responsable, via `voitTableauDeBord()` | `tests/crm.test.js` : « le tableau de bord n'est visible que du responsable ». Honnêtement, ce test n'a pas pu échouer avant : la règle était absente du code (dans `app.js`, non testable). Je l'ai extraite dans `acces.js` pour la rendre testable |
| **Droits** (introduit par l'IA, trouvé en relecture) : tableau de bord masqué mais pas vidé | `app.js` | Un commercial pouvait lire le chiffre d'affaires global dans la page | Contenu vidé hors responsable | Pas de test `npm test` (le DOM demanderait une dépendance de test en plus). Preuve navigateur (Playwright) : avant, Awa a `"17 650 000 FCFA"` et 5 lignes dans la page ; après, `""` et 0 ligne |
| Montant vide enregistré à 0 (introduit par l'IA) | `crm.js` | Donnée fausse sans erreur si on contourne le formulaire | Champ vide refusé | `tests/crm.test.js` : « refuse un montant ... » (commit rouge `f927910`) |
| Fichier parasite `New folder/départ.txt` | racine | Code / fichier mort | Supprimé | (pas de test pertinent) |

## Ce que je ferais avec plus de temps

- **Les droits vérifiés dans le navigateur ne protègent rien en vrai** : le sélecteur « Connecté en tant que » simule une connexion, et toutes les données sont téléchargées. En production : vraie authentification et API (par ex. FastAPI + PostgreSQL) qui filtre les clients côté serveur. `crm.js` isole déjà les actions, ce qui faciliterait ce passage.
- Historique des changements d'étape (qui, quand), utile pour un CRM.
- Préciser avec le client si « pipeline en cours » doit inclure les affaires gagnées (j'ai suivi le README : seul « perdu » est exclu).
