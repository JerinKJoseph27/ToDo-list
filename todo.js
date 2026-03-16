const STORAGE_KEY = "todo-app.tasks.v1";

const form = document.getElementById("todo-form");
const input = document.getElementById("inp");
const list = document.getElementById("todo-list");
const filterSelect = document.getElementById("filter");
const taskCount = document.getElementById("task-count");
const emptyState = document.getElementById("empty-state");
const clearCompletedBtn = document.getElementById("clear-completed");

let todos = [];
let currentFilter = "all";

// App bootstrapping: load persisted todos and wire all events.
init();

function init() {
    todos = loadTodos();

    form.addEventListener("submit", onAddTodo);
    filterSelect.addEventListener("change", onFilterChange);
    clearCompletedBtn.addEventListener("click", clearCompleted);

    render();
}

// Main add handler with input validation.
function onAddTodo(event) {
    event.preventDefault();
    const value = input.value.trim();

    if (!value) {
        alert("Please enter a task");
        return;
    }

    const todo = {
        id: Date.now(),
        text: value,
        completed: false
    };

    todos.unshift(todo);
    input.value = "";
    persistTodos();
    render();
}

function onFilterChange() {
    currentFilter = filterSelect.value;
    render();
}

// Remove all completed items in one action.
function clearCompleted() {
    todos = todos.filter(function (todo) {
        return !todo.completed;
    });
    persistTodos();
    render();
}

function toggleTodo(id) {
    todos = todos.map(function (todo) {
        if (todo.id === id) {
            return {
                id: todo.id,
                text: todo.text,
                completed: !todo.completed
            };
        }
        return todo;
    });
    persistTodos();
    render();
}

function deleteTodo(id) {
    todos = todos.filter(function (todo) {
        return todo.id !== id;
    });
    persistTodos();
    render();
}

// Inline editing with simple prompt to keep UI minimal but functional.
function editTodo(id) {
    const todo = todos.find(function (item) {
        return item.id === id;
    });

    if (!todo) {
        return;
    }

    const updatedText = prompt("Edit task:", todo.text);
    if (updatedText === null) {
        return;
    }

    const cleanedText = updatedText.trim();
    if (!cleanedText) {
        alert("Task text cannot be empty");
        return;
    }

    todos = todos.map(function (item) {
        if (item.id === id) {
            return {
                id: item.id,
                text: cleanedText,
                completed: item.completed
            };
        }
        return item;
    });

    persistTodos();
    render();
}

function getFilteredTodos() {
    if (currentFilter === "active") {
        return todos.filter(function (todo) {
            return !todo.completed;
        });
    }

    if (currentFilter === "completed") {
        return todos.filter(function (todo) {
            return todo.completed;
        });
    }

    return todos;
}

// Render list + counts based on current app state.
function render() {
    const filteredTodos = getFilteredTodos();
    list.innerHTML = "";

    filteredTodos.forEach(function (todo) {
        list.appendChild(createTodoElement(todo));
    });

    const activeCount = todos.filter(function (todo) {
        return !todo.completed;
    }).length;

    taskCount.textContent = activeCount + (activeCount === 1 ? " task left" : " tasks left");
    emptyState.classList.toggle("hidden", filteredTodos.length > 0);
}

function createTodoElement(todo) {
    const item = document.createElement("li");
    item.className = "todo-item" + (todo.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", function () {
        toggleTodo(todo.id);
    });

    const textSpan = document.createElement("span");
    textSpan.className = "task-text";
    textSpan.textContent = todo.text;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const editBtn = document.createElement("button");
    editBtn.className = "icon-btn";
    editBtn.type = "button";
    editBtn.setAttribute("aria-label", "Edit task");
    editBtn.innerHTML = '<i class="fas fa-pen"></i>';
    editBtn.addEventListener("click", function () {
        editTodo(todo.id);
    });

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn delete";
    deleteBtn.type = "button";
    deleteBtn.setAttribute("aria-label", "Delete task");
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.addEventListener("click", function () {
        deleteTodo(todo.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    item.appendChild(checkbox);
    item.appendChild(textSpan);
    item.appendChild(actions);

    return item;
}

// Persist and load from localStorage so tasks survive refresh/reopen.
function persistTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
        return [];
    }

    try {
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }

        return parsed
            .filter(function (item) {
                return item && typeof item.id === "number" && typeof item.text === "string";
            })
            .map(function (item) {
                return {
                    id: item.id,
                    text: item.text,
                    completed: Boolean(item.completed)
                };
            });
    } catch (error) {
        return [];
    }
}