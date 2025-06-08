const express = require('express');
const Model = require('../model/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const router = express.Router();

// Add role field to user registration route
router.post('/add', (req, res) => {
    new Model(req.body).save()
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
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

router.get('/getbyid/:id', (req, res) => {
    Model.findById(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' });
            console.log(err);
        });
})

router.delete('/delete/:id', (req, res) => {
    Model.findByIdAndDelete(req.params.id)
        .then((result) => {
            res.status(200).json(result);
        }).catch((err) => {
            res.status(500).json({ message: 'Internal Server Error' });
            console.log(err);
        });
})


router.put('/update/:id', (req, res) => {
    Model.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((result) => {
            res.json(result);
        }).catch((err) => {
            console.error(err);
            res.status(500).json(err);
        });
});


router.post('/authenticate', async (req, res) => {
    try {
        const { email, password } = req.body;

        
        const user = await Model.findOne({ email, password });
        
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        
        const token = jwt.sign(
            { userId: user._id, email: user.email },
            'simplesecret',
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
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