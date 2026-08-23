const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

/**
 * @swagger
 * /api/pieces:
 *   post:
 *     summary: Crée une pièce dans un déménagement
 *     tags: [Pieces]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ demenagement_id, nom ]
 *             properties:
 *               demenagement_id:
 *                 type: integer
 *               nom:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pièce créée
 *       400:
 *         description: demenagement_id et nom sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifierToken, async (req, res, next) => {
  try {
    const { demenagement_id, nom } = req.body;

    if (!demenagement_id || !nom) {
      return res.status(400).json({ erreur: 'demenagement_id et nom sont requis' });
    }

    const [demenagements] = await pool.query(
      'SELECT * FROM demenagements WHERE id = ? AND user_id = ?',
      [demenagement_id, req.userId]
    );

    if (demenagements.length === 0) {
      return res.status(404).json({ erreur: 'Déménagement introuvable' });
    }

    const [result] = await pool.query(
      'INSERT INTO pieces (demenagement_id, nom) VALUES (?, ?)',
      [demenagement_id, nom]
    );

    res.status(201).json({ message: 'Pièce créée', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/pieces:
 *   get:
 *     summary: Liste les pièces de l'utilisateur connecté
 *     tags: [Pieces]
 *     responses:
 *       200:
 *         description: Liste des pièces
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT pieces.* FROM pieces
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE demenagements.user_id = ?`,
      [req.userId]
    );

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/pieces/{id}:
 *   get:
 *     summary: Récupère une pièce par son id
 *     tags: [Pieces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La pièce trouvée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pièce introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT pieces.* FROM pieces
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE pieces.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );
    const piece = rows[0];

    if (!piece) {
      return res.status(404).json({ erreur: 'Pièce introuvable' });
    }

    res.json(piece);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/pieces/{id}:
 *   put:
 *     summary: Modifie une pièce
 *     tags: [Pieces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ nom ]
 *             properties:
 *               nom:
 *                 type: string
 *     responses:
 *       200:
 *         description: Pièce modifiée
 *       400:
 *         description: nom est requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pièce introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifierToken, async (req, res, next) => {
  try {
    const { nom } = req.body;

    if (!nom) {
      return res.status(400).json({ erreur: 'nom est requis' });
    }

    const [result] = await pool.query(
      `UPDATE pieces
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      SET pieces.nom = ?
      WHERE pieces.id = ? AND demenagements.user_id = ?`,
      [nom, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Pièce introuvable' });
    }

    res.json({ message: 'Pièce modifiée' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/pieces/{id}:
 *   delete:
 *     summary: Supprime une pièce
 *     tags: [Pieces]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pièce supprimée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pièce introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifierToken, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `DELETE pieces FROM pieces
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE pieces.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Pièce introuvable' });
    }

    res.json({ message: 'Pièce supprimée' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;