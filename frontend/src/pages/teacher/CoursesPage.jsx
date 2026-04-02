import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import CourseCard from '../../components/teacher/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { BookOpen, Search, Filter } from 'lucide-react';

const CoursesPage = () => {
    const { getMyCourses, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            setCourses(data);
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = courses.filter(course =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && courses.length === 0) return <LoadingSpinner />;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                            <BookOpen className="mr-3 h-8 w-8 text-primary-600" />
                            My Courses
                        </h1>
                        <p className="text-gray-500 mt-1 text-lg">Manage and view all your assigned academic courses</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code..."
                            className="pl-10 pr-4 py-2.5 w-full bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 transition"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="flex items-center space-x-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition text-gray-600 font-medium whitespace-nowrap">
                        <Filter className="h-5 w-5" />
                        <span>Filter Status</span>
                    </button>
                </div>

                {error && <Alert type="error" message={error} className="mb-6" />}

                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-16 text-center">
                        <div className="h-20 w-20 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">No courses found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">We couldn't find any courses matching your search criteria or assigned to you yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoursesPage;
