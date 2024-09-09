import { Link } from 'react-router-dom';
import '../App.css';
import { DashboardMenu } from './Menus';

function Dashboard() {
    return (
        <div className='Dashboard'>
            <div>
                <h2>Dashboard</h2>
            </div>
            {DashboardMenu.map((item, index) => (
                <Link key={index} to={item.path}>
                    <div>
                        <h4><b>{item.title}</b></h4>
                        <p>{item.description}</p>
                    </div>
                </Link>
            ))}
        </div>
    )
}

export default Dashboard;