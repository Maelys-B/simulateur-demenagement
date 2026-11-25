const pieceService = require('../services/pieceService');

async function creer(req, res) {
  const id = await pieceService.creer(req.userId, req.body);
  res.status(201).json({ message: 'Pièce créée', id });
}

async function lister(req, res) {
  res.json(await pieceService.lister(req.userId));
}

async function trouver(req, res) {
  res.json(await pieceService.trouver(req.userId, req.params.id));
}

async function modifier(req, res) {
  await pieceService.modifier(req.userId, req.params.id, req.body);
  res.json({ message: 'Pièce modifiée' });
}

async function supprimer(req, res) {
  await pieceService.supprimer(req.userId, req.params.id);
  res.json({ message: 'Pièce supprimée' });
}

module.exports = { creer, lister, trouver, modifier, supprimer };
