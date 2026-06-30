import { useState } from 'react';
import {Package, Plus} from 'lucide-react'
import './Inventaire.css'

export default function Inventaire() {
  const [value, setValue] = useState('');
  const [pieces, setPieces] = useState([])
  function ajouterPiece(e) {
    e.preventDefault()
    if(value !== ''){
      const nouvellePiece = { id: Date.now(), nom: value, objets: [] };
      setPieces([nouvellePiece, ...pieces ]);
    }
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
        <button className='btn icon' type="submit"><Plus size={16}/>Ajouter</button>
        </div>
  </div>
  <div>
    {pieces.map((piece) => <div key={piece.id}>{piece.nom}</div>)}
  </div>
</form>
      );
}
