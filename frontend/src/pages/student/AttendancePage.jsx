import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AttendancePage = () => {
    const { getMyAttendance, loading, error } = useStudent();
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        const data = await getMyAttendance();
        setAttendance(data || []);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Attendance Records</h1>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {attendance.length === 0 ? (
                            <tr>
                                <td colSpan="3" className="px-6 py-4 text-center text-gray-500">No attendance records found.</td>
                            </tr>
                        ) : (
                            attendance.map((record, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        {new Date(record.date).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {record.course?.name || 'Unknown Course'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            record.status === 'present' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendancePage;
