import '../App.css';
import { Link } from 'react-router-dom';
import { DashboardMenu } from './Menus';

function Dashboard() {
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