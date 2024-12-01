const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2'); // Import mysql2 package

const router = express.Router();

const saltRounds = 10; // Number of salt rounds for hashing

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',           // Your MySQL username
    password: '',           // Your MySQL password
    database: 'blood_acceptor' // Your MySQL database name
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// User Registration Route
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body; // Collect user details

    try {
        // Check if the user already exists in MySQL
        db.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Error checking existing user', error: err });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Insert the new user into MySQL
            db.execute('INSERT INTO users (username, password) VALUES (?, ?)', [name, hashedPassword], (err, results) => {
                if (err) {
                    return res.status(500).json({ message: 'Error registering user', error: err });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Server error', error });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body; // Assuming login is by email and password

    try {
        // Find the user by email in MySQL
        db.execute('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({ message: 'Error finding user', error: err });

            if (results.length === 0) return res.status(404).json({ message: 'User not found' });

            const user = results[0]; // Assuming the user exists

            // Compare entered password with hashed password in MySQL
            const isPasswordMatch = await bcrypt.compare(password, user.password);
            if (!isPasswordMatch) return res.status(401).json({ message: 'Invalid credentials' });

            // Generate a JWT token
            const token = jwt.sign(
                { userId: user.id }, // Payload
                'your_secret_key', // Replace with a strong secret key
                { expiresIn: '1h' } // Token expiration
            );

            res.status(200).json({ message: 'Login successful', token });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});

// Add search history (now requires MySQL)
router.post('/add-history', async (req, res) => {
    const { userId, searchType, query } = req.body;

    try {
        // Update search history in MySQL (you might need to create a separate table for history)
        db.execute('INSERT INTO search_history (user_id, search_type, query) VALUES (?, ?, ?)', [userId, searchType, query], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error adding search history', error: err });

            res.status(200).json({ message: 'Search history added successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding search history', error });
    }
});

// Retrieve search history (now requires MySQL)
router.get('/history/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Retrieve search history from MySQL
        db.execute('SELECT * FROM search_history WHERE user_id = ?', [userId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error retrieving search history', error: err });

            if (results.length === 0) return res.status(404).json({ message: 'No search history found' });

            res.status(200).json(results);
        });
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving search history', error });
    }
});

// Delete search history (now requires MySQL)
router.delete('/delete-history', async (req, res) => {
    const { userId, historyId } = req.body;

    try {
        // Delete search history from MySQL
        db.execute('DELETE FROM search_history WHERE user_id = ? AND id = ?', [userId, historyId], (err, results) => {
            if (err) return res.status(500).json({ message: 'Error deleting search history', error: err });

            res.status(200).json({ message: 'Search history deleted successfully' });
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting search history', error });
    }
});

module.exports = router;
