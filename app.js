// app.js

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Create a MySQL database connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'expenses_db',
});

// Connect to the database
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Serve static files (e.g., HTML, CSS)
app.use(express.static('public'));

// Create a table for expenses if it doesn't exist
db.query(`
    CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        description TEXT,
        amount DECIMAL(10, 2),
        date DATE
    )
`, (err) => {
    if (err) {
        console.error('Error creating expenses table:', err);
    }
});

// API endpoint to get expenses
app.get('/expenses', (req, res) => {
    db.query('SELECT * FROM expenses', (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(results);
        }
    });
});

// API endpoint to add an expense
app.post('/expenses', (req, res) => {
    const { description, amount, date } = req.body;
    db.query('INSERT INTO expenses (description, amount, date) VALUES (?, ?, ?)', [description, amount, date], (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Expense added successfully');
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
