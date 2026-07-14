import { Package, Plus, SpellCheck2, Trash2 } from 'lucide-react';
import { useState } from 'react';
import './Inventaire.css';

const OBJETS_PREDEFINIS = [
  { nom: 'Canapé 2 places', volume: 1.0 },
  { nom: 'Canapé 3 places', volume: 1.5 },
  { nom: 'Fauteuil', volume: 0.8 },
  { nom: 'Table à manger (4 personnes)', volume: 1.2 },
  { nom: 'Table à manger (6 personnes)', volume: 1.8 },
  { nom: 'Chaise', volume: 0.3 },
  { nom: 'Lit simple', volume: 1.5 },
  { nom: 'Lit double', volume: 2.5 },
  { nom: 'Matelas simple', volume: 0.8 },
  { nom: 'Matelas double', volume: 1.2 },
  { nom: 'Armoire 2 portes', volume: 2.5 },
  { nom: 'Armoire 3 portes', volume: 3.5 },
  { nom: 'Commode', volume: 1.0 },
  { nom: 'Bureau', volume: 1.2 },
  { nom: 'Bibliothèque', volume: 1.5 },
  { nom: 'Table de chevet', volume: 0.3 },
  { nom: 'Meuble TV', volume: 0.8 },
  { nom: 'Réfrigérateur', volume: 1.2 },
  { nom: 'Congélateur', volume: 1.0 },
  { nom: 'Lave-linge', volume: 0.8 },
  { nom: 'Sèche-linge', volume: 0.8 },
  { nom: 'Lave-vaisselle', volume: 0.8 },
  { nom: 'Four', volume: 0.5 },
  { nom: 'Micro-ondes', volume: 0.2 },
  { nom: 'Télévision', volume: 0.3 },
  { nom: 'Ordinateur de bureau', volume: 0.4 },
  { nom: 'Imprimante', volume: 0.2 },
  { nom: 'Carton petit', volume: 0.05 },
  { nom: 'Carton moyen', volume: 0.1 },
  { nom: 'Carton grand', volume: 0.2 },
  { nom: 'Vélo', volume: 1.0 },
  { nom: 'Tapis (petit)', volume: 0.2 },
  { nom: 'Tapis (grand)', volume: 0.5 },
  { nom: 'Miroir', volume: 0.3 },
  { nom: 'Table basse', volume: 0.5 },
  { nom: 'Étagère', volume: 0.8 },
];

const OBJETS_A_EMBALLER = [
  { nom: 'Assiette', volume: 0.0025, carton: 'petit' },
  { nom: 'Bol / Saladier', volume: 0.003, carton: 'petit' },
  { nom: 'Verre', volume: 0.0008, carton: 'petit' },
  { nom: 'Tasse / Mug', volume: 0.0012, carton: 'petit' },
  { nom: 'Couverts (lot de 6)', volume: 0.0015, carton: 'petit' },
  { nom: 'Livre', volume: 0.0015, carton: 'petit' },
  { nom: 'Magazine / BD', volume: 0.001, carton: 'petit' },
  { nom: 'Classeur / Dossier', volume: 0.004, carton: 'petit' },
  { nom: 'DVD / CD / Jeu vidéo', volume: 0.0004, carton: 'petit' },
  { nom: 'Bouteille (vin, alcool)', volume: 0.0015, carton: 'petit' },
  { nom: 'Conserve / Bocal', volume: 0.0008, carton: 'petit' },
  { nom: 'Outil à main (marteau, tournevis...)', volume: 0.001, carton: 'petit' },
  { nom: 'Cadre photo', volume: 0.002, carton: 'petit' },
  { nom: 'Vase', volume: 0.005, carton: 'petit' },

  { nom: 'Casserole', volume: 0.008, carton: 'standard' },
  { nom: 'Poêle', volume: 0.006, carton: 'standard' },
  { nom: 'Cocotte / Faitout', volume: 0.012, carton: 'standard' },
  { nom: 'Petit électroménager (grille-pain, mixeur...)', volume: 0.015, carton: 'standard' },
  { nom: 'Cafetière / Bouilloire', volume: 0.01, carton: 'standard' },
  { nom: 'Boîte de rangement', volume: 0.02, carton: 'standard' },
  { nom: 'Bibelot / Objet déco', volume: 0.004, carton: 'standard' },
  { nom: 'Jouet', volume: 0.006, carton: 'standard' },
  { nom: 'Peluche', volume: 0.008, carton: 'standard' },
  { nom: 'Chaussures (paire)', volume: 0.006, carton: 'standard' },
  { nom: 'Sac à main', volume: 0.008, carton: 'standard' },
  { nom: 'Produit de salle de bain', volume: 0.0015, carton: 'standard' },
  { nom: 'Serviette de bain', volume: 0.005, carton: 'standard' },
  { nom: 'Plante (petite, en pot)', volume: 0.01, carton: 'standard' },
  { nom: 'Câbles / Chargeurs (lot)', volume: 0.003, carton: 'standard' },
  { nom: 'Clavier / Souris', volume: 0.004, carton: 'standard' },
  { nom: 'Petit appareil électronique', volume: 0.005, carton: 'standard' },

  { nom: 'Vêtement plié (t-shirt, pantalon...)', volume: 0.002, carton: 'grand' },
  { nom: 'Pull / Gilet épais', volume: 0.004, carton: 'grand' },
  { nom: 'Manteau / Veste', volume: 0.008, carton: 'grand' },
  { nom: 'Drap / Housse de couette', volume: 0.006, carton: 'grand' },
  { nom: 'Couverture / Plaid', volume: 0.012, carton: 'grand' },
  { nom: 'Couette', volume: 0.04, carton: 'grand' },
  { nom: 'Oreiller', volume: 0.015, carton: 'grand' },
  { nom: 'Coussin', volume: 0.01, carton: 'grand' },
  { nom: 'Rideau', volume: 0.008, carton: 'grand' },
  { nom: 'Nappe / Linge de table', volume: 0.003, carton: 'grand' },
  { nom: 'Sac de sport', volume: 0.02, carton: 'grand' },
  { nom: 'Abat-jour', volume: 0.02, carton: 'grand' },

  { nom: 'Vêtement sur cintre (chemise, robe...)', volume: 0.008, carton: 'penderie' },
  { nom: 'Costume / Tailleur', volume: 0.015, carton: 'penderie' },
  { nom: 'Manteau long sur cintre', volume: 0.02, carton: 'penderie' },
]

