const express = require('express');
const app = express();

app.use(express.json());

// Our temporary Todo data
let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
];

// 1. GET All Todos – Read
app.get('/todos', (req, res) => {
  res.status(200).json(todos);
});

// 2. GET Completed Todos – Read
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);

  res.status(200).json(completed);
});

// 3. GET Active Todos – Read
app.get('/todos/active', (req, res) => {
  const active = todos.filter((t) => !t.completed);

  res.status(200).json(active);
});

// 4. GET One Todo – Read
app.get('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  res.status(200).json(todo);
});

// 5. POST New Todo – Create
app.post('/todos', (req, res) => {
  const { task } = req.body;

  if (typeof task !== 'string' || task.trim() === '') {
    return res.status(400).json({
      message: 'Task is required'
    });
  }

  const newTodo = {
    id: Math.max(0, ...todos.map((t) => t.id)) + 1,
    task: task.trim(),
    completed: false
  };

  todos.push(newTodo);

  res.status(201).json(newTodo);
});

// 6. PATCH Todo – Update
app.patch('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const todo = todos.find((t) => t.id === id);

  if (!todo) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  const { task, completed } = req.body;

  // Validate task if provided
  if (task !== undefined) {
    if (typeof task !== 'string' || task.trim() === '') {
      return res.status(400).json({
        message: 'Task must be a non-empty string'
      });
    }
  }

  // Validate completed if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    return res.status(400).json({
      message: 'Completed must be true or false'
    });
  }

  // Prevent empty updates
  if (task === undefined && completed === undefined) {
    return res.status(400).json({
      message: 'Nothing to update'
    });
  }

  // Update only the provided fields
  if (task !== undefined) {
    todo.task = task.trim();
  }

  if (completed !== undefined) {
    todo.completed = completed;
  }

  res.status(200).json(todo);
});

// 7. DELETE Todo – Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const initialLength = todos.length;

  todos = todos.filter((t) => t.id !== id);

  if (todos.length === initialLength) {
    return res.status(404).json({
      message: 'Todo not found'
    });
  }

  res.status(204).send();
});

// Error-handling middleware
app.use((err, req, res, next) => {
  res.status(500).json({
    error: 'Server error!'
  });
});

// Start server
const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});