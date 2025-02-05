import './Tasks.css';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteTask, priorityOptions, Task, taskFields, TaskType } from '../../Features/tasksSlice';
import { Link, useLocation, useMatch } from 'react-router-dom';
import { deleteData } from '../apiRequests';

interface TasksListProps {
    tasks: Task[]
    categoryID?: string
}

function TasksList({ tasks, categoryID }: TasksListProps) {
    const dispatch = useDispatch();
    const isTasksListView = useMatch('/tasks')
    const isCategoriesView = useMatch('/categories/*')

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

    const getMeetingTitle = (meetingId: string) => {
        const meeting = tasks.find((meeting) => meeting.id === meetingId);
        return meeting ? meeting.title : "No associated meeting";
    };

    return (

        <div className='ToDoList'>

            {isTasksListView &&
                <h2 id='toDoList-title'>
                    To Do List
                </h2>
            }

            <Link to={'/newTask'} className='add-task-button' state={{ fromCategories: isCategoriesView, categoryID: categoryID }}>
                <span className="plus-icon">+</span> Add New Task
            </Link>

            {status === 'loading' && <p>Loading tasks...</p>}
            {status === 'failed' && <p>Failed to load tasks</p>}
            {tasks.length > 0 ? (
                tasks.map((task) => {
                    const currTaskType = getTaskType(task.type);
                    return (
                        <Link to={`/tasks/${task.id}`}
                            key={task.id}
                            className={`list-task`}
                            style={{
                                background: priorityOptions.find(opt => opt.value === task.priority)?.bg || "white",
                                backgroundSize: "10%",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "right"
                            }}>

                            {currTaskType && currTaskType.fields.includes(taskFields.title) && task.title && (
                                <h4 className='task-field title'>{task.title}</h4>
                            )}

                            {currTaskType && currTaskType.fields.includes(taskFields.description) && task.description && (
                                <label className='task-field description'>{task.description}</label>
                            )}

                            {currTaskType && currTaskType.fields.includes(taskFields.startDate) && task.startDate && (
                                <label className='task-field'>
                                    {currTaskType.fields.includes(taskFields.endDate) && task.endDate
                                        ? `Timeframe: ${task.startDate} - ${task.endDate}`
                                        : `Start Date: ${task.startDate}`}
                                </label>
                            )}

                            {currTaskType && currTaskType.fields.includes(taskFields.date) && task.date && (
                                <label className='task-field'>Date: {task.date}</label>
                            )}

                            {currTaskType && currTaskType.fields.includes(taskFields.time) && task.time && (
                                <label className='task-field'>Starting at: {task.time}</label>
                            )}

                            {currTaskType && currTaskType.fields.includes(taskFields.meeting) && task.meeting && (
                                <label className='task-field'>Meeting: {getMeetingTitle(task.meeting)}</label>
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