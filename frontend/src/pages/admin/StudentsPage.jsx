import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminUserTable from '../../components/admin/AdminUserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const StudentsPage = () => {
    const { getStudents, deleteUser, loading, error } = useAdmin();
    const [students, setStudents] = useState([]);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        const data = await getStudents();
        setStudents(data || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            const success = await deleteUser(id);
            if (success) {
                fetchStudents();
            }
        }
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

            <div className="bg-white rounded-lg shadow">
                <AdminUserTable 
                    data={students} 
                    handleDelete={handleDelete}
                    activeTab="student"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default StudentsPage;
