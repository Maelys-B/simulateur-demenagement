import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PRIX_CARTONS } from './calculs';

const LABELS_TYPE = {
  Resiliation: 'Résiliation',
  Souscription: 'Souscription',
  Demarche: 'Démarche',
};

export function genererPDF({
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
  completes,
}) {
  const doc = new jsPDF();
  let yPosition = 20;

  const nouvellePageSiBesoin = (seuil = 260) => {
    if (yPosition > seuil) {
      doc.addPage();
      yPosition = 20;
    }
  };

  // Titre
  doc.setFontSize(20);
  doc.text(titre, 105, yPosition, { align: 'center' });
  yPosition += 10;

  doc.setFontSize(11);
  doc.text(
    `Date prévue : ${new Date(profil.dateDemenagement).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}`,
    105,
    yPosition,
    { align: 'center' },
  );
  yPosition += 15;

  // Profil
  doc.setFontSize(14);
  doc.text('Profil du déménagement', 20, yPosition);
  yPosition += 8;
  doc.setFontSize(10);
  doc.text(`Type : ${profil.type}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Distance : ${profil.distance || 0} km`, 20, yPosition);
  yPosition += 6;
  doc.text(
    `Étage : ${profil.etage || 0} ${profil.ascenseur ? '(avec ascenseur)' : '(sans ascenseur)'}`,
    20,
    yPosition,
  );
  yPosition += 6;
  doc.text(`Parking : ${profil.parking ? 'accessible' : 'non accessible'}`, 20, yPosition);
  yPosition += 12;

  // Résumé des calculs
  doc.setFontSize(14);
  doc.text('Résumé des calculs', 20, yPosition);
  yPosition += 8;
  doc.setFontSize(10);
  doc.text(`Volume total : ${volumeTotal.toFixed(2)} m³`, 20, yPosition);
  yPosition += 6;
  doc.text(`Taille de camion : ${tailleCamion}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Personnes recommandées : ${personneReco}`, 20, yPosition);
  yPosition += 6;
  doc.text(`Temps estimé : ${tempsEstime.total}`, 20, yPosition);
  yPosition += 12;

  // Inventaire par pièce
  nouvellePageSiBesoin(230);
  doc.setFontSize(14);
  doc.text('Inventaire par pièce', 20, yPosition);
  yPosition += 8;

  const piecesAvecObjets = pieces.filter(
    (p) => p.objets.length > 0 || p.objetsAEmballer.length > 0,
  );

  if (piecesAvecObjets.length === 0) {
    doc.setFontSize(10);
    doc.text('Aucun objet ajouté à l’inventaire.', 20, yPosition);
    yPosition += 12;
  } else {
    piecesAvecObjets.forEach((piece) => {
      nouvellePageSiBesoin(240);
      doc.setFontSize(12);
      doc.text(piece.nom, 20, yPosition);
      yPosition += 6;

      const lignesObjets = [...piece.objets, ...piece.objetsAEmballer].map((o) => [
        o.nom,
        o.quantite.toString(),
        `${o.volume.toFixed(2)} m³`,
        `${(o.volume * o.quantite).toFixed(2)} m³`,
      ]);

      autoTable(doc, {
        startY: yPosition,
        head: [['Objet', 'Quantité', 'Volume unitaire', 'Volume total']],
        body: lignesObjets,
        theme: 'grid',
        styles: { fontSize: 9 },
        headStyles: { fillColor: [22, 163, 74] },
      });
      yPosition = doc.lastAutoTable.finalY + 10;
    });
  }

  // Cartons nécessaires
  nouvellePageSiBesoin(230);
  doc.setFontSize(14);
  doc.text('Cartons nécessaires', 20, yPosition);
  yPosition += 8;

  const lignesCartons = ['petit', 'standard', 'grand']
    .filter((taille) => cartonsGlobal[taille].nb > 0)
    .map((taille) => [
      taille.charAt(0).toUpperCase() + taille.slice(1),
      cartonsGlobal[taille].nb.toString(),
      `${PRIX_CARTONS[taille].toFixed(2)} €`,
      `${(cartonsGlobal[taille].nb * PRIX_CARTONS[taille]).toFixed(2)} €`,
    ]);

  if (lignesCartons.length > 0) {
    autoTable(doc, {
      startY: yPosition,
      head: [['Type', 'Quantité', 'Prix unitaire', 'Total']],
      body: lignesCartons,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [37, 99, 235] },
    });
    yPosition = doc.lastAutoTable.finalY + 12;
  } else {
    doc.setFontSize(10);
    doc.text('Aucun objet à emballer.', 20, yPosition);
    yPosition += 12;
  }

  // Budget
  nouvellePageSiBesoin(230);
  doc.setFontSize(14);
  doc.text('Estimation du budget', 20, yPosition);
  yPosition += 8;
  doc.setFontSize(10);
  doc.text(`Solo : ${budgetSolo.min.toFixed(0)} € – ${budgetSolo.max.toFixed(0)} €`, 20, yPosition);
  yPosition += 6;
  doc.text(
    `Professionnel : ${budgetPro.min.toFixed(0)} € – ${budgetPro.max.toFixed(0)} €`,
    20,
    yPosition,
  );
  yPosition += 12;

  // Checklist administrative
  doc.addPage();
  yPosition = 20;
  doc.setFontSize(14);
  doc.text('Checklist administrative', 20, yPosition);
  yPosition += 8;

  const lignesTaches = taches.map((tache) => [
    completes.includes(tache.id) ? 'X' : '',
    tache.titre,
    tache.dateEcheance.toLocaleDateString('fr-FR'),
    LABELS_TYPE[tache.type] || tache.type,
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [['', 'Tâche', 'Date limite', 'Type']],
    body: lignesTaches,
    theme: 'grid',
    styles: { fontSize: 9 },
    headStyles: { fillColor: [124, 58, 237] },
    columnStyles: {
      0: { cellWidth: 10 },
      1: { cellWidth: 90 },
      2: { cellWidth: 35 },
      3: { cellWidth: 35 },
    },
  });

  const nomFichier = `demenagement-${titre.trim().replace(/\s+/g, '-').toLowerCase()}.pdf`;
  doc.save(nomFichier);
}
