import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const STORAGE_KEY = "simple_todo";
export default function SimpleTodo() {
   const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Load tasks from localStorage
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTasks(JSON.parse(raw));
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Add new task
  const addTask = () => {
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: input.trim(), done: false }]);
    setInput("");
  };

  // Toggle done
  const toggleDone = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  // Delete task
  const deleteTask = (id) => setTasks(tasks.filter(t => t.id !== id));

  // Drag and drop handler
  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(tasks);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setTasks(items);
  };


  return (
     <div className="font-sans-serif mr-2 bg-black/60 p-2 text-white font-semibold">
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a task..."
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button onClick={addTask} style={{ padding: "8px 12px" }}>Add</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos">
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef} style={{ padding: 0, listStyle: "none" }}>
              {tasks.map((task, index) => (
                <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`flex justify-between items-center p-2 mb-2 border border-gray-300 rounded ${task.done ? 'bg-black/60' : 'bg-black/60'}`}

                    >
                      <div>
                        <input type="checkbox" checked={task.done} onChange={() => toggleDone(task.id)} />
                        <span style={{ marginLeft: 8, textDecoration: task.done ? "line-through" : "none" }}>
                          {task.text}
                        </span>
                      </div>
                      <button onClick={() => deleteTask(task.id)} style={{ color: "red", border: "none", background: "none" }}>×</button>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
