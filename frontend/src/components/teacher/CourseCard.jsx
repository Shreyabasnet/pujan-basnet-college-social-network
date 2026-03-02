import React from 'react';

const CourseCard = ({ course }) => {
    if (!course) return null;

    return (
        <div className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow bg-white">
            <div className="h-24 bg-indigo-600 flex items-center justify-center text-white">
                <span className="text-4xl">📘</span>
            </div>
            <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg text-gray-800 line-clamp-1">
                        {course.name}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">
                        {course.code}
                    </span>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">👥</span>
                        {course.studentsEnrolled || 0} Students Enrolled
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="mr-2">🕒</span>
                        {course.schedule || 'Schedule not set'}
                    </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                    <div
                        className="bg-indigo-500 h-2 rounded-full"
                        style={{ width: `${course.progress || 0}%` }}
                    ></div>
                </div>

                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">Progress: {course.progress || 0}%</span>
                    <button className="text-indigo-600 font-semibold hover:text-indigo-800">
                        View Details →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourseCard;
