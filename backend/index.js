const express = require('express');
require('dotenv').config();
const path = require('path');
const mongoose = require('./connection'); // This will execute the connection
const UserRouter = require('./routes/userRouter');
const ProjectRouter = require('./routes/projectRouter');
const dotenv = require('dotenv');
const cors = require('cors');

//creating new expess app

const app = express();

const port = 5000;

//middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use('/user', UserRouter);
app.use('/project', ProjectRouter);
// Add error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        details: err.message
    });
});

// Serve static files from uploads directory


//routes or endpoints

app.get('/', (req, res) => {
       res.send('Hihihihih')
})

app.get('/add', (req, res) => {
       res.send('hihhi from add')
})

app.get('/getall', (req, res) => {
       res.send(' res from getall User router');
   });

// Debug route to check if server is running
app.get('/health', (req, res) => {
    res.json({ status: 'OK', mongodb: mongoose.connection.readyState });
});

// Only start server after DB connection is ready
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});