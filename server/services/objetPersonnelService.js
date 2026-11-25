const objetPersonnelRepository = require('../repositories/objetPersonnelRepository');
const HttpError = require('../utils/HttpError');
const { versDecimal, versTexte, versId } = require('../utils/conversions');

const INTROUVABLE = 'Objet introuvable';

function preparerDonnees(corps) {
  if (!corps.nom) {
    throw new HttpError(400, 'nom est requis');
  }

  return {
    nom: String(corps.nom),
    volume: versDecimal(corps.volume),
    type: versTexte(corps.type),
    carton: versTexte(corps.carton),
  };
}

async function creer(userId, corps) {
  const donnees = preparerDonnees(corps);
  if (donnees.type === null) delete donnees.type;

  const objet = await objetPersonnelRepository.creer({ ...donnees, user_id: userId });
  return objet.id;
}

function lister(userId) {
  return objetPersonnelRepository.listerParUtilisateur(userId);
}

async function trouver(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const objet = await objetPersonnelRepository.trouverParId(id, userId);

  if (!objet) {
    throw new HttpError(404, INTROUVABLE);
  }

  return objet;
}

async function modifier(userId, idParam, corps) {
  const id = versId(idParam, INTROUVABLE);
  const donnees = preparerDonnees(corps);
  const { count } = await objetPersonnelRepository.modifier(id, userId, donnees);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

async function supprimer(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const { count } = await objetPersonnelRepository.supprimer(id, userId);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

module.exports = { creer, lister, trouver, modifier, supprimer };
