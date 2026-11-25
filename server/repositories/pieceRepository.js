const prisma = require('../config/prisma');

const appartientA = (userId) => ({ demenagement: { user_id: userId } });

function creer(donnees) {
  return prisma.piece.create({ data: donnees });
}

function listerParUtilisateur(userId) {
  return prisma.piece.findMany({ where: appartientA(userId), orderBy: { id: 'asc' } });
}

function trouverParId(id, userId) {
  return prisma.piece.findFirst({ where: { id, ...appartientA(userId) } });
}

function modifier(id, userId, donnees) {
  return prisma.piece.updateMany({ where: { id, ...appartientA(userId) }, data: donnees });
}

function supprimer(id, userId) {
  return prisma.piece.deleteMany({ where: { id, ...appartientA(userId) } });
}

module.exports = { creer, listerParUtilisateur, trouverParId, modifier, supprimer };
