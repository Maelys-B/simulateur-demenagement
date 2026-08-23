const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

/**
 * @swagger
 * /api/objets:
 *   post:
 *     summary: Crée un objet d'inventaire dans une pièce
 *     tags: [ObjetsInventaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ piece_id, nom ]
 *             properties:
 *               piece_id:
 *                 type: integer
 *               nom:
 *                 type: string
 *               volume:
 *                 type: number
 *               quantite:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objet créé
 *       400:
 *         description: piece_id et nom sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pièce introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifierToken, async (req, res, next) => {
  try {
    const { piece_id, nom, volume, quantite, type } = req.body;

    if (!piece_id || !nom) {
      return res.status(400).json({ erreur: 'piece_id et nom sont requis' });
    }

    const [pieces] = await pool.query(
      `SELECT pieces.* FROM pieces
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE pieces.id = ? AND demenagements.user_id = ?`,
      [piece_id, req.userId]
    );

    if (pieces.length === 0) {
      return res.status(404).json({ erreur: 'Pièce introuvable' });
    }

    const [result] = await pool.query(
      'INSERT INTO objets_inventaire (piece_id, nom, volume, quantite, type) VALUES (?, ?, ?, ?, ?)',
      [piece_id, nom, volume, quantite, type]
    );

    res.status(201).json({ message: 'Objet créé', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/objets:
 *   get:
 *     summary: Liste les objets d'inventaire de l'utilisateur connecté
 *     tags: [ObjetsInventaire]
 *     responses:
 *       200:
 *         description: Liste des objets
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT objets_inventaire.* FROM objets_inventaire
      JOIN pieces ON objets_inventaire.piece_id = pieces.id
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
 * /api/objets/{id}:
 *   get:
 *     summary: Récupère un objet d'inventaire par son id
 *     tags: [ObjetsInventaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: L'objet trouvé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Objet introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT objets_inventaire.* FROM objets_inventaire
      JOIN pieces ON objets_inventaire.piece_id = pieces.id
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE objets_inventaire.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );
    const objet = rows[0];

    if (!objet) {
      return res.status(404).json({ erreur: 'Objet introuvable' });
    }

    res.json(objet);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/objets/{id}:
 *   put:
 *     summary: Modifie un objet d'inventaire
 *     tags: [ObjetsInventaire]
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
 *               volume:
 *                 type: number
 *               quantite:
 *                 type: integer
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Objet modifié
 *       400:
 *         description: nom est requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Objet introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifierToken, async (req, res, next) => {
  try {
    const { nom, volume, quantite, type } = req.body;

    if (!nom) {
      return res.status(400).json({ erreur: 'nom est requis' });
    }

    const [result] = await pool.query(
      `UPDATE objets_inventaire
      JOIN pieces ON objets_inventaire.piece_id = pieces.id
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      SET objets_inventaire.nom = ?, objets_inventaire.volume = ?, objets_inventaire.quantite = ?, objets_inventaire.type = ?
      WHERE objets_inventaire.id = ? AND demenagements.user_id = ?`,
      [nom, volume, quantite, type, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Objet introuvable' });
    }

    res.json({ message: 'Objet modifié' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/objets/{id}:
 *   delete:
 *     summary: Supprime un objet d'inventaire
 *     tags: [ObjetsInventaire]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Objet supprimé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Objet introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifierToken, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `DELETE objets_inventaire FROM objets_inventaire
      JOIN pieces ON objets_inventaire.piece_id = pieces.id
      JOIN demenagements ON pieces.demenagement_id = demenagements.id
      WHERE objets_inventaire.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Objet introuvable' });
    }

    res.json({ message: 'Objet supprimé' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
