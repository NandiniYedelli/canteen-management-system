// Selectors
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');

// Load tasks from localStorage on page load
document.addEventListener('DOMContentLoaded', loadTasks);

// Handle form submission
taskForm.addEventListener('submit', function (e) {
    e.preventDefault();
    addTask();
});

// Add Task Function
function addTask() {
    const taskName = document.getElementById('task-name').value;
    const taskDesc = document.getElementById('task-desc').value;
    const taskPriority = document.getElementById('task-priority').value;
    const taskDeadline = document.getElementById('task-deadline').value;

    if (taskName.trim() === '') return alert('Please enter a task name.');

    const task = {
        id: Date.now(),
        name: taskName,
        description: taskDesc,
        priority: taskPriority,
        deadline: taskDeadline,
        completed: false
    };

    addTaskToDOM(task);
    saveTask(task);

    // Reset form
    taskForm.reset();
}

// Add task to DOM
function addTaskToDOM(task) {
    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item', task.priority);
    if (task.completed) taskItem.classList.add('completed');
    taskItem.setAttribute('data-id', task.id);

    taskItem.innerHTML = `
        <div>
            <strong>${task.name}</strong> - <small>${task.description}</small>
            ${task.deadline ? `<br><small>Due by: ${task.deadline}</small>` : ''}
        </div>
        <div class="task-actions">
            <input type="checkbox" ${task.completed ? 'checked' : ''}>
            <button>Delete</button>
        </div>
    `;

    // Handle checkbox toggle
    taskItem.querySelector('input[type="checkbox"]').addEventListener('change', () => toggleComplete(task.id));

    // Handle delete button
    taskItem.querySelector('button').addEventListener('click', () => deleteTask(task.id));

    taskList.appendChild(taskItem);
}

// Toggle task completion
function toggleComplete(id) {
    const tasks = getTasks();
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            task.completed = !task.completed;
        }
        return task;
    });

    saveTasks(updatedTasks);
    refreshTaskList();
}

// Delete a task
function deleteTask(id) {
    const tasks = getTasks().filter(task => task.id !== id);
    saveTasks(tasks);
    refreshTaskList();
}

// Load tasks from localStorage
function loadTasks() {
    const tasks = getTasks();
    tasks.forEach(task => addTaskToDOM(task));
}

// Get tasks from localStorage
function getTasks() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

// Save a single task to localStorage
function saveTask(task) {
    const tasks = getTasks();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Save all tasks to localStorage
function saveTasks(tasks) {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Refresh the task list in the DOM
function refreshTaskList() {
    taskList.innerHTML = '';
    loadTasks();
}
