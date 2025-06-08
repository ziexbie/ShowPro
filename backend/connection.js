const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Debug logs
console.log('Environment Variables Status:');
console.log('DB_URL:', process.env.DB_URL ? 'Defined' : 'Not defined');
console.log('Current directory:', __dirname);

const url = process.env.DB_URL;

const connectDB = async () => {
    if (!url) {
        console.error('MongoDB connection URL is not defined in environment variables');
        process.exit(1);
    }

    try {
        await mongoose.connect(url, {
            serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
            socketTimeoutMS: 45000, // How long to wait for operations (like queries) to complete
        });
        console.log('Successfully connected to MongoDB');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
        process.exit(1); // Exit process with failure
    }
};

// Execute connection
connectDB();

module.exports = mongoose;
