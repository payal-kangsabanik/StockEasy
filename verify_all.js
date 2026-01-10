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
    console.log('Starting Comprehensive API Tests...');

    // 1. Register
    try {
        const email = `user_${Date.now()}@example.com`;
        console.log(`\n1. Registering ${email}...`);
        const registerRes = await makeRequest('/register', 'POST', {
            email: email,
            password: 'password123'
        });
        console.log('Result:', registerRes);
    } catch (e) { console.error(e); }

    // 2. Login
    try {
        console.log('\n2. Logging in...');
        const loginRes = await makeRequest('/login', 'POST', {
            email: 'test@example.com', // Assuming this user exists from previous tests
            password: 'password123'
        });
        console.log('Result:', loginRes);
    } catch (e) { console.error(e); }

    // 3. Add Stock
    let stockId;
    try {
        console.log('\n3. Adding Stock...');
        const stockRes = await makeRequest('/stock', 'POST', {
            name: 'Test Med',
            quantity: 50,
            price: 20,
            description: 'Test Desc'
        });
        console.log('Result:', stockRes);
        stockId = stockRes.id;
    } catch (e) { console.error(e); }

    // 4. Get Stock
    try {
        console.log('\n4. Getting Stock...');
        const getStockRes = await makeRequest('/stock', 'GET');
        console.log('Result:', getStockRes.data.length > 0 ? 'Success (Data found)' : 'Success (No data)');
    } catch (e) { console.error(e); }

    // 5. Add Customer
    let customerId;
    try {
        console.log('\n5. Adding Customer...');
        const customerRes = await makeRequest('/customers', 'POST', {
            name: 'Test Customer',
            email: 'customer@test.com',
            phone: '1234567890',
            address: '123 Test St'
        });
        console.log('Result:', customerRes);
        customerId = customerRes.id;
    } catch (e) { console.error(e); }

    // 6. Get Customers
    try {
        console.log('\n6. Getting Customers...');
        const getCustRes = await makeRequest('/customers', 'GET');
        console.log('Result:', getCustRes.data.length > 0 ? 'Success (Data found)' : 'Success (No data)');
    } catch (e) { console.error(e); }

    // 7. Record Sale
    try {
        if (stockId && customerId) {
            console.log('\n7. Recording Sale...');
            const saleRes = await makeRequest('/sales', 'POST', {
                stock_id: stockId,
                customer_id: customerId,
                quantity: 2,
                total_price: 40,
                date: new Date().toISOString().split('T')[0]
            });
            console.log('Result:', saleRes);
        } else {
            console.log('\n7. Skipping Sale (missing stock/customer id)');
        }
    } catch (e) { console.error(e); }

    // 8. Get Sales
    try {
        console.log('\n8. Getting Sales...');
        const getSalesRes = await makeRequest('/sales', 'GET');
        console.log('Result:', getSalesRes.data.length > 0 ? 'Success (Data found)' : 'Success (No data)');
    } catch (e) { console.error(e); }
}

runTests();
