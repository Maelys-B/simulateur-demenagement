const pieceRepository = require('../repositories/pieceRepository');
const demenagementRepository = require('../repositories/demenagementRepository');
const HttpError = require('../utils/HttpError');
const { versEntier, versId } = require('../utils/conversions');

const INTROUVABLE = 'Pièce introuvable';

async function creer(userId, { demenagement_id, nom }) {
  if (!demenagement_id || !nom) {
    throw new HttpError(400, 'demenagement_id et nom sont requis');
  }

  const demenagementId = versEntier(demenagement_id);
  const demenagement =
    demenagementId && (await demenagementRepository.trouverParId(demenagementId, userId));

  if (!demenagement) {
    throw new HttpError(404, 'Déménagement introuvable');
  }

  const piece = await pieceRepository.creer({ demenagement_id: demenagementId, nom: String(nom) });
  return piece.id;
}

function lister(userId) {
  return pieceRepository.listerParUtilisateur(userId);
}

async function trouver(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const piece = await pieceRepository.trouverParId(id, userId);

  if (!piece) {
    throw new HttpError(404, INTROUVABLE);
  }

  return piece;
}

async function modifier(userId, idParam, { nom }) {
  const id = versId(idParam, INTROUVABLE);

  if (!nom) {
    throw new HttpError(400, 'nom est requis');
  }

  const { count } = await pieceRepository.modifier(id, userId, { nom: String(nom) });

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

async function supprimer(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const { count } = await pieceRepository.supprimer(id, userId);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

module.exports = { creer, lister, trouver, modifier, supprimer };
