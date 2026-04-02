import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const AdminCourseTable = ({ data = [], handleDelete, handleOpenModal, loading }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Code</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Name</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">Teacher</th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {(data || []).map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{item.code}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-600">{item.name}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-600">{item.department || 'N/A'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                                {item.teacher?.username || 'Unassigned'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                                <button onClick={() => handleOpenModal(item)} className="text-blue-600 hover:text-blue-800 transition">
                                    <Edit2 className="w-4 h-4" />
                                </button>
                                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && (
                <div className="p-12 flex justify-center italic text-gray-400">Loading courses...</div>
            )}
            {!loading && data.length === 0 && (
                <div className="p-12 text-center text-gray-400">No courses found.</div>
            )}
        </div>
    );
};

export default AdminCourseTable;
