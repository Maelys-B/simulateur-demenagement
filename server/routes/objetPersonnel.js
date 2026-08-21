const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

router.post('/', verifierToken, async (req, res) => {
  try {
    const { nom, volume } = req.body;

    const [result] = await pool.query(
      'INSERT INTO objets_personnels (user_id, nom, volume) VALUES (?, ?, ?)',
      [req.userId, nom, volume]
    );

    res.status(201).json({ message: 'Objet créé', id: result.insertId });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.get('/', verifierToken, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM objets_personnels WHERE user_id = ?', [req.userId]);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.get('/:id', verifierToken, async (req, res) => {
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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.put('/:id', verifierToken, async (req, res) => {
  try {
    const { nom, volume } = req.body;

    const [result] = await pool.query(
      'UPDATE objets_personnels SET nom = ?, volume = ? WHERE id = ? AND user_id = ?',
      [nom, volume, req.params.id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erreur: 'Objet introuvable' });
    }

    res.json({ message: 'Objet modifié' });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

router.delete('/:id', verifierToken, async (req, res) => {
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
    res.status(500).json({ erreur: 'Erreur serveur', details: err.message });
  }
});

module.exports = router;
