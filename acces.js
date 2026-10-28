// Règles d'accès du mini-CRM. Refus par défaut : un rôle inconnu ne voit et ne peut rien.
// Un commercial ne voit et ne modifie QUE ses propres clients ; le responsable voit tout et réattribue.
const estResponsable = (u) => u?.role === "responsable";
const estProprietaire = (u, client) => u?.role === "commercial" && client.proprietaire === u.id;

export function clientsVisibles(utilisateur, clients) {
  return clients.filter((c) => estResponsable(utilisateur) || estProprietaire(utilisateur, c));
}

export const peutModifier = (utilisateur, client) => estResponsable(utilisateur) || estProprietaire(utilisateur, client);
export const peutReattribuer = estResponsable;
export const voitTableauDeBord = estResponsable;
