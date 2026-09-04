import { Calendar, Download, Trash2, Truck, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
import { genererPDF } from './utils/exportPDF';
import ConfirmModal from './components/ConfirmModal/ConfirmModal';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import MesDemenagements from './components/Demenagements/MesDemenagements';
import ProfilPopup from './components/Profil/ProfilPopup';

function App() {
  const [estConnecte, setEstConnecte] = useState(!!localStorage.getItem('token'));
  const [pageAuth, setPageAuth] = useState('login');
  const [demenagementId, setDemenagementId] = useState(
    () => localStorage.getItem('demenagementId') || '',
  );
  const [ongletActif, setOngletActif] = useState('inventaire');
  const [titre, setTitre] = useState('Mon déménagement');
  const [pieces, setPieces] = useState([]);
  const [formule, setFormule] = useState('economique');
  const [melangerCartons, setMelangerCartons] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [confirmation, setConfirmation] = useState(null);
  const [annonce, setAnnonce] = useState('');
  const [popupProfilOuvert, setPopupProfilOuvert] = useState(false);
  const [taches, setTaches] = useState([]);
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
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  function appliquerDemenagement(d) {
    setTitre(d.nom);
    setProfil({
      type: d.type_profil || 'solo',
      distance: d.distance_km ?? '',
      etage: d.etage ?? '',
      ascenseur: !!d.ascenseur,
      parking: !!d.parking,
      nbPersonnes: d.nb_personnes ?? 1,
      dateDemenagement: d.date_demenagement.slice(0, 10),
    });
    setFormule(d.formule || 'economique');
    setMelangerCartons(!!d.melanger_cartons);
  }

  async function chargerInventaire(id) {
    try {
      const [reponsePieces, reponseObjets] = await Promise.all([
        fetch('http://localhost:3000/api/pieces', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
        fetch('http://localhost:3000/api/objets', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }),
      ]);

      const piecesData = await reponsePieces.json();
      const objetsData = await reponseObjets.json();

      const piecesDuDemenagement = piecesData.filter((p) => p.demenagement_id === id);

      const piecesReconstruites = piecesDuDemenagement.map((p) => ({
        id: p.id,
        nom: p.nom,
        objets: objetsData.filter((o) => o.piece_id === p.id && o.type === 'meuble'),
        objetsAEmballer: objetsData.filter((o) => o.piece_id === p.id && o.type === 'emballer'),
      }));

      setPieces(piecesReconstruites);
    } catch (err) {
      console.error(err);
    }
  }

  async function chargerChecklist(id) {
    try {
      const reponse = await fetch('http://localhost:3000/api/checklist', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await reponse.json();

      const tachesDuDemenagement = data
        .filter((t) => t.demenagement_id === id)
        .map((t) => ({ ...t, dateEcheance: new Date(t.date_limite) }));

      setTaches(tachesDuDemenagement);
    } catch (err) {
      console.error(err);
    }
  }

  function selectionnerDemenagement(d) {
    setDemenagementId(d.id);
    localStorage.setItem('demenagementId', d.id);
    appliquerDemenagement(d);
    chargerInventaire(d.id);
    chargerChecklist(d.id);
  }
  useEffect(() => {
    if (!demenagementId) return;

    fetch(`http://localhost:3000/api/demenagements/${demenagementId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    })
      .then((reponse) => reponse.json())
      .then((data) => {
        if (!data.demenagement) {
          localStorage.removeItem('demenagementId');
          setDemenagementId('');
          return;
        }
        appliquerDemenagement(data.demenagement);
        chargerInventaire(data.demenagement.id);
        chargerChecklist(data.demenagement.id);
      })
      .catch(() => {
        localStorage.removeItem('demenagementId');
        setDemenagementId('');
      });
  }, []);

  async function sauvegarderDemenagement() {
    try {
      await fetch(`http://localhost:3000/api/demenagements/${demenagementId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          nom: titre,
          date_demenagement: profil.dateDemenagement,
          type_profil: profil.type,
          distance_km: profil.distance,
          etage: profil.etage,
          ascenseur: profil.ascenseur,
          parking: profil.parking,
          nb_personnes: profil.nbPersonnes,
          formule: formule,
          melanger_cartons: melangerCartons,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  const chargeInitiale = useRef(true);
  const timeoutSauvegarde = useRef(null);

  useEffect(() => {
    if (!demenagementId) return;

    if (chargeInitiale.current) {
      chargeInitiale.current = false;
      return;
    }

    clearTimeout(timeoutSauvegarde.current);
    timeoutSauvegarde.current = setTimeout(() => {
      sauvegarderDemenagement();
    }, 1000);

    return () => clearTimeout(timeoutSauvegarde.current);
  }, [titre, profil, formule, melangerCartons]);

  function deconnexion() {
    localStorage.removeItem('token');
    localStorage.removeItem('demenagementId');
    setEstConnecte(false);
    setDemenagementId('');
  }

  function reinitialiser() {
    setTitre('Mon déménagement');
    setPieces([]);
    setFormule('economique');
    setMelangerCartons(false);
    setTaches([]);
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
      taches,
    });
  }

  let contenu;

  if (!estConnecte) {
    contenu =
      pageAuth === 'login' ? (
        <Login
          onConnexion={() => setEstConnecte(true)}
          onAllerVersInscription={() => setPageAuth('register')}
        />
      ) : (
        <Register
          onInscription={() => setEstConnecte(true)}
          onAllerVersConnexion={() => setPageAuth('login')}
        />
      );
  } else if (!demenagementId) {
    contenu = (
      <MesDemenagements
        onSelectionner={selectionnerDemenagement}
        onDeconnexion={deconnexion}
        onAnnoncer={setAnnonce}
      />
    );
  } else {
    contenu = (
    <div className="app-wrapper">
      <div inert={popupProfilOuvert}>
      <header className="header-card">
        <div>
          <h1 className="header-title">
            <span className="icon icon-title">
              <Truck size={30} />
              <span
                className="header-title-input"
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label="Titre du déménagement, modifiable"
                tabIndex={0}
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
                aria-label="Date de déménagement"
                value={profil.dateDemenagement}
                onChange={(e) => setProfil({ ...profil, dateDemenagement: e.target.value })}
              />
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            className="btn-theme-toggle"
            type="button"
            onClick={() => setPopupProfilOuvert(true)}
            aria-label="Ouvrir le profil"
          >
            <User size={20} />
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
                  setAnnonce('Vous avez réinitialisé le déménagement');
                },
              })
            }
          >
            <span className="icon">
              <Trash2 size={20} /> Réinitialiser
            </span>
          </button>
        </div>
      </header>
      <Navigation ongletActif={ongletActif} setOngletActif={setOngletActif} />
      <div className="app-content">
        <main className="app-main">
          {ongletActif === 'inventaire' && (
            <Inventaire pieces={pieces} setPieces={setPieces} demenagementId={demenagementId} />
          )}
          {ongletActif === 'calculs' && (
            <Calculs
              pieces={pieces}
              profil={profil}
              formule={formule}
              setFormule={setFormule}
              melangerCartons={melangerCartons}
              setMelangerCartons={setMelangerCartons}
            />
          )}
          {ongletActif === 'comparaison' && (
            <Comparaison budgetSolo={budgetSolo} budgetPro={budgetPro} />
          )}
          {ongletActif === 'check-list' && (
            <Checklist taches={taches} setTaches={setTaches} demenagementId={demenagementId} />
          )}
        </main>
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

      {popupProfilOuvert && (
        <ProfilPopup
          theme={theme}
          onToggleTheme={toggleTheme}
          onDeconnexion={deconnexion}
          onSelectionner={selectionnerDemenagement}
          onFermer={() => setPopupProfilOuvert(false)}
          onAnnoncer={setAnnonce}
        />
      )}
    </div>
    );
  }

  return (
    <>
      <p className="sr-only" role="status" aria-live="polite">
        {annonce}
      </p>
      {contenu}
    </>
  );
}

export default App;
