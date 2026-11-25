const prisma = require('../config/prisma');

const appartientA = (userId) => ({ piece: { demenagement: { user_id: userId } } });

function creer(donnees) {
  return prisma.objetInventaire.create({ data: donnees });
}

function listerParUtilisateur(userId) {
  return prisma.objetInventaire.findMany({ where: appartientA(userId), orderBy: { id: 'asc' } });
}

function trouverParId(id, userId) {
  return prisma.objetInventaire.findFirst({ where: { id, ...appartientA(userId) } });
}

function modifier(id, userId, donnees) {
  return prisma.objetInventaire.updateMany({ where: { id, ...appartientA(userId) }, data: donnees });
}

function supprimer(id, userId) {
  return prisma.objetInventaire.deleteMany({ where: { id, ...appartientA(userId) } });
}

module.exports = { creer, listerParUtilisateur, trouverParId, modifier, supprimer };
