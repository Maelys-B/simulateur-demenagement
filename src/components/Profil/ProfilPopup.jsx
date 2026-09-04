import { LogOut, Moon, Sun, X, User } from 'lucide-react';
import { useEffect, useRef } from 'react';
import MesDemenagements from '../Demenagements/MesDemenagements';
import './ProfilPopup.css';

export default function ProfilPopup({
  theme,
  onToggleTheme,
  onDeconnexion,
  onSelectionner,
  onFermer,
  onAnnoncer,
}) {
  const popupRef = useRef(null);
  const fermerRef = useRef(null);

  useEffect(() => {
    fermerRef.current?.focus();
  }, []);

  useEffect(() => {
    function gererClicExterieur(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onFermer();
      }
    }
    function gererEchap(e) {
      if (e.key === 'Escape') {
        onFermer();
      }
    }

    document.addEventListener('mousedown', gererClicExterieur);
    document.addEventListener('keydown', gererEchap);
    return () => {
      document.removeEventListener('mousedown', gererClicExterieur);
      document.removeEventListener('keydown', gererEchap);
    };
  }, [onFermer]);

  function selectionnerEtFermer(d) {
    onSelectionner(d);
    onFermer();
  }

  return (
    <div className="profil-popup-overlay">
      <div className="profil-popup" ref={popupRef} role="dialog" aria-modal="true" aria-label="Profil">
        <div className="profil-popup-header">
          <h2 className='icon'><User size={20} />Profil</h2>
          <button
            ref={fermerRef}
            type="button"
            className="btn-theme-toggle"
            onClick={onFermer}
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="profil-popup-actions">
          <button type="button" className="profil-popup-action" onClick={onToggleTheme}>
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'light' ? 'Thème sombre' : 'Thème clair'}
          </button>
          <button type="button" className="profil-popup-action profil-popup-action--danger" onClick={onDeconnexion}>
            <LogOut size={18} />
            Se déconnecter
          </button>
        </div>

        <h3 className="profil-popup-soustitre">Mes déménagements</h3>
        <MesDemenagements onSelectionner={selectionnerEtFermer} dansPopup onAnnoncer={onAnnoncer} />
      </div>
    </div>
  );
}
