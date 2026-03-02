import React from 'react';

const StatCard = ({ label, value, icon, colorClass }) => (
    <div className="bg-white p-6 rounded-lg shadow flex items-center space-x-4">
        <div className={`p-3 rounded-full ${colorClass} text-white`}>
            {icon}
        </div>
        <div>
            <p className="text-sm text-gray-500 font-medium">{label}</p>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
    </div>
);

const TeacherStats = ({ stats = {} }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
                label="Total Students"
                value={stats.totalStudents || 0}
                icon={<span>👥</span>}
                colorClass="bg-blue-500"
            />
            <StatCard
                label="Active Courses"
                value={stats.activeCourses || 0}
                icon={<span>📚</span>}
                colorClass="bg-green-500"
            />
            <StatCard
                label="Pending Assignments"
                value={stats.pendingAssignments || 0}
                icon={<span>📝</span>}
                colorClass="bg-yellow-500"
            />
            <StatCard
                label="Avg. Attendance"
                value={`${stats.avgAttendance || 0}%`}
                icon={<span>📊</span>}
                colorClass="bg-purple-500"
            />
        </div>
    );
};

export default TeacherStats;
