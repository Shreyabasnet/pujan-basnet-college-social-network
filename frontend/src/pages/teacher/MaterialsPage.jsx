import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import teacherService from '../../services/teacher.service';
import { Folder, Upload, FileText, Trash2, Plus, Download, X, Paperclip } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const MaterialsPage = () => {
    const { getMyCourses, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [fetchingMaterials, setFetchingMaterials] = useState(false);
    const [showModal, setShowModal] = useState(false);
    
    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);

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
        setFetchingMaterials(true);
        try {
            const res = await teacherService.getMaterials(course._id);
            setMaterials(res.data.data);
        } catch (err) {
            toast.error("Failed to fetch materials");
        } finally {
            setFetchingMaterials(false);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return toast.error("Please select a file");

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('courseId', selectedCourse._id);
        formData.append('file', file);

        try {
            await teacherService.uploadMaterial(formData);
            toast.success("Material uploaded!");
            setShowModal(false);
            setTitle(''); setDescription(''); setFile(null);
            handleCourseSelect(selectedCourse); // Refresh
        } catch (err) {
            toast.error("Failed to upload material");
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                        <Folder className="mr-3 h-8 w-8 text-primary-600" />
                        Study Materials
                    </h1>
                    {selectedCourse && (
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-primary-600 text-white px-5 py-2.5 rounded-xl hover:bg-primary-700 transition shadow-md flex items-center"
                        >
                            <Upload className="h-5 w-5 mr-2" />
                            Upload Material
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

                    {/* Materials Grid */}
                    <div className="lg:col-span-3">
                        {selectedCourse ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {fetchingMaterials ? (
                                    <div className="col-span-2 bg-white p-12 text-center rounded-2xl border border-gray-100">
                                        <LoadingSpinner />
                                    </div>
                                ) : (
                                    <>
                                        {materials.length > 0 ? (
                                            materials.map(material => (
                                                <div key={material._id} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition flex items-start group">
                                                    <div className="bg-primary-50 p-3 rounded-xl mr-4 group-hover:bg-primary-100 transition">
                                                        <FileText className="h-6 w-6 text-primary-600" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-bold text-gray-900 truncate">{material.title}</h3>
                                                        <p className="text-xs text-gray-500 mt-1 uppercase font-bold tracking-wider">{material.fileType || 'FILE'}</p>
                                                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{material.description}</p>
                                                        <div className="mt-4 flex items-center justify-between">
                                                            <span className="text-xs text-gray-400">{new Date(material.createdAt).toLocaleDateString()}</span>
                                                            <div className="flex space-x-2">
                                                                <a
                                                                    href={`http://localhost:5000${material.fileUrl}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1.5 text-gray-400 hover:text-primary-600 transition"
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </a>
                                                                <button className="p-1.5 text-gray-400 hover:text-red-500 transition">
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                                <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                                    <Folder className="h-10 w-10" />
                                                </div>
                                                <h3 className="text-xl font-bold text-gray-900 mb-2">No materials uploaded</h3>
                                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Be the first to share study resources, lecture notes, or reference materials for this course.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-20 text-center">
                                <div className="h-20 w-20 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <Plus className="h-10 w-10" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Educational Resources</h3>
                                <p className="text-gray-500 max-w-sm mx-auto font-medium">Select a course to manage and share educational documents with your students.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Upload to {selectedCourse?.name}</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleUpload} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Document Title</label>
                                <input required type="text" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Week 4 Lecture Notes" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Brief Description</label>
                                <textarea rows="3" className="w-full rounded-xl border-gray-200 p-3 focus:ring-2 focus:ring-primary-500" value={description} onChange={e => setDescription(e.target.value)} placeholder="What is this document about?"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wide">Select File</label>
                                <div className="relative group">
                                    <input
                                        required
                                        type="file"
                                        onChange={(e) => setFile(e.target.files[0])}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label
                                        htmlFor="file-upload"
                                        className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-8 hover:border-primary-400 hover:bg-primary-50/30 transition cursor-pointer"
                                    >
                                        <Paperclip className="h-8 w-8 text-gray-400 group-hover:text-primary-500 mb-2" />
                                        <span className="text-sm font-bold text-gray-600 group-hover:text-primary-700">
                                            {file ? file.name : 'Click to select a file'}
                                        </span>
                                        <span className="text-xs text-gray-400 mt-1">PDF, DOCX, or Images up to 20MB</span>
                                    </label>
                                </div>
                            </div>
                            <div className="pt-4 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-gray-600 font-bold hover:bg-gray-100 rounded-xl transition">Cancel</button>
                                <button type="submit" className="px-8 py-2.5 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition shadow-lg shadow-primary-200">
                                    Start Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MaterialsPage;
