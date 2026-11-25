const demenagementService = require('../services/demenagementService');

async function creer(req, res) {
  const id = await demenagementService.creer(req.userId, req.body);
  res.status(201).json({ message: 'Déménagement créé', id });
}

async function lister(req, res) {
  res.json(await demenagementService.lister(req.userId));
}

async function trouver(req, res) {
  const demenagement = await demenagementService.trouver(req.userId, req.params.id);
  res.json({ demenagement });
}

async function modifier(req, res) {
  await demenagementService.modifier(req.userId, req.params.id, req.body);
  res.json({ message: 'Changement effectué' });
}

async function supprimer(req, res) {
  await demenagementService.supprimer(req.userId, req.params.id);
  res.json({ message: 'Le déménagement est supprimé' });
}

module.exports = { creer, lister, trouver, modifier, supprimer };
