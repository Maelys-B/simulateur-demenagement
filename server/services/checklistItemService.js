const checklistItemRepository = require('../repositories/checklistItemRepository');
const demenagementRepository = require('../repositories/demenagementRepository');
const HttpError = require('../utils/HttpError');
const { versEntier, versDate, versBooleen, versTexte, versId } = require('../utils/conversions');

const INTROUVABLE = 'Tâche introuvable';

function preparerDonnees(corps) {
  if (!corps.titre) {
    throw new HttpError(400, 'titre est requis');
  }

  return {
    titre: String(corps.titre),
    description: versTexte(corps.description),
    date_limite: versDate(corps.date_limite),
    type: versTexte(corps.type),
    complete: versBooleen(corps.complete),
  };
}

async function creer(userId, corps) {
  if (!corps.demenagement_id || !corps.titre) {
    throw new HttpError(400, 'demenagement_id et titre sont requis');
  }

  const demenagementId = versEntier(corps.demenagement_id);
  const demenagement =
    demenagementId && (await demenagementRepository.trouverParId(demenagementId, userId));

  if (!demenagement) {
    throw new HttpError(404, 'Déménagement introuvable');
  }

  const donnees = preparerDonnees(corps);
  if (donnees.type === null) delete donnees.type;
  if (donnees.complete === null) delete donnees.complete;

  const tache = await checklistItemRepository.creer({
    ...donnees,
    demenagement_id: demenagementId,
  });
  return tache.id;
}

function lister(userId) {
  return checklistItemRepository.listerParUtilisateur(userId);
}

async function trouver(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const tache = await checklistItemRepository.trouverParId(id, userId);

  if (!tache) {
    throw new HttpError(404, INTROUVABLE);
  }

  return tache;
}

async function modifier(userId, idParam, corps) {
  const id = versId(idParam, INTROUVABLE);
  const donnees = preparerDonnees(corps);
  const { count } = await checklistItemRepository.modifier(id, userId, donnees);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

async function supprimer(userId, idParam) {
  const id = versId(idParam, INTROUVABLE);
  const { count } = await checklistItemRepository.supprimer(id, userId);

  if (count === 0) {
    throw new HttpError(404, INTROUVABLE);
  }
}

module.exports = { creer, lister, trouver, modifier, supprimer };
