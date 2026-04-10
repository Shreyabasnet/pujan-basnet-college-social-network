import React from 'react';

const StatCard = ({ label, value, icon, colorClass }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex items-center space-x-4">
            <div className={`rounded-2xl p-3 ${colorClass} text-white shadow-sm`}>
            {icon}
            </div>
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-1 text-2xl font-black text-slate-900">{value}</p>
            </div>
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
                colorClass="bg-sky-500"
            />
            <StatCard
                label="Active Courses"
                value={stats.activeCourses || 0}
                icon={<span>📚</span>}
                colorClass="bg-emerald-500"
            />
            <StatCard
                label="Pending Assignments"
                value={stats.pendingAssignments || 0}
                icon={<span>📝</span>}
                colorClass="bg-amber-500"
            />
            <StatCard
                label="Avg. Attendance"
                value={`${stats.avgAttendance || 0}%`}
                icon={<span>📊</span>}
                colorClass="bg-violet-500"
            />
        </div>
    );
};

export default TeacherStats;
