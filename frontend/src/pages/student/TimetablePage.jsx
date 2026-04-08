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
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Weekly Timetable</h1>
                <p className="mt-2 text-blue-100">Check your daily class schedule and stay on track</p>
            </div>
            
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
