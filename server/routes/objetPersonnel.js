const express = require('express');
const verifierToken = require('../middleware/verifierToken');
const objetPersonnelController = require('../controllers/objetPersonnelController');

const router = express.Router();

router.use(verifierToken);

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
 *               type:
 *                 type: string
 *               carton:
 *                 type: string
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
router.post('/', objetPersonnelController.creer);

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
router.get('/', objetPersonnelController.lister);

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
router.get('/:id', objetPersonnelController.trouver);

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
 *               type:
 *                 type: string
 *               carton:
 *                 type: string
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
router.put('/:id', objetPersonnelController.modifier);

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
router.delete('/:id', objetPersonnelController.supprimer);

module.exports = router;
