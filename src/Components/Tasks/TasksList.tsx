import './Tasks.css';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, Task } from '../../Features/tasksSlice';
import { Link } from 'react-router-dom';
import { deleteData } from '../apiRequests';

function TasksList() {
    const dispatch = useDispatch();

    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const status = useSelector((state: RootState) => state.tasksSlice.status);
    const error = useSelector((state: RootState) => state.tasksSlice.error);

    const handleDelete = async (e: React.MouseEvent, id: number) => {
        e.preventDefault()

        await deleteData(`tasks/${id}`);
        dispatch(deleteTask(id))
    }

    return (
        <div className='ToDoList'>

            <h2 id='toDoList-title'>
                To Do List
            </h2>

            <Link to={'/newTask'} className='add-task-button'>
                <span className="plus-icon">+</span> Add New Task
            </Link>

            {status === 'loading' && <p>Loading tasks...</p>}
            {status === 'failed' && <p>Failed to load tasks</p>}
            {tasks.length > 0 ? (
                tasks.map((task) => (
                    <Link to={`/tasks/${task.id}`} key={task.id} className='list-task'>
                        <h4 className='task-field'>{task.title}</h4>
                        <label className='task-field'>Priority: {task.priority}</label>
                        <div className='task-actions'>
                            <Link to={`/editTask/${task.id}`} className="task-bttn bi bi-pencil-square btn btn-primary" />
                            <button onClick={(e) => handleDelete(e, task.id)} className="task-bttn bi bi-trash BsTrashFill btn btn-danger" />
                        </div>
                    </Link>
                ))
            ) : (
                <p>No tasks available</p>
            )}
        </div>
    )
}

export default TasksList;