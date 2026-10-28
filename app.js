// Affichage et interactions. Les règles (droits, calculs) sont dans acces.js, crm.js et tableau.js.
import { clientsVisibles, peutModifier, peutReattribuer, voitTableauDeBord } from "./acces.js";
import { ETAPES, changerEtape, chargerClients, modifierFiche, reattribuer, reinitialiser, sauverClients } from "./crm.js";
import { formatFCFA, totalParEtape, totalPipeline } from "./tableau.js";

const LIBELLES = { prospect: "Prospect", qualifie: "Qualifié", proposition: "Proposition", gagne: "Gagné", perdu: "Perdu" };
const [utilisateurs, depart] = await Promise.all([
  fetch("donnees/utilisateurs.json").then((r) => r.json()),
  fetch("donnees/clients.json").then((r) => r.json()),
]);
let clients = chargerClients(depart, localStorage);

const $ = (id) => document.getElementById(id);
const choix = $("utilisateur");
for (const u of utilisateurs) choix.add(new Option(`${u.nom} (${u.role})`, u.id));
const moi = () => utilisateurs.find((u) => u.id === choix.value);
const nomDe = (id) => utilisateurs.find((u) => u.id === id)?.nom ?? "Non attribué";

function element(balise, attributs = {}, ...enfants) {
  const el = Object.assign(document.createElement(balise), attributs);
  el.append(...enfants);
  return el;
}

// Applique une action métier ; une erreur (droits, validation) est montrée sans casser l'écran.
function appliquer(action) {
  try {
    clients = action(clients);
    sauverClients(clients, localStorage);
    afficher();
    return null;
  } catch (e) {
    return e.message;
  }
}

function carte(client, utilisateur) {
  const modifiable = peutModifier(utilisateur, client);
  const rang = ETAPES.indexOf(client.etape);
  const bouton = (texte, cible, titre) =>
    element("button", { type: "button", textContent: texte, title: titre, disabled: !cible,
      onclick: () => appliquer((cs) => changerEtape(cs, utilisateur, client.id, cible)) });
  const el = element("article", { className: "carte", draggable: modifiable },
    element("button", { type: "button", className: "nom", textContent: client.entreprise, onclick: () => ouvrirFiche(client.id) }),
    element("div", { className: "montant", textContent: formatFCFA(client.montant_fcfa) }),
  );
  if (peutReattribuer(utilisateur)) el.append(element("div", { className: "proprio", textContent: nomDe(client.proprietaire) }));
  if (modifiable) {
    el.append(element("div", { className: "actions" },
      bouton("←", ETAPES[rang - 1], "Étape précédente"), bouton("→", ETAPES[rang + 1], "Étape suivante")));
    el.addEventListener("dragstart", (e) => e.dataTransfer.setData("text/plain", client.id));
  }
  return el;
}

function colonne(etape, visibles, utilisateur) {
  const dans = visibles.filter((c) => c.etape === etape);
  const col = element("section", { className: "colonne" },
    element("h2", {}, LIBELLES[etape], element("span", { textContent: String(dans.length) })),
    ...dans.map((c) => carte(c, utilisateur)));
  col.addEventListener("dragover", (e) => { e.preventDefault(); col.classList.add("survol"); });
  col.addEventListener("dragleave", () => col.classList.remove("survol"));
  col.addEventListener("drop", (e) => {
    e.preventDefault();
    col.classList.remove("survol");
    appliquer((cs) => changerEtape(cs, utilisateur, e.dataTransfer.getData("text/plain"), etape));
  });
  return col;
}

function afficherTableau(utilisateur, visibles) {
  const section = $("tableau");
  section.hidden = !voitTableauDeBord(utilisateur);
  if (section.hidden) return;
  const parEtape = totalParEtape(visibles);
  $("total").textContent = formatFCFA(totalPipeline(visibles));
  $("par-etape").replaceChildren(...ETAPES.map((etape) =>
    element("tr", {}, element("td", { textContent: LIBELLES[etape] }), element("td", { textContent: formatFCFA(parEtape[etape] ?? 0) }))));
}

function afficher() {
  const utilisateur = moi();
  const visibles = clientsVisibles(utilisateur, clients);
  $("pipeline").replaceChildren(...ETAPES.map((etape) => colonne(etape, visibles, utilisateur)));
  afficherTableau(utilisateur, visibles);
}

function ouvrirFiche(id) {
  const utilisateur = moi();
  const client = clients.find((c) => c.id === id);
  const form = $("formulaire");
  const modifiable = peutModifier(utilisateur, client);
  const responsable = peutReattribuer(utilisateur);
  $("fiche-titre").textContent = client.entreprise;
  $("fiche-infos").textContent = `${client.ville} · ${LIBELLES[client.etape]} · ${nomDe(client.proprietaire)}`;
  $("fiche-erreur").textContent = "";
  for (const champ of ["contact", "telephone", "montant_fcfa"]) {
    form.elements[champ].value = client[champ];
    form.elements[champ].disabled = !modifiable;
  }
  $("champ-proprietaire").hidden = !responsable;
  form.elements.proprietaire.replaceChildren(new Option("Non attribué", ""),
    ...utilisateurs.filter((u) => u.role === "commercial").map((u) => new Option(u.nom, u.id)));
  form.elements.proprietaire.value = client.proprietaire ?? "";
  $("enregistrer").hidden = !modifiable;
  form.dataset.client = id;
  $("fiche").showModal();
}

$("formulaire").addEventListener("submit", (e) => {
  const form = e.target;
  const utilisateur = moi();
  const id = form.dataset.client;
  const donnees = Object.fromEntries(new FormData(form));
  const erreur = appliquer((cs) => {
    let suite = modifierFiche(cs, utilisateur, id, donnees);
    const proprietaire = donnees.proprietaire || null;
    if (peutReattribuer(utilisateur) && proprietaire !== cs.find((c) => c.id === id).proprietaire) {
      suite = reattribuer(suite, utilisateur, id, proprietaire, utilisateurs);
    }
    return suite;
  });
  if (erreur) {
    e.preventDefault();
    $("fiche-erreur").textContent = erreur;
  }
});
$("fermer").addEventListener("click", () => $("fiche").close());
$("reinitialiser").addEventListener("click", () => {
  if (!confirm("Effacer les changements enregistrés et revenir aux données de départ ?")) return;
  reinitialiser(localStorage);
  clients = depart;
  afficher();
});
choix.addEventListener("change", afficher);
afficher();
