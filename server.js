const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
console.log('Serving static files from:', path.join(__dirname, 'public'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from public

app.get('/', (req, res) => {
    res.redirect('/signin.html');
});

// --- API Endpoints ---

// Register
app.post('/api/register', (req, res) => {
    const { email, password } = req.body;
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    db.run(sql, [email, password], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'User registered successfully', id: this.lastID });
    });
});

// Login
// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';
    db.get(sql, [email, password], (err, row) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (row) {
            // Mock role assignment
            const user = { ...row };
            if (user.email === 'admin@stockeasy.com') {
                user.role = 'admin';
            } else {
                user.role = 'user';
            }
            res.json({ message: 'Login successful', user: user });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Get Stock
app.get('/api/stock', (req, res) => {
    const sql = 'SELECT * FROM stock';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Add Stock
app.post('/api/stock', (req, res) => {
    const {
        batch_no, name, manufacturer, manf_date, exp_date,
        buying_cost, mrp, discount, price, prescription,
        seller_id, seller_name, category, client_id,
        entry_date, dispatch_date, quantity, type, description
    } = req.body;

    const sql = `INSERT INTO stock (
        batch_no, name, manufacturer, manf_date, exp_date,
        buying_cost, mrp, discount, price, prescription,
        seller_id, seller_name, category, client_id,
        entry_date, dispatch_date, quantity, type, description
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    db.run(sql, [
        batch_no, name, manufacturer, manf_date, exp_date,
        buying_cost, mrp, discount, price, prescription,
        seller_id, seller_name, category, client_id,
        entry_date, dispatch_date, quantity, type, description
    ], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Stock added', id: this.lastID });
    });
});

// Get Customers
app.get('/api/customers', (req, res) => {
    const sql = 'SELECT * FROM customers';
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

// Add Customer (Optional, for completeness)
app.post('/api/customers', (req, res) => {
    const { name, email, phone, address } = req.body;
    const sql = 'INSERT INTO customers (name, email, phone, address) VALUES (?, ?, ?, ?)';
    db.run(sql, [name, email, phone, address], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Customer added', id: this.lastID });
    });
});

// Record Sale
app.post('/api/sales', (req, res) => {
    const { stock_id, customer_id, quantity, total_price, date } = req.body;
    const sql = 'INSERT INTO sales (stock_id, customer_id, quantity, total_price, date) VALUES (?, ?, ?, ?, ?)';
    db.run(sql, [stock_id, customer_id, quantity, total_price, date], function (err) {
        if (err) {
            return res.status(400).json({ error: err.message });
        }
        res.json({ message: 'Sale recorded', id: this.lastID });
    });
});

// Get Sales
app.get('/api/sales', (req, res) => {
    const sql = `
        SELECT sales.id, stock.name as stock_name, customers.name as customer_name, sales.quantity, sales.total_price, sales.date 
        FROM sales 
        LEFT JOIN stock ON sales.stock_id = stock.id 
        LEFT JOIN customers ON sales.customer_id = customers.id
    `;
    db.all(sql, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
