import { Package, PackagePlus, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import './Inventaire.css';
import PieceCard from './PieceCard';
import { OBJETS_A_EMBALLER, OBJETS_PREDEFINIS } from './listes';

export default function Inventaire({ pieces, setPieces, demenagementId }) {
  const [value, setValue] = useState('');
  const [listeObjets, setListeObjets] = useState(OBJETS_PREDEFINIS);
  const [listeEmballer, setListeEmballer] = useState(OBJETS_A_EMBALLER);
  const [persoNom, setPersoNom] = useState('');
  const [persoH, setPersoH] = useState('');
  const [persoL, setPersoL] = useState('');
  const [persol, setPersol] = useState('');
  const [persoType, setPersoType] = useState('meuble');
  const [persoCarton, setPersoCarton] = useState('petit');

  useEffect(() => {
    chargerObjetsPersonnels();
  }, []);

  async function chargerObjetsPersonnels() {
    try {
      const reponse = await fetch('http://localhost:3000/api/objets-personnels', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await reponse.json();

      const persoMeubles = data.filter((o) => o.type === 'meuble');
      const persoEmballer = data.filter((o) => o.type === 'emballer');

      setListeObjets([...OBJETS_PREDEFINIS, ...persoMeubles]);
      setListeEmballer([...OBJETS_A_EMBALLER, ...persoEmballer]);
    } catch (err) {
      console.error(err);
    }
  }

  async function ajouterPiece(e) {
    e.preventDefault();
    if (value === '') return;

    try {
      const reponse = await fetch('http://localhost:3000/api/pieces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ demenagement_id: demenagementId, nom: value }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        console.error(data.erreur);
        return;
      }

      const nouvellePiece = { id: data.id, nom: value, objets: [], objetsAEmballer: [] };
      setPieces([nouvellePiece, ...pieces]);
      setValue('');
    } catch (err) {
      console.error(err);
    }
  }

  async function ajouterObjet(pieceId, objetSelectionne, quantite) {
    try {
      const reponse = await fetch('http://localhost:3000/api/objets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          piece_id: pieceId,
          nom: objetSelectionne.nom,
          volume: objetSelectionne.volume,
          quantite,
          type: 'meuble',
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        console.error(data.erreur);
        return;
      }

      const nouvelObjet = {
        id: data.id,
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
    } catch (err) {
      console.error(err);
    }
  }

  async function ajouterObjetAEmballer(pieceId, objetAEmballerSelectionne, quantiteEmballer) {
    try {
      const reponse = await fetch('http://localhost:3000/api/objets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          piece_id: pieceId,
          nom: objetAEmballerSelectionne.nom,
          volume: objetAEmballerSelectionne.volume,
          quantite: quantiteEmballer,
          type: 'emballer',
          carton: objetAEmballerSelectionne.carton,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        console.error(data.erreur);
        return;
      }

      const nouvelObjetAEmballer = {
        id: data.id,
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
    } catch (err) {
      console.error(err);
    }
  }
  async function ajouterObjetPerso() {
    const volume = Math.round(((Number(persoH) * Number(persoL) * Number(persol)) / 1000000) * 1000) / 1000;

    try {
      const reponse = await fetch('http://localhost:3000/api/objets-personnels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nom: persoNom,
          volume,
          type: persoType,
          carton: persoType === 'emballer' ? persoCarton : null,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        console.error(data.erreur);
        return;
      }

      const nouvelObjet = { id: data.id, nom: persoNom, volume };
      if (persoType === 'meuble') {
        setListeObjets([...listeObjets, nouvelObjet]);
      } else {
        setListeEmballer([...listeEmballer, { ...nouvelObjet, carton: persoCarton }]);
      }
      setPersoNom('');
      setPersoH('');
      setPersoL('');
      setPersol('');
    } catch (err) {
      console.error(err);
    }
  }

  async function supprimerPiece(pieceId) {
    try {
      await fetch(`http://localhost:3000/api/pieces/${pieceId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setPieces(pieces.filter((piece) => piece.id !== pieceId));
    } catch (err) {
      console.error(err);
    }
  }

  async function supprimerObjet(pieceId, objetID) {
    try {
      await fetch(`http://localhost:3000/api/objets/${objetID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const nouvellesPieces = pieces.map((piece) => {
        if (piece.id === pieceId) {
          return { ...piece, objets: piece.objets.filter((objet) => objet.id !== objetID) };
        }
        return piece;
      });
      setPieces(nouvellesPieces);
    } catch (err) {
      console.error(err);
    }
  }

  async function supprimerObjetAEmballer(pieceId, objetID) {
    try {
      await fetch(`http://localhost:3000/api/objets/${objetID}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

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
    } catch (err) {
      console.error(err);
    }
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
              aria-label="Nom de l'objet personnalisé"
              value={persoNom}
              onChange={(e) => setPersoNom(e.target.value)}
            />
            <select
              className="input"
              aria-label="Type d'objet"
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
              aria-label="Taille de carton"
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
            aria-label="Hauteur en centimètres"
            value={persoH}
            onChange={(e) => setPersoH(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Largeur (cm)"
            aria-label="Largeur en centimètres"
            value={persoL}
            onChange={(e) => setPersoL(e.target.value)}
          />
          <input
            className="input"
            type="number"
            min="0"
            placeholder="Longueur (cm)"
            aria-label="Longueur en centimètres"
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
