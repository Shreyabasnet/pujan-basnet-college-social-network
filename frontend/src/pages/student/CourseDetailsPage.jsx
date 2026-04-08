import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useStudent } from '../../hooks/useStudent';
import { ArrowLeft, BookOpen, Users, Clock, MapPin, Award } from 'lucide-react';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CourseDetailsPage = () => {
    const { courseId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [course, setCourse] = useState(location.state?.course || null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        if (!course && courseId) {
            fetchCourseDetails();
        }
    }, [courseId]);

    const fetchCourseDetails = async () => {
        setLoading(true);
        try {
            // In a real app, fetch course details from API
            // For now, using course from state
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (!course && loading) return <LoadingSpinner />;

    if (!course) {
        return (
            <div className="space-y-6">
                <button 
                    onClick={() => navigate('/student/courses')}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                    <ArrowLeft className="h-5 w-5" />
                    <span>Back to Courses</span>
                </button>
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    Course not found. Please select a course from the list.
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header with Back Button */}
            <div className="flex items-center space-x-4">
                <button 
                    onClick={() => navigate('/student/courses')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                    title="Back to Courses"
                >
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{course.name}</h1>
                    <p className="text-gray-500 mt-1">{course.code}</p>
                </div>
            </div>

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-8 text-white">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold mb-2">{course.name}</h2>
                        <p className="text-blue-100">{course.description || 'Welcome to this course'}</p>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4 text-center">
                        <p className="text-xs text-blue-100 mb-1">Progress</p>
                        <p className="text-3xl font-bold">{course.attendance || 0}%</p>
                    </div>
                </div>
            </div>

            {/* Course Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Instructor</p>
                            <p className="text-gray-900 font-semibold mt-1">{course.teacher?.username || course.instructor || 'N/A'}</p>
                        </div>
                        <Users className="h-8 w-8 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Credits</p>
                            <p className="text-gray-900 font-semibold mt-1">{course.credits || 'N/A'}</p>
                        </div>
                        <Award className="h-8 w-8 text-purple-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Attendance</p>
                            <p className="text-gray-900 font-semibold mt-1">{course.attendance || 0}%</p>
                        </div>
                        <Clock className="h-8 w-8 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-500 text-sm">Department</p>
                            <p className="text-gray-900 font-semibold mt-1">{course.department || 'N/A'}</p>
                        </div>
                        <MapPin className="h-8 w-8 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow">
                <div className="border-b border-gray-200 flex">
                    {['overview', 'materials', 'assignments'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-4 font-medium text-sm transition-colors ${
                                activeTab === tab
                                    ? 'border-b-2 border-blue-500 text-blue-600'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                <div className="p-6">
                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-3">About this Course</h3>
                                <p className="text-gray-600">
                                    {course.description || 'This is a course offered by the department. Complete assignments, attend classes, and participate in discussions to succeed.'}
                                </p>
                            </div>

                            {course.schedule && (
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Schedule</h3>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-gray-600">
                                            <span className="font-medium">Days:</span> {course.schedule.day || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            <span className="font-medium">Time:</span> {course.schedule.startTime || 'N/A'} - {course.schedule.endTime || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 mt-2">
                                            <span className="font-medium">Room:</span> {course.schedule.room || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'materials' && (
                        <div className="text-center py-12">
                            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">
                                Course materials will appear here once the instructor uploads them.
                            </p>
                            <button
                                onClick={() => navigate('/student/materials')}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition"
                            >
                                View All Materials
                            </button>
                        </div>
                    )}

                    {activeTab === 'assignments' && (
                        <div className="text-center py-12">
                            <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">
                                Assignments for this course will appear here.
                            </p>
                            <button
                                onClick={() => navigate('/student/assignments')}
                                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-lg transition"
                            >
                                View All Assignments
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Attendance */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Attendance</h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-600">Current Attendance</span>
                        <span className="text-2xl font-bold text-blue-600">{course.attendance || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full"
                            style={{ width: `${course.attendance || 0}%` }}
                        ></div>
                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        Keep your attendance above 75% to be eligible for the final exam.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CourseDetailsPage;