export default function Inventaire({pieces, setPieces}) {
  const [value, setValue] = useState('');
  const [objetSelectionne, setObjetSelectionne] = useState(null);
  const [quantite, setQuantite] = useState(1);
  const [objetAEmballerSelectionne, setObjetAEmballerSelectionne] = useState(null);
  const [quantiteEmballer, setQuantiteEmballer] = useState(1);

  function ajouterPiece(e) {
    e.preventDefault();
    if (value !== '') {
      const nouvellePiece = { id: Date.now(), nom: value, objets: [], objetsAEmballer: [] };
      setPieces([nouvellePiece, ...pieces]);
      setValue('');
    }
  }
  function ajouterObjet(pieceId) {
    const nouvelObjet = {
      id: Date.now(),
      nom: objetSelectionne.nom,
      volume: objetSelectionne.volume,
      quantite: quantite,
    };
    setObjetSelectionne(null);
    setQuantite(1);
    
    const nouvellesPieces = pieces.map((piece) => {
      if (piece.id === pieceId) {
        return { ...piece, objets: [...piece.objets, nouvelObjet] };
      }
      return piece;
    });

    setPieces(nouvellesPieces);
  }

  function ajouterObjetAEmballer(pieceId) {
    const nouvelObjetAEmballer = {
      id: Date.now(),
      nom: objetAEmballerSelectionne.nom,
      volume: objetAEmballerSelectionne.volume,
      quantite: quantiteEmballer,
    };
    setObjetAEmballerSelectionne(null);
    setQuantiteEmballer(1) ;
    
    const nouvellesPieces = pieces.map((piece) => {
      if (piece.id === pieceId) {
        return { ...piece, objetsAEmballer: [...piece.objetsAEmballer, nouvelObjetAEmballer] };
      }
      return piece;
    });

    setPieces(nouvellesPieces);
  }
  function supprimerPiece(pieceId) {
    setPieces(pieces.filter((piece) => piece.id !== pieceId))
  }

  function supprimerObjet(pieceId, objetID) {
    const nouvellesPieces = pieces.map((piece) => {
      if (piece.id === pieceId) {
      return { ...piece, objets: piece.objets.filter((objet) => objet.id !== objetID) };
    }
      return piece;
    });
    setPieces(nouvellesPieces);
  }

  function supprimerObjetAEmballer(pieceId, objetID) {
    const nouvellesPieces = pieces.map((piece) => {
      if (piece.id === pieceId) {
      return { ...piece, objetsAEmballer: piece.objetsAEmballer.filter((objet) => objet.id !== objetID) };
    }
      return piece;
    });
    setPieces(nouvellesPieces);
  }
  
  return (
    <form onSubmit={ajouterPiece}>
      <div className="card inv-ajout">
        <label htmlFor="pièce" className="icon">
          <Package size={22} />
          Ajouter une pièce
        </label>
        <div className="inv-grid">
          <input
            id="pièce"
            name="pièce"
            type="text"
            className="inv-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nom de la pièce (ex: Salon, Chambre...)"
          />
          <button className="btn btn-blue icon" type="submit">
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {pieces.map((piece) => (
        <div key={piece.id} className="card inv-piece">
          <div className="inv-piece-header">
            <h3>{piece.nom}</h3>
            <button className="btn-icon-danger" type="button" onClick={() => supprimerPiece(piece.id)}>
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
              <option value="" disabled>
                Sélectionner un objet
              </option>
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
              onClick={() => ajouterObjet(piece.id)}
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
              <button className="btn-icon-danger" type="button" onClick={() => supprimerObjet(piece.id, objet.id)}>
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
              <option value="" disabled>
                Sélectionner un objet à emballer
              </option>
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
              onClick={() => ajouterObjetAEmballer(piece.id)}
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
              <button className="btn-icon-danger" type="button" onClick={() => supprimerObjetAEmballer(piece.id, objet.id)}>
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ))}
    </form>
  );
}
