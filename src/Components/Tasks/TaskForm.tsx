import { useParams, useNavigate, useMatch } from "react-router-dom";
import { addTask, editTask, Task, TaskType } from "../../Features/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { createData, updateData } from "../apiRequests";
import { v4 as uuidv4 } from 'uuid';
import { DateInputField, SelectField, TextAreaField, TextInputField } from "../FormFields";
import { Category } from "../../Features/categoriesSlice";
import { formatDateYYYYMMDD } from "../../functions";

function TasksForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const taskTypes: TaskType[] = useSelector((state: RootState) => state.tasksSlice.taskTypes);
    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);

    const task = id ? tasks.find(task => task.id === id) : null;

    const isNewTaskView = useMatch('/newTask')
    const isEditTaskView = useMatch('/editTask/:id')
    const isDisabled = !(isNewTaskView || isEditTaskView);

    const [taskType, setTaskType] = useState('')

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [priority, setPriority] = useState('');
    const [description, setDescription] = useState('');
    const [startDateInput, setStartDateInput] = useState('');
    const [endDateInput, setEndDateInput] = useState('');

    const selectedType = taskTypes.find(type => type.id === task?.type || type.id === taskType) as TaskType

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setCategory(task.category || '');
            setPriority(task.priority || '');
            setDescription(task.description || '');
            setStartDateInput(task.startDate || '');
            setEndDateInput(task.endDate || '');
        } else {
            setTitle('');
            setPriority('');
            setDescription('');
            setStartDateInput('');
            setEndDateInput('');
        }
    }, [task]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        const formInputs: { [key: string]: string } = {
            title: title,
            priority: priority,
            description: description,
            startDate: startDateInput,
            endDate: endDateInput
        };

        const { required: requiredFields } = selectedType;

        const missingFields = requiredFields.filter(field => {
            return !formInputs[field] || formInputs[field].trim() === "";
        });

        if (missingFields.length > 0) {
            alert("All fields must be filled")
        } else if (isNewTaskView || isEditTaskView) {
            try {
                if (isNewTaskView) {
                    const newTask = {
                        id: uuidv4(),
                        category: category,
                        title: title,
                        type: selectedType?.id as string,
                        priority: priority,
                        description: description,
                        startDate: startDateInput,
                        endDate: endDateInput
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

    const isFieldRequired = (field: string) => {
        return selectedType.required.includes(field)
    }

    return (
        <div className='TaskForm'>
            <h2>
                {isNewTaskView ? 'New Task' : id ? task?.title : 'Invalid Route'}
            </h2>

            {isNewTaskView && (
                <SelectField
                    label="Task Type"
                    name="taskTypeSelect"
                    value={taskType}
                    onChange={selectedOption => setTaskType(selectedOption)}
                    options={taskTypes.map((type: any) => ({
                        value: type.id,
                        label: type.display,
                    }))}
                    isDisabled={false}
                    isRequired={true}
                />
            )}

            <form onSubmit={handleSubmit}>
                {selectedType?.fields.includes("title") && (
                    <TextInputField
                        label="Title"
                        name="titleInput"
                        value={title}
                        onChange={input => setTitle(input)}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired("title")}
                    />
                )}

                {selectedType?.fields.includes("category") && (
                    <SelectField
                        label="Category"
                        name="categorySelect"
                        value={category}
                        onChange={selectedOption => setCategory(selectedOption)}
                        options={categories.map((cat: any) => ({
                            value: cat.id,
                            label: cat.name,
                        }))}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired("category")}
                    />
                )}

                {selectedType?.fields.includes("priority") && (
                    <SelectField
                        label="Priority"
                        name="prioritySelect"
                        value={priority}
                        onChange={selectedOption => setPriority(selectedOption)}
                        options={[
                            { value: "high", label: "High" },
                            { value: "medium", label: "Medium" },
                            { value: "low", label: "Low" },
                        ]}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired("priority")}
                    />
                )}

                {selectedType?.fields.includes("description") && (
                    <TextAreaField
                        label="Description"
                        name="descriptionInput"
                        value={description}
                        onChange={input => setDescription(input)}
                        rows={5}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired("description")}
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes("startDate") && (
                            <DateInputField
                                label="Start Date"
                                name={"startDateInput"}
                                value={startDateInput}
                                onChange={(value) => setStartDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired("startDate")}
                            />
                        )}
                    </div>

                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes("endDate") && (
                            <DateInputField
                                label="End Date"
                                name={"endDateInput"}
                                value={endDateInput}
                                onChange={(value) => setEndDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired("endDate")}
                                minDate={startDateInput ? formatDateYYYYMMDD(new Date(startDateInput)) : undefined}
                            />
                        )}
                    </div>
                </div>

                <div className="submit-bttn">
                    <button type="submit" className="btn btn-primary">
                        {isNewTaskView ? 'Create' : isEditTaskView ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>
        </div>
    )
}

export default TasksForm;