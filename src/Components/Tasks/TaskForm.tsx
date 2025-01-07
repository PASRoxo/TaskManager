import { useLocation, useParams, useNavigate } from "react-router-dom";
import { addTask, editTask, Task, TaskType } from "../../Features/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import TaskTypeModal from "./TaskTypeModal";
import { createData, updateData } from "../apiRequests";
import { v4 as uuidv4 } from 'uuid';

function TasksForm() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const taskTypes: TaskType[] = useSelector((state: RootState) => state.tasksSlice.taskTypes);

    const task = id ? tasks.find(task => task.id === id) : null;

    const isDisabled = !(location.pathname === '/newTask' || location.pathname.startsWith('/editTask'));

    const [taskType, setTaskType] = useState('')

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');

    const selectedType = taskTypes.find(type => type.id === task?.type || type.id === taskType) as TaskType

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setCategory(task.category || '');
            setPriority(task.priority || '');
            setDescription(task.description || '');
        } else {
            setTitle('');
            setPriority('');
            setDescription('');
        }
    }, [task]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formInputs: { [key: string]: string } = { //defaulted to the basic fields for now
            title: title,
            priority: priority,
            description: description,
        };

        const { required: requiredFields } = selectedType;

        const missingFields = requiredFields.filter(field => {
            return !formInputs[field] || formInputs[field].trim() === "";
        });

        if (missingFields.length > 0) {
            alert("All fields must be filled")
        } else if (location.pathname === '/newTask' || location.pathname.startsWith('/editTask')) {
            try {
                if (location.pathname === '/newTask') {
                    const newTask = {
                        id: uuidv4(),
                        category: category,
                        title: title,
                        type: selectedType?.id as string,
                        priority: priority,
                        description: description,
                    };

                    await createData('tasks', newTask);
                    dispatch(addTask(newTask));

                } else {
                    const editedTask = {
                        id: id as string,
                        category: category,
                        title: title,
                        type: selectedType?.id as string,
                        priority: priority,
                        description: description,
                    };

                    await updateData(`tasks/${id}`, editedTask);
                    dispatch(editTask(editedTask));

                }
                navigate('/tasks')
            } catch (error) {
                console.error('Error saving task:', error);
            }
        } else {
            navigate('/tasks')
        }
    };

    return (
        <div className='TaskForm'>
            <h2>
                {location.pathname === '/newTask' ? 'New Task' : id ? task?.title : 'Invalid Route'}
            </h2>

            {(location.pathname === '/newTask') && (
                <TaskTypeModal
                    taskType={taskType}
                    setTaskType={setTaskType}
                    taskTypes={taskTypes}
                />
            )}

            <form onSubmit={handleSubmit}>

                {selectedType?.fields.includes("title") && (
                    <div className='form-group'>
                        <label className="form-label">Title</label>
                        <input
                            name="titleInput"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="form-control"
                            type="text"
                            disabled={isDisabled}
                        />
                    </div>
                )}

                {selectedType?.fields.includes("category") && (
                    <div className='form-group'>
                        <label className="form-label">Category</label>
                        <select
                            name="categorySelect"
                            value={category}
                            onChange={(e => setCategory(e.target.value))}
                            className="form-select"
                            required>
                            <option value="" disabled>choose one...</option>

                        </select>
                    </div>
                )}

                {selectedType?.fields.includes("priority") && (
                    <div className='form-group'>
                        <label className="form-label">Priority</label>
                        <select
                            name="prioritySelect"
                            value={priority}
                            onChange={(e => setPriority(e.target.value))}
                            className="form-select"
                            required>
                            <option value="" disabled>choose one...</option>
                            <option value={"high"}>High</option>
                            <option value={"medium"}>Medium</option>
                            <option value={"low"}>Low</option>
                        </select>
                    </div>
                )}

                {selectedType?.fields.includes("description") && (
                    <div className='form-group'>
                        <label className="form-label">Description</label>
                        <textarea
                            name="descriptionInput"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            className="form-control"
                            disabled={isDisabled}
                        />
                    </div>
                )}

                <div className="submit-bttn">
                    <button type="submit" className="btn btn-primary">
                        {location.pathname === '/newTask' ? 'Create' : location.pathname.startsWith('/editTask') ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>


        </div>
    )
}

export default TasksForm;