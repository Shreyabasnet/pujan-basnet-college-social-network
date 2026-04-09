import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTeacher } from '../../hooks/useTeacher';
import TeacherStats from '../../components/teacher/TeacherStats';
import CourseCard from '../../components/teacher/CourseCard';
import ScheduleView from '../../components/teacher/ScheduleView';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';

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
            {/* Page Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">
                    Welcome back, Professor!
                </h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => navigate('/teacher/attendance')}
                        className="btn btn-primary"
                    >
                        Take Attendance
                    </button>
                </div>
            </div>

            {/* Error Alert */}
            {error && <Alert type="error" message={error} />}

            {/* Stats Cards */}
            <TeacherStats stats={dashboardData.stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Courses */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Current Courses
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {dashboardData.recentCourses.map(course => (
                                <CourseCard 
                                    key={course._id} 
                                    course={course} 
                                />
                            ))}
                        </div>
                    </div>

                    {/* Recent Activities */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">
                            Recent Activities
                        </h2>
                        <div className="space-y-4">
                            {dashboardData.recentActivities.map((activity, index) => (
                                <div key={index} className="flex items-center space-x-3">
                                    <div className={`w-2 h-2 rounded-full ${
                                        activity.type === 'attendance' ? 'bg-green-500' :
                                        activity.type === 'grade' ? 'bg-blue-500' : 'bg-yellow-500'
                                    }`}></div>
                                    <span>{activity.description}</span>
                                    <span className="text-sm text-gray-500">
                                        {activity.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column - Schedule */}
                <div className="space-y-6">
                    <ScheduleView schedule={dashboardData.todaySchedule} />
                    
                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button 
                                onClick={() => navigate('/teacher/attendance')}
                                className="w-full btn btn-outline text-left"
                            >
                                📝 Mark Attendance
                            </button>
                            <button 
                                onClick={() => navigate('/teacher/courses')}
                                className="w-full btn btn-outline text-left"
                            >
                                📚 Manage Courses
                            </button>
                            <button 
                                onClick={() => navigate('/announcements')}
                                className="w-full btn btn-outline text-left"
                            >
                                📢 Make Announcement
                            </button>
                            <button 
                                onClick={() => navigate('/events')}
                                className="w-full btn btn-outline text-left"
                            >
                                📅 Manage Events
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
