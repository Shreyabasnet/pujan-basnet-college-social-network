import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import GradeView from '../../components/student/GradeView';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const GradesPage = () => {
    const { getMyGrades, loading, error } = useStudent();
    const [grades, setGrades] = useState([]);

    useEffect(() => {
        fetchGrades();
    }, []);

    const fetchGrades = async () => {
        const data = await getMyGrades();
        setGrades(data || []);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">My Grades</h1>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <GradeView grades={grades} />
            </div>
        </div>
    );
};

export default GradesPage;
