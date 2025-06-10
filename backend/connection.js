const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const url = process.env.DB_URL;

const connectDB = async () => {
    if (!url) {
        console.error('MongoDB connection URL is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 15000,
            socketTimeoutMS: 45000,
        });
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1);
    }
};

connectDB();

module.exports = mongoose;
