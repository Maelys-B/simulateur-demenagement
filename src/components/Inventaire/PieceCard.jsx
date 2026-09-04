import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';

export default function PieceCard({
  piece,
  listeObjets,
  listeEmballer,
  onSupprimerPiece,
  onAjouterObjet,
  onSupprimerObjet,
  onAjouterObjetAEmballer,
  onSupprimerObjetAEmballer,
}) {
  const [confirmation, setConfirmation] = useState(null);
  const [annonce, setAnnonce] = useState('');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [recherche, setRecherche] = useState('');
  const [listeVisible, setListeVisible] = useState(false);
  const [objetAEmballerSelectionne, setObjetAEmballerSelectionne] = useState(null);
  const [quantiteEmballer, setQuantiteEmballer] = useState(1);
  const [rechercheEmballer, setRechercheEmballer] = useState('');
  const [listeEmballerVisible, setListeEmballerVisible] = useState(false);

  const resultats = listeObjets.filter((o) =>
    o.nom.toLowerCase().includes(recherche.toLowerCase()),
  );

  const resultatsEmballer = listeEmballer.filter((o) =>
    o.nom.toLowerCase().includes(rechercheEmballer.toLowerCase()),
  );

  return (
    <div className="card inv-piece">
      <p className="sr-only" role="status" aria-live="polite">
        {annonce}
      </p>
      <div className="inv-piece-header">
        <h3>{piece.nom}</h3>
        <button
          className="btn-icon-danger"
          type="button"
          aria-label={`Supprimer la pièce ${piece.nom}`}
          onClick={() =>
            setConfirmation({
              message: `Supprimer la pièce ${piece.nom} et tout son contenu ?`,
              onConfirmer: () => {
                onSupprimerPiece(piece.id, piece.nom);
                setConfirmation(null);
              },
            })
          }
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="inv-piece-add">
        <div
          className="inv-recherche-wrapper"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setListeVisible(false);
            }
          }}
        >
          <input
            type="text"
            className="input inv-recherche-input"
            placeholder="Rechercher un objet..."
            aria-label="Rechercher un objet à ajouter"
            autoComplete="off"
            value={objetSelectionne ? objetSelectionne.nom : recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setObjetSelectionne(null);
              setListeVisible(true);
            }}
            onFocus={() => setListeVisible(true)}
          />
          {listeVisible && resultats.length > 0 && (
            <div className="inv-recherche-liste">
              <ul className="inv-recherche-liste-inner">
                {resultats.map((o) => {
                  const selectionner = () => {
                    setObjetSelectionne(o);
                    setRecherche('');
                    setListeVisible(false);
                  };
                  return (
                    <li key={o.nom}>
                      <button
                        type="button"
                        className="inv-recherche-item"
                        onMouseDown={selectionner}
                        onClick={selectionner}
                      >
                        <span>{o.nom}</span>
                        <span className="inv-recherche-volume">{o.volume} m³</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <input
          type="number"
          min="1"
          className="input"
          aria-label="Quantité"
          value={quantite}
          onChange={(e) => setQuantite(Number(e.target.value))}
        />
        <button
          className="btn btn-primary icon"
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
          <button
            className="btn-icon-danger"
            type="button"
            aria-label={`Supprimer l'objet ${objet.nom}`}
            onClick={() =>
              setConfirmation({
                message: `Supprimer l'objet ${objet.nom} ?`,
                onConfirmer: () => {
                  onSupprimerObjet(piece.id, objet.id);
                  setConfirmation(null);
                  setAnnonce(`Vous avez supprimé l'objet ${objet.nom}`);
                },
              })
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <div className="inv-piece-add">
        <div
          className="inv-recherche-wrapper"
          onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
              setListeEmballerVisible(false);
            }
          }}
        >
          <input
            type="text"
            className="input inv-recherche-input"
            placeholder="Rechercher un objet à emballer..."
            aria-label="Rechercher un objet à emballer"
            autoComplete="off"
            value={objetAEmballerSelectionne ? objetAEmballerSelectionne.nom : rechercheEmballer}
            onChange={(e) => {
              setRechercheEmballer(e.target.value);
              setObjetAEmballerSelectionne(null);
              setListeEmballerVisible(true);
            }}
            onFocus={() => setListeEmballerVisible(true)}
          />
          {listeEmballerVisible && resultatsEmballer.length > 0 && (
            <div className="inv-recherche-liste">
              <ul className="inv-recherche-liste-inner">
                {resultatsEmballer.map((o) => {
                  const selectionner = () => {
                    setObjetAEmballerSelectionne(o);
                    setRechercheEmballer('');
                    setListeEmballerVisible(false);
                  };
                  return (
                    <li key={o.nom}>
                      <button
                        type="button"
                        className="inv-recherche-item"
                        onMouseDown={selectionner}
                        onClick={selectionner}
                      >
                        <span>{o.nom}</span>
                        <span className="inv-recherche-volume">{o.volume} m³</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        <input
          type="number"
          min="1"
          className="input"
          aria-label="Quantité à emballer"
          value={quantiteEmballer}
          onChange={(e) => setQuantiteEmballer(Number(e.target.value))}
        />
        <button
          className="btn btn-primary icon"
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
          <button
            className="btn-icon-danger"
            type="button"
            aria-label={`Supprimer l'objet ${objet.nom}`}
            onClick={() =>
              setConfirmation({
                message: `Supprimer l'objet ${objet.nom} ?`,
                onConfirmer: () => {
                  onSupprimerObjetAEmballer(piece.id, objet.id);
                  setConfirmation(null);
                  setAnnonce(`Vous avez supprimé l'objet ${objet.nom}`);
                },
              })
            }
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      {confirmation && (
        <ConfirmModal
          titre="SUPPRESSION"
          message={confirmation.message}
          onConfirmer={confirmation.onConfirmer}
          onAnnuler={() => setConfirmation(null)}
        />
      )}
    </div>
  );
}
