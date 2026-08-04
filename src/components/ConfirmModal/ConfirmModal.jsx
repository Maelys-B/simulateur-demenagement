import { AlertTriangle } from 'lucide-react';
import './ConfirmModal.css';

export default function ConfirmModal({ titre, message, onConfirmer, onAnnuler }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <div className="confirm-icon">
          <AlertTriangle size={16} />
        </div>
        <h3 className="confirm-titre">{titre}</h3>
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn confirm-btn-annuler" onClick={() => onAnnuler()}>
            Annuler
          </button>
          <button className="btn confirm-btn-confirmer" onClick={() => onConfirmer()}>
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
