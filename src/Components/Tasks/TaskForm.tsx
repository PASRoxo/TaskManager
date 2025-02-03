import { useParams, useNavigate, useMatch } from "react-router-dom";
import { addTask, editTask, priorityOptions, Task, TaskType } from "../../Features/tasksSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { createData, updateData } from "../apiRequests";
import { v4 as uuidv4 } from 'uuid';
import { DateInputField, SelectField, TextAreaField, TextInputField, TimeInputField } from "../FormFields";
import { Category } from "../../Features/categoriesSlice";
import { formatDateYYYYMMDD, isEmptyString } from "../../functions";
import { FORM_ERRORS } from "../FormErrors";

function TasksForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    const meetings: Task[] = tasks.filter(task => task.type === 'meeting');

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
    const [timeInput, setTimeInput] = useState('');
    const [meeting, setMeeting] = useState('');

    const [formErrors, setFormErrors] = useState<string[]>([]);

    const selectedType = taskTypes.find(type => type.id === task?.type || type.id === taskType) as TaskType

    const clearInputFields = () => {
        setTitle('');
        setCategory('');
        setPriority('');
        setDescription('');
        setStartDateInput('');
        setEndDateInput('');

        setFormErrors([]);
    }

    const addFormError = (error: string) => {
        setFormErrors((prevErrors) => {
            if (!prevErrors.includes(error)) {
                return [...prevErrors, error];
            }
            return prevErrors;
        });
    };

    const removeFormError = (error: string) => {
        setFormErrors((prevErrors) => prevErrors.filter(err => err !== error));
    };

    useEffect(() => {
        if (task) {
            setTitle(task.title || '');
            setCategory(task.category || '');
            setPriority(task.priority || '');
            setDescription(task.description || '');
            setStartDateInput(task.startDate || task.date || '');
            setEndDateInput(task.endDate || '');
            setTimeInput(task.time || '');
            setMeeting(task.meeting || '');
        } else {
            clearInputFields();
        }
    }, [task]);

    useEffect(() => {
        if (!isEmptyString(endDateInput) && startDateInput > endDateInput && taskType !== 'meeting') {
            addFormError(FORM_ERRORS.startDate_endDate);
        } else if (formErrors.includes(FORM_ERRORS.startDate_endDate)) {
            removeFormError(FORM_ERRORS.startDate_endDate)
        }
    }, [startDateInput, endDateInput]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        if (formErrors.length > 0) {
            alert(FORM_ERRORS.form_Errors_warn);
            return;
        }

        const { fields: taskFields } = selectedType;
        const { required: requiredFields } = selectedType;

        let formInputs: { [key: string]: string } = {};

        taskFields.forEach(field => {
            field === "title" && title && (formInputs.title = title);
            field === "category" && category && (formInputs.category = category);
            field === "priority" && priority && (formInputs.priority = priority);
            field === "description" && description && (formInputs.description = description);
            field === "startDate" && startDateInput && (formInputs.startDate = startDateInput);
            field === "endDate" && endDateInput && (formInputs.endDate = endDateInput);
            field === "date" && startDateInput && (formInputs.date = startDateInput);
            field === "time" && timeInput && (formInputs.time = timeInput);
            field === "meeting" && meeting && (formInputs.meeting = meeting);
        });

        const missingFields = requiredFields.filter(field => {
            return !formInputs[field] || isEmptyString(formInputs[field]);
        });

        if (missingFields.length > 0) {
            alert("All fields must be filled")
        } else if (isNewTaskView || isEditTaskView) {
            try {
                const taskToSave: Task = {
                    id: isNewTaskView ? uuidv4() : id as string,
                    type: selectedType?.id as string,
                    title: title,
                    ...formInputs,
                };
                if (isNewTaskView) {
                    await createData('tasks', taskToSave);
                    dispatch(addTask(taskToSave));

                } else {
                    await updateData(`tasks/${id}`, taskToSave);
                    dispatch(editTask(taskToSave));
                }
                navigate('/tasks')
            } catch (error) {
                console.error('Error saving task:', error);
            }
        } else {
            navigate('/tasks')
        }
    };

    const handleTaskTypeSelection = (selectedOption: string) => {
        setTaskType(selectedOption);

        clearInputFields();
    }

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
                    onChange={handleTaskTypeSelection}
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
                        options={priorityOptions}
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
                                name="startDateInput"
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
                                name="endDateInput"
                                value={endDateInput}
                                onChange={(value) => setEndDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired("endDate")}
                                minDate={startDateInput ? formatDateYYYYMMDD(new Date(startDateInput)) : undefined}
                            />
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes("date") && (
                            <DateInputField
                                label="Date"
                                name="dateInput"
                                value={startDateInput}
                                onChange={(value) => setStartDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired("date")}
                                minDate={formatDateYYYYMMDD(new Date())}
                            />
                        )}
                    </div>

                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes("time") && (
                            <TimeInputField
                                label="Time"
                                name="timeInput"
                                value={timeInput}
                                onChange={input => setTimeInput(input)}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired("description")}
                            />
                        )}
                    </div>
                </div>

                {selectedType?.fields.includes("meeting") && (
                    <SelectField
                        label="Meeting"
                        name="meetingSelect"
                        value={meeting}
                        onChange={selectedOption => setMeeting(selectedOption)}
                        options={meetings.map((meeting) => ({
                            value: meeting.id,
                            label: meeting.title,
                        }))}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired("meeting")}
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'row', alignItems: "center" }}>
                    <div style={{ flex: '1' }}>
                        {
                            formErrors.length > 0 && formErrors.map((err) => (
                                <label>
                                    {err}<label style={{ color: "red" }}> *</label>
                                </label>
                            ))

                        }
                    </div>

                    <div style={{ flex: '1' }}>
                        <div className="submit-bttn">
                            <button type="submit" className="btn btn-primary">
                                {isNewTaskView ? 'Create' : isEditTaskView ? 'Update' : 'Back'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>
        </div>
    )
}

export default TasksForm;