const http = require('http');

function makeRequest(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/api' + path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (e) {
                    resolve(body);
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (data) {
            req.write(JSON.stringify(data));
        }
        req.end();
    });
}

async function runTests() {
    console.log('Starting API Tests...');

    // 1. Register User
    try {
        console.log('\nTesting Register...');
        const registerRes = await makeRequest('/register', 'POST', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Register Response:', registerRes);
    } catch (e) {
        console.error('Register Error:', e);
    }

    // 2. Login User
    try {
        console.log('\nTesting Login...');
        const loginRes = await makeRequest('/login', 'POST', {
            email: 'test@example.com',
            password: 'password123'
        });
        console.log('Login Response:', loginRes);
    } catch (e) {
        console.error('Login Error:', e);
    }

    // 3. Add Stock
    try {
        console.log('\nTesting Add Stock...');
        const stockRes = await makeRequest('/stock', 'POST', {
            name: 'Test Medicine',
            quantity: 100,
            price: 50,
            description: 'Test Description'
        });
        console.log('Add Stock Response:', stockRes);
    } catch (e) {
        console.error('Add Stock Error:', e);
    }

    // 4. Get Stock
    try {
        console.log('\nTesting Get Stock...');
        const getStockRes = await makeRequest('/stock', 'GET');
        console.log('Get Stock Response:', getStockRes);
    } catch (e) {
        console.error('Get Stock Error:', e);
    }
}

// Wait for server to start if running concurrently, but here we assume server is running.
// Actually, I need to make sure the server is running. 
// I will run the server in background and then run this test.
runTests();
