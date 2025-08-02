/* jshint esversion: 8 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pinoLogger = require('./logger');
const connectToDatabase = require('./models/db');
const { loadData } = require('./util/import-mongo/index');

const app = express();
const port = 3060;

app.use('*', cors());
app.use(express.json());

// Connect to MongoDB
connectToDatabase()
  .then(() => {
    pinoLogger.info('Connected to DB');
  })
  .catch((e) => {
    console.error('Failed to connect to DB', e);
  });

// Routes
const secondChanceItemsRoutes = require('./routes/secondChanceItemsRoutes');
app.use('/api/secondchance/items', secondChanceItemsRoutes);

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const searchRoutes = require('./routes/searchRoutes');
app.use('/api/secondchance/search', searchRoutes);

const pinoHttp = require('pino-http');
const logger = require('./logger');
app.use(pinoHttp({ logger }));

// Health check route
app.get('/', (req, res) => {
  res.send('Inside the server');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Internal Server Error');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
