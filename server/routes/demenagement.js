const express = require('express');
const verifierToken = require('../middleware/verifierToken');
const demenagementController = require('../controllers/demenagementController');

const router = express.Router();

router.use(verifierToken);

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
 *             required: [ nom, date_demenagement ]
 *             properties:
 *               nom:
 *                 type: string
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
 *               nb_personnes:
 *                 type: integer
 *               formule:
 *                 type: string
 *               melanger_cartons:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Déménagement créé
 *       400:
 *         description: nom et date_demenagement sont requis
 *       500:
 *         description: Erreur serveur
 */
router.post('/', demenagementController.creer);

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
router.get('/', demenagementController.lister);

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
router.get('/:id', demenagementController.trouver);

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
 *             required: [ nom, date_demenagement ]
 *             properties:
 *               nom:
 *                 type: string
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
 *               nb_personnes:
 *                 type: integer
 *               formule:
 *                 type: string
 *               melanger_cartons:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Déménagement modifié
 *       400:
 *         description: nom et date_demenagement sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Déménagement introuvable
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', demenagementController.modifier);

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
router.delete('/:id', demenagementController.supprimer);

module.exports = router;
