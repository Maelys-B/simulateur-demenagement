const objetInventaireService = require('../services/objetInventaireService');

async function creer(req, res) {
  const id = await objetInventaireService.creer(req.userId, req.body);
  res.status(201).json({ message: 'Objet créé', id });
}

async function lister(req, res) {
  res.json(await objetInventaireService.lister(req.userId));
}

async function trouver(req, res) {
  res.json(await objetInventaireService.trouver(req.userId, req.params.id));
}

async function modifier(req, res) {
  await objetInventaireService.modifier(req.userId, req.params.id, req.body);
  res.json({ message: 'Objet modifié' });
}

async function supprimer(req, res) {
  await objetInventaireService.supprimer(req.userId, req.params.id);
  res.json({ message: 'Objet supprimé' });
}

module.exports = { creer, lister, trouver, modifier, supprimer };
