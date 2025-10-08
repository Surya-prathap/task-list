import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

function App() {
  const [task, setTask] = useState("");
  const [taskList, setTaskList] = useState([]);

  const [editingTask, setEditingTask] = useState(null);
  const [edittask, setEditTask] = useState("");

  useEffect(() => {
    axios
      .get(`${API_URL}/api/tasks`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setTaskList(res.data);
        }
        // console.log("api res:", res.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const addTask = async () => {
    if (!task.trim()) return;
    try {
      const res = await axios.post(`${API_URL}/api/tasks`, { task });
      setTaskList([...taskList, res.data]);
      setTask("");
    } catch (err) {
      console.log("error", err);
    }
  };

  const toggleTask = async (id, completed) => {
    const res = await axios.put(`${API_URL}/api/tasks/${id}`, {
      completed: !completed,
    });
    setTaskList(taskList.map((t) => (t._id === id ? res.data : t)));
  };

  const editTask = async (id) => {
    const res = await axios.put(`${API_URL}/api/tasks/${id}`, {
      task: edittask,
    });
    setTaskList(taskList.map((t) => (t._id === id ? res.data : t)));
    setEditingTask(null);
    setEditTask("");
  };

  const deleteTask = async (id) => {
    const res = await axios.delete(`${API_URL}/api/tasks/${id}`);
    setTaskList(taskList.filter((t) => t._id !== id));
  };

  return (
    <>
      <div className="container">
        <h1 className="title">TASK MANAGER APP</h1>
        <div className="input-box">
          <input
            className="enter-task"
            type="text"
            value={task}
            placeholder="Enter task...."
            onChange={(e) => setTask(e.target.value)}
          />
          <button className="add" onClick={addTask}>
            Add
          </button>
        </div>
        {taskList.length > 0 ? (
          taskList.map((task, i) => (
            <h2 className={task.completed ? "done" : ""} key={i}>
              {editingTask === task._id ? (
                <>
                  <input
                    className="edit-input"
                    type="text"
                    value={edittask}
                    onChange={(e) => setEditTask(e.target.value)}
                  />
                  <button
                    className="save-btn"
                    onClick={() => editTask(task._id)}
                  >
                    Save
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => setEditingTask(null)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <div className="task">
                  <div className="task-name">{task.task}</div>
                  <div className="handle-buttons">
                    <button
                      className={
                        task.completed ? "completed-btn" : "complete-btn"
                      }
                      onClick={() => toggleTask(task._id, task.completed)}
                    >
                      {task.completed ? "completed" : "complete"}
                    </button>
                    <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingTask(task._id);
                        setEditTask(task.task);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => deleteTask(task._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </h2>
          ))
        ) : (
          <h1 className="empty">NO TASKS YET.....</h1>
        )}
      </div>
    </>
  );
}

export default App;
