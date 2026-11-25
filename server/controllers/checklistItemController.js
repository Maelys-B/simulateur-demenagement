const checklistItemService = require('../services/checklistItemService');

async function creer(req, res) {
  const id = await checklistItemService.creer(req.userId, req.body);
  res.status(201).json({ message: 'Tâche créée', id });
}

async function lister(req, res) {
  res.json(await checklistItemService.lister(req.userId));
}

async function trouver(req, res) {
  res.json(await checklistItemService.trouver(req.userId, req.params.id));
}

async function modifier(req, res) {
  await checklistItemService.modifier(req.userId, req.params.id, req.body);
  res.json({ message: 'Tâche modifiée' });
}

async function supprimer(req, res) {
  await checklistItemService.supprimer(req.userId, req.params.id);
  res.json({ message: 'Tâche supprimée' });
}

module.exports = { creer, lister, trouver, modifier, supprimer };
