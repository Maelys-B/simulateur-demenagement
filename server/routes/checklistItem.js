const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

/**
 * @swagger
 * /api/checklist:
 *   post:
 *     summary: Crée une tâche de checklist dans un déménagement
 *     tags: [Checklist]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ demenagement_id, titre ]
 *             properties:
 *               demenagement_id:
 *                 type: integer
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               date_limite:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *               complete:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Tâche créée
 *       400:
 *         description: demenagement_id et titre sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post('/', verifierToken, async (req, res, next) => {
  try {
    const { demenagement_id, titre, description, date_limite, type, complete } = req.body;

    if (!demenagement_id || !titre) {
      return res.status(400).json({ erreur: 'demenagement_id et titre sont requis' });
    }

    const [demenagements] = await pool.query(
      'SELECT * FROM demenagements WHERE id = ? AND user_id = ?',
      [demenagement_id, req.userId]
    );

    if (demenagements.length === 0) {
      return res.status(404).json({ erreur: 'Déménagement introuvable' });
    }

    const [result] = await pool.query(
      'INSERT INTO checklist_items (demenagement_id, titre, description, date_limite, type, complete) VALUES (?, ?, ?, ?, ?, ?)',
      [demenagement_id, titre, description, date_limite, type, complete]
    );

    res.status(201).json({ message: 'Tâche créée', id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/checklist:
 *   get:
 *     summary: Liste les tâches de checklist de l'utilisateur connecté
 *     tags: [Checklist]
 *     responses:
 *       200:
 *         description: Liste des tâches
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT checklist_items.* FROM checklist_items
      JOIN demenagements ON checklist_items.demenagement_id = demenagements.id
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
 * /api/checklist/{id}:
 *   get:
 *     summary: Récupère une tâche de checklist par son id
 *     tags: [Checklist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: La tâche trouvée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tâche introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT checklist_items.* FROM checklist_items
      JOIN demenagements ON checklist_items.demenagement_id = demenagements.id
      WHERE checklist_items.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );
    const tache = rows[0];

    if (!tache) {
      return res.status(404).json({ erreur: 'Tâche introuvable' });
    }

    res.json(tache);
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/checklist/{id}:
 *   put:
 *     summary: Modifie une tâche de checklist
 *     tags: [Checklist]
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
 *             required: [ titre ]
 *             properties:
 *               titre:
 *                 type: string
 *               description:
 *                 type: string
 *               date_limite:
 *                 type: string
 *                 format: date
 *               type:
 *                 type: string
 *               complete:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Tâche modifiée
 *       400:
 *         description: titre est requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tâche introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', verifierToken, async (req, res, next) => {
  try {
    const { titre, description, date_limite, type, complete } = req.body;

    if (!titre) {
      return res.status(400).json({ erreur: 'titre est requis' });
    }

    const [result] = await pool.query(
      `UPDATE checklist_items
      JOIN demenagements ON checklist_items.demenagement_id = demenagements.id
      SET checklist_items.titre = ?, checklist_items.description = ?, checklist_items.date_limite = ?, checklist_items.type = ?, checklist_items.complete = ?
      WHERE checklist_items.id = ? AND demenagements.user_id = ?`,
      [titre, description, date_limite, type, complete, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Tâche introuvable' });
    }

    res.json({ message: 'Tâche modifiée' });
  } catch (err) {
    next(err);
  }
});

/**
 * @swagger
 * /api/checklist/{id}:
 *   delete:
 *     summary: Supprime une tâche de checklist
 *     tags: [Checklist]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tâche supprimée
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Tâche introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', verifierToken, async (req, res, next) => {
  try {
    const [result] = await pool.query(
      `DELETE checklist_items FROM checklist_items
      JOIN demenagements ON checklist_items.demenagement_id = demenagements.id
      WHERE checklist_items.id = ? AND demenagements.user_id = ?`,
      [req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Tâche introuvable' });
    }

    res.json({ message: 'Tâche supprimée' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
