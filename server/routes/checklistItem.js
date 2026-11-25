const express = require('express');
const verifierToken = require('../middleware/verifierToken');
const checklistItemController = require('../controllers/checklistItemController');

const router = express.Router();

router.use(verifierToken);

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
router.post('/', checklistItemController.creer);

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
router.get('/', checklistItemController.lister);

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
router.get('/:id', checklistItemController.trouver);

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
router.put('/:id', checklistItemController.modifier);

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
router.delete('/:id', checklistItemController.supprimer);

module.exports = router;
