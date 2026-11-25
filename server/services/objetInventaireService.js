const objetInventaireRepository = require('../repositories/objetInventaireRepository');
const pieceRepository = require('../repositories/pieceRepository');
const HttpError = require('../utils/HttpError');
const { versEntier, versDecimal, versTexte, versId } = require('../utils/conversions');

const INTROUVABLE = 'Objet introuvable';

function preparerDonnees(corps) {
  if (!corps.nom) {
    throw new HttpError(400, 'nom est requis');
  }

  return {
    nom: String(corps.nom),
    volume: versDecimal(corps.volume),
    quantite: versEntier(corps.quantite),
    type: versTexte(corps.type),
    carton: versTexte(corps.carton),
  };
}

async function creer(userId, corps) {
  if (!corps.piece_id || !corps.nom) {
    throw new HttpError(400, 'piece_id et nom sont requis');
  }

  const pieceId = versEntier(corps.piece_id);
  const piece = pieceId && (await pieceRepository.trouverParId(pieceId, userId));

  if (!piece) {
    throw new HttpError(404, 'Pièce introuvable');
  }

  const donnees = preparerDonnees(corps);
  if (donnees.quantite === null) delete donnees.quantite;
  if (donnees.type === null) delete donnees.type;

  const objet = await objetInventaireRepository.creer({ ...donnees, piece_id: pieceId });
  return objet.id;
}

function lister(userId) {
  return objetInventaireRepository.listerParUtilisateur(userId);
}

async function trouver(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const objet = await objetInventaireRepository.trouverParId(id, userId);

  if (!objet) {
    throw new HttpError(404, INTROUVABLE);
  }

  return objet;
}

async function modifier(userId, idParam, corps) {
  const id = versId(idParam, INTROUVABLE);
  const donnees = preparerDonnees(corps);
  const { count } = await objetInventaireRepository.modifier(id, userId, donnees);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

async function supprimer(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const { count } = await objetInventaireRepository.supprimer(id, userId);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

module.exports = { creer, lister, trouver, modifier, supprimer };
