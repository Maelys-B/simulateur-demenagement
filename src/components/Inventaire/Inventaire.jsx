import { useState } from 'react';
import {Package, Plus} from 'lucide-react'
import './Inventaire.css'

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
]

export default function Inventaire() {
  const [value, setValue] = useState('');
  const [pieces, setPieces] = useState([])
  const [objetSelectionne, setObjetSelectionne] = useState(OBJETS_PREDEFINIS[0])
  const [quantite, setQuantite] = useState(1)

  function ajouterPiece(e) {
    e.preventDefault()
    if(value !== ''){
      const nouvellePiece = { id: Date.now(), nom: value, objets: [] };
      setPieces([nouvellePiece, ...pieces ]);
      setValue('');
    }
  }
  function ajouterObjet(pieceId){
  const nouvelObjet = { nom: objetSelectionne.nom, volume: objetSelectionne.volume, quantite: quantite }
  const nouvellesPieces = pieces.map((piece) => {
    if (piece.id === pieceId) {
      return { ...piece, objets: [...piece.objets, nouvelObjet] }
    }
    return piece
  })

  setPieces(nouvellesPieces)
  }
  return (
  <form onSubmit={ajouterPiece}>

      <div className="inv-ajout">
          <label htmlFor="pièce" className="icon">
            <Package size={20}/>Ajouter une pièce
          </label>
        <div className='grid'>
          <input
            id="pièce"
            name="pièce"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Nom de la pièce (ex: Salon, Chambre...)"
          />
          <button className='btn btn-blue icon' type="submit"><Plus size={16}/>Ajouter</button>
        </div>
      </div>
    
      <label htmlFor="type">
        {pieces.map((piece) => <div key={piece.id}>
          <div className='inv-ajout'>
            {piece.nom}
            <div className='grid'>
              <select
                id="type"
                name="type"
                value={objetSelectionne.nom}
                onChange={(e) => {
                  const objet = OBJETS_PREDEFINIS.find((o) => o.nom === e.target.value)
                  setObjetSelectionne(objet)
                }}
              >
                {OBJETS_PREDEFINIS.map((objet) => <option key={objet.nom} value={objet.nom}>{objet.nom} ({objet.volume}m³)</option>)}
              </select>
              <button className='btn btn-blue icon' type="button" onClick={() => ajouterObjet(piece.id)}><Plus size={16}/>Ajouter</button>
              </div>
              {piece.objets.map((objet) => (<div key={objet.nom}>{objet.nom} × {objet.quantite} ({objet.volume}m³)</div>
            ))}
          </div>
        </div>
      )}</label>
  </form>
      );
}
