// Admin Dashboard JavaScript
const user = JSON.parse(localStorage.getItem('user'));
if (!user || user.role !== 'admin') {
    alert('Access Denied: Admins only.');
    window.location.href = 'signin.html';
}
const API_URL = 'http://localhost:3000/api';

// Initialize dashboard on page load
document.addEventListener('DOMContentLoaded', () => {
    loadDashboardData();
    initializeCharts();
    loadRecentActivity();
});

// Load all dashboard data
async function loadDashboardData() {
    try {
        await Promise.all([
            loadStatistics(),
            loadLowStockItems(),
            loadRecentSales()
        ]);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

// Load statistics
async function loadStatistics() {
    try {
        // Fetch stock data
        const stockResponse = await fetch(`${API_URL}/stock`);
        const stockData = await stockResponse.json();
        const stocks = stockData.data || [];

        // Fetch sales data
        const salesResponse = await fetch(`${API_URL}/sales`);
        const salesData = await salesResponse.json();
        const sales = salesData.data || [];

        // Fetch customers data
        const customersResponse = await fetch(`${API_URL}/customers`);
        const customersData = await customersResponse.json();
        const customers = customersData.data || [];

        // Calculate statistics
        const totalStock = stocks.length;
        const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total_price || 0), 0);
        const totalCustomers = customers.length;
        const lowStock = stocks.filter(item => (item.quantity || 0) < 10).length;

        // Update UI
        document.getElementById('totalStock').textContent = totalStock;
        document.getElementById('totalRevenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('totalCustomers').textContent = totalCustomers;
        document.getElementById('lowStock').textContent = lowStock;

    } catch (error) {
        console.error('Error loading statistics:', error);
    }
}

// Load low stock items
async function loadLowStockItems() {
    try {
        const response = await fetch(`${API_URL}/stock`);
        const result = await response.json();
        const stocks = result.data || [];

        // Filter low stock items (quantity < 10)
        const lowStockItems = stocks.filter(item => (item.quantity || 0) < 10).slice(0, 5);

        const tableBody = document.getElementById('lowStockTable');
        tableBody.innerHTML = '';

        if (lowStockItems.length === 0) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: #7f8c8d;">
            <i class="fa fa-check-circle" style="font-size: 2rem; color: #27ae60; margin-bottom: 10px;"></i>
            <p>All stock levels are healthy!</p>
          </td>
        </tr>
      `;
            return;
        }

        lowStockItems.forEach(item => {
            const quantity = item.quantity || 0;
            let statusClass = 'status-normal';
            let statusText = 'Normal';

            if (quantity === 0) {
                statusClass = 'status-critical';
                statusText = 'Out of Stock';
            } else if (quantity < 5) {
                statusClass = 'status-critical';
                statusText = 'Critical';
            } else if (quantity < 10) {
                statusClass = 'status-low';
                statusText = 'Low';
            }

            const row = `
        <tr>
          <td><strong>${item.name || 'N/A'}</strong></td>
          <td>${item.batch_no || 'N/A'}</td>
          <td><strong>${quantity}</strong></td>
          <td>${item.exp_date || 'N/A'}</td>
          <td><span class="status-badge ${statusClass}">${statusText}</span></td>
          <td>
            <button class="table-action-btn btn-reorder" onclick="reorderStock(${item.id})">
              <i class="fa fa-shopping-cart"></i> Reorder
            </button>
          </td>
        </tr>
      `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error loading low stock items:', error);
    }
}

// Load recent sales
async function loadRecentSales() {
    try {
        const response = await fetch(`${API_URL}/sales`);
        const result = await response.json();
        const sales = result.data || [];

        const recentSales = sales.slice(0, 5);

        const tableBody = document.getElementById('recentSalesTable');
        tableBody.innerHTML = '';

        if (recentSales.length === 0) {
            tableBody.innerHTML = `
        <tr>
          <td colspan="6" style="text-align: center; padding: 30px; color: #7f8c8d;">
            <i class="fa fa-shopping-bag" style="font-size: 2rem; color: #667eea; margin-bottom: 10px;"></i>
            <p>No sales recorded yet</p>
          </td>
        </tr>
      `;
            return;
        }

        recentSales.forEach(sale => {
            const row = `
        <tr>
          <td>#${sale.id}</td>
          <td>${sale.stock_name || 'N/A'}</td>
          <td>${sale.customer_name || 'N/A'}</td>
          <td>${sale.quantity || 0}</td>
          <td><strong>$${(sale.total_price || 0).toFixed(2)}</strong></td>
          <td>${sale.date || 'N/A'}</td>
        </tr>
      `;
            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error('Error loading recent sales:', error);
    }
}

// Load recent activity
async function loadRecentActivity() {
    const activityList = document.getElementById('activityList');

    try {
        const salesResponse = await fetch(`${API_URL}/sales`);
        const salesData = await salesResponse.json();
        const sales = salesData.data || [];

        const stockResponse = await fetch(`${API_URL}/stock`);
        const stockData = await stockResponse.json();
        const stocks = stockData.data || [];

        const activities = [];

        // Add recent sales
        sales.slice(0, 3).forEach(sale => {
            activities.push({
                type: 'sale',
                icon: 'fa-shopping-cart',
                iconClass: 'sale',
                text: `Sale of ${sale.stock_name || 'product'} to ${sale.customer_name || 'customer'}`,
                time: sale.date || 'Recently'
            });
        });

        // Add recent stock additions (last 3)
        stocks.slice(-3).forEach(stock => {
            activities.push({
                type: 'stock',
                icon: 'fa-box',
                iconClass: 'stock',
                text: `New stock added: ${stock.name || 'product'}`,
                time: stock.entry_date || 'Recently'
            });
        });

        // Sort by most recent and take top 5
        const recentActivities = activities.slice(0, 5);

        activityList.innerHTML = '';

        if (recentActivities.length === 0) {
            activityList.innerHTML = `
        <div style="text-align: center; padding: 30px; color: #7f8c8d;">
          <i class="fa fa-clock" style="font-size: 2rem; margin-bottom: 10px;"></i>
          <p>No recent activity</p>
        </div>
      `;
            return;
        }

        recentActivities.forEach(activity => {
            const activityItem = `
        <div class="activity-item">
          <div class="activity-icon ${activity.iconClass}">
            <i class="fa ${activity.icon}"></i>
          </div>
          <div class="activity-content">
            <p>${activity.text}</p>
            <span>${activity.time}</span>
          </div>
        </div>
      `;
            activityList.innerHTML += activityItem;
        });

    } catch (error) {
        console.error('Error loading recent activity:', error);
    }
}

// Initialize Charts
let salesChart, stockChart;

function initializeCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart').getContext('2d');
    salesChart = new Chart(salesCtx, {
        type: 'line',
        data: {
            labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            datasets: [{
                label: 'Sales',
                data: [1200, 1900, 1500, 2200, 1800, 2400, 2100],
                borderColor: '#667eea',
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#667eea',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14
                    },
                    bodyFont: {
                        size: 13
                    },
                    cornerRadius: 8
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });

    // Stock Distribution Chart
    const stockCtx = document.getElementById('stockChart').getContext('2d');
    stockChart = new Chart(stockCtx, {
        type: 'doughnut',
        data: {
            labels: ['Tablets', 'Capsules', 'Syrups', 'Injections', 'Others'],
            datasets: [{
                data: [35, 25, 20, 15, 5],
                backgroundColor: [
                    '#667eea',
                    '#f093fb',
                    '#ffecd2',
                    '#ff9a9e',
                    '#c3cfe2'
                ],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    cornerRadius: 8
                }
            }
        }
    });
}

// Update sales chart based on period
function updateSalesChart() {
    const period = document.getElementById('salesPeriod').value;
    let labels, data;

    switch (period) {
        case 'week':
            labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            data = [1200, 1900, 1500, 2200, 1800, 2400, 2100];
            break;
        case 'month':
            labels = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
            data = Array.from({ length: 30 }, () => Math.floor(Math.random() * 3000) + 1000);
            break;
        case 'year':
            labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            data = [45000, 52000, 48000, 61000, 55000, 67000, 72000, 68000, 75000, 71000, 78000, 82000];
            break;
    }

    salesChart.data.labels = labels;
    salesChart.data.datasets[0].data = data;
    salesChart.update();
}

// Refresh dashboard
function refreshDashboard() {
    const btn = document.querySelector('.btn-refresh');
    btn.classList.add('loading');
    btn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Refreshing...';

    loadDashboardData().then(() => {
        setTimeout(() => {
            btn.classList.remove('loading');
            btn.innerHTML = '<i class="fa fa-refresh"></i> Refresh';
            showNotification('Dashboard refreshed successfully!', 'success');
        }, 1000);
    });
}

// Export data
function exportData() {
    showNotification('Exporting data...', 'info');
    setTimeout(() => {
        showNotification('Data exported successfully!', 'success');
    }, 1500);
}

// Reorder stock
function reorderStock(stockId) {
    showNotification(`Reorder request for stock ID ${stockId} has been sent!`, 'success');
}

// Open customer modal
function openCustomerModal() {
    showNotification('Customer form will open here', 'info');
}

// Generate invoice
function generateInvoice() {
    showNotification('Invoice generation feature coming soon!', 'info');
}

// Manage users
function manageUsers() {
    showNotification('User management panel coming soon!', 'info');
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 15px 25px;
    background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#667eea'};
    color: white;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    z-index: 10000;
    animation: slideIn 0.3s ease;
    font-weight: 600;
  `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
