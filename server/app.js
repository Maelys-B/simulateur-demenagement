const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const authRoutes = require('./routes/auth');
const demenagementRoutes = require('./routes/demenagement');
const pieceRoutes = require('./routes/piece');
const objetInventaireRoutes = require('./routes/objetInventaire');
const checklistRoutes = require('./routes/checklistItem');
const objetPersonnelRoutes = require('./routes/objetPersonnel');
const gestionErreurs = require('./middleware/gestionErreurs');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use('/api/auth', authRoutes);
app.use('/api/demenagements', demenagementRoutes);
app.use('/api/pieces', pieceRoutes);
app.use('/api/objets', objetInventaireRoutes);
app.use('/api/checklist', checklistRoutes);
app.use('/api/objets-personnels', objetPersonnelRoutes);

app.use(gestionErreurs);

module.exports = app;
