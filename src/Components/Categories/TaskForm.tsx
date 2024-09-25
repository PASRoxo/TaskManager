import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { useEffect, useState } from "react";
import axios from "axios";
import { addCategory, Category, editCategory } from "../../Features/categoriesSlice";

function CategoriesForm() {
    const { id } = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);

    const category = id ? categories.find(category => category.id === Number(id)) : null;

    const isDisabled = !(location.pathname === '/newCategory' || location.pathname.startsWith('/editCategory'));

    const [name, setName] = useState('');
    const [colorCode, setColorCode] = useState('');
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
        } else if (location.pathname === '/newTask' || location.pathname.startsWith('/editTask')) {
            try {
                if (location.pathname === '/newTask') {
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

                {/* Implement later (color picker) */}
                <div className='form-group'>
                    <label className="form-label">Color Code</label>
                    <select
                        name="prioritySelect"
                        value={colorCode}
                        onChange={(e => setColorCode(e.target.value))}
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
                        {location.pathname === '/newCategory' ? 'Create' : location.pathname.startsWith('/editCategory') ? 'Update' : 'Back'}
                    </button>
                </div>

            </form>


        </div>
    )
}

export default CategoriesForm;