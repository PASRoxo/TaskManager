import './Navigation.css';
import { Link } from 'react-router-dom';
import { SidebarMenu } from '../Menus';

function Sidebar({ sidebar, showSidebar }: any) {

    return (
        <div className='Sidebar'>
            {!sidebar && (
                <Link to='#' className='menu-int'>
                    <div className="bi bi-list" onClick={showSidebar} />
                </Link>
            )}

            <nav className={sidebar ? "sidebar-menu active" : "sidebar-menu"}>
                <ul className='sidebar-items' >
                    <li className='sidebar-toggle'>
                        {sidebar && (
                            <Link to='#' className='menu-int'>
                                <div className="bi bi-x-lg" onClick={showSidebar} />
                            </Link>
                        )}
                    </li>

                    {SidebarMenu.map((item, index) => {
                        return (
                            <li key={index} className='sidebar-item'>
                                <Link to={item.path}>
                                    <span>{item.icon}</span>
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            </nav>
        </div>

    )
}

export default Sidebar;