// Défauts de calcul du tableau de bord.
import { test } from "node:test";
import assert from "node:assert/strict";
import { totalParEtape, totalPipeline } from "../tableau.js";

const clients = [
  { etape: "qualifie", montant_fcfa: 100000 },
  { etape: "qualifie", montant_fcfa: "90000" },
  { etape: "perdu", montant_fcfa: 50000 },
];

test("le total par étape additionne les montants saisis en texte", () => {
  assert.deepEqual(totalParEtape(clients), { qualifie: 190000, perdu: 50000 });
});

test("le total du pipeline exclut « perdu » et reste un nombre", () => {
  assert.equal(totalPipeline(clients), 190000);
});
