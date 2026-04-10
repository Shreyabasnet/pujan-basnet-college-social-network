import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseEnrollmentCard = ({ course }) => {
    const navigate = useNavigate();
    if (!course) return null;

    return (
        <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-center space-x-3">
                    <div className="rounded-2xl bg-primary-50 p-3 text-primary-600">
                        <span className="text-xl">🎓</span>
                    </div>
                    <div>
                        <h3 className="line-clamp-1 font-black text-slate-900">{course.name}</h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{course.code}</p>
                    </div>
                </div>
                <div className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Active
                </div>
            </div>

            <div className="mb-4 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Instructor</span>
                    <span className="font-medium text-slate-900">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Credits</span>
                    <span className="font-medium text-slate-900">{course.credits}</span>
                </div>
                <div>
                    <div className="mb-1 flex justify-between text-xs">
                        <span className="text-slate-500">Attendance</span>
                        <span className="font-semibold text-primary-600">{course.attendance}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-100">
                        <div
                            className="h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-cyan-500"
                            style={{ width: `${course.attendance}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <button
                onClick={() => navigate(`/student/courses/${course._id}`, { state: { course } })}
                className="w-full rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:from-primary-700 hover:to-cyan-700"
            >
                Go to Course
            </button>
        </div>
    );
};

export default CourseEnrollmentCard;
