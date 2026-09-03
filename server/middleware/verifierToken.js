const jwt = require('jsonwebtoken');

function verifierToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erreur: 'Non authentifié' });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decode.userId;
    next();
  } catch {
    return res.status(401).json({ erreur: 'Veuillez vous reconnecter' });
  }
}

module.exports = verifierToken;