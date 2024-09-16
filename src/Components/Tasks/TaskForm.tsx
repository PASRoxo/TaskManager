import { useLocation, useParams } from "react-router-dom";
import { Task } from "../../Features/tasksSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";

function TasksForm() {
    const { id } = useParams();
    const location = useLocation();
    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);

    const task = id ? tasks.find(task => task.id === Number(id)) : null;

    const isDisabled = !!id;

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
            <form>
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
                    <input
                        name="prioritySelect"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                        className="form-control"
                        type="text"
                        disabled={isDisabled}
                    />
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

            </form>
        </div>
    )
}

export default TasksForm;