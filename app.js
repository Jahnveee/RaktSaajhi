require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken"); // Import JWT for token handling
const mysql = require('mysql2');

const userRoutes = require("./routes/userRoutes");
const donorRoutes = require("./routes/donorRoutes");
const hospitalRoutes = require("./routes/hospitalRoutes");

const app = express();

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',            // Replace with your MySQL username
    password: 'SACS2094',    // Replace with your MySQL password
    database: 'blood_acceptor' // Your MySQL database
});

// Connect to MySQL database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Middleware
app.use(cors());
app.use(express.json()); // Built-in body parser (for JSON)
app.use(express.urlencoded({ extended: true })); // For parsing form data
app.use(express.static(path.join(__dirname, "assets"))); // Serve static files (e.g., images, stylesheets)

// Authentication Middleware to check JWT token
const authenticateToken = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) return res.status(403).json({ message: "Token required" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid token" });
        req.userId = decoded.userId; // Attach userId for use in routes
        next();
    });
};

// Apply authentication middleware to routes under /api
app.use("/api", authenticateToken);

// Routes
app.use("/api/users", userRoutes); // User-related routes
app.use("/api/donors", donorRoutes); // Donor-related routes
app.use("/api/hospitals", hospitalRoutes); // Hospital-related routes

// Default route to serve static HTML pages (e.g., index.html)
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MongoDB connected successfully!");
    })
    .catch((err) => {
        console.error("Error connecting to MongoDB:", err);
    });

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
