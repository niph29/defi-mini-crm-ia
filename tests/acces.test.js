// Défauts de droits d'accès du code de départ.
import { test } from "node:test";
import assert from "node:assert/strict";
import { clientsVisibles } from "../acces.js";

const awa = { id: "u1", role: "commercial" };
const clients = [
  { id: "a", proprietaire: "u1" },
  { id: "b", proprietaire: "u2" },
  { id: "c", proprietaire: null },
];

test("un commercial ne voit pas les clients sans propriétaire", () => {
  assert.deepEqual(clientsVisibles(awa, clients).map((c) => c.id), ["a"]);
});

test("un commercial ne voit pas un client dont le propriétaire a un type différent", () => {
  // Avec ==, l'identifiant numérique 1 était confondu avec la chaîne "1".
  const clientsNum = [{ id: "x", proprietaire: 1 }];
  assert.equal(clientsVisibles({ id: "1", role: "commercial" }, clientsNum).length, 0);
});

test("sans utilisateur connu, aucun client n'est visible (refus par défaut)", () => {
  assert.deepEqual(clientsVisibles(undefined, clients), []);
  assert.deepEqual(clientsVisibles({ id: "u9", role: "inconnu" }, clients), []);
});
