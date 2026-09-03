const express = require('express');
const router = express.Router();
const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const verifierToken = require('../middleware/verifierToken');
const { motDePasseValide } = require('../utils/validation');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Crée un nouveau compte utilisateur
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mot_de_passe]
 *             properties:
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *                 description: Min 8 caractères, majuscule, minuscule, chiffre, caractère spécial
 *               nom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *       400:
 *         description: Email/mot de passe manquant ou mot de passe invalide
 *       500:
 *         description: Erreur serveur
 */
router.post('/register', async (req, res, next) => {
  try {
    const { email, mot_de_passe, nom } = req.body;

    if (!email || !mot_de_passe) {
      return res.status(400).json({ erreur: 'Email et mot de passe requis' });
    }

    if (!motDePasseValide(mot_de_passe)) {
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

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Connecte un utilisateur et renvoie un token JWT
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, mot_de_passe]
 *             properties:
 *               email:
 *                 type: string
 *               mot_de_passe:
 *                 type: string
 *     responses:
 *       200:
 *         description: Connexion réussie, renvoie le token JWT
 *       400:
 *         description: Email/mot de passe manquant
 *       401:
 *         description: Identifiants incorrects
 *       500:
 *         description: Erreur serveur
 */
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