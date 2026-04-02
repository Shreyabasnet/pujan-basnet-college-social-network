import React from 'react';
import { Activity, AlertCircle, Info } from 'lucide-react';

const LogsPage = () => {
    // Mock logs
    const logs = [
        { id: 1, type: 'info', user: 'admin', action: 'Login success', time: '2026-03-26 11:20:45' },
        { id: 2, type: 'warning', user: 'teacher1', action: 'Multiple failed login attempts', time: '2026-03-26 11:15:22' },
        { id: 3, type: 'error', user: 'system', action: 'Database connection timeout', time: '2026-03-26 10:45:01' },
        { id: 4, type: 'info', user: 'admin', action: 'Updated course CS101', time: '2026-03-26 10:12:33' },
    ];

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">System Logs</h1>
            
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-gray-600">
                        <Activity className="h-5 w-5" />
                        <span className="font-medium">Live Activity Stream</span>
                    </div>
                    <button className="text-sm text-blue-600 hover:underline">Download CSV</button>
                </div>
                <div className="divide-y divide-gray-100">
                    {logs.map(log => (
                        <div key={log.id} className="p-4 flex items-start space-x-4 hover:bg-gray-50 transition">
                            {log.type === 'error' ? (
                                <AlertCircle className="h-5 w-5 text-red-500 mt-1" />
                            ) : log.type === 'warning' ? (
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-1" />
                            ) : (
                                <Info className="h-5 w-5 text-blue-500 mt-1" />
                            )}
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <p className="text-sm font-medium text-gray-900">{log.action}</p>
                                    <span className="text-xs text-gray-400">{log.time}</span>
                                </div>
                                <p className="text-xs text-gray-500">Triggered by: {log.user}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LogsPage;
