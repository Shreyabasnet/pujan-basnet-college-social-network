import React from 'react';
import { Link } from 'react-router-dom';

const ScheduleView = ({ schedule = [] }) => {
    return (
        <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
            <h2 className="mb-4 flex items-center text-lg font-bold text-slate-900">
                <span className="mr-2">📅</span> Today's Schedule
            </h2>

            <div className="space-y-4">
                {schedule.length > 0 ? (
                    schedule.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center rounded-2xl border border-slate-100 bg-slate-50 p-3"
                        >
                            <div className="min-w-[80px]">
                                <p className="text-sm font-bold text-slate-900">{item.time}</p>
                            </div>
                            <div className="ml-4 border-l border-slate-200 pl-4">
                                <p className="font-semibold text-slate-900">{item.courseName}</p>
                                <p className="text-sm text-slate-500">{item.room || 'Online'}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-6 text-center text-sm italic text-slate-500">
                        No classes scheduled for today.
                    </div>
                )}
            </div>

            <Link
                to="/teacher/schedule"
                className="mt-6 block w-full text-center text-sm font-semibold text-primary-600 transition hover:text-primary-800"
            >
                View Full Calendar →
            </Link>
        </div>
    );
};

export default ScheduleView;
