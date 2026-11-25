const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const HttpError = require('../utils/HttpError');
const { motDePasseValide } = require('../utils/validation');

async function inscrire({ email, mot_de_passe, nom }) {
  if (!email || !mot_de_passe) {
    throw new HttpError(400, 'Email et mot de passe requis');
  }

  if (!motDePasseValide(mot_de_passe)) {
    throw new HttpError(
      400,
      'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial'
    );
  }

  const existant = await userRepository.trouverParEmail(email);
  if (existant) {
    throw new HttpError(409, 'Un compte existe déjà avec cet email');
  }

  const hash = await bcrypt.hash(mot_de_passe, 10);
  await userRepository.creer({ email, mot_de_passe: hash, nom: nom ?? null });
}

async function connecter({ email, mot_de_passe }) {
  if (!email || !mot_de_passe) {
    throw new HttpError(400, 'Email et mot de passe requis');
  }

  const user = await userRepository.trouverParEmail(email);
  if (!user) {
    throw new HttpError(401, 'Identifiants incorrects');
  }

  const valide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
  if (!valide) {
    throw new HttpError(401, 'Identifiants incorrects');
  }

  return jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

module.exports = { inscrire, connecter };
