import React from 'react';
import { Link } from 'react-router-dom';

const ScheduleView = ({ schedule = [] }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
                <span className="mr-2">📅</span> Today's Schedule
            </h2>

            <div className="space-y-4">
                {schedule.length > 0 ? (
                    schedule.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center p-3 border-l-4 border-indigo-500 bg-gray-50 rounded-r-lg"
                        >
                            <div className="min-w-[80px]">
                                <p className="text-sm font-bold text-gray-800">{item.time}</p>
                            </div>
                            <div className="ml-4 border-l pl-4 border-gray-300">
                                <p className="font-semibold text-gray-800">{item.courseName}</p>
                                <p className="text-sm text-gray-500">{item.room || 'Online'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-500 italic">
                        No classes scheduled for today.
                    </div>
                )}
            </div>

            <Link
                to="/teacher/schedule"
                className="block text-center w-full mt-6 text-sm text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
            >
                View Full Calendar →
            </Link>
        </div>
    );
};

export default ScheduleView;
