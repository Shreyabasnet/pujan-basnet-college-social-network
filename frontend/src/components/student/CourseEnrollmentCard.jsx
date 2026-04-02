import React from 'react';
import { useNavigate } from 'react-router-dom';

const CourseEnrollmentCard = ({ course }) => {
    const navigate = useNavigate();
    if (!course) return null;

    return (
        <div className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                        <span className="text-xl">🎓</span>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 line-clamp-1">{course.name}</h3>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{course.code}</p>
                    </div>
                </div>
                <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-semibold">
                    Active
                </div>
            </div>

            <div className="space-y-3 mb-4">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Instructor</span>
                    <span className="text-gray-800 font-medium">{course.instructor}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Credits</span>
                    <span className="text-gray-800 font-medium">{course.credits}</span>
                </div>
                <div>
                    <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-500">Attendance</span>
                        <span className="text-blue-600 font-semibold">{course.attendance}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${course.attendance}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <button 
                onClick={() => navigate('/student/courses')}
                className="w-full py-2 bg-gray-50 text-gray-700 text-sm font-semibold rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
                Go to Course
            </button>
        </div>
    );
};

export default CourseEnrollmentCard;
