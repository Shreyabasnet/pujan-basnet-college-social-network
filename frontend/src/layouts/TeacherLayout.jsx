import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar.jsx';
import Header from '../components/layout/Header.jsx';
import { teacherMenuItems } from './SidebarMenu.jsx';

const TeacherLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-50">
            <Sidebar
                menuItems={teacherMenuItems}
                isOpen={sidebarOpen}
                toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
            />

            <div className="flex-1 flex flex-col overflow-hidden">
                <Header
                    toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
                    title="Teacher Dashboard"
                />

                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6">
                    <div className="mx-auto max-w-7xl">
                    <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default TeacherLayout;
