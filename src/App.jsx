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
  const [ongletActif, setOngletActif] = useState('inventaire');
  const [titre, setTitre] = useState('Mon déménagement');
  const [pieces, setPieces] = useState([]);
  const [formule, setFormule] = useState('economique');
  const [profil, setProfil] = useState({
    type: 'solo',
    distance: '',
    etage: '',
    ascenseur: false,
    parking: false,
    nbPersonnes: 1,
    dateDemenagement: new Date().toISOString().split('T')[0],
  });
  const volumeTotal = calculerVolume(pieces);
  const cartonsParPiece = calculerCartons(pieces);
  const coutCartons = cartonsParPiece.reduce((acc, p) => acc + (p.petit.nb + p.standard.nb + p.grand.nb) * 1.5, 0);
  const budgetSolo = calculerBudgetSolo(volumeTotal, profil.distance, coutCartons);
  const budgetPro = calculerBudgetPro(volumeTotal, profil.distance, profil.etage, profil.ascenseur, formule, profil.parking);


  return (
    <div className="app-wrapper">
      <div className="header-card">
        <div>
          <h1 className="header-title">
            <span className="icon icon-title">
              <Truck size={30} />
              <span
                className="header-title-input"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => setTitre(e.currentTarget.textContent)}
              >
                {titre}
              </span>
            </span>
          </h1>
          <div className='flex'>
            <Calendar size={16} color="#4A5565" />
            <div className="header-date-wrapper">
              <input
                type="date"
                min="2000-01-01"
                max="9999-12-31"
                className="header-date"
                value={profil.dateDemenagement}
                onChange={(e) => setProfil({ ...profil, dateDemenagement: e.target.value })}
              />
            </div>

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
          {ongletActif === 'calculs' && <Calculs pieces={pieces} profil={profil} formule={formule} setFormule={setFormule} />}
          {ongletActif === 'comparaison' && <Comparaison budgetSolo={budgetSolo} budgetPro={budgetPro} />}
          {ongletActif === 'check-list' && <Checklist profil={profil}/>}
        </div>
        <ProfilPanel profil={profil} setProfil={setProfil} />
      </div>
    </div>
  );
}

export default App;
