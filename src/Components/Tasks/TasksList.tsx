import './Tasks.css';
import axios from 'axios';
import { useEffect, useState } from 'react';

function TasksList() {
    const baseUrl = 'http://localhost:3000/'
    const [tasks, setTasks] = useState([]);

    const fetchData = async () => {
        try {
            const response = await axios.get(baseUrl + "tasks");
            setTasks(response.data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='ToDoList'>

            <h2 id='toDoList-title'>
                To Do List
            </h2>

            {tasks.length > 0 ? (
                tasks.map((task: any) => (
                    <div key={task.id}>
                        <h4>{task.title}</h4>
                        <p>Priority:    {task.priority}</p>
                        <p>Description: {task.description}</p>
                    </div>
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </div>
    )
}

export default TasksList;