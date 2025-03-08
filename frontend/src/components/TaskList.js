import React, { useEffect, useState } from 'react';
import { getTasks, addTask, deleteTask } from '../services/api';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState("");

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        const data = await getTasks();
        setTasks(data);
    };

    const handleAddTask = async () => {
        if (newTask.trim()) {
            await addTask({ title: newTask, completed: false });
            setNewTask("");
            loadTasks();
        }
    };

    const handleDeleteTask = async (id) => {
        await deleteTask(id);
        loadTasks();
    };

    return (
        <div>
            <h1>Task Manager</h1>
            <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
            />
            <button onClick={handleAddTask}>Add Task</button>
            <ul>
                {tasks.map((task) => (
                    <li key={task.id}>
                        {task.title}
                        <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TaskList;
