import './Tasks.css';
import { RootState } from '../../store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchApiTasks, Task } from '../../Features/tasksSlice';
import { Link } from 'react-router-dom';

function TasksList() {
    const dispatch = useDispatch();
    const thunkDispatch = useDispatch<ThunkDispatch<any, void, Action>>();

    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const status = useSelector((state: RootState) => state.tasksSlice.status);
    const error = useSelector((state: RootState) => state.tasksSlice.error);

    useEffect(() => {
        thunkDispatch(fetchApiTasks());
    }, [dispatch]);

    return (
        <div className='ToDoList'>

            <h2 id='toDoList-title'>
                To Do List
            </h2>

            <Link to={'/taskForm'} className='add-task-button'>
                <span className="plus-icon">+</span> Add New Task
            </Link>

            {status === 'loading' && <p>Loading tasks...</p>}
            {status === 'failed' && <p>Failed to load tasks</p>}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <Link to={`/tasks/${task.id}`} key={task.id} className='list-task'>
                        <h4 className='task-field'>{task.title}</h4>
                        <label className='task-field'>Priority: {task.priority}</label>
                        <label className='task-field'>Description: {task.description}</label>
                    </Link>
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </div>
    )
}

export default TasksList;