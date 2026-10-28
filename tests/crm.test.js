import { test } from "node:test";
import assert from "node:assert/strict";
import { changerEtape, chargerClients, modifierFiche, reattribuer, sauverClients } from "../crm.js";
import { formatFCFA } from "../tableau.js";
import { voitTableauDeBord } from "../acces.js";

const awa = { id: "u1", role: "commercial" };
const ibra = { id: "u2", role: "commercial" };
const mariama = { id: "u3", role: "responsable" };
const utilisateurs = [awa, ibra, mariama];
const clients = [
  { id: "a", etape: "prospect", contact: "A", telephone: "+221 77 000 00 01", montant_fcfa: 1000, proprietaire: "u1" },
  { id: "b", etape: "prospect", contact: "B", telephone: "+221 77 000 00 02", montant_fcfa: 2000, proprietaire: "u2" },
];
const fiche = { contact: "Nouveau", telephone: "+221 77 111 22 33", montant_fcfa: "5000" };

function faussePersistance() {
  const m = new Map();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => m.set(k, v), removeItem: (k) => m.delete(k) };
}

test("un commercial fait avancer son client, sans toucher la liste d'origine", () => {
  const apres = changerEtape(clients, awa, "a", "qualifie");
  assert.equal(apres.find((c) => c.id === "a").etape, "qualifie");
  assert.equal(clients[0].etape, "prospect");
});

test("un commercial ne peut ni déplacer ni modifier le client d'un autre", () => {
  assert.throws(() => changerEtape(clients, awa, "b", "gagne"), /non autorisée/);
  assert.throws(() => modifierFiche(clients, awa, "b", fiche), /non autorisée/);
});

test("une étape inconnue est refusée", () => {
  assert.throws(() => changerEtape(clients, awa, "a", "signe"), /inconnue/);
});

test("la fiche enregistre le montant en nombre et ignore les champs non prévus", () => {
  const apres = modifierFiche(clients, awa, "a", { ...fiche, proprietaire: "u2", etape: "gagne" });
  const a = apres.find((c) => c.id === "a");
  assert.equal(a.montant_fcfa, 5000);
  assert.equal(a.proprietaire, "u1");
  assert.equal(a.etape, "prospect");
});

test("la fiche refuse un montant négatif ou non numérique, et un téléphone invalide", () => {
  assert.throws(() => modifierFiche(clients, awa, "a", { ...fiche, montant_fcfa: "-5" }), /montant/);
  assert.throws(() => modifierFiche(clients, awa, "a", { ...fiche, montant_fcfa: "abc" }), /montant/);
  assert.throws(() => modifierFiche(clients, awa, "a", { ...fiche, telephone: "<script>" }), /Téléphone/);
  // Number("") vaut 0 : un montant vide ne doit pas devenir 0 FCFA.
  assert.throws(() => modifierFiche(clients, awa, "a", { ...fiche, montant_fcfa: "" }), /montant/);
  assert.throws(() => modifierFiche(clients, awa, "a", { ...fiche, montant_fcfa: "  " }), /montant/);
});

test("seul le responsable réattribue, et seulement à un commercial", () => {
  assert.equal(reattribuer(clients, mariama, "a", "u2", utilisateurs)[0].proprietaire, "u2");
  assert.throws(() => reattribuer(clients, awa, "a", "u2", utilisateurs), /non autorisée/);
  assert.throws(() => reattribuer(clients, mariama, "a", "u3", utilisateurs), /commercial/);
});

test("les changements survivent à un rechargement", () => {
  const stockage = faussePersistance();
  sauverClients(changerEtape(clients, awa, "a", "gagne"), stockage);
  assert.equal(chargerClients(clients, stockage)[0].etape, "gagne");
});

test("un stockage illisible ramène aux données de départ", () => {
  const stockage = faussePersistance();
  stockage.setItem("mini-crm.clients", "{pas du json");
  assert.equal(chargerClients(clients, stockage), clients);
});

test("le tableau de bord n'est visible que du responsable", () => {
  assert.equal(voitTableauDeBord(mariama), true);
  assert.equal(voitTableauDeBord(awa), false);
  assert.equal(voitTableauDeBord(undefined), false);
});

test("les montants s'affichent en FCFA lisibles", () => {
  assert.equal(formatFCFA(1250000), "1 250 000 FCFA");
  assert.equal(formatFCFA("90000"), "90 000 FCFA");
  assert.equal(formatFCFA(0), "0 FCFA");
});
