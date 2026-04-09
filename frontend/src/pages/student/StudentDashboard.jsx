import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import CourseEnrollmentCard from '../../components/student/CourseEnrollmentCard';
import Timetable from '../../components/student/Timetable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import api from '../../services/api';

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
            {/* Welcome Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
                <p className="mt-2">Here's your academic overview</p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-4 border border-blue-50">
                    <div className="text-gray-500 font-medium">Courses</div>
                    <div className="text-2xl font-bold text-blue-600">{dashboardData.enrolledCourses.length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-gray-500">Upcoming Events</div>
                    <div className="text-2xl font-bold text-blue-500">{dashboardData.upcomingDeadlines.length}</div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Courses */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Enrolled Courses */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">My Courses</h2>
                            <button className="text-blue-600 hover:underline">
                                View All
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.enrolledCourses.map(course => (
                                <CourseEnrollmentCard 
                                    key={course._id} 
                                    course={course} 
                                />
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Today's Classes */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Today's Classes</h2>
                        <Timetable classes={dashboardData.todayClasses} compact />
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
                        <div className="space-y-3">
                            {dashboardData.upcomingDeadlines.map((deadline, index) => (
                                <div key={index} className="border-l-4 border-red-500 pl-3">
                                    <p className="font-medium">{deadline.title}</p>
                                    <p className="text-sm text-gray-500">
                                        Due: {deadline.date}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Latest Announcements</h2>
                        {announcements.length === 0 ? (
                            <p className="text-sm text-gray-500">No announcements yet</p>
                        ) : (
                            <div className="space-y-3">
                                {announcements.map((announcement) => (
                                    <Link
                                        to="/announcements"
                                        key={announcement._id}
                                        className="block border-l-4 border-amber-500 pl-3 hover:bg-amber-50 rounded-r-md transition"
                                    >
                                        <p className="font-medium text-gray-900">{announcement.title}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            By {announcement.createdBy?.username || 'Admin'}
                                        </p>
                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
