const objetPersonnelService = require('../services/objetPersonnelService');

async function creer(req, res) {
  const id = await objetPersonnelService.creer(req.userId, req.body);
  res.status(201).json({ message: 'Objet créé', id });
}

async function lister(req, res) {
  res.json(await objetPersonnelService.lister(req.userId));
}

async function trouver(req, res) {
  res.json(await objetPersonnelService.trouver(req.userId, req.params.id));
}

async function modifier(req, res) {
  await objetPersonnelService.modifier(req.userId, req.params.id, req.body);
  res.json({ message: 'Objet modifié' });
}

async function supprimer(req, res) {
  await objetPersonnelService.supprimer(req.userId, req.params.id);
  res.json({ message: 'Objet supprimé' });
}

module.exports = { creer, lister, trouver, modifier, supprimer };
