import './Tasks.css';
import { RootState } from '../../store';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { fetchApiTasks, Task } from '../../Features/tasksSlice';

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

            {status === 'loading' && <p>Loading tasks...</p>}
            {status === 'failed' && <p>Failed to load tasks</p>}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <div key={task.id}>
                        <h4>{task.title}</h4>
                        <p>Priority: {task.priority}</p>
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