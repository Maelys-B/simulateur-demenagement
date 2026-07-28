import { useState } from 'react';
import { Check, Calendar, Plus, ListPlus, Trash2, ClipboardList } from 'lucide-react';
import './Checklist.css'

export const TACHES_PREDEFINIES = [
    {
      id: 'bail-preavis',
      titre: 'Résilier le bail / Préavis',
      description:
        'Envoyer un courrier recommandé avec accusé de réception à votre propriétaire (1 à 3 mois de préavis selon la zone et le type de location)',
      joursAvant: 90,
      type: 'Resiliation',
    },
    {
      id: 'assurance-habitation-resil',
      titre: 'Résilier assurance habitation',
      description: 'Informer votre assureur de votre déménagement et résilier le contrat du logement actuel',
      joursAvant: 30,
      type: 'Resiliation',
    },
    {
      id: 'internet-resil',
      titre: 'Résilier / transférer Internet et téléphone',
      description: 'Prévoir environ 10 jours de délai pour la résiliation ou le transfert de ligne',
      joursAvant: 21,
      type: 'Resiliation',
    },
    {
      id: 'energie-resil',
      titre: 'Résilier électricité et gaz',
      description: 'Contacter votre fournisseur et relever les compteurs le jour du départ',
      joursAvant: 14,
      type: 'Resiliation',
    },
    {
      id: 'eau-resil',
      titre: 'Résilier le contrat d\'eau',
      description: 'Uniquement si le contrat est à votre nom (souvent inclus dans les charges en appartement)',
      joursAvant: 14,
      type: 'Resiliation',
    },

    {
      id: 'assurance-habitation-nouv',
      titre: 'Souscrire assurance habitation',
      description: 'Obligatoire avant l\'entrée dans les lieux — l\'attestation est demandée à la remise des clés',
      joursAvant: 14,
      type: 'Souscription',
    },
    {
      id: 'energie-souscription',
      titre: 'Ouvrir les compteurs électricité et gaz',
      description: 'Souscrire un contrat pour le nouveau logement, prévoir 5 à 15 jours de délai',
      joursAvant: 15,
      type: 'Souscription',
    },
    {
      id: 'eau-souscription',
      titre: 'Ouvrir le contrat d\'eau',
      description: 'Contacter le service des eaux de la nouvelle commune',
      joursAvant: 10,
      type: 'Souscription',
    },
    {
      id: 'internet-souscription',
      titre: 'Souscrire Internet et téléphone',
      description: 'Commander votre box — comptez 2 à 4 semaines si une intervention technique est nécessaire',
      joursAvant: 21,
      type: 'Souscription',
    },

    {
      id: 'poste-reexpedition',
      titre: 'Contrat de réexpédition du courrier',
      description: 'Souscrire auprès de La Poste pour faire suivre votre courrier (6 ou 12 mois)',
      joursAvant: 10,
      type: 'Demarche',
    },
    {
      id: 'stationnement',
      titre: 'Demander une autorisation de stationnement',
      description: 'À faire en mairie pour réserver un emplacement au camion le jour J (délai variable selon la commune)',
      joursAvant: 20,
      type: 'Demarche',
    },
    {
      id: 'etat-des-lieux',
      titre: 'Planifier l\'état des lieux de sortie',
      description: 'Prendre rendez-vous avec le propriétaire ou l\'agence',
      joursAvant: 14,
      type: 'Demarche',
    },
    {
      id: 'securite-sociale',
      titre: 'Signaler le changement d\'adresse à la Sécurité sociale',
      description: 'Via votre compte Ameli — pensez aussi à votre mutuelle',
      joursAvant: 0,
      type: 'Demarche',
    },
    {
      id: 'caf',
      titre: 'Mettre à jour l\'adresse à la CAF',
      description: 'Important si vous percevez des aides au logement (APL), le montant peut changer',
      joursAvant: 0,
      type: 'Demarche',
    },
    {
      id: 'impots',
      titre: 'Déclarer le changement d\'adresse aux impôts',
      description: 'Via impots.gouv.fr, rubrique "Gérer mon prélèvement à la source"',
      joursAvant: -7,
      type: 'Demarche',
    },
    {
      id: 'banque',
      titre: 'Prévenir la banque et les assurances',
      description: 'Mise à jour de l\'adresse pour les relevés et contrats (auto, santé, prévoyance)',
      joursAvant: -7,
      type: 'Demarche',
    },
    {
      id: 'employeur',
      titre: 'Informer l\'employeur',
      description: 'Mise à jour du dossier RH, utile pour les remboursements de transport',
      joursAvant: -7,
      type: 'Demarche',
    },
    {
      id: 'carte-grise',
      titre: 'Mettre à jour la carte grise',
      description: 'Obligatoire dans le mois suivant le déménagement, via ANTS (gratuit)',
      joursAvant: -30,
      type: 'Demarche',
    },
    {
      id: 'liste-electorale',
      titre: 'S\'inscrire sur les listes électorales',
      description: 'À faire en mairie ou en ligne sur service-public.fr',
      joursAvant: -30,
      type: 'Demarche',
    },
    {
      id: 'medecin-traitant',
      titre: 'Déclarer un nouveau médecin traitant',
      description: 'Si vous changez de région — formulaire à remplir avec le nouveau praticien',
      joursAvant: -60,
      type: 'Demarche',
    },
];

