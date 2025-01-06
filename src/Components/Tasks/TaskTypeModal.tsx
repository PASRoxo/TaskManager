
function TaskTypeModal({ taskTypes, taskType, setTaskType }: any) {

    return (
        <div className='form-group'>
            <label className="form-label">Select Task Type</label>
            <select
                name="taskTypeSelect"
                value={taskType}
                onChange={(e => setTaskType(e.target.value))}
                className="form-select"
                required>

                <option value="" disabled>choose one...</option>
                {taskTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>
                        {type.display}
                    </option>
                ))}
            </select>
        </div>
    )
}

export default TaskTypeModal;