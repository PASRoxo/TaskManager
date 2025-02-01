interface BaseFieldProps {
    label: string;
    name: string;
    value: string;
    onChange: (value: string) => void;
    isDisabled: boolean;
    isRequired: boolean;
}

interface TextInputFieldProps extends BaseFieldProps { }

interface TextAreaFieldProps extends BaseFieldProps {
    rows: number;
}

interface SelectFieldProps extends BaseFieldProps {
    options: { value: string; label: string }[];
}

interface DateInputFieldProps extends BaseFieldProps {
    minDate?: string;
}

interface TimeInputFieldProps extends BaseFieldProps { }

export const TextInputField = ({ label, name, value, onChange, isDisabled, isRequired }: TextInputFieldProps) => (
    <div className="form-group">
        <label className="form-label">
            {label} {isRequired && <label style={{ color: "red" }}> *</label>}
        </label>
        <input
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            className="form-control"
            type="text"
            disabled={isDisabled}
            required={isRequired}
        />
    </div>
);

export const TextAreaField = ({ label, name, value, onChange, rows, isDisabled, isRequired }: TextAreaFieldProps) => (
    <div className='form-group'>
        <label className="form-label">
            {label} {isRequired && <label style={{ color: "red" }}> *</label>}
        </label>
        <textarea
            name={name}
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={rows}
            className="form-control"
            disabled={isDisabled}
            required={isRequired}
        />
    </div>
);


export const SelectField = ({ label, name, value, onChange, options, isDisabled, isRequired }: SelectFieldProps) => (
    <div className="form-group">
        <label className="form-label">
            {label} {isRequired && <label style={{ color: "red" }}> *</label>}
        </label>
        <select
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="form-select"
            disabled={isDisabled}
            required={isRequired}
        >
            <option value="" disabled>
                Choose one...
            </option>
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
    </div>
);

export const DateInputField = ({ label, name, value, onChange, isDisabled, isRequired, minDate }: DateInputFieldProps) => (
    <div className='form-group'>
        <label className="form-label">
            {label} {isRequired && <label style={{ color: "red" }}> *</label>}
        </label>
        <input
            name={name}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className="form-control"
            type="date"
            disabled={isDisabled}
            required={isRequired}
            min={minDate}
        />
    </div>
);

export const TimeInputField = ({ label, name, value, onChange, isDisabled, isRequired }: TimeInputFieldProps) => (
    <div className="form-group">
        <label className="form-label">
            {label} {isRequired && <span style={{ color: "red" }}> *</span>}
        </label>
        <input
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="form-control"
            type="time"
            disabled={isDisabled}
            required={isRequired}
        />
    </div>
);
