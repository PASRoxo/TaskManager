import './Navigation.css';
import { Link } from 'react-router-dom';
import { SidebarMenu } from '../Menus';

function Sidebar({ sidebar, showSidebar }: any) {

    return (
        <>
            <div className='Header'>
                {!sidebar && (
                    <Link to='#' className='menu-int'>
                        <div className="bi bi-list" onClick={showSidebar} />
                    </Link>
                )}
            </div>
            <nav className={sidebar ? "Sidebar active" : "Sidebar"}>
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
        </>

    )
}

export default Sidebar;