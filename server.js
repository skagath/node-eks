const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = process.env.APP_PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        process.exit(1);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Route to insert user data
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and Email are required' });
    }

    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    db.query(sql, [name, email], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'User added successfully', userId: result.insertId });
    });
});

// Route to fetch all users
app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

