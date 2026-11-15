
import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editId, setEditId] = useState(null);

  // Load todos from MongoDB
  useEffect(() => {
    fetch(`${API_URL}/todos`)
      .then(res => {
        if (!res.ok) throw new Error("Failed to load todos");
        return res.json();
      })
      .then(data => setTodos(data))
      .catch(err => console.error(err));
  }, []);

  // Add or update todo
  const addTodo = async () => {
    if (!task.trim()) return;

    try {
      if (editId !== null) {
        const res = await fetch(`${API_URL}/todos/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: task })
        });

        if (!res.ok) throw new Error("Failed to update todo");

        const updatedTodo = await res.json();

        setTodos(todos.map(todo =>
          todo._id === editId ? updatedTodo : todo
        ));

        setEditId(null);
      } else {
        const res = await fetch(`${API_URL}/todos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: task })
        });

        if (!res.ok) throw new Error("Failed to add todo");

        const newTodo = await res.json();
        setTodos([...todos, newTodo]);
      }

      setTask("");
    } catch (err) {
      alert(err.message);
    }
  };

  // Edit todo
  const editTodo = (todo) => {
    setTask(todo.text);
    setEditId(todo._id);
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) throw new Error("Failed to delete todo");

      setTodos(todos.filter(todo => todo._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>My Todo App</h1>
        <p>Organize your day, one task at a time.</p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter your task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <button onClick={addTodo}>
            {editId !== null ? "Update" : "Add Todo"}
          </button>
        </div>

        <h2>My Tasks ({todos.length})</h2>

        {todos.length === 0 ? (
          <p>No tasks yet. Add your first task!</p>
        ) : (
          todos.map(todo => (
            <div className="todo-item" key={todo._id}>
              <span>{todo.text}</span>
              <div>
                <button onClick={() => editTodo(todo)}>Edit</button>
                <button onClick={() => deleteTodo(todo._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
