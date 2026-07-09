export default function Calculs({ pieces, profil }) {
  function calculerVolume() {
    return pieces.reduce((total, piece) => {
      const volumePiece = piece.objets.reduce((acc, objet) => acc + objet.volume * objet.quantite, 0); 
      return total + volumePiece;
    }, 0);
  }
  function determinerCamion(volume) {
  if (volume <= 5) {
    return 'Voiture + remorque';
  } else if (volume <= 10) {
    return 'Camionnette 10m³ (type Trafic)';
  } else if (volume <= 20) {
    return 'Camion 20m³ (type Master)';
  } else if (volume <= 30) {
    return 'Camion 30m³';
  } else if (volume > 30) {
    return 'Camion 40m³ ou plusieurs rotations';
  }
  }
  function determinerPersonne(volume) {
  if (volume <= 10) {
    return '1 à 2 personnes';
  } else if (volume <= 20) {
    return '2 à 3 personnes';
  } else if (volume <= 30) {
    return '3 à 4 personnes';
  } else if (volume > 30) {
    return '4 personnes +';
  }
  }
  function calculerTemps(volume, distance) {
    const emballage = volume / 5;
    const chargement = volume / 7;
    const trajet = distance / 60 * 2;
    const total = emballage + chargement + trajet
    return {
      emballage: `${Math.floor(emballage)}h${String(Math.round((emballage % 1) * 60)).padStart(2, '0')}`,
      chargement: `${Math.floor(chargement)}h${String(Math.round((chargement % 1) * 60)).padStart(2, '0')}`,
      trajet: `${Math.floor(trajet)}h${String(Math.round((trajet % 1) * 60)).padStart(2, '0')}`,
      total: `${Math.floor(total)}h${String(Math.round((total % 1) * 60)).padStart(2, '0')}`,
    };
  }


  const volumeTotal = calculerVolume();
  const tailleCamion = determinerCamion(volumeTotal);
  const personneReco = determinerPersonne(volumeTotal);
  const tempsEstime = calculerTemps(volumeTotal, profil.distance);

  return (
    <div>
      <div>
      <p>Volume total : {volumeTotal} m³</p>
      </div>
      <div>
      <p>Taille du camion : {tailleCamion} </p>
      </div>
      <div>
      <p>Personnes recommandées : {personneReco} </p>
      </div>
      <div>
      <p>Temps estimé : {tempsEstime.total} </p>
      <p>({tempsEstime.chargement} de chargement) ({tempsEstime.emballage} d'emballage) ({tempsEstime.trajet} de trajet)</p>
      </div>
    </div>
    
  );
}
