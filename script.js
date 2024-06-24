document.addEventListener('DOMContentLoaded', function() {
    loadTasks();
    document.getElementById('add-task').addEventListener('click', addNewTask);
    document.getElementById('filter-tasks').addEventListener('change', filterTasks);
    document.getElementById('search').addEventListener('input', searchTasks);
    document.getElementById('toggle-dark-mode').addEventListener('click', toggleDarkMode);
    checkDueDates();
    setInterval(checkDueDates, 60000);  // Check due dates every minute
});

function addNewTask() {
    let taskText = document.getElementById('new-task').value;
    let tagsText = document.getElementById('new-tags').value;
    let dueDate = document.getElementById('due-date').value;

    if (taskText) {
        addTask(taskText, tagsText, dueDate);
        document.getElementById('new-task').value = '';
        document.getElementById('new-tags').value = '';
        document.getElementById('due-date').value = '';
        saveTasks();
    }
}

function addTask(text, tags, dueDate, completed = false) {
    let li = document.createElement('li');
    li.textContent = text;
    if (completed) {
        li.classList.add('completed');
    }

    let tagsSpan = document.createElement('span');
    tagsSpan.className = 'tags';
    tagsSpan.textContent = tags ? 'Tags: ' + tags : '';
    li.appendChild(tagsSpan);

    let dueDateSpan = document.createElement('span');
    dueDateSpan.className = 'due-date';
    dueDateSpan.textContent = dueDate ? 'Due: ' + dueDate : '';
    li.appendChild(dueDateSpan);

    let editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit';
    editButton.onclick = function() {
        editTask(li);
    };

    let deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete';
    deleteButton.onclick = function() {
        li.remove();
        saveTasks();
    };

    li.appendChild(editButton);
    li.appendChild(deleteButton);
    li.addEventListener('click', function() {
        li.classList.toggle('completed');
        saveTasks();
    });

    document.getElementById('task-list').appendChild(li);
}

function editTask(taskItem) {
    let newTaskText = prompt('Edit your task', taskItem.childNodes[0].textContent);
    if (newTaskText) {
        taskItem.childNodes[0].textContent = newTaskText;
        saveTasks();
    }
}

function filterTasks() {
    let filter = document.getElementById('filter-tasks').value;
    let tasks = document.getElementById('task-list').getElementsByTagName('li');
    for (let task of tasks) {
        switch (filter) {
            case 'all':
                task.classList.remove('hidden');
                break;
            case 'completed':
                if (task.classList.contains('completed')) {
                    task.classList.remove('hidden');
                } else {
                    task.classList.add('hidden');
                }
                break;
            case 'uncompleted':
                if (!task.classList.contains('completed')) {
                    task.classList.remove('hidden');
                } else {
                    task.classList.add('hidden');
                }
                break;
        }
    }
}

function searchTasks() {
    let query = document.getElementById('search').value.toLowerCase();
    let tasks = document.getElementById('task-list').getElementsByTagName('li');
    for (let task of tasks) {
        let taskText = task.childNodes[0].textContent.toLowerCase();
        let tagsText = task.getElementsByClassName('tags')[0].textContent.toLowerCase();
        if (taskText.includes(query) || tagsText.includes(query)) {
            task.classList.remove('hidden');
        } else {
            task.classList.add('hidden');
        }
    }
}

function saveTasks() {
    let tasks = [];
    let taskItems = document.getElementById('task-list').getElementsByTagName('li');
    for (let taskItem of taskItems) {
        tasks.push({
            text: taskItem.childNodes[0].textContent,
            tags: taskItem.getElementsByClassName('tags')[0].textContent.replace('Tags: ', ''),
            dueDate: taskItem.getElementsByClassName('due-date')[0].textContent.replace('Due: ', ''),
            completed: taskItem.classList.contains('completed')
        });
    }
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        for (let task of tasks) {
            addTask(task.text, task.tags, task.dueDate, task.completed);
        }
    }
}

function checkDueDates() {
    let now = new Date().toISOString().split('T')[0];
    let tasks = document.getElementById('task-list').getElementsByTagName('li');
    for (let task of tasks) {
        let dueDate = task.getElementsByClassName('due-date')[0].textContent.replace('Due: ', '');
        if (dueDate && dueDate <= now && !task.classList.contains('completed')) {
            alert(`Task "${task.childNodes[0].textContent}" is due!`);
        }
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}