export default function Checklist({ profil }) {
  const [completes, setCompletes] = useState([]);
  const [nouvelleTache, setNouvelleTache] = useState({
  titre: '',
  description: '',   
  dateLimite: '',
  type: 'Demarche',
})
  const [tachesPerso, setTachesPerso] = useState([]);
  const [tachesPredefinies, setTachesPredefinies] = useState(TACHES_PREDEFINIES);

  const toggleComplete = (id) => {
    setCompletes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const supprimerTache = (id, personnalisee) => {
    if (personnalisee) {
      setTachesPerso((prev) => prev.filter((t) => t.id !== id));
    } else {
      setTachesPredefinies((prev) => prev.filter((t) => t.id !== id));
    }
  };


  const now = new Date();

  const tachesAvecDates = tachesPredefinies.map((item) => {
    const dateEcheance = new Date(profil.dateDemenagement);
    dateEcheance.setDate(dateEcheance.getDate() - item.joursAvant);
    return { ...item, dateEcheance };
  });

  const toutesLesTaches = [...tachesAvecDates, ...tachesPerso]
    .map((t) => {
      const enRetard = t.dateEcheance < now;
      const enUrgence = !enRetard && t.dateEcheance <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return { ...t, enRetard, enUrgence };
    })
    .sort((a, b) => a.dateEcheance - b.dateEcheance);

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
      <div className='card chk-header'>
        <div className='chk-header-top'>
          <h2 className='icon chk-title'><ClipboardList size={20} />Checklist administrative</h2>
          <span className='chk-compteur'>{completes.length}/{toutesLesTaches.length} tâches complétées</span>
        </div>
        <div className='progress-bar-track'>
          <div className='progress-bar-fill' style={{ width: `${progression}%` }} />
        </div>
      </div>
      <div className='card'>
        {toutesLesTaches.map((tache) => (
          <div key={tache.id} className={`chk-card ${tache.enRetard ? 'chk-card--late' : ''} ${tache.enUrgence ? 'chk-card--urgent' : ''} ${completes.includes(tache.id) ? 'chk-card--done' : ''}`}>
            <button className={`chk-checkbox ${completes.includes(tache.id) ? 'chk-checkbox--checked' : ''}`} onClick={() => toggleComplete(tache.id)}>
              {completes.includes(tache.id) && <Check size={14} color="#16a34a " strokeWidth={3} />}
            </button>
            <div className='chk-card-item'>
              <div className='chk-section-badge'>
                <div className='chk-section-texte'>
                  <span className={`chk-item-title ${completes.includes(tache.id) ? 'chk-item-title--done' : ''}`}>{tache.titre}</span>
                  <span className="chk-item-description">{tache.description}</span>
                </div>
                <div className='icon'>
                  <span className={`chk-item-type chk-item-type--${tache.type}`}>{tache.type}</span>
                  <button className='btn-icon-danger' onClick={() => supprimerTache(tache.id, tache.personnalisee)}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <div className='chk-section-date'>
                <span className="chk-item-date icon"><Calendar size={14} color="#4A5565"/>{tache.dateEcheance.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                {tache.enRetard && <span className="chk-item-badge chk-item-badge--late">En retard</span>}
                {tache.enUrgence && <span className="chk-item-badge chk-item-badge--urgent">Urgent</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="card chk-form">
        <h3 className='chk-form-title icon'><ListPlus size={20} />Ajouter une tâche</h3>
        <div className='chk-form-text'>
          <input
            type="text"
            placeholder="Titre (ex: Prévenir la crèche)"
            value={nouvelleTache.titre}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, titre: e.target.value })}
            className='input'
          />
          <textarea
            placeholder="Description (facultatif)"
            rows={2}
            value={nouvelleTache.description}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, description: e.target.value })}
            className='input'
          />
        </div>
        <div className="chk-form-ligne">
          <div className='icon header-date-wrapper' style={{ gap: 'var(--spacing-md)!important' }}>
            <span style={{ marginLeft: 'var(--spacing-xs)' }}><Calendar size={16} color="#4A5565"/></span>
            <input
              type="date"
              min="2000-01-01"
              max="9999-12-31"
              value={nouvelleTache.dateLimite}
              onChange={(e) => setNouvelleTache({ ...nouvelleTache, dateLimite: e.target.value })}
              className='header-date'
            />
          </div>
          <select
            value={nouvelleTache.type}
            onChange={(e) => setNouvelleTache({ ...nouvelleTache, type: e.target.value })}
            className='input'
          >
            <option value="Resiliation">Résiliation</option>
            <option value="Souscription">Souscription</option>
            <option value="Demarche">Démarche</option>
          </select>
        </div>
        <button className="btn btn-primary icon chk-form-btn" type="submit" onClick={ajouterTache}>
          <Plus size={16} /> Ajouter
        </button>
      </div>
    </div>
  );
}
