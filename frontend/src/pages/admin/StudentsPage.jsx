import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminUserTable from '../../components/admin/AdminUserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { X } from 'lucide-react';
import adminService from '../../services/admin.service';

const StudentsPage = () => {
    const { getStudents, deleteUser, updateUser, loading, error } = useAdmin();
    const [students, setStudents] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingStudent, setEditingStudent] = useState(null);
    const [formData, setFormData] = useState({ username: '', email: '' });
    const [classSections, setClassSections] = useState([]);
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedClassId, setSelectedClassId] = useState('');
    const [assignMessage, setAssignMessage] = useState('');

    useEffect(() => {
        fetchStudents();
        fetchClasses();
    }, []);

    const fetchStudents = async () => {
        const data = await getStudents();
        setStudents(data || []);
        if ((data || []).length > 0 && !selectedStudentId) {
            setSelectedStudentId(data[0]._id);
        }
    };

    const fetchClasses = async () => {
        try {
            const res = await adminService.getClassSections();
            const classes = res.data?.data || [];
            setClassSections(classes);
            if (classes.length > 0 && !selectedClassId) {
                setSelectedClassId(classes[0]._id);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleAssignClass = async () => {
        if (!selectedStudentId || !selectedClassId) {
            setAssignMessage('Select both student and class');
            return;
        }

        try {
            await adminService.assignStudentClass(selectedStudentId, selectedClassId);
            setAssignMessage('Student assigned to class successfully');
            fetchStudents();
        } catch (err) {
            setAssignMessage(err.response?.data?.message || 'Failed to assign class');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            const success = await deleteUser(id);
            if (success) {
                fetchStudents();
            }
        }
    };

    const handleEdit = (student) => {
        setEditingStudent(student);
        setFormData({ 
            username: student.username, 
            email: student.email 
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const success = await updateUser(editingStudent._id, formData);
        if (success) {
            setShowEditModal(false);
            fetchStudents();
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    if (loading && students.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Students</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-4 space-y-3">
                <h2 className="text-lg font-semibold text-gray-900">Assign Student to Class</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={selectedStudentId}
                        onChange={(e) => setSelectedStudentId(e.target.value)}
                    >
                        <option value="">Select student</option>
                        {students.map((student) => (
                            <option key={student._id} value={student._id}>{student.username}</option>
                        ))}
                    </select>

                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="">Select class</option>
                        {classSections.map((classItem) => (
                            <option key={classItem._id} value={classItem._id}>
                                {classItem.name} - {classItem.section} ({classItem.academicYear})
                            </option>
                        ))}
                    </select>

                    <button
                        type="button"
                        onClick={handleAssignClass}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-semibold"
                    >
                        Assign
                    </button>
                </div>
                {assignMessage && (
                    <p className="text-sm text-gray-600">{assignMessage}</p>
                )}
            </div>

            <div className="bg-white rounded-lg shadow">
                <AdminUserTable 
                    data={students} 
                    handleDelete={handleDelete}
                    handleEdit={handleEdit}
                    activeTab="student"
                    loading={loading}
                />
            </div>

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold text-gray-900">Edit Student</h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Username
                                </label>
                                <input
                                    type="text"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex gap-3 justify-end pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;
