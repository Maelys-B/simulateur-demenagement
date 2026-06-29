import { Calculator, ClipboardList, Home, Scale } from 'lucide-react';
import './Navigation.css';

function Navigation({ ongletActif, setOngletActif }) {
  return (
    <div className="nav-bar">
      <button
        onClick={() => setOngletActif('inventaire')}
        className={ongletActif === 'inventaire' ? 'nav-btn actif' : 'nav-btn'}
      >
        <Home size={20} /> Inventaire
      </button>
      <button
        onClick={() => setOngletActif('calculs')}
        className={ongletActif === 'calculs' ? 'nav-btn actif' : 'nav-btn'}
      >
        <Calculator size={20} /> Calculs
      </button>
      <button
        onClick={() => setOngletActif('comparaison')}
        className={ongletActif === 'comparaison' ? 'nav-btn actif' : 'nav-btn'}
      >
        <Scale size={20} /> Comparaison
      </button>
      <button
        onClick={() => setOngletActif('check-list')}
        className={ongletActif === 'check-list' ? 'nav-btn actif' : 'nav-btn'}
      >
        <ClipboardList size={20} /> Check-list
      </button>
    </div>
  );
}

export default Navigation;
