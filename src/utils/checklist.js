export const TACHES_PREDEFINIES = [
  {
    id: 'bail-preavis',
    titre: 'Résilier le bail / Préavis',
    description:
      'Envoyer un courrier recommandé avec accusé de réception à votre propriétaire (1 à 3 mois de préavis selon la zone et le type de location)',
    joursAvant: 90,
    type: 'Resiliation',
  },
  {
    id: 'assurance-habitation-resil',
    titre: 'Résilier assurance habitation',
    description:
      'Informer votre assureur de votre déménagement et résilier le contrat du logement actuel',
    joursAvant: 30,
    type: 'Resiliation',
  },
  {
    id: 'internet-resil',
    titre: 'Résilier / transférer Internet et téléphone',
    description: 'Prévoir environ 10 jours de délai pour la résiliation ou le transfert de ligne',
    joursAvant: 21,
    type: 'Resiliation',
  },
  {
    id: 'energie-resil',
    titre: 'Résilier électricité et gaz',
    description: 'Contacter votre fournisseur et relever les compteurs le jour du départ',
    joursAvant: 14,
    type: 'Resiliation',
  },
  {
    id: 'eau-resil',
    titre: "Résilier le contrat d'eau",
    description:
      'Uniquement si le contrat est à votre nom (souvent inclus dans les charges en appartement)',
    joursAvant: 14,
    type: 'Resiliation',
  },

  {
    id: 'assurance-habitation-nouv',
    titre: 'Souscrire assurance habitation',
    description:
      "Obligatoire avant l'entrée dans les lieux — l'attestation est demandée à la remise des clés",
    joursAvant: 14,
    type: 'Souscription',
  },
  {
    id: 'energie-souscription',
    titre: 'Ouvrir les compteurs électricité et gaz',
    description: 'Souscrire un contrat pour le nouveau logement, prévoir 5 à 15 jours de délai',
    joursAvant: 15,
    type: 'Souscription',
  },
  {
    id: 'eau-souscription',
    titre: "Ouvrir le contrat d'eau",
    description: 'Contacter le service des eaux de la nouvelle commune',
    joursAvant: 10,
    type: 'Souscription',
  },
  {
    id: 'internet-souscription',
    titre: 'Souscrire Internet et téléphone',
    description:
      'Commander votre box — comptez 2 à 4 semaines si une intervention technique est nécessaire',
    joursAvant: 21,
    type: 'Souscription',
  },

  {
    id: 'poste-reexpedition',
    titre: 'Contrat de réexpédition du courrier',
    description: 'Souscrire auprès de La Poste pour faire suivre votre courrier (6 ou 12 mois)',
    joursAvant: 10,
    type: 'Demarche',
  },
  {
    id: 'stationnement',
    titre: 'Demander une autorisation de stationnement',
    description:
      'À faire en mairie pour réserver un emplacement au camion le jour J (délai variable selon la commune)',
    joursAvant: 20,
    type: 'Demarche',
  },
  {
    id: 'etat-des-lieux',
    titre: "Planifier l'état des lieux de sortie",
    description: "Prendre rendez-vous avec le propriétaire ou l'agence",
    joursAvant: 14,
    type: 'Demarche',
  },
  {
    id: 'securite-sociale',
    titre: "Signaler le changement d'adresse à la Sécurité sociale",
    description: 'Via votre compte Ameli — pensez aussi à votre mutuelle',
    joursAvant: 0,
    type: 'Demarche',
  },
  {
    id: 'caf',
    titre: "Mettre à jour l'adresse à la CAF",
    description: 'Important si vous percevez des aides au logement (APL), le montant peut changer',
    joursAvant: 0,
    type: 'Demarche',
  },
  {
    id: 'impots',
    titre: "Déclarer le changement d'adresse aux impôts",
    description: 'Via impots.gouv.fr, rubrique "Gérer mon prélèvement à la source"',
    joursAvant: -7,
    type: 'Demarche',
  },
  {
    id: 'banque',
    titre: 'Prévenir la banque et les assurances',
    description: "Mise à jour de l'adresse pour les relevés et contrats (auto, santé, prévoyance)",
    joursAvant: -7,
    type: 'Demarche',
  },
  {
    id: 'employeur',
    titre: "Informer l'employeur",
    description: 'Mise à jour du dossier RH, utile pour les remboursements de transport',
    joursAvant: -7,
    type: 'Demarche',
  },
  {
    id: 'carte-grise',
    titre: 'Mettre à jour la carte grise',
    description: 'Obligatoire dans le mois suivant le déménagement, via ANTS (gratuit)',
    joursAvant: -30,
    type: 'Demarche',
  },
  {
    id: 'liste-electorale',
    titre: "S'inscrire sur les listes électorales",
    description: 'À faire en mairie ou en ligne sur service-public.fr',
    joursAvant: -30,
    type: 'Demarche',
  },
  {
    id: 'medecin-traitant',
    titre: 'Déclarer un nouveau médecin traitant',
    description: 'Si vous changez de région — formulaire à remplir avec le nouveau praticien',
    joursAvant: -60,
    type: 'Demarche',
  },
];

export function calculerTachesAvecDates(tachesPredefinies, tachesPerso, profil) {
  const now = new Date();

  const tachesAvecDates = tachesPredefinies.map((item) => {
    const dateEcheance = new Date(profil.dateDemenagement);
    dateEcheance.setDate(dateEcheance.getDate() - item.joursAvant);
    return { ...item, dateEcheance };
  });

  return [...tachesAvecDates, ...tachesPerso]
    .map((t) => {
      const enRetard = t.dateEcheance < now;
      const enUrgence =
        !enRetard && t.dateEcheance <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { ...t, enRetard, enUrgence };
    })
    .sort((a, b) => a.dateEcheance - b.dateEcheance);
}
