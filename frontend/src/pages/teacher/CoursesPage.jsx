import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacher } from '../../hooks/useTeacher';
import CourseCard from '../../components/teacher/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { BookOpen, Search, Filter, ArrowLeft, Users, Clock } from 'lucide-react';

const CoursesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMyCourses, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            setCourses(data);
            if (id) {
                const course = data.find(c => c._id === id);
                setSelectedCourse(course);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && courses.length === 0) return <LoadingSpinner />;

    // Course Details View
    if (id && selectedCourse) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-5xl mx-auto space-y-6">
                    <button 
                        onClick={() => navigate('/teacher/courses')}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to Courses
                    </button>

                    <div className="flex items-center space-x-4">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{selectedCourse.name}</h1>
                            <p className="text-gray-500 mt-1">{selectedCourse.code}</p>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-8 text-white">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold mb-2">{selectedCourse.name}</h2>
                                <p className="text-blue-100">{selectedCourse.description || 'Course information'}</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4 text-center">
                                <p className="text-xs text-blue-100 mb-1">Students</p>
                                <p className="text-3xl font-bold">{selectedCourse.studentsEnrolled || 0}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Code</p>
                                    <p className="text-gray-900 font-semibold mt-1">{selectedCourse.code}</p>
                                </div>
                                <BookOpen className="h-8 w-8 text-blue-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Students</p>
                                    <p className="text-gray-900 font-semibold mt-1">{selectedCourse.studentsEnrolled || 0}</p>
                                </div>
                                <Users className="h-8 w-8 text-purple-500" />
                            </div>
                        </div>
                        <div className="bg-white rounded-lg shadow p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-gray-500 text-sm">Credits</p>
                                    <p className="text-gray-900 font-semibold mt-1">{selectedCourse.credits || 'N/A'}</p>
                                </div>
                                <Clock className="h-8 w-8 text-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow">
                        <div className="border-b border-gray-200 flex">
                            {['overview', 'schedule', 'students'].map(tab => (
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
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-gray-900">About this Course</h3>
                                    <p className="text-gray-600">{selectedCourse.description || 'No description available'}</p>
                                    <div className="grid grid-cols-2 gap-4 mt-6">
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Department</p>
                                            <p className="font-semibold text-gray-900 mt-1">{selectedCourse.department || 'N/A'}</p>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-sm text-gray-600">Semester</p>
                                            <p className="font-semibold text-gray-900 mt-1">{selectedCourse.semester || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'schedule' && (
                                <div className="text-center py-12">
                                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">Schedule not configured yet</p>
                                </div>
                            )}
                            {activeTab === 'students' && (
                                <div>
                                    {selectedCourse.students && selectedCourse.students.length > 0 ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Enrolled Students ({selectedCourse.students.length})
                                                </h3>
                                            </div>
                                            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                                                <table className="w-full">
                                                    <thead className="bg-gray-50 border-b border-gray-200">
                                                        <tr>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                                                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Department</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {selectedCourse.students.map((student, index) => (
                                                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition">
                                                                <td className="px-6 py-4">
                                                                    <div className="flex items-center space-x-3">
                                                                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-bold">
                                                                            {student.username?.charAt(0).toUpperCase() || 'S'}
                                                                        </div>
                                                                        <span className="text-gray-900 font-medium">{student.fullName || 'N/A'}</span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 text-gray-600">{student.username || 'N/A'}</td>
                                                                <td className="px-6 py-4 text-gray-600">{student.email || 'N/A'}</td>
                                                                <td className="px-6 py-4 text-gray-600">{student.department || 'N/A'}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-500">No students enrolled</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="mr-3 h-8 w-8 text-primary-600" />
                            My Courses
                        </h1>
                        <p className="text-gray-500 mt-1 text-lg">Manage and view all your assigned academic courses</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code..."
                            className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 font-medium whitespace-nowrap">
                        <Filter className="h-5 w-5" />
                        <span>Filter Status</span>
                    </button>
                </div>

                {error && <Alert type="error" message={error} className="mb-6" />}

                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="h-20 w-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any courses matching your search criteria or assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
