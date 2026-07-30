import { Clock, Euro, Package, Shuffle, Truck, Users } from 'lucide-react';
import { useState } from 'react';
import {
  PRIX_CARTONS,
  calculerBudgetPro,
  calculerBudgetSolo,
  calculerCartons,
  calculerCartonsGlobal,
  calculerTemps,
  calculerVolume,
  determinerCamion,
  determinerPersonne,
} from '../../utils/calculs';
import './Calculs.css';

export default function Calculs({ pieces, profil }) {
  const [melangerCartons, setMelangerCartons] = useState(false);
  const volumeTotal = calculerVolume(pieces);
  const tailleCamion = determinerCamion(volumeTotal * 1.15);
  const personneReco = determinerPersonne(volumeTotal);
  const tempsEstime = calculerTemps(volumeTotal, profil.distance, profil.nbPersonnes);
  const cartonsParPiece = calculerCartons(pieces);
  const cartonsGlobal = calculerCartonsGlobal(pieces);

  const coutCartons = melangerCartons
    ? cartonsGlobal.petit.nb * PRIX_CARTONS.petit + cartonsGlobal.standard.nb * PRIX_CARTONS.standard + cartonsGlobal.grand.nb * PRIX_CARTONS.grand
    : cartonsParPiece.reduce(
        (acc, p) =>
          acc +
          p.petit.nb * PRIX_CARTONS.petit +
          p.standard.nb * PRIX_CARTONS.standard +
          p.grand.nb * PRIX_CARTONS.grand,
        0,
      );

  const totalCartons = melangerCartons
    ? { petit: cartonsGlobal.petit.nb, standard: cartonsGlobal.standard.nb, grand: cartonsGlobal.grand.nb }
    : {
        petit: cartonsParPiece.reduce((acc, p) => acc + p.petit.nb, 0),
        standard: cartonsParPiece.reduce((acc, p) => acc + p.standard.nb, 0),
        grand: cartonsParPiece.reduce((acc, p) => acc + p.grand.nb, 0),
      };
  const budgetSolo = calculerBudgetSolo(volumeTotal, profil.distance, coutCartons);
  const budgetPro = calculerBudgetPro(volumeTotal, profil.distance, profil.etage, profil.ascenseur);

  return (
    <div>
      <div className="card calc-section">
        <h2 className="calc-title icon">
          <Truck size={22} /> Résumé des calculs
        </h2>
        <div className="calc-grid">
          <div className="calc-card calc-card--blue">
            <span className="calc-label">Volume total</span>
            <span className="calc-value">{volumeTotal.toFixed(2)} m³</span>
          </div>
          <div className="calc-card calc-card--green">
            <span className="calc-label">Taille de camion</span>
            <span className="calc-value">{tailleCamion}</span>
          </div>
          <div className="calc-card calc-card--purple">
            <span className="calc-label icon"><Users size={14} /> Personnes recommandées</span>
            <span className="calc-value">{personneReco}</span>
          </div>
          <div className="calc-card calc-card--orange">
            <span className="calc-label icon"><Clock size={14} /> Temps estimé</span>
            <span className="calc-value">{tempsEstime.total}</span>
            <span className="calc-detail">({tempsEstime.emballage} emballage + {tempsEstime.chargement} chargement + {tempsEstime.trajet} trajet)</span>
          </div>
        </div>
      </div>

      <div className="card calc-section">
        <h2 className="calc-cartons-title icon">
          <Package size={20} /> Cartons nécessaires
        </h2>
        {melangerCartons ? (
          <div>
            {[
              { label: 'Petits cartons', nb: totalCartons.petit, prix: PRIX_CARTONS.petit },
              { label: 'Cartons standards', nb: totalCartons.standard, prix: PRIX_CARTONS.standard },
              { label: 'Grands cartons', nb: totalCartons.grand, prix: PRIX_CARTONS.grand },
            ].filter((l) => l.nb > 0).map((l) => (
              <div key={l.label} className="calc-cartons-line">
                <span>{l.label} / {l.nb} carton(s)</span>
                <span>{(l.nb * l.prix).toFixed(2)} €</span>
              </div>
            ))}
          </div>
        ) : cartonsParPiece.map((piece) => {
          const lignes = [
            { label: 'Petits cartons', data: piece.petit, prix: PRIX_CARTONS.petit },
            { label: 'Cartons standards', data: piece.standard, prix: PRIX_CARTONS.standard },
            { label: 'Grands cartons', data: piece.grand, prix: PRIX_CARTONS.grand },
          ].filter((l) => l.data.nb > 0);

          if (lignes.length === 0) return null;

          return (
            <div key={piece.nom} className="calc-cartons-piece">
              <span className="calc-cartons-piece-name">{piece.nom}</span>
              {lignes.map((l) => (
                <div key={l.label} className="calc-cartons-line">
                  <span>{l.label} / {l.data.nb} carton(s)</span>
                  <span>{(l.data.nb * l.prix).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="calc-cartons-total">
          <div>
            <label className="icon calc-melanger-label">
              <input
                type="checkbox"
                checked={melangerCartons}
                onChange={(e) => setMelangerCartons(e.target.checked)}
              />
              <Shuffle size={14} /> Mélanger les cartons
            </label>
            <p className="calc-melanger-desc">
              (Regroupe les objets de toutes les pièces par taille de carton, réduit le nombre total grâce à un meilleur remplissage.)
            </p>
          </div>
          <span>{coutCartons.toFixed(2)} €</span>
        </div>
      </div>

      <div className="card calc-section">
        <h2 className="calc-budget-title icon">
          <Euro size={20} />Estimation du budget
        </h2>
        <div className="calc-grid">
          <div className="calc-budget-card calc-card--blue calc-border--blue">
            <span className="calc-budget-label">Déménagement solo</span>
            <span className="calc-budget-value">{budgetSolo.min.toFixed(0)} – {budgetSolo.max.toFixed(0)} €</span>
            <p className="calc-budget-detail">Location camion + cartons + carburant</p>
          </div>
          <div className="calc-budget-card calc-card--green calc-border--green">
            <span className="calc-budget-label">Déménagement professionnel</span>
            <span className="calc-budget-value">{budgetPro.min.toFixed(0)} – {budgetPro.max.toFixed(0)} €</span>
            <p className="calc-budget-detail">Service complet avec déménageurs</p>
          </div>
        </div>
      </div>
    </div>
  );
}
