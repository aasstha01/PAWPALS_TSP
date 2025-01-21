const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors"); // Import CORS
const path = require('path'); // Import path module
const User = require('./models/user'); // Ensure correct case for User model
const Pet = require('./models/pet'); // Import the Pet model
const petRoutes = require('./routes/petRoutes'); // Import pet routes
const bcrypt = require('bcrypt'); // Import bcrypt for hashing passwords
const jwt = require('jsonwebtoken'); // Import JWT for token generation
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Middleware to parse incoming JSON requests
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for all routes

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pawpalsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Registration endpoint
app.post('/register', async (req, res) => {
    console.log("Request Body:", req.body);
    const {
        username,
        email,
        password,
        userType,
        organizationName,
        establishmentYear,
        socialMedia,
        description,
        location
    } = req.body;

    // Basic validation
    if (!username || !password || !email || !userType) {
        return res.status(400).json({ message: "All fields are required!" });
    }

    try {
        // Check for existing user
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user object
        const newUser = {
            username,
            password: hashedPassword,
            email,
            userType,
            location // Include location even for individuals
        };

        // Add organization-specific fields if userType is 'organization'
        if (userType === 'organization') {
            if (!organizationName || !establishmentYear || !socialMedia || !description) {
                return res.status(400).json({ message: "All NGO fields are required for organizations" });
            }
            newUser.organizationName = organizationName;
            newUser.establishmentYear = establishmentYear;
            newUser.socialMedia = socialMedia;
            newUser.description = description;
        }

        // Save the new user to the database
        const user = new User(newUser);
        await user.save();
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user: " + error.message });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Both username and password are required!" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET || 'your_jwt_secret_key',
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: "Login successful!",
            token,
            user: { id: user._id, username: user.username } // Optional: do not include password
        });
    } catch (error) {
        console.error("Error logging in", error);
        res.status(500).json({ message: "Error logging in. Please try again." });
    }
});

// Serve your homepage
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'MINI PROJECT pawpals', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// pet listing

// Use the pet routes
app.use("/pets", petRoutes);

//connect to mongoDB
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/pawpalsDB")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("Failed to connect to MongoDB", err));

// Use the user and pet routes

app.use('/pets', petRoutes);

