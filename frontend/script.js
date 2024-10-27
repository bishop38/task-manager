const baseURL = process.env.BASE_API;

// Регистрация пользователя

document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    const res = await fetch(`${baseURL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
    });
    if (res.ok) {
        alert('Registration successful');
    } else {
        alert('Registration failed');
    }
});

// Вход пользователя
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('tasks-section').style.display = 'block';
        await fetchTasks();
    } else {
        alert('Login failed');
    }
});

// Получить задачи пользователя
async function fetchTasks() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseURL}/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const tasks = await res.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';
    tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <span>${task.title} - ${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : ''}</span>
            <button onclick="deleteTask('${task._id}')">Delete</button>
        `;
        taskList.appendChild(taskItem);
    });
}

// Добавить задачу
document.getElementById('task-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-desc').value;
    const dueDate = document.getElementById('task-due-date').value;
    const token = localStorage.getItem('token');

    const res = await fetch(`${baseURL}/tasks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description, dueDate }),
    });

    if (res.ok) {
        await fetchTasks();
        document.getElementById('task-form').reset();
    } else {
        alert('Failed to add task');
    }
});

// Удалить задачу
async function deleteTask(id) {
    const token = localStorage.getItem('token');
    const res = await fetch(`${baseURL}/tasks/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
        await fetchTasks();
    } else {
        alert('Failed to delete task');
    }
}