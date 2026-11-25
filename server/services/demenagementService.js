const demenagementRepository = require('../repositories/demenagementRepository');
const HttpError = require('../utils/HttpError');
const { versEntier, versDate, versBooleen, versTexte, versId } = require('../utils/conversions');

const INTROUVABLE = 'Erreur de chargement';

function preparerDonnees(corps) {
  const { nom, date_demenagement } = corps;

  if (!nom || !date_demenagement) {
    throw new HttpError(400, 'nom et date_demenagement sont requis');
  }

  const date = versDate(date_demenagement);
  if (!date) {
    throw new HttpError(400, 'date_demenagement invalide');
  }

  return {
    nom: String(nom),
    date_demenagement: date,
    type_profil: versTexte(corps.type_profil),
    distance_km: versEntier(corps.distance_km),
    etage: versEntier(corps.etage),
    ascenseur: versBooleen(corps.ascenseur),
    parking: versBooleen(corps.parking),
    nb_personnes: versEntier(corps.nb_personnes),
    formule: versTexte(corps.formule),
    melanger_cartons: versBooleen(corps.melanger_cartons),
  };
}

function sansChampsVides(donnees) {
  return Object.fromEntries(Object.entries(donnees).filter(([, valeur]) => valeur !== null));
}

async function creer(userId, corps) {
  const donnees = sansChampsVides(preparerDonnees(corps));
  const demenagement = await demenagementRepository.creer({ ...donnees, user_id: userId });
  return demenagement.id;
}

function lister(userId) {
  return demenagementRepository.listerParUtilisateur(userId);
}

async function trouver(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const demenagement = await demenagementRepository.trouverParId(id, userId);

  if (!demenagement) {
    throw new HttpError(404, INTROUVABLE);
  }

  return demenagement;
}

async function modifier(userId, idParam, corps) {
  const id = versId(idParam, INTROUVABLE);
  const donnees = preparerDonnees(corps);
  const { count } = await demenagementRepository.modifier(id, userId, donnees);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

async function supprimer(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const { count } = await demenagementRepository.supprimer(id, userId);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

module.exports = { creer, lister, trouver, modifier, supprimer };
