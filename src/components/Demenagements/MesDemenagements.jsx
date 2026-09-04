import { LogOut } from 'lucide-react';
import { useEffect, useState } from 'react';
import { TACHES_PREDEFINIES } from '../../utils/checklist';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './MesDemenagements.css';

function ordinal(n) {
  return n === 1 ? '1er' : `${n}ème`;
}

export default function MesDemenagements({
  onSelectionner,
  onDeconnexion,
  dansPopup = false,
  onAnnoncer,
}) {
  const [demenagements, setDemenagements] = useState([]);
  const [erreur, setErreur] = useState('');
  const [nom, setNom] = useState('');
  const [dateDemenagement, setDateDemenagement] = useState('');
  const [confirmation, setConfirmation] = useState(null);
  const [annonce, setAnnonce] = useState('');

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

  async function semerChecklist(demenagementIdCree, dateDemenagementChoisie) {
    const requetes = TACHES_PREDEFINIES.map((tache) => {
      const dateLimite = new Date(dateDemenagementChoisie);
      dateLimite.setDate(dateLimite.getDate() - tache.joursAvant);

      return fetch('http://localhost:3000/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          demenagement_id: demenagementIdCree,
          titre: tache.titre,
          description: tache.description,
          date_limite: dateLimite.toISOString().slice(0, 10),
          type: tache.type,
        }),
      });
    });

    await Promise.all(requetes);
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

      await semerChecklist(data.id, dateDemenagement);

      onAnnoncer?.(`Vous avez créé le déménagement ${nom}`);
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

  async function supprimerDemenagement(id, nomSupprime) {
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
      setAnnonce(`Vous avez supprimé le déménagement ${nomSupprime}`);
    } catch (err) {
      setErreur('Erreur de connexion au serveur');
    }
  }

  return (
    <div className={dansPopup ? 'mes-demenagements mes-demenagements--popup' : 'mes-demenagements'}>

      {!dansPopup && (
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
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {annonce}
      </p>

      <ul className="mes-demenagements-liste">
        {demenagements.map((d, index) => (
          <li key={d.id} className="mes-demenagements-item">
            <button
              type="button"
              className="mes-demenagements-select"
              onClick={() => onSelectionner(d)}
              aria-label={`${ordinal(index + 1)} déménagement : ${d.nom}, ${new Date(d.date_demenagement).toLocaleDateString('fr-FR')}`}
            >
              {d.nom} — {new Date(d.date_demenagement).toLocaleDateString('fr-FR')}
            </button>
            <button
              type="button"
              className="btn-icon-danger"
              onClick={() =>
                setConfirmation({
                  message: `Voulez-vous supprimer "${d.nom}" ?`,
                  onConfirmer: () => {
                    supprimerDemenagement(d.id, d.nom);
                    setConfirmation(null);
                  },
                })
              }
              aria-label={`Supprimer le ${ordinal(index + 1)} déménagement : ${d.nom}`}
            >
              Supprimer
            </button>
          </li>
        ))}
      </ul>

      {erreur && <p className="mes-demenagements-erreur">{erreur}</p>}
        
        
      <form className="mes-demenagements-form" onSubmit={creerDemenagement}>
        <div className='mes-demenagements-date'> 
          <h3>Commencer un nouveau déménagement</h3>
          <input
          type="text"
          className="input"
          placeholder="Nom du déménagement"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          required
          aria-label='Entrer le nom du déménagement que vous souhaitez créer'
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
          aria-label='Entrer la date du déménagement que vous souhaitez créer'
        />
        </div>
        <button type="submit" className="btn btn-primary">
          Créer
        </button>
      </form>

      {confirmation && (
        <ConfirmModal
          titre="SUPPRESSION"
          message={confirmation.message}
          onConfirmer={confirmation.onConfirmer}
          onAnnuler={() => setConfirmation(null)}
        />
      )}

    </div>
  );
}
