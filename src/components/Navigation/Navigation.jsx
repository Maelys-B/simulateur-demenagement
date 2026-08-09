import { Calculator, ClipboardList, Home, Scale } from 'lucide-react';
import './Navigation.css';

function Navigation({ ongletActif, setOngletActif }) {
  return (
    <nav className="nav-bar" aria-label="Navigation principale">
      <button
        onClick={() => setOngletActif('inventaire')}
        className={ongletActif === 'inventaire' ? 'nav-btn actif' : 'nav-btn'}
        aria-current={ongletActif === 'inventaire' ? 'page' : undefined}
      >
        <Home size={20} /> Inventaire
      </button>
      <button
        onClick={() => setOngletActif('calculs')}
        className={ongletActif === 'calculs' ? 'nav-btn actif' : 'nav-btn'}
        aria-current={ongletActif === 'calculs' ? 'page' : undefined}
      >
        <Calculator size={20} /> Calculs
      </button>
      <button
        onClick={() => setOngletActif('comparaison')}
        className={ongletActif === 'comparaison' ? 'nav-btn actif' : 'nav-btn'}
        aria-current={ongletActif === 'comparaison' ? 'page' : undefined}
      >
        <Scale size={20} /> Comparaison
      </button>
      <button
        onClick={() => setOngletActif('check-list')}
        className={ongletActif === 'check-list' ? 'nav-btn actif' : 'nav-btn'}
        aria-current={ongletActif === 'check-list' ? 'page' : undefined}
      >
        <ClipboardList size={20} /> Check-list
      </button>
    </nav>
  );
}

export default Navigation;
