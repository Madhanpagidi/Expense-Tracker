const API_BASE_URL = 'http://localhost:8080/api';

document.addEventListener('DOMContentLoaded', () => {
    // 0. Set Current Date in Header
    const dateDisplay = document.getElementById('current-date');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.textContent = new Date().toLocaleDateString('en-US', options);
    }

    // 1. Auth Check
    const pathname = window.location.pathname;
    const isAuthPage = pathname.endsWith('login.html') || pathname.endsWith('register.html');

    if (!isAuthPage) {
        checkAuth();
    } else {
        return; // Stop execution on auth pages
    }

    // 2. Identify Page
    const isDashboard = pathname.endsWith('index.html') || pathname === '/' || pathname.endsWith('/');
    const isTransactions = pathname.endsWith('transactions.html');
    const isProfile = pathname.endsWith('profile.html');

    // 3. Page Specific Logic
    // 3. Page Specific Logic
    if (isDashboard) {
        loadDashboard(); // Fixed name
    } else if (isTransactions) {
        loadTransactionsPage();
    } else if (isProfile) {
        loadProfilePage();
    }
});

async function loadTransactionsPage() {
    await loadCategories();
    // Load existing transactions for the table
    loadTransactionsTable();

    // Attach Event Listeners
    const incomeForm = document.getElementById('income-form');
    if (incomeForm) incomeForm.addEventListener('submit', handleAddIncome);

    const expenseForm = document.getElementById('expense-form');
    if (expenseForm) expenseForm.addEventListener('submit', handleAddExpense);
}

function loadProfilePage() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
        // Set Inputs
        document.getElementById('profile-username').value = user.username || 'N/A';
        document.getElementById('profile-email').value = user.email || 'N/A';
        document.getElementById('profile-date').value = new Date().toLocaleDateString();

        // Set Display Elements
        const username = user.username || 'User';
        const nameDisplay = document.getElementById('profile-name-display');
        if (nameDisplay) nameDisplay.textContent = username;

        // Initials
        const initialsDisplay = document.getElementById('profile-initials');
        if (initialsDisplay) {
            initialsDisplay.textContent = username.charAt(0).toUpperCase();
        }
    }

    // Attach Button Listeners
    const editBtn = document.getElementById('edit-profile-btn');
    const changePassBtn = document.getElementById('change-password-btn');

    if (editBtn) {
        // Remove old listeners to avoid duplicates if single page app style (though we reload nav usually)
        editBtn.onclick = handleEditProfile;
    }
    if (changePassBtn) {
        changePassBtn.onclick = handleChangePassword;
    }
}

function handleEditProfile() {
    const editBtn = document.getElementById('edit-profile-btn');
    const usernameInput = document.getElementById('profile-username');
    const emailInput = document.getElementById('profile-email');
    const isEditing = !usernameInput.hasAttribute('readonly');

    if (!isEditing) {
        // Enable Editing
        usernameInput.removeAttribute('readonly');
        emailInput.removeAttribute('readonly');
        usernameInput.focus();
        usernameInput.style.backgroundColor = '#fff';
        emailInput.style.backgroundColor = '#fff';
        editBtn.textContent = 'Save Changes';
        editBtn.style.backgroundColor = 'var(--success-color)';
    } else {
        // Save Changes
        const newUsername = usernameInput.value;
        const newEmail = emailInput.value;

        if (!newUsername || !newEmail) {
            alert('Username and Email cannot be empty.');
            return;
        }

        // Mock Save - In real app, send PUT request to API
        const user = JSON.parse(localStorage.getItem('user'));
        user.username = newUsername;
        user.email = newEmail;
        localStorage.setItem('user', JSON.stringify(user));

        // Update UI
        document.getElementById('profile-name-display').textContent = newUsername;
        const initialsDisplay = document.getElementById('profile-initials');
        if (initialsDisplay) initialsDisplay.textContent = newUsername.charAt(0).toUpperCase();

        // Update User Info in Navbar
        const navUserDisplay = document.getElementById('user-display');
        if (navUserDisplay) navUserDisplay.textContent = `Welcome, ${newUsername}`;

        // Revert UI
        usernameInput.setAttribute('readonly', true);
        emailInput.setAttribute('readonly', true);
        usernameInput.style.backgroundColor = '#f8fafc';
        emailInput.style.backgroundColor = '#f8fafc';
        editBtn.textContent = 'Edit Profile';
        editBtn.style.backgroundColor = ''; // Reset to default

        alert('Profile updated successfully!');
    }
}

