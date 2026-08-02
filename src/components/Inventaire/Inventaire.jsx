import { Package, PackagePlus, Plus } from 'lucide-react';
import { useState } from 'react';
import './Inventaire.css';
import PieceCard from './PieceCard';
import { OBJETS_A_EMBALLER, OBJETS_PREDEFINIS } from './listes';

export default function Inventaire({ pieces, setPieces }) {
  const [value, setValue] = useState('');
  const [listeObjets, setListeObjets] = useState(OBJETS_PREDEFINIS);
  const [listeEmballer, setListeEmballer] = useState(OBJETS_A_EMBALLER);
  const [persoNom, setPersoNom] = useState('');
  const [persoH, setPersoH] = useState('');
  const [persoL, setPersoL] = useState('');
  const [persol, setPersol] = useState('');
  const [persoType, setPersoType] = useState('meuble');
  const [persoCarton, setPersoCarton] = useState('petit');

  function ajouterPiece(e) {
    e.preventDefault();
    if (value !== '') {
      const nouvellePiece = { id: Date.now(), nom: value, objets: [], objetsAEmballer: [] };
      setPieces([nouvellePiece, ...pieces]);
      setValue('');
    }
  }

  function ajouterObjet(pieceId, objetSelectionne, quantite) {
    const nouvelObjet = {
      id: Date.now(),
      nom: objetSelectionne.nom,
      volume: objetSelectionne.volume,
      quantite,
    };
    setPieces(
      pieces.map((piece) => {
        if (piece.id === pieceId) return { ...piece, objets: [...piece.objets, nouvelObjet] };
        return piece;
      }),
    );
  }

  function ajouterObjetAEmballer(pieceId, objetAEmballerSelectionne, quantiteEmballer) {
    const nouvelObjetAEmballer = {
      id: Date.now(),
      nom: objetAEmballerSelectionne.nom,
      volume: objetAEmballerSelectionne.volume,
      quantite: quantiteEmballer,
      carton: objetAEmballerSelectionne.carton,
    };
    setPieces(
      pieces.map((piece) => {
        if (piece.id === pieceId)
          return { ...piece, objetsAEmballer: [...piece.objetsAEmballer, nouvelObjetAEmballer] };
        return piece;
      }),
    );
  }
  function ajouterObjetPerso() {
    const volume = (Number(persoH) * Number(persoL) * Number(persol)) / 1000000;
    const nouvelObjet = { nom: persoNom, volume: Math.round(volume * 1000) / 1000 };
    if (persoType === 'meuble') {
      setListeObjets([...listeObjets, nouvelObjet]);
    } else {
      setListeEmballer([...listeEmballer, { ...nouvelObjet, carton: persoCarton }]);
    }
    setPersoNom('');
    setPersoH('');
    setPersoL('');
    setPersol('');
  }

  function supprimerPiece(pieceId) {
    setPieces(pieces.filter((piece) => piece.id !== pieceId));
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
        return {
          ...piece,
          objetsAEmballer: piece.objetsAEmballer.filter((objet) => objet.id !== objetID),
        };
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
            className="input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nom de la pièce (ex: Salon, Chambre...)"
          />
          <button className="btn btn-primary icon" type="submit">
            <Plus size={16} />
            Ajouter
          </button>
        </div>
      </div>

      {pieces.map((piece) => (
        <PieceCard
          key={piece.id}
          piece={piece}
          listeObjets={listeObjets}
          listeEmballer={listeEmballer}
          onSupprimerPiece={supprimerPiece}
          onAjouterObjet={ajouterObjet}
          onSupprimerObjet={supprimerObjet}
          onAjouterObjetAEmballer={ajouterObjetAEmballer}
          onSupprimerObjetAEmballer={supprimerObjetAEmballer}
        />
      ))}
      <div className="card form-card">
        <p className="form-title icon">
          <PackagePlus size={20} />
          Ajouter un objet personnalisé
        </p>
        <p className="inv-desc">
          Un objet absent de la liste ? Saisis ses dimensions pour calculer son volume, il sera
          disponible dans la recherche de toutes les pièces.
        </p>
        <div className="form-text">
          <div className="form-grid">
            <input
              className="input"
              placeholder="Nom de l'objet"
              value={persoNom}
              onChange={(e) => setPersoNom(e.target.value)}
            />
            <select
              className="input"
              value={persoType}
              onChange={(e) => setPersoType(e.target.value)}
            >
              <option value="meuble">Meuble / Objet encombrant</option>
              <option value="emballer">Objet à emballer</option>
            </select>
          </div>
          {persoType === 'emballer' && (
            <select
              className="input"
              value={persoCarton}
              onChange={(e) => setPersoCarton(e.target.value)}
            >
              <option value="petit">Petit carton</option>
              <option value="standard">Carton standard</option>
              <option value="grand">Grand carton</option>
            </select>
          )}
        </div>
        <div className="form-ligne">
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Hauteur (cm)"
            value={persoH}
            onChange={(e) => setPersoH(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Largeur (cm)"
            value={persoL}
            onChange={(e) => setPersoL(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Longueur (cm)"
            value={persol}
            onChange={(e) => setPersol(e.target.value)}
          />
        </div>
        <button
          className="btn btn-primary icon form-btn"
          type="button"
          disabled={!persoNom || !persoH || !persoL || !persol}
          onClick={ajouterObjetPerso}
        >
          <Plus size={16} /> Ajouter à la liste
        </button>
      </div>
    </form>
  );
}
