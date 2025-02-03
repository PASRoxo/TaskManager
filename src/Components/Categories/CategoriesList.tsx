import './Categories.css';
import { RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { deleteCategory, Category } from '../../Features/categoriesSlice';
import { Link } from 'react-router-dom';
import { deleteData } from '../apiRequests';

function CategoriesList() {
    const dispatch = useDispatch();

    const categories: Category[] = useSelector((state: RootState) => state.categoriesSlice.categories);
    const status = useSelector((state: RootState) => state.categoriesSlice.status);
    const error = useSelector((state: RootState) => state.categoriesSlice.error);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault()

        await deleteData(`categories/${id}`);
        dispatch(deleteCategory(id))
    }

    console.log(categories)
    return (
        <div className='CategoriesList'>

            <h2 id='categoriesList-title'>
                Categories List
            </h2>

            <Link to={'/newCategory'} className='add-category-button'>
                <span className="plus-icon">+</span> Add New Category
            </Link>

            {status === 'loading' && <p>Loading tasks...</p>}
            {status === 'failed' && <p>Failed to load tasks</p>}
            {categories.length > 0 ? (
                categories.map((category) => (
                    <Link to={`/categories/${category.id}`}
                        key={category.id}
                        className='list-category'
                        style={{
                            background: `linear-gradient(to left, ${category.colorCode} 0%, white 100%)`,
                            backgroundSize: "10%",
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "right"
                        }}>

                        <h4 className='category-field'>{category?.name}</h4>
                        <label className='task-field'>{category?.description}</label>

                        <div className='category-actions'>
                            <Link to={`/editCategory/${category.id}`} className="category-bttn bi bi-pencil-square btn btn-primary" />
                            <button onClick={(e) => handleDelete(e, category.id)} className="category-bttn bi bi-trash BsTrashFill btn btn-danger" />
                        </div>
                    </Link>
                ))
            ) : (
                <p>No categories available</p>
            )}
        </div>
    )
}

export default CategoriesList;