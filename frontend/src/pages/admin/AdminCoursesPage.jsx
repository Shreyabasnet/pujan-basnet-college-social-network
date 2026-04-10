import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminCourseTable from '../../components/admin/AdminCourseTable';
import CourseModal from '../../components/admin/CourseModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Plus } from 'lucide-react';

const AdminCoursesPage = () => {
    const { getCourses, getTeachers, createCourse, updateCourse, deleteCourse, loading, error } = useAdmin();
    const [courses, setCourses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({
        schedule: {}
    });

    useEffect(() => {
        const init = async () => {
            await fetchCourses();
            const teacherData = await getTeachers();
            setTeachers(teacherData || []);
        };
        init();
    }, []);

    const fetchCourses = async () => {
        const data = await getCourses();
        setCourses(data || []);
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ 
                code: item.code || '',
                name: item.name || '',
                department: item.department || '',
                teacher: item.teacher?._id || item.teacher || '',
                description: item.description || '',
                schedule: {
                    day: item.schedule?.day || '',
                    startTime: item.schedule?.startTime || '',
                    endTime: item.schedule?.endTime || '',
                    room: item.schedule?.room || ''
                }
            });
        } else {
            setFormData({
                code: '',
                name: '',
                department: '',
                teacher: '',
                description: '',
                schedule: {
                    day: '',
                    startTime: '',
                    endTime: '',
                    room: ''
                }
            });
        }
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this course?')) {
            const success = await deleteCourse(id);
            if (success) fetchCourses();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = editingItem
            ? await updateCourse(editingItem._id, formData)
            : await createCourse(formData);

        if (result) {
            setShowModal(false);
            fetchCourses();
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage All Courses</h1>
                <button 
                    onClick={() => handleOpenModal()}
                    className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                >
                    <Plus className="h-5 w-5" />
                    <span>Add Course</span>
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <AdminCourseTable 
                    data={courses} 
                    handleOpenModal={handleOpenModal}
                    handleDelete={handleDelete}
                    loading={loading}
                />
            </div>

            <CourseModal 
                showModal={showModal}
                setShowModal={setShowModal}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                teachers={teachers}
            />
        </div>
    );
};

export default AdminCoursesPage;
