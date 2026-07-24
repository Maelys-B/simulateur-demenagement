import { Calendar, Download, Trash2, Truck } from 'lucide-react';
import { useState } from 'react';
import Calculs from './components/Calculs/Calculs';
import Checklist from './components/Checklist/Checklist';
import Comparaison from './components/Comparaison/Comparaison';
import Inventaire from './components/Inventaire/Inventaire';
import Navigation from './components/Navigation/Navigation';
import ProfilPanel from './components/ProfilPanel/ProfilPanel';
import { calculerBudgetPro, calculerBudgetSolo, calculerCartons, calculerVolume } from './utils/calculs';

function App() {
  // eslint-disable-next-line no-unused-vars
  const [progression, setProgression] = useState(0);
  const [ongletActif, setOngletActif] = useState('inventaire');
  const [pieces, setPieces] = useState([]);
  const [profil, setProfil] = useState({
    type: 'solo',
    distance: '',
    etage: '',
    ascenseur: false,
    parking: false,
    dateDemenagement: '',
  });
  const volumeTotal = calculerVolume(pieces);
  const cartonsParPiece = calculerCartons(pieces);
  const coutCartons = cartonsParPiece.reduce((acc, p) => acc + (p.petit.nb + p.standard.nb + p.grand.nb) * 1.5, 0);
  const budgetSolo = calculerBudgetSolo(volumeTotal, profil.distance, coutCartons);
  const budgetPro = calculerBudgetPro(volumeTotal, profil.distance, profil.etage, profil.ascenseur);


  return (
    <div className="app-wrapper">
      <div className="header-card">
        <div>
          <h1 className="header-title">
            <span className="icon">
              <Truck size={30} /> Mon déménagement
            </span>
          </h1>
          <div className='flex'>
            <div className="header-date-wrapper">
              <Calendar size={16} />
              <input type="date" className="header-date" />
            </div>
            <p className="header-progression">Progression : {progression}%</p>
          </div>
          <div className="progress-bar-track">
            <div className="progress-bar-fill" style={{ width: `${progression}%` }} />
          </div>
        </div>

        <div className="header-actions">
          <button className="btn btn-pdf">
            <span className="icon">
              <Download size={20} /> Exporter en PDF
            </span>
          </button>
          <button className="btn btn-reset">
            <span className="icon">
              <Trash2 size={20} /> Réinitialiser
            </span>
          </button>
        </div>
      </div>
      <Navigation ongletActif={ongletActif} setOngletActif={setOngletActif} />
      <div className="app-content">
        <div className="app-main">
          {ongletActif === 'inventaire' && <Inventaire pieces={pieces} setPieces={setPieces} />}
          {ongletActif === 'calculs' && <Calculs pieces={pieces} profil={profil}/>}
          {ongletActif === 'comparaison' && <Comparaison budgetSolo={budgetSolo} budgetPro={budgetPro} />}
          {ongletActif === 'check-list' && <Checklist profil={profil}/>}
        </div>
        <ProfilPanel profil={profil} setProfil={setProfil} />
      </div>
    </div>
  );
}

export default App;
