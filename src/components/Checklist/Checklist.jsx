import { Calendar, Check, ClipboardList, ListPlus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ConfirmModal from '../ConfirmModal/ConfirmModal';
import './Checklist.css';

const LABELS_TYPE = {
  Resiliation: 'Résiliation',
  Souscription: 'Souscription',
  Demarche: 'Démarche',
};

export default function Checklist({ taches, setTaches, demenagementId }) {
  const [confirmation, setConfirmation] = useState(null);
  const [annonce, setAnnonce] = useState('');
  const [nouvelleTache, setNouvelleTache] = useState({
    titre: '',
    description: '',
    dateLimite: '',
    type: 'Demarche',
  });

  async function toggleComplete(tache) {
    try {
      await fetch(`http://localhost:3000/api/checklist/${tache.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          titre: tache.titre,
          description: tache.description,
          date_limite: tache.date_limite,
          type: tache.type,
          complete: !tache.complete,
        }),
      });

      setTaches(taches.map((t) => (t.id === tache.id ? { ...t, complete: !t.complete } : t)));
    } catch (err) {
      console.error(err);
    }
  }

  async function ajouterTache() {
    if (!nouvelleTache.titre.trim() || !nouvelleTache.dateLimite) return;

    try {
      const reponse = await fetch('http://localhost:3000/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          demenagement_id: demenagementId,
          titre: nouvelleTache.titre.trim(),
          description: nouvelleTache.description.trim(),
          date_limite: nouvelleTache.dateLimite,
          type: nouvelleTache.type,
        }),
      });

      const data = await reponse.json();

      if (!reponse.ok) {
        console.error(data.erreur);
        return;
      }

      setTaches([
        ...taches,
        {
          id: data.id,
          titre: nouvelleTache.titre.trim(),
          description: nouvelleTache.description.trim(),
          date_limite: nouvelleTache.dateLimite,
          dateEcheance: new Date(nouvelleTache.dateLimite),
          type: nouvelleTache.type,
          complete: false,
        },
      ]);

      setAnnonce(`Vous avez ajouté la tâche ${nouvelleTache.titre.trim()}`);
      setNouvelleTache({ titre: '', description: '', dateLimite: '', type: 'Demarche' });
    } catch (err) {
      console.error(err);
    }
  }

  async function supprimerTache(id, titreSupprime) {
    try {
      await fetch(`http://localhost:3000/api/checklist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      setTaches(taches.filter((t) => t.id !== id));
      setAnnonce(`Vous avez supprimé la tâche ${titreSupprime}`);
    } catch (err) {
      console.error(err);
    }
  }

  const now = new Date();
  const tachesAffichees = [...taches]
    .map((t) => {
      const enRetard = t.dateEcheance < now;
      const enUrgence =
        !enRetard && t.dateEcheance <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { ...t, enRetard, enUrgence };
    })
    .sort((a, b) => a.dateEcheance - b.dateEcheance);

  const nbCompletes = taches.filter((t) => t.complete).length;
  const progression = taches.length > 0 ? Math.round((nbCompletes / taches.length) * 100) : 0;

  return (
    <div>
      <p className="sr-only" role="status" aria-live="polite">
        {annonce}
      </p>
      <div className="card chk-header">
        <div className="chk-header-top">
          <h2 className="icon chk-title">
            <ClipboardList size={20} />
            Checklist administrative
          </h2>
          <span className="chk-compteur">
            {nbCompletes}/{taches.length} tâches complétées
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progression}%` }} />
        </div>
      </div>
      <div className="card">
        {tachesAffichees.map((tache) => (
          <div
            key={tache.id}
            className={`chk-card ${tache.enRetard ? 'chk-card--late' : ''} ${tache.enUrgence ? 'chk-card--urgent' : ''} ${tache.complete ? 'chk-card--done' : ''}`}
          >
            <button
              className={`chk-checkbox ${tache.complete ? 'chk-checkbox--checked' : ''}`}
              aria-label={tache.complete ? `${tache.titre} — marquer comme terminée` : tache.titre}
              aria-pressed={tache.complete}
              onClick={() => toggleComplete(tache)}
            >
              {tache.complete && <Check size={14} color="#16a34a " strokeWidth={3} />}
            </button>
            <div className="chk-card-item">
              <div className="chk-section-badge">
                <div className="chk-section-texte">
                  <span className={`chk-item-title ${tache.complete ? 'chk-item-title--done' : ''}`}>
                    {tache.titre}
                  </span>
                  <span className="chk-item-description">{tache.description}</span>
                </div>
                <div className="icon">
                  <span className={`chk-item-type chk-item-type--${tache.type}`}>
                    <span className="sr-only">Type de tâche : </span>
                    {LABELS_TYPE[tache.type] || tache.type}
                  </span>
                  <button
                    className="btn-icon-danger"
                    aria-label={`Supprimer ${tache.titre}`}
                    onClick={() =>
                      setConfirmation({
                        message: `Supprimer la tâche ${tache.titre} ?`,
                        onConfirmer: () => {
                          supprimerTache(tache.id, tache.titre);
                          setConfirmation(null);
                        },
                      })
                    }
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className="chk-section-date">
                <span className="chk-item-date icon">
                  <Calendar size={14} color="#4A5565" />
                  {tache.dateEcheance.toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                {tache.enRetard && (
                  <span className="chk-item-badge chk-item-badge--late">
                    <span className="sr-only">Statut : </span>
                    En retard
                  </span>
                )}
                {tache.enUrgence && (
                  <span className="chk-item-badge chk-item-badge--urgent">
                    <span className="sr-only">Statut : </span>
                    Urgent
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card form-card">
        <h3 className="form-title icon">
          <ListPlus size={20} />
          Ajouter une tâche
        </h3>
        <div className="form-text">
          <input
            type="text"
            placeholder="Titre (ex: Prévenir la crèche)"
            aria-label="Titre de la tâche"
            value={nouvelleTache.titre}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, titre: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="Description (facultatif)"
            aria-label="Description de la tâche"
            rows={2}
            value={nouvelleTache.description}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, description: e.target.value })}
            className="input"
          />
        </div>
        <div className="form-ligne">
          <div className="icon header-date-wrapper" style={{ gap: 'var(--spacing-md)!important' }}>
            <span style={{ marginLeft: 'var(--spacing-xs)' }}>
              <Calendar size={16} color="#4A5565" />
            </span>
            <input
              type="date"
              min="2000-01-01"
              max="9999-12-31"
              aria-label="Date limite de la tâche"
              value={nouvelleTache.dateLimite}
              onChange={(e) => setNouvelleTache({ ...nouvelleTache, dateLimite: e.target.value })}
              className="header-date"
            />
          </div>
          <select
            value={nouvelleTache.type}
            aria-label="Type de tâche"
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, type: e.target.value })}
            className="input"
          >
            <option value="Resiliation">Résiliation</option>
            <option value="Souscription">Souscription</option>
            <option value="Demarche">Démarche</option>
          </select>
        </div>
        <button className="btn btn-primary icon form-btn" type="submit" onClick={ajouterTache}>
          <Plus size={16} /> Ajouter
        </button>
      </div>

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
