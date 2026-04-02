import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import teacherService from '../../services/teacher.service';
import { Star, ChevronRight, Edit2, Save, X, Search } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const GradesPage = () => {
    const { getMyCourses, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [fetchingStudents, setFetchingStudents] = useState(false);
    const [editingGrade, setEditingGrade] = useState(null); // studentId
    const [gradeData, setGradeData] = useState({
        grade: '',
        maxGrade: 100,
        assignment: '',
        feedback: ''
    });

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
        } catch (err) {
            toast.error("Failed to fetch students");
        } finally {
            setFetchingStudents(false);
        }
    };

    const handleEdit = (student) => {
        setEditingGrade(student._id);
        setGradeData({
            ...gradeData,
            studentId: student._id
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await teacherService.updateGrades({
                ...gradeData,
                courseId: selectedCourse._id
            });
            toast.success("Grade updated successfully!");
            setEditingGrade(null);
            setGradeData({ grade: '', maxGrade: 100, assignment: '', feedback: '' });
        } catch (err) {
            toast.error("Failed to update grade");
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Star className="mr-3 h-8 w-8 text-primary-600" />
                        Gradebook
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

                    {/* Student Grades */}
                    <div className="lg:col-span-3">
                        {selectedCourse ? (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                {fetchingStudents ? (
                                    <div className="p-12 text-center">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                            <thead>
                                                <tr className="bg-gray-50">
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Student</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Recent Grade</th>
                                                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {students.map(student => (
                                                    <React.Fragment key={student._id}>
                                                        <tr className="hover:bg-gray-50/50 transition">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center">
                                                                    <img
                                                                        src={student.profilePicture || `https://ui-avatars.com/api/?name=${student.username}&background=random`}
                                                                        className="h-9 w-9 rounded-full mr-3 border border-gray-100"
                                                                        alt=""
                                                                    />
                                                                    <span className="font-semibold text-gray-900">{student.username}</span>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-600">
                                                                - / 100
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => handleEdit(student)}
                                                                    className="p-2 text-gray-400 hover:text-primary-600 transition hover:bg-primary-50 rounded-lg"
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </button>
                                                            </td>
                                                        </tr>
                                                        {editingGrade === student._id && (
                                                            <tr>
                                                                <td colSpan="3" className="px-6 py-6 bg-primary-50/30">
                                                                    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl mx-auto bg-white p-6 rounded-xl border border-primary-100 shadow-sm">
                                                                        <div className="flex justify-between items-center mb-2">
                                                                            <h4 className="font-bold text-gray-800">Add Grade for {student.username}</h4>
                                                                            <button type="button" onClick={() => setEditingGrade(null)}>
                                                                                <X className="h-5 w-5 text-gray-400 hover:text-red-500" />
                                                                            </button>
                                                                        </div>
                                                                        <div className="grid grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Assignment Name</label>
                                                                                <input required type="text" className="w-full rounded-lg border-gray-200 p-2 focus:ring-primary-500" value={gradeData.assignment} onChange={e => setGradeData({...gradeData, assignment: e.target.value})} />
                                                                            </div>
                                                                            <div className="grid grid-cols-2 gap-2">
                                                                                <div>
                                                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Grade</label>
                                                                                    <input required type="number" className="w-full rounded-lg border-gray-200 p-2 focus:ring-primary-500" value={gradeData.grade} onChange={e => setGradeData({...gradeData, grade: e.target.value})} />
                                                                                </div>
                                                                                <div>
                                                                                    <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max</label>
                                                                                    <input required type="number" className="w-full rounded-lg border-gray-200 p-2 focus:ring-primary-500" value={gradeData.maxGrade} onChange={e => setGradeData({...gradeData, maxGrade: e.target.value})} />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Feedback</label>
                                                                            <textarea rows="2" className="w-full rounded-lg border-gray-200 p-2 focus:ring-primary-500" value={gradeData.feedback} onChange={e => setGradeData({...gradeData, feedback: e.target.value})}></textarea>
                                                                        </div>
                                                                        <div className="flex justify-end pt-2">
                                                                            <button type="submit" className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
                                                                                <Save className="h-4 w-4" />
                                                                                <span>Save Grade</span>
                                                                            </button>
                                                                        </div>
                                                                    </form>
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </React.Fragment>
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
                                    <Search className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Manage Student Grades</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Select a course to view the roll call and start updating academic performance records.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradesPage;
