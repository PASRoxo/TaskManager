import './Tasks.css';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, Task, TaskType } from '../../Features/tasksSlice';
import { Link } from 'react-router-dom';
import { deleteData } from '../apiRequests';

function TasksList() {
    const dispatch = useDispatch();

    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const taskTypes: TaskType[] = useSelector((state: RootState) => state.tasksSlice.taskTypes);
    const status = useSelector((state: RootState) => state.tasksSlice.status);
    const error = useSelector((state: RootState) => state.tasksSlice.error);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()

        await deleteData(`tasks/${id}`);
        dispatch(deleteTask(id))
    }

    const getTaskType = (taskType: string) => {
        return taskTypes.find(type => type.id === taskType);
    };

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
                tasks.map((task) => {
                    const currTaskType = getTaskType(task.type);
                    return (
                        <Link to={`/tasks/${task.id}`} key={task.id} className='list-task'>
                            {currTaskType && currTaskType.fields.includes("description") && (
                                <>
                                    <h4 className='task-field'>{task.title}</h4>
                                    <label className='task-field description'>Description: {task.description}</label>
                                </>
                            )}

                            {currTaskType && currTaskType.fields.includes("startDate") && (
                                <label className='task-field'>Start Date: {task.startDate}</label>
                            )}

                            <div className='task-actions'>
                                <Link to={`/editTask/${task.id}`} className="task-bttn bi bi-pencil-square btn btn-primary" />
                                <button onClick={(e) => handleDelete(e, task.id)} className="task-bttn bi bi-trash BsTrashFill btn btn-danger" />
                            </div>
                        </Link>)
                })
            ) : (
                <p>No tasks available</p>
            )}
        </div>
    )
}

export default TasksList;