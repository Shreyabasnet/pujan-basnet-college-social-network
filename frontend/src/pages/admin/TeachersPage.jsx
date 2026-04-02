import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import AdminUserTable from '../../components/admin/AdminUserTable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TeachersPage = () => {
    const { getTeachers, deleteUser, loading, error } = useAdmin();
    const [teachers, setTeachers] = useState([]);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        const data = await getTeachers();
        setTeachers(data || []);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this teacher?')) {
            const success = await deleteUser(id);
            if (success) {
                fetchTeachers();
            }
        }
    };

    if (loading && teachers.length === 0) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">Manage Teachers</h1>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow">
                <AdminUserTable 
                    data={teachers} 
                    handleDelete={handleDelete}
                    activeTab="teacher"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default TeachersPage;
