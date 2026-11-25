const express = require('express');
const verifierToken = require('../middleware/verifierToken');
const pieceController = require('../controllers/pieceController');

const router = express.Router();

router.use(verifierToken);

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
router.post('/', pieceController.creer);

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
router.get('/', pieceController.lister);

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
router.get('/:id', pieceController.trouver);

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
router.put('/:id', pieceController.modifier);

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
router.delete('/:id', pieceController.supprimer);

module.exports = router;
