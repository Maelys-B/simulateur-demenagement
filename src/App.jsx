import { Calendar, Download, Moon, Sun, Trash2, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import Calculs from './components/Calculs/Calculs';
import Checklist from './components/Checklist/Checklist';
import Comparaison from './components/Comparaison/Comparaison';
import Inventaire from './components/Inventaire/Inventaire';
import Navigation from './components/Navigation/Navigation';
import ProfilPanel from './components/ProfilPanel/ProfilPanel';
import {
  calculerBudgetPro,
  calculerBudgetSolo,
  calculerCartons,
  calculerCartonsGlobal,
  calculerTemps,
  calculerVolume,
  calculerVolumeAEmballer,
  determinerCamion,
  determinerPersonne,
} from './utils/calculs';
import { calculerTachesAvecDates, TACHES_PREDEFINIES } from './utils/checklist';
import { genererPDF } from './utils/exportPDF';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';

function App() {
  const [ongletActif, setOngletActif] = useState('inventaire');
  const [titre, setTitre] = useState('Mon déménagement');
  const [pieces, setPieces] = useState([]);
  const [formule, setFormule] = useState('economique');
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [confirmation, setConfirmation] = useState(null);
  const [completes, setCompletes] = useState([]);
  const [tachesPerso, setTachesPerso] = useState([]);
  const [tachesPredefinies, setTachesPredefinies] = useState(TACHES_PREDEFINIES);
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
  const cartonsGlobal = calculerCartonsGlobal(pieces);
  const coutCartons = cartonsParPiece.reduce(
    (acc, p) => acc + (p.petit.nb + p.standard.nb + p.grand.nb) * 1.5,
    0,
  );
  const budgetSolo = calculerBudgetSolo(volumeTotal, profil.distance, coutCartons);
  const budgetPro = calculerBudgetPro(
    volumeTotal,
    profil.distance,
    profil.etage,
    profil.ascenseur,
    formule,
    profil.parking,
  );
  const volumeAEmballer = calculerVolumeAEmballer(pieces);
  const tailleCamion = determinerCamion(volumeTotal * 1.15);
  const personneReco = determinerPersonne(volumeTotal);
  const tempsEstime = calculerTemps(
    volumeTotal,
    volumeAEmballer,
    profil.distance,
    profil.nbPersonnes,
  );
  const toutesLesTaches = calculerTachesAvecDates(tachesPredefinies, tachesPerso, profil);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  function reinitialiser() {
    setTitre('Mon déménagement');
    setPieces([]);
    setFormule('economique');
    setCompletes([]);
    setTachesPerso([]);
    setProfil({
    type: 'solo',
    distance: '',
    etage: '',
    ascenseur: false,
    parking: false,
    nbPersonnes: 1,
    dateDemenagement: new Date().toISOString().split('T')[0],
  });
    setOngletActif('inventaire');
    setTachesPredefinies(TACHES_PREDEFINIES)
  }

  function exporterPDF() {
    genererPDF({
      titre,
      profil,
      pieces,
      volumeTotal,
      tailleCamion,
      personneReco,
      tempsEstime,
      cartonsGlobal,
      budgetSolo,
      budgetPro,
      taches: toutesLesTaches,
      completes,
    });
  }

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
          <div className="flex">
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
          <button className="btn-theme-toggle" type="button" onClick={toggleTheme}>
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="btn btn-pdf" type="button" onClick={exporterPDF}>
            <span className="icon">
              <Download size={20} /> Exporter en PDF
            </span>
          </button>
          <button
            className="btn btn-reset"
            type="button"
            onClick={() =>
              setConfirmation({
                message: `Voulez-vous tout réinitialiser ?`,
                onConfirmer: () => {
                  reinitialiser();
                  setConfirmation(null);
                },
              })
            }
          >
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
          {ongletActif === 'calculs' && (
            <Calculs pieces={pieces} profil={profil} formule={formule} setFormule={setFormule} />
          )}
          {ongletActif === 'comparaison' && (
            <Comparaison budgetSolo={budgetSolo} budgetPro={budgetPro} />
          )}
          {ongletActif === 'check-list' && (
            <Checklist
              profil={profil}
              completes={completes}
              setCompletes={setCompletes}
              tachesPerso={tachesPerso}
              setTachesPerso={setTachesPerso}
              tachesPredefinies={tachesPredefinies}
              setTachesPredefinies={setTachesPredefinies}
            />
          )}
        </div>
        <ProfilPanel profil={profil} setProfil={setProfil} />
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

export default App;
