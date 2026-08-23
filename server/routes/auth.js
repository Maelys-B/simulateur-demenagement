const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifierToken = require('../middleware/verifierToken');

router.post('/register', async (req, res, next) => {
  try {
    const { email, mot_de_passe, nom } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ erreur: 'Email et mot de passe requis' });
    }

    const regexMotDePasse = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

    if (!regexMotDePasse.test(mot_de_passe)) {
      return res.status(400).json({
        erreur:
          'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial',
      });
    }

    const hash = await bcrypt.hash(mot_de_passe, 10);

    await pool.query(
      'INSERT INTO users (email, mot_de_passe, nom) VALUES (?, ?, ?)',
      [email, hash, nom]
    );

    res.status(201).json({ message: 'Compte créé avec succès' });
  } catch (err) {
    next(err);
  }
});

router.post('/login', async (req, res, next) => {
  try {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ erreur: 'Email et mot de passe requis' });
    }

    const [rows] = await pool.query(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ erreur: "Identifiants incorrects" });
    }

    const motDePasseValide = await bcrypt.compare(mot_de_passe, user.mot_de_passe);

    if (!motDePasseValide) {
      return res.status(401).json({ erreur: "Identifiants incorrects" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ token });
  } catch (err) {
    next(err);
  }
});

router.get('/profil', verifierToken, (req, res) => {
  res.json({ message: 'Accès autorisé !', userId: req.userId });
});

module.exports = router;