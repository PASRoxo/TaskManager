import { useParams, useNavigate, useMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { addCategory, Category, categoryFields, editCategory } from "../../Features/categoriesSlice";
import { SketchPicker } from 'react-color'
import { createData, updateData } from "../apiRequests";
import { v4 as uuidv4 } from 'uuid';
import { TextAreaField, TextInputField } from "../FormFields";
import { isEmptyString } from "../../functions";
import { FORM_ERRORS } from "../FormErrors";
import TasksList from "../Tasks/TasksList";
import { Task } from "../../Features/tasksSlice";

function CategoriesForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);

    const category = id ? categories.find(category => category.id === id) : null;

    let tasks: Task[] = useSelector((state: RootState) => state.tasksSlice.tasks);
    if (category) {
        tasks = tasks.filter((task) => task.category === category.id);
    } else {
        tasks = []
    }

    const isNewCategoryView = useMatch('/newCategory')
    const isEditCategoryView = useMatch('/editCategory/:id')
    const isDisabled = !(isNewCategoryView || isEditCategoryView);

    const [name, setName] = useState('');
    const [colorCode, setColorCode] = useState('#f0f0f0');
    const [description, setDescription] = useState('');

    const [formErrors, setFormErrors] = useState<string[]>([]);

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
        if (category) {
            setName(category.name || '');
            setColorCode(category.colorCode || '');
            setDescription(category.description || '');
        } else {
            setName('');
            setColorCode('');
            setDescription('');
        }
    }, [category]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        let formInputs: { [key: string]: string } = {};

        Object.values(categoryFields).forEach(field => {
            field === categoryFields.name && name && (formInputs.name = name);
            field === categoryFields.colorCode && colorCode && (formInputs.colorCode = colorCode);
            field === categoryFields.description && description && (formInputs.description = description);
        });

        const missingFields = Object.keys(categoryFields).filter(field => {
            return !formInputs[field] || isEmptyString(formInputs[field]);
        });

        console.log(missingFields)

        if (missingFields.length > 0) {
            addFormError(FORM_ERRORS.req_field_missing);
            alert(FORM_ERRORS.req_field_missing)
            return
        } else if (isNewCategoryView || isEditCategoryView) {
            try {
                const categoryToSave: Category = {
                    id: isNewCategoryView ? uuidv4() : id as string,
                    name: formInputs.name,
                    colorCode: formInputs.colorCode,
                    description: formInputs.description,
                };
                if (isNewCategoryView) {
                    await createData('categories', categoryToSave);
                    dispatch(addCategory(categoryToSave));

                } else {
                    await updateData(`categories/${id}`, categoryToSave);
                    dispatch(editCategory(categoryToSave));
                }

                navigate('/categories')
            } catch (error) {
                console.error(FORM_ERRORS.error_saving("category"), error);
            }
        } else {
            navigate('/categories')
        }
    };

    const handleColor = (colorPicked: any) => {
        setColorCode(colorPicked.hex)
    }

    return (
        <div className='TaskForm'>
            <h2>
                {isNewCategoryView ? 'New Category' : id ? category?.name : 'Invalid Route'}
            </h2>

            <form onSubmit={handleSubmit}>
                <TextInputField
                    label="Name"
                    name="nameInput"
                    value={name}
                    onChange={input => setName(input)}
                    isDisabled={isDisabled}
                    isRequired={true}
                />

                <div className='form-group'>
                    <label className="form-label">Color Code</label>
                    <SketchPicker
                        color={colorCode}
                        onChange={handleColor}
                    />
                </div>

                <TextAreaField
                    label="Description"
                    name="descriptionInput"
                    value={description}
                    onChange={input => setDescription(input)}
                    rows={5}
                    isDisabled={isDisabled}
                    isRequired={true}
                />

                {
                    tasks.length > 0 && !isNewCategoryView &&
                    <div className='form-group'>
                        <label className="form-label">Associated Tasks</label>
                        <TasksList tasks={tasks} categoryID={category?.id} />
                    </div>
                }

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
                        <div className="submit-bttn ">
                            <button type="submit" className="btn btn-primary">
                                {isNewCategoryView ? 'Create' : isEditCategoryView ? 'Update' : 'Back'}
                            </button>
                        </div>
                    </div>
                </div>

            </form>


        </div>
    )
}

export default CategoriesForm;