import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../hooks/useTeacher';
import TeacherStats from '../../components/teacher/TeacherStats';
import CourseCard from '../../components/teacher/CourseCard';
import ScheduleView from '../../components/teacher/ScheduleView';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { BookOpen, CalendarDays, ClipboardCheck, Sparkles, Users, Megaphone } from 'lucide-react';

const TeacherDashboard = () => {
    const navigate = useNavigate();
    const { getDashboardData, loading, error } = useTeacher();
    const [dashboardData, setDashboardData] = useState({
        stats: {
            totalStudents: 0,
            activeCourses: 0,
            pendingAssignments: 0,
            avgAttendance: 0
        },
        recentCourses: [],
        todaySchedule: [],
        recentActivities: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const data = await getDashboardData();
        if (data) setDashboardData(data);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Teacher dashboard
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, Professor!</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            A clearer teaching command center with attendance, classes, course activity, and quick actions in one elevated view.
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/teacher/attendance')}
                        className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                    >
                        Take attendance
                    </button>
                </div>
            </section>

            {error && <Alert type="error" message={error} />}

            <TeacherStats stats={dashboardData.stats} />

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.65fr)]">
                <div className="space-y-6">
                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Courses</p>
                                <h2 className="mt-1 text-2xl font-black text-slate-900">Current Courses</h2>
                            </div>
                            <button
                                onClick={() => navigate('/teacher/courses')}
                                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700"
                            >
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {dashboardData.recentCourses.map((course) => (
                                <CourseCard key={course._id} course={course} />
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Recent Activities</h2>
                        <div className="space-y-4">
                            {dashboardData.recentActivities.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                    No recent activity yet.
                                </div>
                            ) : dashboardData.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <div className={`mt-1 h-2.5 w-2.5 rounded-full ${activity.type === 'attendance' ? 'bg-emerald-500' : activity.type === 'grade' ? 'bg-sky-500' : 'bg-amber-500'}`} />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-slate-800">{activity.description}</p>
                                        <p className="mt-1 text-xs text-slate-500">{activity.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <ScheduleView schedule={dashboardData.todaySchedule} />

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Quick Actions</h2>
                        <div className="space-y-3">
                            <ActionButton onClick={() => navigate('/teacher/attendance')} label="Mark attendance" helper="Record class presence" icon={<ClipboardCheck className="h-4 w-4" />} />
                            <ActionButton onClick={() => navigate('/teacher/courses')} label="Manage courses" helper="Review your course list" icon={<BookOpen className="h-4 w-4" />} />
                            <ActionButton onClick={() => navigate('/announcements')} label="Make announcement" helper="Publish class updates" icon={<Megaphone className="h-4 w-4" />} />
                            <ActionButton onClick={() => navigate('/events')} label="Manage events" helper="Check campus schedules" icon={<CalendarDays className="h-4 w-4" />} />
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

const ActionButton = ({ onClick, label, helper, icon }) => (
    <button onClick={onClick} className="group flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-primary-200 hover:bg-primary-50/60">
        <div>
            <p className="text-sm font-semibold text-slate-900">{label}</p>
            <p className="mt-1 text-xs text-slate-500">{helper}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-primary-600 shadow-sm transition group-hover:translate-x-0.5">
            {icon}
        </div>
    </button>
);

export default TeacherDashboard;
