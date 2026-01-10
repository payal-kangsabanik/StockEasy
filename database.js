const sqlite3 = require('sqlite3').verbose();
const dbName = 'stockeasy.db';

const db = new sqlite3.Database(dbName, (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
        createTables();
    }
});

function createTables() {
    // Users Table
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE,
        password TEXT
    )`);

    // Stock Table
    db.run(`CREATE TABLE IF NOT EXISTS stock (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        batch_no TEXT,
        name TEXT,
        manufacturer TEXT,
        manf_date TEXT,
        exp_date TEXT,
        buying_cost REAL,
        mrp REAL,
        discount REAL,
        price REAL,
        prescription TEXT,
        seller_id TEXT,
        seller_name TEXT,
        category TEXT,
        client_id TEXT,
        entry_date TEXT,
        dispatch_date TEXT,
        quantity INTEGER,
        type TEXT,
        description TEXT
    )`);

    // Customers Table
    db.run(`CREATE TABLE IF NOT EXISTS customers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        phone TEXT,
        address TEXT
    )`);

    // Sales Table
    db.run(`CREATE TABLE IF NOT EXISTS sales (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stock_id INTEGER,
        customer_id INTEGER,
        quantity INTEGER,
        total_price REAL,
        date TEXT,
        FOREIGN KEY(stock_id) REFERENCES stock(id),
        FOREIGN KEY(customer_id) REFERENCES customers(id)
    )`);
}

module.exports = db;
