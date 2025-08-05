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
    cb(null, directoryPath); // Specify the upload directory
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Use the original file name
  },
});

const upload = multer({ storage: storage });


// Get all secondChanceItems
router.get('/', async (req, res, next) => {
    logger.info('/ called');
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const secondChanceItems = await collection.find({}).toArray();
        res.json(secondChanceItems);
    } catch (e) {
        logger.console.error('oops something went wrong', e)
        next(e);
    }
});

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
router.get('/:id', async (req, res, next) => {
    try {
        const db = await connectToDatabase();
        const collection = db.collection("secondChanceItems");
        const id = req.params.id;
        const secondChanceItem = await collection.findOne({ id: id });
        if (!secondChanceItem) {
        return res.status(404).send("secondChanceItem not found");
        }

        res.json(secondChanceItem);
    } catch (e) {
        next(e);
    }
});

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
    }
});


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
  } catch (e) {
    next(e);
  }
});



module.exports = router;
