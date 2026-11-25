const HttpError = require('./HttpError');

function versEntier(valeur) {
  if (valeur === undefined || valeur === null || valeur === '') return null;
  const nombre = Number(valeur);
  return Number.isNaN(nombre) ? null : Math.trunc(nombre);
}

function versDecimal(valeur) {
  if (valeur === undefined || valeur === null || valeur === '') return null;
  const nombre = Number(valeur);
  return Number.isNaN(nombre) ? null : nombre;
}

function versDate(valeur) {
  if (!valeur) return null;
  const date = new Date(valeur);
  return Number.isNaN(date.getTime()) ? null : date;
}

function versBooleen(valeur) {
  if (valeur === undefined || valeur === null || valeur === '') return null;
  return Boolean(valeur);
}

function versTexte(valeur) {
  if (valeur === undefined || valeur === null) return null;
  return String(valeur);
}

function versId(valeur, messageIntrouvable) {
  const id = versEntier(valeur);
  if (id === null || id <= 0) throw new HttpError(404, messageIntrouvable);
  return id;
}

module.exports = { versEntier, versDecimal, versDate, versBooleen, versTexte, versId };
