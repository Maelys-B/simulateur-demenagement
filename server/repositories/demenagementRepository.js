const prisma = require('../config/prisma');

function creer(donnees) {
  return prisma.demenagement.create({ data: donnees });
}

function listerParUtilisateur(userId) {
  return prisma.demenagement.findMany({
    where: { user_id: userId },
    orderBy: { id: 'asc' },
  });
}

function trouverParId(id, userId) {
  return prisma.demenagement.findFirst({ where: { id, user_id: userId } });
}

function modifier(id, userId, donnees) {
  return prisma.demenagement.updateMany({ where: { id, user_id: userId }, data: donnees });
}

function supprimer(id, userId) {
  return prisma.demenagement.deleteMany({ where: { id, user_id: userId } });
}

module.exports = { creer, listerParUtilisateur, trouverParId, modifier, supprimer };
