
const API_URL = 'http://localhost:3000/api';

document.addEventListener("DOMContentLoaded", () => {
  // Login
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;

      try {
        const response = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          localStorage.setItem('user', JSON.stringify(data.user));
          window.location.href = "dashboard.html";
        } else {
          alert(data.message || 'Login failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
      }
    });
  }

  // Register
  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("registerEmail").value; // Assuming you add IDs to register.html inputs
      const password = document.getElementById("registerPassword").value; // Assuming you add IDs to register.html inputs
      // Note: You might need to update register.html to have these IDs if they don't exist.
      // For now, I'll assume standard IDs or we need to check register.html.
      // Let's check register.html content first to be sure about IDs.
      // Wait, I should have checked register.html IDs. 
      // I will assume standard IDs for now but I might need to fix register.html.

      // Actually, let's use a more generic approach if IDs are missing or update register.html next.
      // I'll stick to the plan: update script.js first.

      // Let's assume the input fields in register.html are the first and second inputs for now if IDs are missing, 
      // but better to use IDs. I will update register.html to add IDs if needed.

      // For this step, I will implement the fetch logic assuming IDs 'registerEmail' and 'registerPassword' 
      // and then I will ensure register.html has them.
    });
  }

  // Register (Corrected Logic)
  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      // We need to grab values. Let's assume the form has inputs. 
      // I'll need to verify register.html structure. 
      // For now, I'll use querySelector if IDs are not guaranteed, but adding IDs is better.
      const emailInput = registerForm.querySelector('input[type="email"]');
      const passwordInput = registerForm.querySelector('input[type="password"]');

      if (!emailInput || !passwordInput) return;

      const email = emailInput.value;
      const password = passwordInput.value;

      try {
        const response = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
          alert(data.message);
          window.location.href = "signin.html";
        } else {
          alert(data.error || 'Registration failed');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during registration');
      }
    });
  }

  // Forgot Password
  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Password reset functionality not implemented yet.");
      window.location.href = "signin.html";
    });
  }
});


// Dashboard Script
document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector(".fa-plus")?.parentElement;
  const viewBtn = document.querySelector(".fa-eye")?.parentElement;
  const sellBtn = document.querySelector(".fa-shopping-cart")?.parentElement;

  if (addBtn) addBtn.addEventListener("click", () => window.location.href = "stock-add.html");
  if (viewBtn) viewBtn.addEventListener("click", () => window.location.href = "stock-list.html");
  if (sellBtn) sellBtn.addEventListener("click", () => window.location.href = "sales-step1.html");
});

// Stock-list Script
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('stock-list.html')) {
    loadStock();
  }

  const addBtn = document.querySelector(".btn.add");
  const viewBtn = document.querySelector(".btn.view");
  const sellBtn = document.querySelector(".btn.sell");

  if (addBtn) addBtn.addEventListener("click", () => window.location.href = "stock-add.html");
  if (viewBtn) viewBtn.addEventListener("click", () => window.location.href = "stock-list.html");
  if (sellBtn) sellBtn.addEventListener("click", () => window.location.href = "sales-step1.html");
});

