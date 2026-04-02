import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import Timetable from '../../components/student/Timetable';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TimetablePage = () => {
    const { getTimetable, loading, error } = useStudent();
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        const data = await getTimetable();
        setTimetable(data || []);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Weekly Timetable</h1>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6">
                <Timetable classes={timetable} />
            </div>
        </div>
    );
};

export default TimetablePage;
