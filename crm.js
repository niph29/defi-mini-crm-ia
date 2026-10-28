// Actions métier du CRM. Chaque action vérifie les droits elle-même : masquer un bouton ne suffit pas.
// Les fonctions ne modifient pas la liste reçue, elles en renvoient une nouvelle.
import { peutModifier, peutReattribuer } from "./acces.js";

export const ETAPES = ["prospect", "qualifie", "proposition", "gagne", "perdu"];
const CLE = "mini-crm.clients";

export function chargerClients(depart, stockage) {
  try {
    const sauves = JSON.parse(stockage.getItem(CLE));
    if (Array.isArray(sauves)) return sauves;
  } catch {
    // Stockage absent ou illisible : on repart des données de départ.
  }
  return depart;
}

export function sauverClients(clients, stockage) {
  stockage.setItem(CLE, JSON.stringify(clients));
}

export function reinitialiser(stockage) {
  stockage.removeItem(CLE);
}

function remplacer(clients, utilisateur, id, autorise, changement) {
  const client = clients.find((c) => c.id === id);
  if (!client || !autorise(utilisateur, client)) throw new Error("Action non autorisée");
  return clients.map((c) => (c === client ? { ...c, ...changement } : c));
}

export function changerEtape(clients, utilisateur, id, etape) {
  if (!ETAPES.includes(etape)) throw new Error(`Étape inconnue : ${etape}`);
  return remplacer(clients, utilisateur, id, peutModifier, { etape });
}

// Seuls ces trois champs sont modifiables depuis la fiche : un commercial ne peut pas
// changer le propriétaire ou l'étape en glissant un champ en plus.
export function modifierFiche(clients, utilisateur, id, { contact, telephone, montant_fcfa }) {
  const montant = String(montant_fcfa ?? "").trim();
  const changement = {
    contact: String(contact ?? "").trim(),
    telephone: String(telephone ?? "").trim(),
    // Number("") vaut 0 : un champ vide doit être refusé, pas enregistré à 0.
    montant_fcfa: montant === "" ? NaN : Number(montant),
  };
  if (!changement.contact) throw new Error("Le contact est obligatoire");
  if (!/^\+?[0-9 ]{6,20}$/.test(changement.telephone)) throw new Error("Téléphone invalide");
  if (!Number.isInteger(changement.montant_fcfa) || changement.montant_fcfa < 0) {
    throw new Error("Le montant doit être un nombre entier positif");
  }
  return remplacer(clients, utilisateur, id, peutModifier, changement);
}

export function reattribuer(clients, utilisateur, id, proprietaire, utilisateurs) {
  const cible = utilisateurs.find((u) => u.id === proprietaire && u.role === "commercial");
  if (proprietaire !== null && !cible) throw new Error("Le nouveau propriétaire doit être un commercial");
  return remplacer(clients, utilisateur, id, peutReattribuer, { proprietaire });
}
