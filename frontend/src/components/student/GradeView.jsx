import React from 'react';

const GradeView = ({ grades = [] }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assessment</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {grades.length > 0 ? (
                        grades.map((grade, index) => (
                            <tr key={index} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{grade.course?.name || 'N/A'}</div>
                                    <div className="text-xs text-gray-500">{grade.course?.code || ''}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-600">{grade.assignment}</div>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className="text-lg font-bold text-indigo-600">{grade.grade}</span>
                                    <span className="text-xs text-gray-400 ml-1">/{grade.maxGrade}</span>
                                </td>
                                <td className="px-4 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                                        grade.grade >= (grade.maxGrade / 2) ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {grade.grade >= (grade.maxGrade / 2) ? 'Passed' : 'Failed'}
                                    </span>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="4" className="px-4 py-10 text-center text-gray-400 italic">
                                No recent grades available.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default GradeView;