function handleChangePassword() {
    const newPass = prompt('Enter your new password:');
    if (newPass) {
        if (newPass.length < 6) {
            alert('Password must be at least 6 characters.');
            return;
        }
        // Mock API Call
        alert('Password changed successfully! (Mock)');
    }
}

/* --- Auth Functions --- */
function checkAuth() {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        window.location.href = 'login.html';
        return;
    }
    const user = JSON.parse(userStr);
    const displayElement = document.getElementById('user-display');
    if (displayElement) {
        displayElement.textContent = `Welcome, ${user.username || 'User'}`;
    }
}

function getUserId() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.id : null;
}

function logout() {
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/users/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            const user = await res.json();
            localStorage.setItem('user', JSON.stringify(user));
            window.location.href = 'index.html';
        } else {
            alert('Invalid credentials');
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('Login failed');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const username = document.getElementById('reg-username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_BASE_URL}/users/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert('Registration successful! Please login.');
            window.location.href = 'login.html';
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        alert('Registration failed');
    }
}

async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        const categories = await response.json();
        const select = document.getElementById('expense-category');
        select.innerHTML = '<option value="" disabled selected>Select Category</option>'; // Reset

        categories.forEach(cat => {
            if (cat.type === 'EXPENSE') {
                const option = document.createElement('option');
                option.value = cat.id;
                option.textContent = cat.name;
                select.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

async function loadDashboard() {
    try {
        const [incomes, expenses] = await Promise.all([
            fetch(`${API_BASE_URL}/incomes/user/${getUserId()}`).then(res => res.json()),
            fetch(`${API_BASE_URL}/expenses/user/${getUserId()}`).then(res => res.json())
        ]);

        let totalIncome = 0;
        let totalExpense = 0;
        const transactionList = document.getElementById('transaction-list');
        transactionList.innerHTML = ''; // Clear list

        // Process Incomes
        incomes.forEach(inc => {
            totalIncome += inc.amount;
            addTransactionToUI(inc, 'income');
        });

        // Process Expenses
        expenses.forEach(exp => {
            totalExpense += exp.amount;
            addTransactionToUI(exp, 'expense');
        });

        // Update Cards
        document.getElementById('total-income').textContent = formatCurrency(totalIncome);
        document.getElementById('total-expense').textContent = formatCurrency(totalExpense);
        document.getElementById('total-balance').textContent = formatCurrency(totalIncome - totalExpense);

        // Render Charts
        renderCharts(incomes, expenses);

    } catch (error) {
        console.error('Error loading dashboard:', error);
    }
}

let mainChartInstance = null;
let categoryChartInstance = null;

function renderCharts(incomes, expenses) {
    // 1. Prepare Data for Main Chart (Income vs Expense)
    // Group by month or just show totals for now? Let's verify simplest valid chart first: Totals
    // Better: Timeline. For simplicity in MVP, let's just show Total Income vs Total Expense bar chart

    // Grouping by date would be better but let's stick to a robust summary first
    const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);
    const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

    const ctxMain = document.getElementById('mainChart').getContext('2d');

    if (mainChartInstance) mainChartInstance.destroy();

    mainChartInstance = new Chart(ctxMain, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses'],
            datasets: [{
                label: 'Amount',
                data: [totalIncome, totalExpense],
                backgroundColor: ['#10b981', '#ef4444'],
                borderRadius: 5,
                barThickness: 50
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(context.parsed.y);
                            }
                            return label;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: '#f1f5f9' },
                    ticks: {
                        callback: function (value, index, values) {
                            return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumSignificantDigits: 3 }).format(value);
                        }
                    }
                },
                x: { grid: { display: false } }
            }
        }
    });

    // 2. Prepare Data for Category Chart
    // We need to group expenses by category name. 
    // Since expense object has `category` object, we can use category.name
    const categoryTotals = {};
    expenses.forEach(exp => {
        const catName = exp.category ? exp.category.name : 'Uncategorized';
        categoryTotals[catName] = (categoryTotals[catName] || 0) + exp.amount;
    });

    const catLabels = Object.keys(categoryTotals);
    const catData = Object.values(categoryTotals);
    const catColors = ['#64748b', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

    const ctxCat = document.getElementById('categoryChart').getContext('2d');
    if (categoryChartInstance) categoryChartInstance.destroy();

    categoryChartInstance = new Chart(ctxCat, {
        type: 'doughnut',
        data: {
            labels: catLabels.length ? catLabels : ['No Data'],
            datasets: [{
                data: catData.length ? catData : [1],
                backgroundColor: catLabels.length ? catColors : ['#e2e8f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } }
            },
            cutout: '70%'
        }
    });
}



async function loadTransactionsTable() {
    try {
        const [incomes, expenses] = await Promise.all([
            fetch(`${API_BASE_URL}/incomes/user/${getUserId()}`).then(res => res.json()),
            fetch(`${API_BASE_URL}/expenses/user/${getUserId()}`).then(res => res.json())
        ]);

        const tbody = document.getElementById('transactions-body');
        if (!tbody) return; // Guard clause if table doesn't exist (e.g. on dashboard)

        tbody.innerHTML = '';

        // Merge and sort by date descending
        const allTransactions = [
            ...incomes.map(i => ({ ...i, type: 'income' })),
            ...expenses.map(e => ({ ...e, type: 'expense' }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date));

        allTransactions.forEach(item => {
            const tr = document.createElement('tr');

            const isIncome = item.type === 'income';
            const category = isIncome ? 'Income' : (item.category ? item.category.name : 'Uncategorized');
            const description = isIncome ? item.source : item.description;
            const sign = isIncome ? '+' : '-';
            const colorStyle = isIncome ? 'color: var(--success-color); font-weight: 700;' : 'color: var(--danger-color); font-weight: 700;';

            tr.innerHTML = `
                <td>${item.date}</td>
                <td style="font-weight: 600;">${description}</td>
                <td><span class="badge ${isIncome ? 'badge-income' : 'badge-expense'}">${category}</span></td>
                <td style="${colorStyle}">${sign} ${formatCurrency(item.amount)}</td>
                <td>
                    <button class="delete-btn" onclick="deleteTransaction(${item.id}, '${item.type}')" title="Delete">&times;</button>
                </td>
            `;
            tbody.appendChild(tr);
        });

    } catch (error) {
        console.error('Error loading transactions table:', error);
    }
}

function addTransactionToUI(item, type) {
    const list = document.getElementById('transaction-list');
    const li = document.createElement('li');
    li.className = `${type}-item`;

    const name = type === 'income' ? item.source : item.description;
    const sign = type === 'income' ? '+' : '-';

    li.innerHTML = `
        <span>${name} <small>(${item.date})</small></span>
        <div style="display: flex; align-items: center;">
            <span>${sign} ${formatCurrency(item.amount)}</span>
            <button class="delete-btn" onclick="deleteTransaction(${item.id}, '${type}')" title="Delete Transaction">&times;</button>
        </div>
    `;
    list.prepend(li); // Newest first (visual approximation)
}

async function deleteTransaction(id, type) {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
        const endpoint = type === 'income' ? 'incomes' : 'expenses';
        const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, {
            method: 'DELETE'
        });

        if (res.ok) {
            loadDashboard(); // Reload to update UI and totals
        } else {
            console.error('Failed to delete transaction');
        }
    } catch (error) {
        console.error('Error deleting transaction:', error);
    }
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount);
}

async function handleAddIncome(e) {
    e.preventDefault();
    const source = document.getElementById('income-source').value;
    const amount = document.getElementById('income-amount').value;
    const date = document.getElementById('income-date').value;

    const data = { source, amount, date, user: { id: getUserId() } };

    try {
        const res = await fetch(`${API_BASE_URL}/incomes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            e.target.reset();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error adding income:', error);
    }
}

async function handleAddExpense(e) {
    e.preventDefault();
    const description = document.getElementById('expense-desc').value;
    const amount = document.getElementById('expense-amount').value;
    const date = document.getElementById('expense-date').value;
    const categoryId = document.getElementById('expense-category').value;

    const data = {
        description,
        amount,
        date,
        user: { id: getUserId() },
        category: { id: categoryId }
    };

    try {
        const res = await fetch(`${API_BASE_URL}/expenses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (res.ok) {
            e.target.reset();
            loadDashboard();
        }
    } catch (error) {
        console.error('Error adding expense:', error);
    }
}
