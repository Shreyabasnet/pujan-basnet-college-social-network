import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import CourseEnrollmentCard from '../../components/student/CourseEnrollmentCard';
import Timetable from '../../components/student/Timetable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';
import { BookOpen, CalendarDays, Megaphone, GraduationCap, TrendingUp, Users } from 'lucide-react';

const StudentDashboard = () => {
    const { getDashboardData, loading } = useStudent();
    const [announcements, setAnnouncements] = useState([]);
    const [dashboardData, setDashboardData] = useState({
        enrolledCourses: [],
        recentGrades: [],
        todayClasses: [],
        attendance: {},
        upcomingDeadlines: []
    });

    useEffect(() => {
        fetchDashboardData();
        fetchAnnouncements();
    }, []);

    const fetchDashboardData = async () => {
        const data = await getDashboardData();
        setDashboardData(data);
    };

    const fetchAnnouncements = async () => {
        try {
            const res = await api.get('/announcements');
            setAnnouncements((res.data || []).slice(0, 3));
        } catch (error) {
            console.error(error);
            setAnnouncements([]);
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary-600 via-cyan-600 to-sky-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <GraduationCap className="h-4 w-4" />
                            Student dashboard
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Welcome back, Student!</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            A sharper overview of your classes, deadlines, announcements, and academic progress in one place.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <MiniStat icon={<BookOpen className="h-4 w-4" />} label="Courses" value={dashboardData.enrolledCourses.length} />
                        <MiniStat icon={<CalendarDays className="h-4 w-4" />} label="Deadlines" value={dashboardData.upcomingDeadlines.length} />
                        <MiniStat icon={<Users className="h-4 w-4" />} label="Classes today" value={dashboardData.todayClasses.length} />
                        <MiniStat icon={<TrendingUp className="h-4 w-4" />} label="Announcements" value={announcements.length} />
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
                <MetricCard label="Courses" value={dashboardData.enrolledCourses.length} helper="Enrolled classes" icon={<BookOpen className="h-5 w-5" />} />
                <MetricCard label="Today's classes" value={dashboardData.todayClasses.length} helper="Sessions on your timetable" icon={<CalendarDays className="h-5 w-5" />} />
                <MetricCard label="Deadlines" value={dashboardData.upcomingDeadlines.length} helper="Assignments and tasks" icon={<TrendingUp className="h-5 w-5" />} />
                <MetricCard label="Announcements" value={announcements.length} helper="Recent updates" icon={<Megaphone className="h-5 w-5" />} />
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.6fr)]">
                <div className="space-y-6">
                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <div className="mb-5 flex items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Learning</p>
                                <h2 className="mt-1 text-2xl font-black text-slate-900">My Courses</h2>
                            </div>
                            <button className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700">
                                View all
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            {dashboardData.enrolledCourses.map((course) => (
                                <CourseEnrollmentCard key={course._id} course={course} />
                            ))}
                        </div>
                    </section>
                </div>

                <div className="space-y-6">
                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Today's Classes</h2>
                        <Timetable classes={dashboardData.todayClasses} compact />
                    </section>

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Upcoming Deadlines</h2>
                        <div className="space-y-3">
                            {dashboardData.upcomingDeadlines.length === 0 ? (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                                    No upcoming deadlines.
                                </div>
                            ) : dashboardData.upcomingDeadlines.map((deadline, index) => (
                                <div key={index} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="font-semibold text-slate-900">{deadline.title}</p>
                                    <p className="mt-1 text-sm text-slate-500">Due: {deadline.date}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                        <h2 className="mb-4 text-lg font-bold text-slate-900">Latest Announcements</h2>
                        {announcements.length === 0 ? (
                            <p className="text-sm text-slate-500">No announcements yet</p>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((announcement) => (
                                    <Link
                                        to="/announcements"
                                        key={announcement._id}
                                        className="block rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/60"
                                    >
                                        <p className="font-semibold text-slate-900">{announcement.title}</p>
                                        <p className="mt-1 text-xs text-slate-500">By {announcement.createdBy?.username || 'Admin'}</p>
                                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{announcement.content}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </section>
                </div>
            </div>
        </div>
    );
};

const MiniStat = ({ icon, label, value }) => (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-white/70">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
        </div>
        <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
);

const MetricCard = ({ label, value, helper, icon }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
                <p className="mt-2 text-sm text-slate-500">{helper}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                {icon}
            </div>
        </div>
    </div>
);

export default StudentDashboard;
