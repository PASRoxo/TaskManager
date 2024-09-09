import '../../App.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SidebarMenu } from '../Menus';

function Sidebar() {
    const [sidebar, setSidebar] = useState(false)

    const showSidebar = () => {
        setSidebar(!sidebar)
    }

    return (
        <>
            <div className='Sidebar'>
                <Link to='#' className='menu-bars'>
                    <div className="bi bi-list" onClick={showSidebar} />
                </Link>
            </div>
            <nav className={sidebar ? "sidebar-menu active" : "sidebar-menu"}>
                <ul className='sidebar-items' onClick={showSidebar}>
                    <li className='sidebar-toggle'>
                        <Link to='#' className='menu-bars'>
                            <div className="bi bi-x-lg" />
                        </Link>
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
        </>
    )
}

export default Sidebar;