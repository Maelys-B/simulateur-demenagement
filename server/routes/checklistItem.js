const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

router.post('/', verifierToken, async (req, res) => {
  try {
    const { demenagement_id, titre, description, date_limite, type, complete } = req.body;

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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.get('/', verifierToken, async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT checklist_items.* FROM checklist_items
      JOIN demenagements ON checklist_items.demenagement_id = demenagements.id
      WHERE demenagements.user_id = ?`,
      [req.userId]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.get('/:id', verifierToken, async (req, res) => {
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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.put('/:id', verifierToken, async (req, res) => {
  try {
    const { titre, description, date_limite, type, complete } = req.body;

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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.delete('/:id', verifierToken, async (req, res) => {
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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
