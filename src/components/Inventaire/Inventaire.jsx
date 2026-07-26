import { Package, Plus } from 'lucide-react';
import { useState } from 'react';
import './Inventaire.css';
import PieceCard from './PieceCard';


export default function Inventaire({pieces, setPieces}) {
  const [value, setValue] = useState('');

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
    setPieces(pieces.map((piece) => {
      if (piece.id === pieceId) return { ...piece, objets: [...piece.objets, nouvelObjet] };
      return piece;
    }));
  }

  function ajouterObjetAEmballer(pieceId, objetAEmballerSelectionne, quantiteEmballer) {
    const nouvelObjetAEmballer = {
      id: Date.now(),
      nom: objetAEmballerSelectionne.nom,
      volume: objetAEmballerSelectionne.volume,
      quantite: quantiteEmballer,
      carton: objetAEmballerSelectionne.carton,
    };
    setPieces(pieces.map((piece) => {
      if (piece.id === pieceId) return { ...piece, objetsAEmballer: [...piece.objetsAEmballer, nouvelObjetAEmballer] };
      return piece;
    }));
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
          onSupprimerPiece={supprimerPiece}
          onAjouterObjet={ajouterObjet}
          onSupprimerObjet={supprimerObjet}
          onAjouterObjetAEmballer={ajouterObjetAEmballer}
          onSupprimerObjetAEmballer={supprimerObjetAEmballer}
        />
      ))}
    </form>
  );
}
