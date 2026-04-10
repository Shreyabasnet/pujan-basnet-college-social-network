import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseCard = ({ course }) => {
    const navigate = useNavigate();
    if (!course) return null;

    const formatSchedule = (schedule) => {
        if (!schedule) return 'Schedule not set';
        if (typeof schedule === 'string') return schedule;

        const day = schedule.day || '';
        const startTime = schedule.startTime || '';
        const endTime = schedule.endTime || '';
        const room = schedule.room || '';

        const timeText = startTime && endTime ? `${startTime} - ${endTime}` : '';
        const primaryText = [day, timeText].filter(Boolean).join(' | ');
        if (!primaryText && !room) return 'Schedule not set';

        return room ? `${primaryText || 'Time TBD'} (${room})` : primaryText;
    };

    return (
        <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="flex h-24 items-center justify-between bg-gradient-to-r from-primary-600 to-cyan-600 px-5 text-white">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Course</p>
                    <span className="text-2xl font-black">{course.code}</span>
                </div>
                <span className="text-4xl">📘</span>
            </div>
            <div className="p-5">
                <div className="mb-2 flex items-start justify-between gap-3">
                    <h3 className="line-clamp-1 text-lg font-black text-slate-900">
                        {course.name}
                    </h3>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="mr-2">👥</span>
                        {course.studentsEnrolled || 0} Students Enrolled
                    </div>
                    <div className="flex items-center text-sm text-slate-600">
                        <span className="mr-2">🕒</span>
                        {formatSchedule(course.schedule)}
                    </div>
                </div>

                <div className="mb-4 h-2 w-full rounded-full bg-slate-100">
                    <div
                        className="h-2 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500"
                        style={{ width: `${course.progress || 0}%` }}
                    ></div>
                </div>

                <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500">Progress: {course.progress || 0}%</span>
                    <button
                        onClick={() => navigate(`/teacher/courses/${course._id}`)}
                        className="font-semibold text-primary-600 transition hover:text-primary-800"
                    >
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
