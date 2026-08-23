const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

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

router.get('/', verifierToken, async (req, res, next) => {
  try {
    const [rows] = await pool.query('SELECT * FROM demenagements WHERE user_id = ?', [req.userId]);

    res.json({ rows });
  } catch (err) {
    next(err);
  }
});

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