const express = require('express');
const router = express.Router();
const pool = require('../db');
const verifierToken = require('../middleware/verifierToken');

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