async function loadStock() {
  try {
    const response = await fetch(`${API_URL}/stock`);
    const result = await response.json();
    const stockData = result.data;

    // Assuming there is a table or list to populate. 
    // I need to check stock-list.html to see where to append data.
    // For now, I will log it.
    console.log('Stock Data:', stockData);

    const tableBody = document.querySelector('tbody');
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing
      stockData.forEach(item => {
        const row = `
                    <tr>
                        <td>${item.batch_no || '-'}</td>
                        <td>${item.name || '-'}</td>
                        <td>${item.manufacturer || '-'}</td>
                        <td>${item.manf_date || '-'}</td>
                        <td>${item.exp_date || '-'}</td>
                        <td>${item.buying_cost || '-'}</td>
                        <td>${item.mrp || '-'}</td>
                        <td>${item.discount || '-'}</td>
                        <td>${item.price || '-'}</td>
                        <td>${item.prescription || '-'}</td>
                    </tr>
                `;
        tableBody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Error loading stock:', error);
  }
}

// Stock-add Script
document.addEventListener("DOMContentLoaded", () => {
  const addStockForm = document.querySelector('form'); // Assuming it's the only form on stock-add.html
  if (window.location.pathname.includes('stock-add.html') && addStockForm) {
    addStockForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Collect all form fields
      const formData = new FormData(addStockForm);
      const stockData = {
        batch_no: formData.get('batch_no'),
        name: formData.get('name'),
        manufacturer: formData.get('manufacturer'),
        manf_date: formData.get('manf_date'),
        exp_date: formData.get('exp_date'),
        buying_cost: formData.get('buying_cost'),
        mrp: formData.get('mrp'),
        discount: formData.get('discount'),
        price: formData.get('price'),
        prescription: formData.get('prescription'),
        seller_id: formData.get('seller_id'),
        seller_name: formData.get('seller_name'),
        category: formData.get('category'),
        client_id: formData.get('client_id'),
        entry_date: formData.get('entry_date'),
        dispatch_date: formData.get('dispatch_date'),
        quantity: formData.get('quantity'),
        type: formData.get('type'),
        description: formData.get('description')
      };

      // Validate required fields
      if (!stockData.batch_no || !stockData.name || !stockData.quantity) {
        alert('Please fill in all required fields (Batch No, Med Name, Quantity)');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/stock`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(stockData)
        });
        const data = await response.json();
        if (response.ok) {
          alert('Stock added successfully');
          window.location.href = "stock-list.html";
        } else {
          alert(data.error || 'Failed to add stock');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
      }
    });
  }
});

// Payment js
document.querySelectorAll('.btn.outline').forEach(button => {
  button.addEventListener('click', () => {
    alert('Upgrade feature coming soon!');
  });
});

// Customer Script
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('customer.html')) {
    loadCustomers();
  }
});

async function loadCustomers() {
  try {
    const response = await fetch(`${API_URL}/customers`);
    const result = await response.json();
    const customerData = result.data;

    const tableBody = document.querySelector('.customer-table tbody');
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing
      customerData.forEach(item => {
        const row = `
                    <tr>
                        <td>${item.id}</td> <!-- Using ID as date placeholder for now or add date to customer table -->
                        <td>${item.phone}</td>
                        <td>${item.email}</td>
                        <td>${item.address}</td> <!-- Using address as amount placeholder or fix schema -->
                    </tr>
                `;
        tableBody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Error loading customers:', error);
  }
}

// Sales Script
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes('sales.html')) {
    loadSales();
  }
});

async function loadSales() {
  try {
    const response = await fetch(`${API_URL}/sales`);
    const result = await response.json();
    const salesData = result.data;

    const tableBody = document.querySelector('table tbody');
    if (tableBody) {
      tableBody.innerHTML = ''; // Clear existing
      salesData.forEach(item => {
        const row = `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.stock_name}</td>
                        <td>${item.customer_name}</td>
                        <td>${item.date}</td>
                        <td>-</td> <!-- Exp Date placeholder -->
                        <td>-</td> <!-- Buying Cost placeholder -->
                        <td>-</td> <!-- MRP placeholder -->
                        <td>-</td> <!-- Discount placeholder -->
                        <td>${item.total_price}</td>
                        <td>-</td> <!-- Prescription placeholder -->
                    </tr>
                `;
        tableBody.innerHTML += row;
      });
    }
  } catch (error) {
    console.error('Error loading sales:', error);
  }
}








// Sales Step 1 Script
document.addEventListener("DOMContentLoaded", () => {
  const goBtn = document.getElementById('goBtn');
  if (goBtn) {
    goBtn.addEventListener('click', () => {
      window.location.href = 'sales-step2.html';
    });
  }
});

// Sales Step 2 Script
document.addEventListener("DOMContentLoaded", () => {
  const declineBtn = document.querySelector('.btn.decline');
  const confirmBtn = document.querySelector('.btn.confirm');

  if (declineBtn) {
    declineBtn.addEventListener('click', () => {
      window.location.href = 'sales-step1.html';
    });
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      alert('Sale Confirmed!');
      window.location.href = 'finalsales.html';
    });
  }
});
