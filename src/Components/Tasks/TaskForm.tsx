import { useParams, useNavigate, useMatch, useLocation } from "react-router-dom";
import { addTask, editTask, priorityOptions, Task, taskFields, TaskType } from "../../Features/tasksSlice";
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
    const location = useLocation();

    const { fromCategories, categoryID } = location.state || {};

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
        if (fromCategories) {
            setCategory(categoryID)
        }
    }, [fromCategories]);

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

        const { fields: taskFormFields } = selectedType;
        const { required: requiredFields } = selectedType;

        let formInputs: { [key: string]: string } = {};

        taskFormFields.forEach(field => {
            field === taskFields.title && title && (formInputs.title = title);
            field === taskFields.category && category && (formInputs.category = category);
            field === taskFields.priority && priority && (formInputs.priority = priority);
            field === taskFields.description && description && (formInputs.description = description);
            field === taskFields.startDate && startDateInput && (formInputs.startDate = startDateInput);
            field === taskFields.endDate && endDateInput && (formInputs.endDate = endDateInput);
            field === taskFields.date && startDateInput && (formInputs.date = startDateInput);
            field === taskFields.time && timeInput && (formInputs.time = timeInput);
            field === taskFields.meeting && meeting && (formInputs.meeting = meeting);
        });

        const missingFields = requiredFields.filter(field => {
            return !formInputs[field] || isEmptyString(formInputs[field]);
        });

        if (missingFields.length > 0) {
            addFormError(FORM_ERRORS.req_field_missing);
            alert(FORM_ERRORS.req_field_missing)
            return
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
                console.error(FORM_ERRORS.error_saving("task"), error);
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
                {selectedType?.fields.includes(taskFields.title) && (
                    <TextInputField
                        label="Title"
                        name="titleInput"
                        value={title}
                        onChange={input => setTitle(input)}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired(taskFields.title)}
                    />
                )}

                {selectedType?.fields.includes(taskFields.category) && (
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
                        isRequired={isFieldRequired(taskFields.category)}
                    />
                )}

                {selectedType?.fields.includes(taskFields.priority) && (
                    <SelectField
                        label="Priority"
                        name="prioritySelect"
                        value={priority}
                        onChange={selectedOption => setPriority(selectedOption)}
                        options={priorityOptions}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired(taskFields.priority)}
                    />
                )}

                {selectedType?.fields.includes(taskFields.description) && (
                    <TextAreaField
                        label="Description"
                        name="descriptionInput"
                        value={description}
                        onChange={input => setDescription(input)}
                        rows={5}
                        isDisabled={isDisabled}
                        isRequired={isFieldRequired(taskFields.description)}
                    />
                )}

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes(taskFields.startDate) && (
                            <DateInputField
                                label="Start Date"
                                name="startDateInput"
                                value={startDateInput}
                                onChange={(value) => setStartDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired(taskFields.startDate)}
                            />
                        )}
                    </div>

                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes(taskFields.endDate) && (
                            <DateInputField
                                label="End Date"
                                name="endDateInput"
                                value={endDateInput}
                                onChange={(value) => setEndDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired(taskFields.endDate)}
                                minDate={startDateInput ? formatDateYYYYMMDD(new Date(startDateInput)) : undefined}
                            />
                        )}
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes(taskFields.date) && (
                            <DateInputField
                                label="Date"
                                name="dateInput"
                                value={startDateInput}
                                onChange={(value) => setStartDateInput(formatDateYYYYMMDD(new Date(value)))}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired(taskFields.date)}
                                minDate={formatDateYYYYMMDD(new Date())}
                            />
                        )}
                    </div>

                    <div style={{ flex: '1' }}>
                        {selectedType?.fields.includes(taskFields.time) && (
                            <TimeInputField
                                label="Time"
                                name="timeInput"
                                value={timeInput}
                                onChange={input => setTimeInput(input)}
                                isDisabled={isDisabled}
                                isRequired={isFieldRequired(taskFields.time)}
                            />
                        )}
                    </div>
                </div>

                {selectedType?.fields.includes(taskFields.meeting) && (
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
                        isRequired={isFieldRequired(taskFields.meeting)}
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