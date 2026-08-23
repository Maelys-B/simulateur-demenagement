const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

/**
 * @swagger
 * /api/objets-personnels:
 *   post:
 *     summary: Crée un objet personnel
 *     tags: [ObjetsPersonnels]
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
 *     responses:
 *       201:
 *         description: Objet créé
 *       400:
 *         description: nom est requis
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifierToken, async (req, res, next) => {
  try {
    const { nom, volume } = req.body;

    if (!nom) {
      return res.status(400).json({ erreur: 'nom est requis' });
    }

    const [result] = await pool.query(
      'INSERT INTO objets_personnels (user_id, nom, volume) VALUES (?, ?, ?)',
      [req.userId, nom, volume]
    );

    res.status(201).json({ message: 'Objet créé', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/objets-personnels:
 *   get:
 *     summary: Liste les objets personnels de l'utilisateur connecté
 *     tags: [ObjetsPersonnels]
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
    const [rows] = await pool.query('SELECT * FROM objets_personnels WHERE user_id = ?', [req.userId]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/objets-personnels/{id}:
 *   get:
 *     summary: Récupère un objet personnel par son id
 *     tags: [ObjetsPersonnels]
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
      'SELECT * FROM objets_personnels WHERE id = ? AND user_id = ?',
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
 * /api/objets-personnels/{id}:
 *   put:
 *     summary: Modifie un objet personnel
 *     tags: [ObjetsPersonnels]
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
    const { nom, volume } = req.body;

    if (!nom) {
      return res.status(400).json({ erreur: 'nom est requis' });
    }

    const [result] = await pool.query(
      'UPDATE objets_personnels SET nom = ?, volume = ? WHERE id = ? AND user_id = ?',
      [nom, volume, req.params.id, req.userId]
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
 * /api/objets-personnels/{id}:
 *   delete:
 *     summary: Supprime un objet personnel
 *     tags: [ObjetsPersonnels]
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
      'DELETE FROM objets_personnels WHERE id = ? AND user_id = ?',
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
