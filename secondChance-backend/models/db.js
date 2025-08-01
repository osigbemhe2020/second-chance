// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

let dbInstance = null;
const url = process.env.MONGO_URL;
const dbName = process.env.MONGO_DB;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    const client = new MongoClient(url);

    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");

        dbInstance = client.db(dbName); 
        return dbInstance;
    } catch (err) {
        console.error("MongoDB connection error:", err);
        throw err;
    }
}

module.exports = connectToDatabase;


