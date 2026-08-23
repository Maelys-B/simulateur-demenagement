require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const demenagementRoutes = require('./routes/demenagement');
app.use('/api/demenagements', demenagementRoutes);

const piecesRoutes = require('./routes/piece');
app.use('/api/pieces', piecesRoutes);

const objetInvRoutes = require('./routes/objetInventaire');
app.use('/api/objets', objetInvRoutes);

const checklistRoutes = require('./routes/checklistItem');
app.use('/api/checklist', checklistRoutes);

const objetPersRoutes = require('./routes/objetPersonnel');
app.use('/api/objets-personnels', objetPersRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erreur: 'Erreur serveur' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));