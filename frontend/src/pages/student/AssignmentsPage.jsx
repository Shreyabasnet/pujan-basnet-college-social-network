import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { ClipboardList, Clock } from 'lucide-react';

const AssignmentsPage = () => {
    const { getAssignments, loading, error } = useStudent();
    const [assignments, setAssignments] = useState([]);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        const data = await getAssignments();
        setAssignments(data || []);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Assignments</h1>
                <p className="mt-2 text-blue-100">Track pending work and deadlines</p>
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                {assignments.length === 0 ? (
                    <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No assignments found.
                    </div>
                ) : (
                    assignments.map(assignment => (
                        <div key={assignment._id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center space-x-2 mb-2">
                                        <ClipboardList className="h-5 w-5 text-blue-600" />
                                        <h3 className="text-lg font-bold">{assignment.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="flex items-center text-gray-500">
                                            <Clock className="h-4 w-4 mr-1" />
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-500">
                                            Course: {assignment.course?.name || assignment.course?.title || 'N/A'}
                                        </span>
                                    </div>
                                </div>
                                <button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg transition">
                                    Submit
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AssignmentsPage;
