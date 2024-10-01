import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { addCategory, Category, editCategory } from "../../Features/categoriesSlice";
import { SketchPicker } from 'react-color'

function CategoriesForm() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);

    const category = id ? categories.find(category => category.id === Number(id)) : null;

    const isDisabled = !(location.pathname === '/newCategory' || location.pathname.startsWith('/editCategory'));

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

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const formInputs = {
            name: name,
            colorCode: colorCode,
            description: description,
        };

        if (formInputs.name.trim() === "" || formInputs.colorCode.trim() === "" || formInputs.description.trim() === "") {
            alert("All fields must be filled")
        } else if (location.pathname === '/newCategory' || location.pathname.startsWith('/editCategory')) {
            try {
                if (location.pathname === '/newCategory') {
                    const newCategory = {
                        id: 0,
                        name: name,
                        colorCode: colorCode,
                        description: description,
                    };
                    axios
                        .post("http://localhost:3000/categories", newCategory)
                        .then(() => {
                            dispatch(addCategory(newCategory));
                        })
                } else {
                    const editedCategory = {
                        id: Number(id),
                        name: name,
                        colorCode: colorCode,
                        description: description,
                    };
                    axios
                        .put(`http://localhost:3000/categories/${id}`, editedCategory)
                        .then(() => {
                            dispatch(editCategory(editedCategory));
                        })
                }
                navigate(-1)
            } catch (error) {
                console.error('Error saving category:', error);
            }
        } else {
            navigate(-1)
        }
    };

    const handleColor = (colorPicked: any) => {
        setColorCode(colorPicked.hex)
    }

    return (
        <div className='TaskForm'>
            <h2>
                {location.pathname === '/newCategory' ? 'New Category' : id ? category?.name : 'Invalid Route'}
            </h2>

            <form onSubmit={handleSubmit}>

                <div className='form-group'>
                    <label className="form-label">Name</label>
                    <input
                        name="nameInput"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        className="form-control"
                        type="text"
                        disabled={isDisabled}
                    />
                </div>

                <div className='form-group'>
                    <label className="form-label">Color Code</label>
                    <SketchPicker 
                    color={colorCode}
                    onChange={handleColor}
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


                <div className="submit-bttn ">
                    <button type="submit" className="btn btn-primary">
                        {location.pathname === '/newCategory' ? 'Create' : location.pathname.startsWith('/editCategory') ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>


        </div>
    )
}

export default CategoriesForm;