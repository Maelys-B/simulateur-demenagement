import { Calendar, Check, ClipboardList, ListPlus, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { calculerTachesAvecDates } from '../../utils/checklist';
import './Checklist.css';

export default function Checklist({
  profil,
  completes,
  setCompletes,
  tachesPerso,
  setTachesPerso,
  tachesPredefinies,
  setTachesPredefinies,
}) {
  const [nouvelleTache, setNouvelleTache] = useState({
    titre: '',
    description: '',
    dateLimite: '',
    type: 'Demarche',
  });

  const toggleComplete = (id) => {
    setCompletes((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const supprimerTache = (id, personnalisee) => {
    if (personnalisee) {
      setTachesPerso((prev) => prev.filter((t) => t.id !== id));
    } else {
      setTachesPredefinies((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const toutesLesTaches = calculerTachesAvecDates(tachesPredefinies, tachesPerso, profil);

  const progression = Math.round((completes.length / toutesLesTaches.length) * 100);

  function ajouterTache() {
    if (!nouvelleTache.titre.trim() || !nouvelleTache.dateLimite) return;

    setTachesPerso((prev) => [
      ...prev,
      {
        id: `perso-${Date.now()}`,
        titre: nouvelleTache.titre.trim(),
        description: nouvelleTache.description.trim(),
        dateEcheance: new Date(nouvelleTache.dateLimite),
        type: nouvelleTache.type,
        personnalisee: true,
      },
    ]);

    setNouvelleTache({ titre: '', description: '', dateLimite: '', type: 'Demarche' });
  }
  return (
    <div>
      <div className="card chk-header">
        <div className="chk-header-top">
          <h2 className="icon chk-title">
            <ClipboardList size={20} />
            Checklist administrative
          </h2>
          <span className="chk-compteur">
            {completes.length}/{toutesLesTaches.length} tâches complétées
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progression}%` }} />
        </div>
      </div>
      <div className="card">
        {toutesLesTaches.map((tache) => (
          <div
            key={tache.id}
            className={`chk-card ${tache.enRetard ? 'chk-card--late' : ''} ${tache.enUrgence ? 'chk-card--urgent' : ''} ${completes.includes(tache.id) ? 'chk-card--done' : ''}`}
          >
            <button
              className={`chk-checkbox ${completes.includes(tache.id) ? 'chk-checkbox--checked' : ''}`}
              onClick={() => toggleComplete(tache.id)}
            >
              {completes.includes(tache.id) && <Check size={14} color="#16a34a " strokeWidth={3} />}
            </button>
            <div className="chk-card-item">
              <div className="chk-section-badge">
                <div className="chk-section-texte">
                  <span
                    className={`chk-item-title ${completes.includes(tache.id) ? 'chk-item-title--done' : ''}`}
                  >
                    {tache.titre}
                  </span>
                  <span className="chk-item-description">{tache.description}</span>
                </div>
                <div className="icon">
                  <span className={`chk-item-type chk-item-type--${tache.type}`}>{tache.type}</span>
                  <button
                    className="btn-icon-danger"
                    onClick={() => supprimerTache(tache.id, tache.personnalisee)}
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
                  <span className="chk-item-badge chk-item-badge--late">En retard</span>
                )}
                {tache.enUrgence && (
                  <span className="chk-item-badge chk-item-badge--urgent">Urgent</span>
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
            value={nouvelleTache.titre}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, titre: e.target.value })}
            className="input"
          />
          <textarea
            placeholder="Description (facultatif)"
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
              value={nouvelleTache.dateLimite}
              onChange={(e) => setNouvelleTache({ ...nouvelleTache, dateLimite: e.target.value })}
              className="header-date"
            />
          </div>
          <select
            value={nouvelleTache.type}
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
    </div>
  );
}
