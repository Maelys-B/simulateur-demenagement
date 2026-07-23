import { Clock, Euro, Package, Truck, Users } from 'lucide-react';
import {
  calculerBudgetPro,
  calculerBudgetSolo,
  calculerCartons,
  calculerTemps,
  calculerVolume,
  determinerCamion,
  determinerPersonne,
} from '../../utils/calculs';
import './Calculs.css';

export default function Calculs({ pieces, profil }) {
  const volumeTotal = calculerVolume(pieces);
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
        {cartonsParPiece.map((piece) => {
          const lignes = [
            { label: 'Petits cartons', data: piece.petit },
            { label: 'Cartons standards', data: piece.standard },
            { label: 'Grands cartons', data: piece.grand },
          ].filter((l) => l.data.nb > 0);

          if (lignes.length === 0) return null;

          return (
            <div key={piece.nom} className="calc-cartons-piece">
              <span className="calc-cartons-piece-name">{piece.nom}</span>
              {lignes.map((l) => (
                <div key={l.label} className="calc-cartons-line">
                  <span>{l.label} / {l.data.nb} carton(s)</span>
                  <span>{(l.data.nb * 1.5).toFixed(2)} €</span>
                </div>
              ))}
            </div>
          );
        })}
        <div className="calc-cartons-total">
          <span>Total cartons</span>
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
