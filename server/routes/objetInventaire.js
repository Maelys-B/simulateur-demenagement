const express = require('express');
const verifierToken = require('../middleware/verifierToken');
const objetInventaireController = require('../controllers/objetInventaireController');

const router = express.Router();

router.use(verifierToken);

/**
 * @swagger
 * /api/objets:
 *   post:
 *     summary: Crée un objet d'inventaire dans une pièce
 *     tags: [ObjetsInventaire]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [ piece_id, nom ]
 *             properties:
 *               piece_id:
 *                 type: integer
 *               nom:
 *                 type: string
 *               volume:
 *                 type: number
 *               quantite:
 *                 type: integer
 *               type:
 *                 type: string
 *               carton:
 *                 type: string
 *     responses:
 *       201:
 *         description: Objet créé
 *       400:
 *         description: piece_id et nom sont requis
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Pièce introuvable
 *       500:
 *         description: Erreur serveur
 */
router.post('/', objetInventaireController.creer);

/**
 * @swagger
 * /api/objets:
 *   get:
 *     summary: Liste les objets d'inventaire de l'utilisateur connecté
 *     tags: [ObjetsInventaire]
 *     responses:
 *       200:
 *         description: Liste des objets
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', objetInventaireController.lister);

/**
 * @swagger
 * /api/objets/{id}:
 *   get:
 *     summary: Récupère un objet d'inventaire par son id
 *     tags: [ObjetsInventaire]
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
router.get('/:id', objetInventaireController.trouver);

/**
 * @swagger
 * /api/objets/{id}:
 *   put:
 *     summary: Modifie un objet d'inventaire
 *     tags: [ObjetsInventaire]
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
 *               quantite:
 *                 type: integer
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
router.put('/:id', objetInventaireController.modifier);

/**
 * @swagger
 * /api/objets/{id}:
 *   delete:
 *     summary: Supprime un objet d'inventaire
 *     tags: [ObjetsInventaire]
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
router.delete('/:id', objetInventaireController.supprimer);

module.exports = router;
