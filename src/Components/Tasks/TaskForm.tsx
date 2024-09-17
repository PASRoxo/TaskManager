import { useLocation, useParams, useNavigate } from "react-router-dom";
import { addTask, editTask, Task } from "../../Features/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";

function TasksForm() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);

    const task = id ? tasks.find(task => task.id === Number(id)) : null;

    const isDisabled = !(location.pathname === '/newTask' || location.pathname.startsWith('/editTask'));

    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setPriority(task.priority || '');
            setDescription(task.description || '');
        } else {
            setTitle('');
            setPriority('');
            setDescription('');
        }
    }, [task]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const formInputs = {
            title: title,
            priority: priority,
            description: description,
        };

        if (formInputs.priority.trim() === "" || formInputs.title.trim() === "" || formInputs.description.trim() === "") {
            alert("All fields must be filled")
        } else if (location.pathname === '/newTask' || location.pathname.startsWith('/editTask')) {
            try {
                if (location.pathname === '/newTask') {
                    const newTask = {
                        id: 0,
                        title: title,
                        priority: priority,
                        description: description,
                    };
                    axios
                        .post("http://localhost:3000/tasks", newTask)
                        .then(() => {
                            dispatch(addTask(newTask));
                        })
                } else {
                    const editedTask = {
                        id: Number(id),
                        title: title,
                        priority: priority,
                        description: description,
                    };
                    axios
                        .put(`http://localhost:3000/tasks/${id}`, editedTask)
                        .then(() => {
                            dispatch(editTask(editedTask));
                        })
                }
                navigate(-1)
            } catch (error) {
                console.error('Error saving task:', error);
            }
        } else {
            navigate(-1)
        }
    };

    return (
        <div className='TaskForm'>
            {location.pathname === '/newTask' ? (
                <div>
                    <h2>New Task</h2>
                </div>
            ) : id ? (
                <div>
                    <h2>{task?.title}</h2>
                </div>
            ) : (
                <div>Invalid Route</div>
            )}
            <form onSubmit={handleSubmit}>
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

                <div className="submit-bttn ">
                    <button type="submit" className="btn btn-primary">
                        {location.pathname === '/newTask' ? 'Create' : location.pathname.startsWith('/editTask') ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default TasksForm;