export const VOLUMES_CARTONS = {
  petit: 0.032,
  standard: 0.058,
  grand: 0.077,
};

export const PRIX_CARTONS = {
  petit: 1.0,
  standard: 1.5,
  grand: 2.5,
};

export function calculerVolume(pieces) {
  return pieces.reduce((total, piece) => {
    const volumeMeubles = piece.objets.reduce((acc, o) => acc + o.volume * o.quantite, 0);
    const volumeCartons = ['petit', 'standard', 'grand'].reduce((acc, taille) => {
      const vol = piece.objetsAEmballer
        .filter((o) => o.carton === taille)
        .reduce((a, o) => a + o.volume * o.quantite, 0);
      const nb = Math.ceil(vol / (VOLUMES_CARTONS[taille] * 0.8));
      return acc + nb * VOLUMES_CARTONS[taille];
    }, 0);
    return total + volumeMeubles + volumeCartons;
  }, 0);
}

export function determinerCamion(volume) {
  if (volume <= 5) return 'Voiture + remorque';
  if (volume <= 10) return 'Camionnette 10m³ (type Trafic)';
  if (volume <= 20) return 'Camion 20m³ (type Master)';
  if (volume <= 30) return 'Camion 30m³';
  return 'Camion 40m³ ou plusieurs rotations';
}

export function determinerPersonne(volume) {
  if (volume <= 10) return '1 à 2 personnes';
  if (volume <= 20) return '2 à 3 personnes';
  if (volume <= 30) return '3 à 4 personnes';
  return '4 personnes +';
}

export function calculerTemps(volume, distance, nbPersonnes = 1) {
  const nb = Math.max(1, Number(nbPersonnes) || 1);
  const emballage = volume / (5 * nb);
  const chargement = volume / (7 * nb);
  const trajet = (distance / 60) * 2;
  const total = emballage + chargement + trajet;
  const fmt = (h) => `${Math.floor(h)}h${String(Math.round((h % 1) * 60)).padStart(2, '0')}`;
  return {
    emballage: fmt(emballage),
    chargement: fmt(chargement),
    trajet: fmt(trajet),
    total: fmt(total),
  };
}

export function calculerCartons(pieces) {
  return pieces.map((piece) => {
    const calculerGroupe = (taille) => {
      const objets = piece.objetsAEmballer.filter((o) => o.carton === taille);
      const volume = objets.reduce((acc, o) => acc + o.volume * o.quantite, 0);
      const nb = Math.ceil(volume / (VOLUMES_CARTONS[taille] * 0.8));
      return { nb, volume };
    };
    return {
      nom: piece.nom,
      petit: calculerGroupe('petit'),
      standard: calculerGroupe('standard'),
      grand: calculerGroupe('grand'),
    };
  });
}

export function calculerCartonsGlobal(pieces) {
  const calculerGroupe = (taille) => {
    const volume = pieces.reduce(
      (acc, piece) =>
        acc +
        piece.objetsAEmballer
          .filter((o) => o.carton === taille)
          .reduce((a, o) => a + o.volume * o.quantite, 0),
      0,
    );
    const nb = Math.ceil(volume / (VOLUMES_CARTONS[taille] * 0.8));
    return { nb, volume };
  };
  return {
    petit: calculerGroupe('petit'),
    standard: calculerGroupe('standard'),
    grand: calculerGroupe('grand'),
  };
}

export function calculerBudgetSolo(volume, distance, coutCartons) {
  let camionMin;
  let camionMax;

  if (volume <= 5) {
    camionMin = 80;
    camionMax = 120;
  } else if (volume <= 10) {
    camionMin = 70;
    camionMax = 170;
  } else if (volume <= 20) {
    camionMin = 120;
    camionMax = 200;
  } else if (volume <= 30) {
    camionMin = 150;
    camionMax = 250;
  } else {
    camionMin = 200;
    camionMax = 300;
  }

  const carburant = distance * 0.55 + 25;

  return {
    min: camionMin + carburant + coutCartons,
    max: camionMax + carburant + coutCartons,
  };
}

export const FORMULES_PRO = {
  economique: { label: 'Économique', prixMin: 35, prixMax: 60 },
  standard: { label: 'Standard', prixMin: 50, prixMax: 100 },
  toutCompris: { label: 'Tout compris', prixMin: 60, prixMax: 160 },
};

function calculerCoutDistance(distance) {
  if (distance <= 50) return distance * 2.5;
  if (distance <= 200) return 50 * 2.5 + (distance - 50) * 2.0;
  if (distance <= 500) return 50 * 2.5 + 150 * 2.0 + (distance - 200) * 1.7;
  return 50 * 2.5 + 150 * 2.0 + 300 * 1.7 + (distance - 500) * 1.4;
}

export function calculerBudgetPro(
  volume,
  distance,
  etage,
  ascenseur,
  formule = 'economique',
  parking,
) {
  const { prixMin, prixMax } = FORMULES_PRO[formule];
  let proMin = volume * prixMin;
  let proMax = volume * prixMax;

  const coutDist = calculerCoutDistance(distance);
  proMin += coutDist;
  proMax += coutDist;

  if (etage >= 3 && !ascenseur) {
    proMin *= 1.3;
    proMax *= 1.3;
  }

  if (!parking) {
    proMin *= 1.15;
    proMax *= 1.15;
  }

  return { min: Math.round(proMin), max: Math.round(proMax) };
}
