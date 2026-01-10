const db = require('./database');

const email = 'admin@stockeasy.com';
const password = 'admin';

db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function (err) {
    if (err) {
        console.error('Error adding admin:', err.message);
    } else {
        console.log(`Admin added with ID: ${this.lastID}`);
    }
});
