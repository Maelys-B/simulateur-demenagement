const prisma = require('../config/prisma');

function creer(donnees) {
  return prisma.objetPersonnel.create({ data: donnees });
}

function listerParUtilisateur(userId) {
  return prisma.objetPersonnel.findMany({ where: { user_id: userId }, orderBy: { id: 'asc' } });
}

function trouverParId(id, userId) {
  return prisma.objetPersonnel.findFirst({ where: { id, user_id: userId } });
}

function modifier(id, userId, donnees) {
  return prisma.objetPersonnel.updateMany({ where: { id, user_id: userId }, data: donnees });
}

function supprimer(id, userId) {
  return prisma.objetPersonnel.deleteMany({ where: { id, user_id: userId } });
}

module.exports = { creer, listerParUtilisateur, trouverParId, modifier, supprimer };
