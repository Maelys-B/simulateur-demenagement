import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { OBJETS_A_EMBALLER, OBJETS_PREDEFINIS } from './listes';

export default function PieceCard({ piece, onSupprimerPiece, onAjouterObjet, onSupprimerObjet, onAjouterObjetAEmballer, onSupprimerObjetAEmballer }) {
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [objetAEmballerSelectionne, setObjetAEmballerSelectionne] = useState(null);
  const [quantiteEmballer, setQuantiteEmballer] = useState(1);

  return (
    <div className="card inv-piece">
      <div className="inv-piece-header">
        <h3>{piece.nom}</h3>
        <button className="btn-icon-danger" type="button" onClick={() => onSupprimerPiece(piece.id)}>
          <Trash2 size={18} />
        </button>
      </div>

      <div className="inv-piece-add">
        <select
          className="inv-input"
          value={objetSelectionne ? objetSelectionne.nom : ''}
          onChange={(e) => {
            const objet = OBJETS_PREDEFINIS.find((o) => o.nom === e.target.value) ?? null;
            setObjetSelectionne(objet);
          }}
        >
          <option value="" disabled>Sélectionner un objet</option>
          {OBJETS_PREDEFINIS.map((objet) => (
            <option key={objet.nom} value={objet.nom}>
              {objet.nom} ({objet.volume}m³)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          className="inv-input"
          value={quantite}
          onChange={(e) => setQuantite(Number(e.target.value))}
        />
        <button
          className="btn btn-blue icon"
          type="button"
          disabled={!objetSelectionne}
          onClick={() => {
            onAjouterObjet(piece.id, objetSelectionne, quantite);
            setObjetSelectionne(null);
            setQuantite(1);
          }}
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {piece.objets.map((objet) => (
        <div key={objet.id} className="inv-objet">
          <div className="inv-objet-info">
            <strong>{objet.nom}</strong>
            <span>× {objet.quantite}</span>
            <span className="inv-objet-volume">({objet.volume}m³)</span>
          </div>
          <button className="btn-icon-danger" type="button" onClick={() => onSupprimerObjet(piece.id, objet.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <div className="inv-piece-add">
        <select
          className="inv-input"
          value={objetAEmballerSelectionne ? objetAEmballerSelectionne.nom : ''}
          onChange={(e) => {
            const objet = OBJETS_A_EMBALLER.find((o) => o.nom === e.target.value) ?? null;
            setObjetAEmballerSelectionne(objet);
          }}
        >
          <option value="" disabled>Sélectionner un objet à emballer</option>
          {OBJETS_A_EMBALLER.map((objet) => (
            <option key={objet.nom} value={objet.nom}>
              {objet.nom} ({objet.volume}m³)
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          className="inv-input"
          value={quantiteEmballer}
          onChange={(e) => setQuantiteEmballer(Number(e.target.value))}
        />
        <button
          className="btn btn-blue icon"
          type="button"
          disabled={!objetAEmballerSelectionne}
          onClick={() => {
            onAjouterObjetAEmballer(piece.id, objetAEmballerSelectionne, quantiteEmballer);
            setObjetAEmballerSelectionne(null);
            setQuantiteEmballer(1);
          }}
        >
          <Plus size={16} /> Ajouter
        </button>
      </div>

      {piece.objetsAEmballer.map((objet) => (
        <div key={objet.id} className="inv-objet">
          <div className="inv-objet-info">
            <strong>{objet.nom}</strong>
            <span>× {objet.quantite}</span>
            <span className="inv-objet-volume">({objet.volume}m³)</span>
          </div>
          <button className="btn-icon-danger" type="button" onClick={() => onSupprimerObjetAEmballer(piece.id, objet.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
