const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const taskList = document.getElementById('taskList');
const noTasks = document.getElementById('noTasks');
const filterBtns = document.querySelectorAll('.filter-btn');

let tasks = [];
let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
            tasks = JSON.parse(savedTasks);
            renderTasks();
      }
});

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
            addTask();
      }
});

filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
      });
});

function addTask() {
      const taskText = taskInput.value.trim();

      if (taskText === '') return;

      const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
      };

      tasks.push(newTask);
      saveToLocalStorage();
      renderTasks();

      taskInput.value = '';
      taskInput.focus();
}

function deleteTask(id) {
      tasks = tasks.filter(task => task.id !== id);
      saveToLocalStorage();
      renderTasks();
}

function toggleComplete(id) {
      tasks = tasks.map(task => {
            if (task.id === id) {
                  return { ...task, completed: !task.completed };
            }
            return task;
      });

      saveToLocalStorage();
      renderTasks();
}

function editTask(id) {
      const taskElement = document.querySelector(`li[data-id="${id}"]`);
      const task = tasks.find(t => t.id === id);

      taskElement.innerHTML = `
                <input type="text" class="edit-input" value="${task.text}">
                <button class="save-btn">Saxla</button>
            `;
      taskElement.classList.add('edit-mode');

      const editInput = taskElement.querySelector('.edit-input');
      const saveBtn = taskElement.querySelector('.save-btn');

      editInput.focus();

      saveBtn.addEventListener('click', () => saveEdit(id, editInput.value));
      editInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                  saveEdit(id, editInput.value);
            }
            if (e.key === 'Escape') {
                  renderTasks();
            }
      });
}

function saveEdit(id, newText) {
      newText = newText.trim();
      if (newText === '') return;

      tasks = tasks.map(task => {
            if (task.id === id) {
                  return { ...task, text: newText };
            }
            return task;
      });

      saveToLocalStorage();
      renderTasks();
}

function saveToLocalStorage() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
      const filteredTasks = tasks.filter(task => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
      });

      taskList.innerHTML = '';

      if (filteredTasks.length === 0) {
            noTasks.style.display = 'block';
      } else {
            noTasks.style.display = 'none';

            filteredTasks.forEach(task => {
                  const li = document.createElement('li');
                  li.dataset.id = task.id;

                  if (task.completed) {
                        li.classList.add('completed');
                  }

                  li.innerHTML = `
                        <input type="checkbox" class="checkbox" ${task.completed ? 'checked' : ''}>
                        <span class="task-text">${task.text}</span>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">❌</button>
                    `;

                  taskList.appendChild(li);

                  const checkbox = li.querySelector('.checkbox');
                  checkbox.addEventListener('change', () => toggleComplete(task.id));

                  const deleteBtn = li.querySelector('.delete-btn');
                  deleteBtn.addEventListener('click', () => deleteTask(task.id));

                  const editBtn = li.querySelector('.edit-btn');
                  editBtn.addEventListener('click', () => editTask(task.id));
            });
      }
}