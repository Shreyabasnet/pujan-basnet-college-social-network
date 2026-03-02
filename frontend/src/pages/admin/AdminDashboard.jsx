import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Plus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminUserTable from '../../components/admin/AdminUserTable';
import AdminCourseTable from '../../components/admin/AdminCourseTable';
import CourseModal from '../../components/admin/CourseModal';

const AdminDashboard = () => {
    const {
        getTeachers, getStudents, deleteUser,
        getCourses, createCourse, updateCourse, deleteCourse,
        loading
    } = useAdmin();

    const [activeTab, setActiveTab] = useState('teachers');
    const [data, setData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        let result = [];
        if (activeTab === 'teachers') result = await getTeachers();
        else if (activeTab === 'students') result = await getStudents();
        else if (activeTab === 'courses') result = await getCourses();
        setData(result);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            const success = activeTab === 'courses' ? await deleteCourse(id) : await deleteUser(id);
            if (success) {
                toast.success('Deleted successfully');
                fetchData();
            } else {
                toast.error('Deletion failed');
            }
        }
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ ...item, teacher: item.teacher?._id || item.teacher });
        } else {
            setFormData({});
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeTab === 'courses') {
            const result = editingItem
                ? await updateCourse(editingItem._id, formData)
                : await createCourse(formData);

            if (result) {
                toast.success(editingItem ? 'Updated!' : 'Created!');
                setShowModal(false);
                fetchData();
            } else {
                toast.error('Action failed');
            }
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <Toaster position="top-right" />
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Control Panel</h1>
                <p className="text-gray-600">Manage institutional resources and users.</p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-6 border-b">
                <button
                    onClick={() => setActiveTab('teachers')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'teachers' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Teachers
                </button>
                <button
                    onClick={() => setActiveTab('students')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'students' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Students
                </button>
                <button
                    onClick={() => setActiveTab('courses')}
                    className={`pb-2 px-4 font-medium transition ${activeTab === 'courses' ? 'border-b-2 border-primary-600 text-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Courses
                </button>
            </div>

            {/* Content Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold capitalize">{activeTab} List</h2>
                {activeTab === 'courses' && (
                    <button
                        onClick={() => handleOpenModal()}
                        className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Course
                    </button>
                )}
            </div>

            {/* Main Content */}
            {activeTab === 'courses' ? (
                <AdminCourseTable
                    data={data}
                    handleDelete={handleDelete}
                    handleOpenModal={handleOpenModal}
                    loading={loading}
                />
            ) : (
                <AdminUserTable
                    data={data}
                    activeTab={activeTab}
                    handleDelete={handleDelete}
                    loading={loading}
                />
            )}

            {/* Modal */}
            <CourseModal
                showModal={showModal}
                setShowModal={setShowModal}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
            />
        </div>
    );
};

export default AdminDashboard;
