const express = require('express');
const router = express.Router();
const User = require('../models/User'); // Import your User model
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Load environment variables for JWT secret key
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // Set this securely in a .env file

// Sign-in Route
router.post('/signin', async (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Check if the user exists by username
        const user = await User.findOne({ username }); // Change here to find by username
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Compare entered password with stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id, username: user.username }, // Change email to username here
            JWT_SECRET,
            { expiresIn: '1h' } // Set token expiration as needed
        );

        // Respond with success message and token
        res.status(200).json({
            message: 'Login successful',
            token, // Send the token to the client
            user: { id: user._id, username: user.username } // Return username instead of email
        });
    } catch (error) {
        console.error('Login error:', error); // Log the error for debugging
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;
