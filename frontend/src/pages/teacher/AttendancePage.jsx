import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import teacherService from '../../services/teacher.service';
import { UserCheck, Calendar as CalendarIcon, Save, ChevronRight, Check, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AttendancePage = () => {
    const { getMyCourses, markAttendance, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [fetchingStudents, setFetchingStudents] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCourseSelect = async (course) => {
        setSelectedCourse(course);
        setFetchingStudents(true);
        try {
            const res = await teacherService.getCourseStudents(course._id);
            setStudents(res.data.data);
            // Initialize attendance as all present
            const initialAttendance = {};
            res.data.data.forEach(student => {
                initialAttendance[student._id] = 'present';
            });
            setAttendance(initialAttendance);
        } catch (err) {
            toast.error("Failed to fetch students");
        } finally {
            setFetchingStudents(false);
        }
    };

    const toggleStatus = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const handleSave = async () => {
        try {
            const promises = Object.entries(attendance).map(([studentId, status]) => 
                markAttendance({
                    courseId: selectedCourse._id,
                    studentId,
                    date,
                    status
                })
            );
            await Promise.all(promises);
            toast.success("Attendance saved successfully!");
        } catch (err) {
            toast.error("Failed to save some attendance records");
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <UserCheck className="mr-3 h-8 w-8 text-primary-600" />
                        Attendance Management
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Course Selection */}
                    <div className="lg:col-span-1 space-y-4">
                        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">Select Course</h2>
                        <div className="space-y-2">
                            {courses.map(course => (
                                <button
                                    key={course._id}
                                    onClick={() => handleCourseSelect(course)}
                                    className={`w-full p-4 rounded-xl text-left border transition ${
                                        selectedCourse?._id === course._id 
                                        ? 'bg-primary-50 border-primary-200 shadow-sm' 
                                        : 'bg-white border-gray-100 hover:border-gray-200'
                                    }`}
                                >
                                    <h3 className={`font-bold ${selectedCourse?._id === course._id ? 'text-primary-700' : 'text-gray-800'}`}>
                                        {course.name}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 font-medium">{course.code}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Student List */}
                    <div className="lg:col-span-3">
                        {selectedCourse ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-primary-50 p-2.5 rounded-lg">
                                            <CalendarIcon className="h-5 w-5 text-primary-600" />
                                        </div>
                                        <input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="font-medium text-gray-900 border-none focus:ring-0 p-0 text-lg"
                                        />
                                    </div>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="w-full md:w-auto flex items-center justify-center space-x-2 bg-primary-600 text-white px-6 py-2.5 rounded-lg hover:bg-primary-700 transition shadow-md disabled:bg-primary-300"
                                    >
                                        <Save className="h-5 w-5" />
                                        <span>Save Attendance</span>
                                    </button>
                                </div>

                                {fetchingStudents ? (
                                    <div className="p-12 text-center">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student Name</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Department</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {students.map(student => (
                                                    <tr key={student._id} className="hover:bg-gray-50/50 transition">
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <img
                                                                    src={student.profilePicture || `https://ui-avatars.com/api/?name=${student.username}&background=random`}
                                                                    className="h-9 w-9 rounded-full mr-3 border border-gray-100"
                                                                    alt=""
                                                                />
                                                                <span className="font-semibold text-gray-900">{student.username}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {student.department || 'N/A'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                                            <button
                                                                onClick={() => toggleStatus(student._id)}
                                                                className={`px-4 py-1.5 rounded-full text-sm font-bold transition flex items-center ml-auto ${
                                                                    attendance[student._id] === 'present'
                                                                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                                                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                                                                }`}
                                                            >
                                                                {attendance[student._id] === 'present' ? (
                                                                    <><Check className="h-4 w-4 mr-1.5" /> Present</>
                                                                ) : (
                                                                    <><X className="h-4 w-4 mr-1.5" /> Absent</>
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        {students.length === 0 && (
                                            <div className="p-16 text-center text-gray-500 italic">
                                                No students enrolled in this course.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <ChevronRight className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to mark attendance?</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Please select a course from the sidebar to view the roll call and start marking attendance records.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AttendancePage;
