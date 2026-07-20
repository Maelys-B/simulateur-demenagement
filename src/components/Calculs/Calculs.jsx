import { Package, Clock, Truck, Users } from 'lucide-react';
import './Calculs.css';

const VOLUMES_CARTONS = {
  petit: 0.032,
  standard: 0.058,
  grand: 0.077,
};

export default function Calculs({ pieces, profil }) {
  function calculerVolume() {
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
  function determinerCamion(volume) {
  if (volume <= 5) {
    return 'Voiture + remorque';
  } else if (volume <= 10) {
    return 'Camionnette 10m³ (type Trafic)';
  } else if (volume <= 20) {
    return 'Camion 20m³ (type Master)';
  } else if (volume <= 30) {
    return 'Camion 30m³';
  } else if (volume > 30) {
    return 'Camion 40m³ ou plusieurs rotations';
  }
  }
  function determinerPersonne(volume) {
  if (volume <= 10) {
    return '1 à 2 personnes';
  } else if (volume <= 20) {
    return '2 à 3 personnes';
  } else if (volume <= 30) {
    return '3 à 4 personnes';
  } else if (volume > 30) {
    return '4 personnes +';
  }
  }
  function calculerTemps(volume, distance) {
    const emballage = volume / 5;
    const chargement = volume / 7;
    const trajet = distance / 60 * 2;
    const total = emballage + chargement + trajet
    return {
      emballage: `${Math.floor(emballage)}h${String(Math.round((emballage % 1) * 60)).padStart(2, '0')}`,
      chargement: `${Math.floor(chargement)}h${String(Math.round((chargement % 1) * 60)).padStart(2, '0')}`,
      trajet: `${Math.floor(trajet)}h${String(Math.round((trajet % 1) * 60)).padStart(2, '0')}`,
      total: `${Math.floor(total)}h${String(Math.round((total % 1) * 60)).padStart(2, '0')}`,
    };
  }
  function calculerCartons(piecesData) {
    return piecesData.map((piece) => {
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
  function calculerBudgetSolo(volume, distance, coutCartons) {
    let camionMin;
    let camionMax;

    if (volume <= 5) {
      camionMin = 80; camionMax = 120;
    } else if (volume <= 10) {
      camionMin = 70; camionMax = 170;
    } else if (volume <= 20) {
      camionMin = 120; camionMax = 200;
    } else if (volume <= 30) {
      camionMin = 150; camionMax = 250;
    } else {
      camionMin = 200; camionMax = 300;
    }

    const carburant = distance * 0.55 + 25;

    return {
      min: camionMin + carburant + coutCartons,
      max: camionMax + carburant + coutCartons,
    };
  }

  function calculerBudgetPro(volume, distance, etage, ascenseur) {
    let proMin = volume * 35;
    let proMax = volume * 90;

    if (distance > 300) {
      proMin *= 2; proMax *= 2;
    } else if (distance > 100) {
      proMin *= 1.5; proMax *= 1.5;
    }

    if (etage >= 3 && !ascenseur) {
      proMin *= 1.30; proMax *= 1.30;
    }

    return { min: proMin, max: proMax };
  }

  const volumeTotal = calculerVolume();
  const tailleCamion = determinerCamion(volumeTotal * 1.15);
  const personneReco = determinerPersonne(volumeTotal);
  const tempsEstime = calculerTemps(volumeTotal, profil.distance);
  const cartonsParPiece = calculerCartons(pieces);
  const coutCartons = cartonsParPiece.reduce((acc, p) => acc + (p.petit.nb + p.standard.nb + p.grand.nb) * 1.5, 0);
  const budgetSolo = calculerBudgetSolo(volumeTotal, profil.distance, coutCartons);
  const budgetPro = calculerBudgetPro(volumeTotal, profil.distance, profil.etage, profil.ascenseur);



  return (
    <div>
      <div className="card calc-section">
        <h2 className="calc-titre icon">
          <Truck size={22} /> Résumé des calculs
        </h2>
        <div className="calc-grid">
          <div className="calc-card calc-card--blue">
            <span className="calc-label">Volume total</span>
            <span className="calc-valeur">{volumeTotal.toFixed(2)} m³</span>
          </div>
          <div className="calc-card calc-card--green">
            <span className="calc-label">Taille de camion</span>
            <span className="calc-valeur">{tailleCamion}</span>
          </div>
          <div className="calc-card calc-card--purple">
            <span className="calc-label icon"><Users size={14} /> Personnes recommandées</span>
            <span className="calc-valeur">{personneReco}</span>
          </div>
          <div className="calc-card calc-card--orange">
            <span className="calc-label icon"><Clock size={14} /> Temps estimé</span>
            <span className="calc-valeur">{tempsEstime.total}</span>
            <span className="calc-detail">({tempsEstime.emballage} emballage + {tempsEstime.chargement} chargement + {tempsEstime.trajet} trajet)</span>
          </div>
        </div>    
      </div>
      <div className="card calc-section">
        <h2 className="calc-cartons-titre icon">
          <Package size={20} /> Cartons nécessaires
        </h2>
        {cartonsParPiece.map((piece) => {
          const lignes = [
            { label: 'Petits cartons', data: piece.petit },
            { label: 'Cartons standards', data: piece.standard },
            { label: 'Grands cartons', data: piece.grand },
          ].filter((l) => l.data.nb > 0);

          if (lignes.length === 0) return null;

          return (
            <div key={piece.nom} className="calc-cartons-piece">
              <span className="calc-cartons-piece-nom">{piece.nom}</span>
              {lignes.map((l) => (
                <div key={l.label} className="calc-cartons-ligne">
                  <span>{l.label} / {l.data.nb} carton(s)</span>
                  <span>{(l.data.nb * 1.5).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="calc-cartons-total">
          <span>Total cartons</span>
          <span>
            {cartonsParPiece
              .reduce((acc, p) => acc + (p.petit.nb + p.standard.nb + p.grand.nb) * 1.5, 0)
              .toFixed(2)} €
          </span>
        </div>
      </div>
      <div className="card calc-section">
        <h2 className="calc-cartons-titre">Estimation du budget</h2>
        <div className="calc-budget-ligne">
          <span className="calc-budget-label">Déménagement solo</span>
          <span className="calc-budget-valeur">{budgetSolo.min.toFixed(0)} € – {budgetSolo.max.toFixed(0)} €</span>
        </div>
        <div className="calc-budget-ligne">
          <span className="calc-budget-label">Déménagement professionnel</span>
          <span className="calc-budget-valeur">{budgetPro.min.toFixed(0)} € – {budgetPro.max.toFixed(0)} €</span>
        </div>
      </div>
   </div>
  );
}
