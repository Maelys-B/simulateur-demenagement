import { AlertTriangle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import './ConfirmModal.css';

export default function ConfirmModal({ titre, message, onConfirmer, onAnnuler }) {
  const annulerRef = useRef(null);
  const confirmerRef = useRef(null);

  useEffect(() => {
    annulerRef.current?.focus();
  }, []);

  function gererClavier(e) {
    if (e.key === 'Escape') {
      onAnnuler();
      return;
    }
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === annulerRef.current) {
        e.preventDefault();
        confirmerRef.current?.focus();
      } else if (!e.shiftKey && document.activeElement === confirmerRef.current) {
        e.preventDefault();
        annulerRef.current?.focus();
      }
    }
  }

  return (
    <div className="confirm-overlay" onKeyDown={gererClavier}>
      <div
        className="confirm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-titre"
        aria-describedby="confirm-message"
      >
        <div className="confirm-icon" aria-hidden="true">
          <AlertTriangle size={16} />
        </div>
        <h3 id="confirm-titre" className="confirm-titre">
          {titre}
        </h3>
        <p id="confirm-message" className="confirm-message">
          {message}
        </p>
        <div className="confirm-actions">
          <button
            ref={annulerRef}
            className="btn confirm-btn-annuler"
            onClick={() => onAnnuler()}
          >
            Annuler
          </button>
          <button
            ref={confirmerRef}
            className="btn confirm-btn-confirmer"
            onClick={() => onConfirmer()}
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
