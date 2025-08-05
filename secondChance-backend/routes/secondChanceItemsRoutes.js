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

<<<<<<< HEAD
// Add a new item
router.post('/', upload.single('file'), async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("secondChanceItems");

    let secondChanceItem = req.body;

    // Auto-increment id
    const lastItem = await collection.find().sort({ id: -1 }).limit(1).toArray();
    secondChanceItem.id = lastItem.length > 0
      ? (parseInt(lastItem[0].id) + 1).toString()
      : "1";

    // Add timestamp
    secondChanceItem.date_added = Math.floor(Date.now() / 1000);

    // Save uploaded file name if present
    if (req.file) {
      secondChanceItem.image = req.file.filename;
    }

    const result = await collection.insertOne(secondChanceItem);
    res.status(201).json({ ...secondChanceItem, _id: result.insertedId });

  } catch (e) {
    console.error('Error in POST /items:', e);
    res.status(500).json({ error: 'Internal Server Error', message: e.message });
  }
});


// Get a single secondChanceItem by ID
=======
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
>>>>>>> 113035e0432d3d830a349e882579bdcfa1b8e67f
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

<<<<<<< HEAD
// Update and existing item
router.put('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");

        const id = req.params.id;

        // Try to find and update the item
        const result = await collection.updateOne(
            { id: id }, // use string if your ids are stored as strings
            { $set: req.body }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({ message: "secondChanceItem not found" });
        }

        res.json({ message: "secondChanceItem updated successfully" });
    } catch (e) {
        next(e);
=======
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
>>>>>>> 113035e0432d3d830a349e882579bdcfa1b8e67f
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

<<<<<<< HEAD

// Delete an existing item
router.delete('/:id', async (req, res, next) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("secondChanceItems");

    const id = req.params.id; // 👈 match how it's stored in MongoDB

    const secondChanceItem = await collection.findOne({ id });

    if (!secondChanceItem) {
      console.error("secondChanceItem not found");
      return res.status(404).json({ error: "secondChanceItem not found" });
    }

    await collection.deleteOne({ id });
    res.json({ deleted: "success" });
=======
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
>>>>>>> 113035e0432d3d830a349e882579bdcfa1b8e67f
  } catch (e) {
    next(e);
  }
});



module.exports = router;
