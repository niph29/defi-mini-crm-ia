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
| 10h35 | Écrire d'abord les tests des défauts, les lancer, puis corriger | 7 tests, tous rouges sur le code de départ (commit `test: ... tests rouges`), puis corrections | J'ai vérifié la sortie rouge (ex. total `'10000090000'` au lieu de `190000`), puis 8/8 verts après correction. J'ai gardé un commit séparé pour les tests rouges, comme preuve dans l'historique |

## Les erreurs de l'IA que j'ai repérées

-

## Les défauts trouvés dans le code et les données de départ

| Défaut | Où | Pourquoi c'est un problème | Ma correction | Le test qui le prouve |
|---|---|---|---|---|
| **Droits** : `\|\| !c.proprietaire` rend les 7 clients sans propriétaire visibles par **tous** les commerciaux | `acces.js` | Fuite de données personnelles (contact, téléphone) vers des commerciaux non concernés | Condition supprimée : un commercial ne voit que `proprietaire === son id` | `tests/acces.test.js` : « ne voit pas les clients sans propriétaire » |
| **Droits** : comparaison laxiste `==` | `acces.js` | `1 == "1"` est vrai : un identifiant d'un autre type donne accès | Comparaison stricte `===` | `tests/acces.test.js` : « propriétaire de type différent » |
| **Droits** : pas de refus par défaut ; un utilisateur absent fait planter, un rôle inconnu voit les clients sans propriétaire | `acces.js` | Une règle d'accès doit refuser ce qu'elle ne connaît pas | `u?.role`, seuls `commercial` et `responsable` ont des droits | `tests/acces.test.js` : « refus par défaut » |
| Montants en texte (`"90000"`) : la somme concatène les chaînes | `clients.json` (c04, c12, c25), `tableau.js` | Totaux du tableau de bord faux (`'10000090000'`) | Données corrigées + `Number()` dans les calculs | `tests/tableau.test.js`, `tests/donnees.test.js` |
| Propriétaire `"u1 "` avec une espace | `clients.json` (c16) | Awa ne voit pas son propre client Yoff Digital | Donnée corrigée | `tests/donnees.test.js` : « propriétaire existant ou null » |

## Ce que je ferais avec plus de temps

-
