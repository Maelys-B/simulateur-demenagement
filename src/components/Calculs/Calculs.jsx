export default function Calculs({ pieces }) {
  function calculerVolume() {
    return pieces.reduce((total, piece) => {
      const volumePiece = piece.objets.reduce((acc, objet) => acc + objet.volume * objet.quantite, 0); 
      return total + volumePiece;
    }, 0);
  }
    
  const volumeTotal = calculerVolume();

  return (
    <div>
      <p>Volume total : {volumeTotal} m³</p>
    </div>
  );
}