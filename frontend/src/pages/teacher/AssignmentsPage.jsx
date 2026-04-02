import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import * as LucideIcons from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AssignmentsPage = () => {
    const { getMyCourses, getAssignments, createAssignment, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [assignments, setAssignments] = useState([]);
    const [fetchingAssignments, setFetchingAssignments] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxPoints: 100
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
        setFetchingAssignments(true);
        try {
            const data = await getAssignments(course._id);
            setAssignments(data);
        } catch (err) {
            toast.error("Failed to fetch assignments");
        } finally {
            setFetchingAssignments(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createAssignment({
                ...formData,
                courseId: selectedCourse._id
            });
            toast.success("Assignment created!");
            setShowModal(false);
            setFormData({ title: '', description: '', dueDate: '', maxPoints: 100 });
            handleCourseSelect(selectedCourse); // Refresh
        } catch (err) {
            toast.error("Failed to create assignment");
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <LucideIcons.Clipboard className="mr-3 h-8 w-8 text-primary-600" />
                        Assignments
                    </h1>
                    {selectedCourse && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition shadow-md flex items-center"
                        >
                            <LucideIcons.Plus className="h-5 w-5 mr-2" />
                            New Assignment
                        </button>
                    )}
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

                    {/* Assignments List */}
                    <div className="lg:col-span-3">
                        {selectedCourse ? (
                            <div className="space-y-4">
                                {fetchingAssignments ? (
                                    <div className="bg-white p-12 text-center rounded-2xl border border-gray-100">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <>
                                        {assignments.length > 0 ? (
                                            assignments.map(assignment => (
                                                <div key={assignment._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div>
                                                            <h3 className="text-xl font-bold text-gray-900">{assignment.title}</h3>
                                                            <div className="flex items-center text-sm text-gray-500 mt-1">
                                                                <span className="bg-primary-50 text-primary-600 px-2 py-0.5 rounded text-xs font-bold uppercase mr-3">
                                                                    {assignment.maxPoints} Points
                                                                </span>
                                                                <LucideIcons.Clock className="h-4 w-4 mr-1.5" />
                                                                Due {new Date(assignment.dueDate).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                        <button className="text-gray-400 hover:text-red-500 transition p-2">
                                                            <LucideIcons.Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                                                        {assignment.description}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                        <div className="flex items-center text-gray-400 text-sm">
                                                            <LucideIcons.Users className="h-4 w-4 mr-1.5" />
                                                            0 Submissions
                                                        </div>
                                                        <button className="text-primary-600 font-bold text-sm hover:underline">
                                                            View Submissions →
                                                        </button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                                <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <LucideIcons.Clipboard className="h-10 w-10" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">No assignments yet</h3>
                                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Create your first assignment for this course to start tracking student progress.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <LucideIcons.ArrowRight className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Academic Assignments</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Select a course to manage and create assignments for your students.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">New Assignment for {selectedCourse?.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <LucideIcons.X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Title</label>
                                <input required type="text" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} placeholder="e.g. Modern Physics Quiz" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Description</label>
                                <textarea required rows="4" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Describe the assignment requirements..."></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide flex items-center">
                                        <LucideIcons.Calendar className="h-4 w-4 mr-2" />
                                        Due Date
                                    </label>
                                    <input required type="date" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Max Points</label>
                                    <input required type="number" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={formData.maxPoints} onChange={e => setFormData({...formData, maxPoints: e.target.value})} />
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                                    Create Assignment
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage;
