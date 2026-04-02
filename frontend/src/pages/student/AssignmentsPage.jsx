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
            <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
            
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
                                        <ClipboardList className="h-5 w-5 text-primary-600" />
                                        <h3 className="text-lg font-bold">{assignment.title}</h3>
                                    </div>
                                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                                    <div className="flex items-center space-x-4 text-sm">
                                        <span className="flex items-center text-gray-500">
                                            <Clock className="h-4 w-4 mr-1" />
                                            Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                        </span>
                                        <span className="text-gray-500">
                                            Course: {assignment.course?.title}
                                        </span>
                                    </div>
                                </div>
                                <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition">
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
