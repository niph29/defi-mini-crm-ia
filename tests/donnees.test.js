// Défauts du fichier de données de départ.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const lire = (f) => JSON.parse(readFileSync(new URL(`../donnees/${f}`, import.meta.url)));
const clients = lire("clients.json");
const ids = new Set(lire("utilisateurs.json").map((u) => u.id));

test("tous les montants sont des nombres", () => {
  const fautifs = clients.filter((c) => typeof c.montant_fcfa !== "number").map((c) => c.id);
  assert.deepEqual(fautifs, []);
});

test("chaque propriétaire est un utilisateur existant ou null", () => {
  const fautifs = clients.filter((c) => c.proprietaire !== null && !ids.has(c.proprietaire)).map((c) => c.id);
  assert.deepEqual(fautifs, []);
});
