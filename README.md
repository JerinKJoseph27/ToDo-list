# ToDo List App

A simple and functional Todo List application built with HTML, CSS, and JavaScript.

## Features

- Add new tasks
- Mark tasks as completed or active
- Edit existing tasks
- Delete tasks
- Filter tasks by All, Active, and Completed
- Clear all completed tasks
- See remaining active task count
- Persistent data using browser local storage

## Local Storage

This app saves tasks in browser local storage, so tasks remain available after refresh or browser restart.

- Storage key: todo-app.tasks.v1
- Data format: array of task objects
- Each task object:
	- id (number)
	- text (string)
	- completed (boolean)

If you want to reset all saved tasks:

1. Open browser developer tools.
2. Go to Application (or Storage) tab.
3. Find Local Storage for this site.
4. Delete the key todo-app.tasks.v1.

## Project Files

- todo.html: App structure and UI elements
- todo.css: Styling and responsive layout
- todo.js: App logic, rendering, and local storage handling

## How To Run

1. Open todo.html in any modern browser.
2. Start adding tasks.

Optional (recommended in VS Code):

1. Install Live Server extension.
2. Right-click todo.html.
3. Select Open with Live Server.

## Notes

- Works fully on the client side (no backend required).
- Local storage is browser-specific for the current origin.
