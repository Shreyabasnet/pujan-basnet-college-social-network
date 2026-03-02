import React from 'react';

const Timetable = ({ classes = [], compact = false }) => {
    return (
        <div className="space-y-4">
            {classes.length > 0 ? (
                classes.map((cls, index) => (
                    <div
                        key={index}
                        className={`flex items-center p-3 rounded-lg border border-gray-100 ${compact ? 'bg-white' : 'bg-gray-50'
                            } hover:border-indigo-200 transition-colors`}
                    >
                        <div className="min-w-[70px] flex flex-col items-center justify-center border-r border-gray-200 pr-3 mr-3">
                            <span className="text-sm font-bold text-indigo-600">{cls.startTime}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{cls.duration}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{cls.courseName}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="mr-3">📍 {cls.room}</span>
                                <span>👨‍🏫 {cls.instructor}</span>
                            </div>
                        </div>
                        {!compact && (
                            <div className="ml-2">
                                <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                                    🔔
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <span className="text-3xl block mb-2">🎈</span>
                    <p className="text-sm text-gray-500 italic">Relax! No classes for today.</p>
                </div>
            )}

            {!compact && (
                <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm font-medium hover:border-indigo-300 hover:text-indigo-400 transition-all">
                    + Add Custom Reminder
                </button>
            )}
        </div>
    );
};

export default Timetable;
