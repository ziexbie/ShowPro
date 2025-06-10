const express = require('express');
const router = express.Router();
const Model = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Add role field to user registration route
router.post('/add', async (req, res) => {
    try {
        const newUser = new Model(req.body);
        const result = await newUser.save();
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/getall', (req, res) => {

    Model.find()
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' });
            console.log(err);
        });

})

router.get('/getbyid/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const result = await Model.findById(userId);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.delete('/delete/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const result = await Model.findByIdAndDelete(userId);
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.put('/update/:userId', async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const result = await Model.findByIdAndUpdate(userId, req.body, { new: true });
        if (!result) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(result);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await Model.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check if user is admin
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied. Admin access only.' });
        }

        // Compare passwords
        if (user.password !== password) {  // Note: In production, use proper password hashing
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/signup', (req, res) => {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    Model.findOne({ email })
        .then((existingUser) => {
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Create new user
            const newUser = new Model({
                name,
                email,
                password,
                role: role || 'user' 
            });

            return newUser.save();
        })
        .then((savedUser) => {
            res.status(201).json(savedUser);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).json({ message: 'Internal Server Error' });
        });
})



router.get('/count', async (req, res) => {
    try {
        const count = await Model.countDocuments(); // Use the User model
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get user count' });
    }
});

module.exports = router;