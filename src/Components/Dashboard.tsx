import '../App.css';
import { Link } from 'react-router-dom';
import { DashboardMenu } from './Menus';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ThunkDispatch } from 'redux-thunk';
import { Action } from 'redux';
import { fetchApiTasks, fetchApiTaskTypes } from '../Features/tasksSlice';
import { fetchApiCategories } from '../Features/categoriesSlice';

function Dashboard() {
    const dispatch = useDispatch();
    const thunkDispatch = useDispatch<ThunkDispatch<any, void, Action>>();

    useEffect(() => {
        thunkDispatch(fetchApiTasks());
        thunkDispatch(fetchApiTaskTypes());
        thunkDispatch(fetchApiCategories());
    }, [dispatch]);

    return (
        <div className='Dashboard'>
            <div>
                <h2>Dashboard</h2>
            </div>

            <h4>Shortcut Menu <i className="bi bi-grid-3x3" /></h4>
            <div className="card-container">
                {DashboardMenu.map((item, index) => (
                    <Link key={index} to={item.path} className="card">
                        <h4><b>{item.title}</b></h4>
                        <p>{item.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default Dashboard;