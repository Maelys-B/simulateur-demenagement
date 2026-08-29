const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

/**
 * @swagger
 * /api/demenagements:
 *   post:
 *     summary: Crée un déménagement
 *     tags: [Demenagements]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ date_demenagement, type_profil ]
 *             properties:
 *               date_demenagement:
 *                 type: string
 *                 format: date
 *               type_profil:
 *                 type: string
 *               distance_km:
 *                 type: integer
 *               etage:
 *                 type: integer
 *               ascenseur:
 *                 type: boolean
 *               parking:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Déménagement créé
 *       400:
 *         description: date_demenagement et type_profil sont requis
 *       500:
 *         description: Erreur serveur
 */

router.post('/', verifierToken, async (req, res, next) => {
  try {
    const { date_demenagement, type_profil, distance_km, etage, ascenseur, parking } = req.body;

    if (!date_demenagement || !type_profil) {
      return res.status(400).json({ erreur: 'date_demenagement et type_profil sont requis' });
    }

    const [result] = await pool.query(
      'INSERT INTO demenagements (user_id, date_demenagement, type_profil, distance_km, etage, ascenseur, parking) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [req.userId, date_demenagement, type_profil, distance_km, etage, ascenseur, parking]
    );

    res.status(201).json({ message: 'Déménagement créé', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/demenagements:
 *   get:
 *     summary: Liste les déménagements de l'utilisateur connecté
 *     tags: [Demenagements]
 *     responses:
 *       200:
 *         description: Liste des déménagements
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM demenagements WHERE user_id = ?', [req.userId]);

    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/demenagements/{id}:
 *   get:
 *     summary: Récupère un déménagement par son id
 *     tags: [Demenagements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: id du déménagement
 *     responses:
 *       200:
 *         description: Le déménagement trouvé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM demenagements WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);
    const demenagement = rows[0];

    if (!demenagement) {
      return res.status(404).json({ erreur: 'Erreur de chargement' });
    }

    res.json({demenagement});
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/demenagements/{id}:
 *   put:
 *     summary: Modifie un déménagement
 *     tags: [Demenagements]
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
 *             required: [ date_demenagement, type_profil ]
 *             properties:
 *               date_demenagement:
 *                 type: string
 *                 format: date
 *               type_profil:
 *                 type: string
 *               distance_km:
 *                 type: integer
 *               etage:
 *                 type: integer
 *               ascenseur:
 *                 type: boolean
 *               parking:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Déménagement modifié
 *       400:
 *         description: date_demenagement et type_profil sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifierToken, async (req, res, next) => {
  try {
    const { date_demenagement, type_profil, distance_km, etage, ascenseur, parking } = req.body;

    if (!date_demenagement || !type_profil) {
      return res.status(400).json({ erreur: 'date_demenagement et type_profil sont requis' });
    }

    const [result] = await pool.query(
      'UPDATE demenagements SET date_demenagement = ?, type_profil = ?, distance_km = ?, etage = ?, ascenseur = ?, parking = ? WHERE id = ? AND user_id = ?',
      [date_demenagement, type_profil, distance_km, etage, ascenseur, parking, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Erreur de chargement' });
    }

    res.json({ message: 'Changement effectué' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/demenagements/{id}:
 *   delete:
 *     summary: Supprime un déménagement
 *     tags: [Demenagements]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Déménagement supprimé
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifierToken, async (req, res, next) => {
  try {
    const [result] = await pool.query('DELETE FROM demenagements WHERE id = ? AND user_id = ?', [req.params.id, req.userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Erreur de chargement' });
    }

    res.json({ message: 'Le déménagement est supprimé' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;