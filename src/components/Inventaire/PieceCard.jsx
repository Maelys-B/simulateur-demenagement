import { Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

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
      <div className="inv-piece-header">
        <h3>{piece.nom}</h3>
        <button
          className="btn-icon-danger"
          type="button"
          onClick={() => onSupprimerPiece(piece.id)}
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="inv-piece-add">
        <div className="inv-recherche-wrapper">
          <input
            type="text"
            className="input inv-recherche-input"
            placeholder="Rechercher un objet..."
            autoComplete="off"
            value={objetSelectionne ? objetSelectionne.nom : recherche}
            onChange={(e) => {
              setRecherche(e.target.value);
              setObjetSelectionne(null);
              setListeVisible(true);
            }}
            onFocus={() => setListeVisible(true)}
            onBlur={() => setTimeout(() => setListeVisible(false), 150)}
          />
          {listeVisible && resultats.length > 0 && (
            <ul className="inv-recherche-liste">
              <div className="inv-recherche-liste-inner">
                {resultats.map((o) => (
                  <li
                    key={o.nom}
                    className="inv-recherche-item"
                    onMouseDown={() => {
                      setObjetSelectionne(o);
                      setRecherche('');
                      setListeVisible(false);
                    }}
                  >
                    <span>{o.nom}</span>
                    <span className="inv-recherche-volume">{o.volume} m³</span>
                  </li>
                ))}
              </div>
            </ul>
          )}
        </div>
        <input
          type="number"
          min="1"
          className="input"
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
            onClick={() => onSupprimerObjet(piece.id, objet.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}

      <div className="inv-piece-add">
        <div className="inv-recherche-wrapper">
          <input
            type="text"
            className="input inv-recherche-input"
            placeholder="Rechercher un objet à emballer..."
            autoComplete="off"
            value={objetAEmballerSelectionne ? objetAEmballerSelectionne.nom : rechercheEmballer}
            onChange={(e) => {
              setRechercheEmballer(e.target.value);
              setObjetAEmballerSelectionne(null);
              setListeEmballerVisible(true);
            }}
            onFocus={() => setListeEmballerVisible(true)}
            onBlur={() => setTimeout(() => setListeEmballerVisible(false), 150)}
          />
          {listeEmballerVisible && resultatsEmballer.length > 0 && (
            <ul className="inv-recherche-liste">
              <div className="inv-recherche-liste-inner">
                {resultatsEmballer.map((o) => (
                  <li
                    key={o.nom}
                    className="inv-recherche-item"
                    onMouseDown={() => {
                      setObjetAEmballerSelectionne(o);
                      setRechercheEmballer('');
                      setListeEmballerVisible(false);
                    }}
                  >
                    <span>{o.nom}</span>
                    <span className="inv-recherche-volume">{o.volume} m³</span>
                  </li>
                ))}
              </div>
            </ul>
          )}
        </div>
        <input
          type="number"
          min="1"
          className="input"
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
            onClick={() => onSupprimerObjetAEmballer(piece.id, objet.id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
