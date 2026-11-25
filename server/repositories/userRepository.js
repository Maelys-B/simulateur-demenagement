const prisma = require('../config/prisma');

function trouverParEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

function creer(donnees) {
  return prisma.user.create({ data: donnees });
}

module.exports = { trouverParEmail, creer };
