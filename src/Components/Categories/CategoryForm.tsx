import { useParams, useNavigate, useMatch } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import { addCategory, Category, editCategory } from "../../Features/categoriesSlice";
import { SketchPicker } from 'react-color'
import { createData, updateData } from "../apiRequests";
import { v4 as uuidv4 } from 'uuid';
import { TextAreaField, TextInputField } from "../FormFields";

function CategoriesForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);

    const category = id ? categories.find(category => category.id === id) : null;

    const isNewCategoryView = useMatch('/newCategory')
    const isEditCategoryView = useMatch('/editCategory/:id')
    const isDisabled = !(isNewCategoryView || isEditCategoryView);

    const [name, setName] = useState('');
    const [colorCode, setColorCode] = useState('#f0f0f0');
    const [description, setDescription] = useState('');

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

        const formInputs = {
            name: name,
            colorCode: colorCode,
            description: description,
        };

        if (formInputs.name.trim() === "" || formInputs.colorCode.trim() === "" || formInputs.description.trim() === "") {
            alert("All fields must be filled")
        } else if (isNewCategoryView || isEditCategoryView) {
            try {
                if (isNewCategoryView) {
                    const newCategory = {
                        id: uuidv4(),
                        name: name,
                        colorCode: colorCode,
                        description: description,
                    };

                    await createData('categories', newCategory);
                    dispatch(addCategory(newCategory));

                } else {
                    const editedCategory = {
                        id: id as string,
                        name: name,
                        colorCode: colorCode,
                        description: description,
                    };

                    await updateData(`categories/${id}`, editedCategory);
                    dispatch(editCategory(editedCategory));
                }
                navigate('/categories')
            } catch (error) {
                console.error('Error saving category:', error);
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

                <div className="submit-bttn ">
                    <button type="submit" className="btn btn-primary">
                        {isNewCategoryView ? 'Create' : isEditCategoryView ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>


        </div>
    )
}

export default CategoriesForm;