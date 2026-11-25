const authService = require('../services/authService');

async function register(req, res) {
  await authService.inscrire(req.body);
  res.status(201).json({ message: 'Compte créé avec succès' });
}

async function login(req, res) {
  const token = await authService.connecter(req.body);
  res.json({ token });
}

function profil(req, res) {
  res.json({ message: 'Accès autorisé !', userId: req.userId });
}

module.exports = { register, login, profil };
