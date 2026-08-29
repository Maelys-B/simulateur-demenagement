import { useEffect, useState } from 'react';
import './MesDemenagements.css';
import { HandHelping } from 'lucide-react';

export default function MesDemenagements({ onSelectionner }) {
  const [demenagements, setDemenagements] = useState([]);
  const [erreur, setErreur] = useState('');
  const [dateDemenagement, setDateDemenagement] = useState('');
  const [typeProfil, setTypeProfil] = useState('solo');

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
        body: JSON.stringify({ date_demenagement: dateDemenagement, type_profil: typeProfil }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        setErreur(data.erreur);
        return;
      }

      setDateDemenagement('');
      setTypeProfil('solo');
      chargerDemenagements();
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  async function modifierDemenagement(id, nouvelleDate, nouveauType) {
    try {
      const reponse = await fetch(`http://localhost:3000/api/demenagements/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ date_demenagement: nouvelleDate, type_profil: nouveauType }),
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
      <h2>Mes déménagements</h2>

      {erreur && <p className="mes-demenagements-erreur">{erreur}</p>}

      <form className="mes-demenagements-form" onSubmit={creerDemenagement}>
        <input
          type="date"
          className="input"
          value={dateDemenagement}
          onChange={(e) => setDateDemenagement(e.target.value)}
          required
        />
        <select
          className="input"
          value={typeProfil}
          onChange={(e) => setTypeProfil(e.target.value)}
        >
          <option value="solo">Solo</option>
          <option value="plusieurs">Je me fais aider</option>
          <option value="pro">Professionnel</option>
        </select>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>

      <ul className="mes-demenagements-liste">
        {demenagements.map((d) => (
          <li key={d.id} className="mes-demenagements-item">
            <button
              type="button"
              className="mes-demenagements-select"
              onClick={() => onSelectionner(d.id)}
            >
              {d.date_demenagement} — {d.type_profil}
            </button>
            <button
              type="button"
              className="btn-icon-danger"
              onClick={() => supprimerDemenagement(d.id)}
              aria-label={`Supprimer le déménagement du ${d.date_demenagement}`}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
