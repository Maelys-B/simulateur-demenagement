import { useState } from 'react';
import {Package} from 'lucide-react'
import './Inventaire.css'
import { isFunctionDeclaration } from 'typescript';

export default function Inventaire() {
  const [value, setValue] = useState('');
  const [pieces, setPieces] = useState([])

  return (
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
        <button className='btn'>+ Ajouter</button>
        </div>
      </div>
      );
}
