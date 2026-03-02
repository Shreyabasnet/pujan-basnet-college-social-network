import React from 'react';
import { Trash2 } from 'lucide-react';

const AdminUserTable = ({ data, activeTab, handleDelete, loading }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-gray-50 border-b">
                    <tr>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Username
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider">
                            Email
                        </th>
                        <th className="px-6 py-3 text-sm font-semibold text-gray-600 uppercase tracking-wider text-right">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {data.map((item) => (
                        <tr key={item._id} className="hover:bg-gray-50 transition">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{item.username}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-gray-600">{item.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                <button onClick={() => handleDelete(item._id)} className="text-red-600 hover:text-red-800 transition">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {loading && (
                <div className="p-12 flex justify-center italic text-gray-400">Loading {activeTab}...</div>
            )}
            {!loading && data.length === 0 && (
                <div className="p-12 text-center text-gray-400">No {activeTab} found.</div>
            )}
        </div>
    );
};

export default AdminUserTable;
