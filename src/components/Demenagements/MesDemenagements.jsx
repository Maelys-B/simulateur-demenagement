import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import './MesDemenagements.css';

export default function MesDemenagements({ onSelectionner, onDeconnexion }) {
  const [demenagements, setDemenagements] = useState([]);
  const [erreur, setErreur] = useState('');
  const [nom, setNom] = useState('');
  const [dateDemenagement, setDateDemenagement] = useState('');

  useEffect(() => {
    chargerDemenagements();
  }, []);

  async function chargerDemenagements() {
    try {
      const reponse = await fetch('http://localhost:3000/api/demenagements', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      setDemenagements(data);
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  async function creerDemenagement(e) {
    e.preventDefault();

    try {
      const reponse = await fetch('http://localhost:3000/api/demenagements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nom, date_demenagement: dateDemenagement }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      onSelectionner({
        id: data.id,
        nom,
        date_demenagement: dateDemenagement,
      });
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  async function modifierDemenagement(id, nouveauNom, nouvelleDate, nouveauType) {
    try {
      const reponse = await fetch(`http://localhost:3000/api/demenagements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ nom: nouveauNom, date_demenagement: nouvelleDate, type_profil: nouveauType }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      chargerDemenagements();
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  async function supprimerDemenagement(id) {
    try {
      const reponse = await fetch(`http://localhost:3000/api/demenagements/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      chargerDemenagements();
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  return (
    <div className="mes-demenagements">

      <div className="mes-demenagements-header">
        <h2>Mes déménagements</h2>
        <button
          type="button"
          className="btn-theme-toggle"
          onClick={onDeconnexion}
          aria-label="Se déconnecter"
        >
          <LogOut size={20} />
        </button>
      </div>

      <ul className="mes-demenagements-liste">
        {demenagements.map((d) => (
          <li key={d.id} className="mes-demenagements-item">
            <button
              type="button"
              className="mes-demenagements-select"
              onClick={() => onSelectionner(d)}
            >
              {d.nom} — {new Date(d.date_demenagement).toLocaleDateString('fr-FR')}
            </button>
            <button
              type="button"
              className="btn-icon-danger"
              onClick={() => supprimerDemenagement(d.id)}
              aria-label={`Supprimer ${d.nom}`}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {erreur && <p className="mes-demenagements-erreur">{erreur}</p>}
        
        
      <form className="mes-demenagements-form" onSubmit={creerDemenagement}>
        <div className='mes-demenagements-date'> 
          <h3>Commencer un nouvel déménagement</h3>
          <input
          type="text"
          className="input"
          placeholder="Nom du déménagement"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
        />
        </div>
        <div className='mes-demenagements-date'>
        <label htmlFor='date'>Quand déménagez-vous ?</label>
        <input
          type="date"
          className="input"
          value={dateDemenagement}
          onChange={(e) => setDateDemenagement(e.target.value)}
          required
        />
        </div>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>

    </div>
  );
}
