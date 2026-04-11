import React from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Book,
    CheckCircle,
    Star,
    ClipboardList,
    Folder,
    Calendar,
    MessageSquare,
    User,
    Bell,
    UserCheck,
    Users,
    BookOpen,
    Settings,
    Activity,
    X,
    ChevronDown,
    ChevronRight
} from 'lucide-react';

const iconMap = {
    'dashboard': LayoutDashboard,
    'book': Book,
    'check-circle': CheckCircle,
    'star': Star,
    'clipboard': ClipboardList,
    'folder': Folder,
    'calendar': Calendar,
    'message': MessageSquare,
    'user': User,
    'bell': Bell,
    'user-check': UserCheck,
    'users': Users,
    'book-open': BookOpen,
    'settings': Settings,
    'activity': Activity
};

const SidebarItem = ({ item, isMobile = false, toggleSidebar }) => {
    const Icon = iconMap[item.icon] || LayoutDashboard;

    return (
        <NavLink
            to={item.path}
            onClick={isMobile ? toggleSidebar : undefined}
            className={({ isActive }) =>
                `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                    ? 'bg-blue-50 text-blue-600 border-r-4 border-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`
            }
        >
            <Icon size={20} className="mr-3" />
            <span>{item.title}</span>
            {item.badge && (
                <span className="ml-auto bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs font-bold">
                    {item.badge}
                </span>
            )}
        </NavLink>
    );
};

const Sidebar = ({ menuItems = [], isOpen, toggleSidebar }) => {
    return (
        <>
            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-20 transition-opacity bg-black opacity-50 lg:hidden ${isOpen ? 'block' : 'hidden'
                    }`}
                onClick={toggleSidebar}
            ></div>

            {/* Sidebar Desktop/Mobile */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 overflow-y-auto transition duration-300 transform bg-white border-r lg:translate-x-0 lg:static lg:inset-0 ${isOpen ? 'translate-x-0 ease-out' : '-translate-x-full ease-in'
                    }`}
            >
                <div className="flex items-center justify-between px-6 py-4 border-b lg:hidden">
                    <button onClick={toggleSidebar} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-0">
                    {menuItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            item={item}
                            isMobile={window.innerWidth < 1024}
                            toggleSidebar={toggleSidebar}
                        />
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default Sidebar;
