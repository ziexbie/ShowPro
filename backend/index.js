const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const cors = require('cors');
const mongoose = require('./connection');
const UserRouter = require('./routes/userRouter');
const ProjectRouter = require('./routes/projectRouter');

// Configure dotenv
dotenv.config();

const app = express();
const port = 5000;

// Middleware
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(express.json());
app.use('/user', UserRouter);
app.use('/project', ProjectRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: 'Something went wrong!',
        details: err.message
    });
});

// Routes
app.get('/health', (req, res) => {
    res.json({ status: 'OK', mongodb: mongoose.connection.readyState });
});

app.get('/', (req, res) => {
       res.send('Hihihihih')
})

app.get('/add', (req, res) => {
       res.send('hihhi from add')
})

app.get('/getall', (req, res) => {
       res.send(' res from getall User router');
   });

// Serve static files
// app.use(express.static(path.join(__dirname, '../frontend/dist')));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
// });

// Start server
mongoose.connection.once('open', () => {
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});