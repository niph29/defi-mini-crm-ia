// Indicateurs du tableau de bord. Number() protège contre un montant arrivé en texte (données, saisie).
export function totalParEtape(clients) {
  const total = {};
  for (const c of clients) {
    total[c.etape] = (total[c.etape] || 0) + Number(c.montant_fcfa);
  }
  return total;
}

export function totalPipeline(clients) {
  return clients
    .filter((c) => c.etape !== "perdu")
    .reduce((somme, c) => somme + Number(c.montant_fcfa), 0);
}

// 1250000 -> "1 250 000 FCFA"
export function formatFCFA(montant) {
  return `${String(Math.round(Number(montant))).replace(/\B(?=(\d{3})+(?!\d))/g, " ")} FCFA`;
}
