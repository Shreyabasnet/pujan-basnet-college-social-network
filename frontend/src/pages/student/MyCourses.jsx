import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import CourseEnrollmentCard from '../../components/student/CourseEnrollmentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const MyCourses = () => {
    const { getMyCourses, loading, error } = useStudent();
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        const data = await getMyCourses();
        setCourses(data);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">My Enrolled Courses</h1>
                <p className="mt-2 text-blue-100">View your active subjects and attendance progress</p>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {Array.isArray(courses) && courses.length === 0 ? (
                <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                    You are not enrolled in any courses yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map(course => (
                        <CourseEnrollmentCard 
                            key={course._id} 
                            course={course} 
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;
