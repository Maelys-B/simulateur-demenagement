const HttpError = require('../utils/HttpError');

// eslint-disable-next-line no-unused-vars
function gestionErreurs(err, req, res, next) {
  if (err instanceof HttpError) {
    return res.status(err.status).json({ erreur: err.message });
  }

  if (err.code === 'P2002') {
    return res.status(409).json({ erreur: 'Cette valeur est déjà utilisée' });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ erreur: 'Corps de requête JSON invalide' });
  }

  console.error(err);
  return res.status(500).json({ erreur: 'Erreur serveur' });
}

module.exports = gestionErreurs;
