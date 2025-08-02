const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const connectToDatabase = require('../models/db');
const logger = require('../logger');

// Define the upload directory path
const directoryPath = 'public/images';

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, directoryPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

// GET all secondChanceItems
router.get('/', async (req, res, next) => {
  logger.info('/ called');
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const secondChanceItems = await collection.find({}).toArray();
    res.json(secondChanceItems);
  } catch (e) {
    logger.error('Oops something went wrong', e);
    next(e);
  }
});

// POST a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    let secondChanceItem = req.body;

    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
    const lastId = lastItem.length > 0 ? parseInt(lastItem[0].id) : 0;
    secondChanceItem.id = (lastId + 1).toString();

    const dateAdded = Math.floor(Date.now() / 1000);
    secondChanceItem.date_added = dateAdded;

    const result = await collection.insertOne(secondChanceItem);
    res.status(201).json(result.ops?.[0] || secondChanceItem);
  } catch (e) {
    next(e);
  }
});

// GET single item by id
router.get('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;

    const item = await collection.findOne({ id });
    if (!item) {
      return res.status(404).send('secondChanceItem not found');
    }

    res.json(item);
  } catch (e) {
    next(e);
  }
});

// PUT update item
router.put('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;

    const item = await collection.findOne({ id });
    if (!item) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    const updatedItem = {
      ...item,
      ...req.body,
      age_years: Number((req.body.age_days / 365).toFixed(1)),
      updatedAt: new Date()
    };

    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updatedItem },
      { returnDocument: 'after' }
    );

    if (result?.value) {
      res.json({ uploaded: 'success' });
    } else {
      res.json({ uploaded: 'failed' });
    }
  } catch (e) {
    next(e);
  }
});

// DELETE item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection('secondChanceItems');
    const { id } = req.params;

    const item = await collection.findOne({ id });
    if (!item) {
      logger.error('secondChanceItem not found');
      return res.status(404).json({ error: 'secondChanceItem not found' });
    }

    await collection.deleteOne({ id });
    res.json({ deleted: 'success' });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
