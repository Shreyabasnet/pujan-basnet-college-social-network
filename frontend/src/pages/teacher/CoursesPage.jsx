import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTeacher } from '../../hooks/useTeacher';
import CourseCard from '../../components/teacher/CourseCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import { ArrowLeft, BookOpen, Clock, Filter, GraduationCap, Search, TrendingUp, Users } from 'lucide-react';

const CoursesPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMyCourses, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchCourses();
    }, []);

    const fetchCourses = async () => {
        try {
            const data = await getMyCourses();
            const safeData = Array.isArray(data) ? data : [];
            setCourses(safeData);

            if (id) {
                const course = safeData.find((courseItem) => courseItem._id === id);
                setSelectedCourse(course || null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const filteredCourses = courses.filter((course) =>
        course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalCourses = courses.length;
    const totalStudents = courses.reduce((sum, course) => sum + (course.studentsEnrolled || 0), 0);
    const averageStudents = totalCourses ? Math.round(totalStudents / totalCourses) : 0;

    if (loading && courses.length === 0) return <LoadingSpinner />;

    if (id && selectedCourse) {
        return (
            <div className="space-y-6">
                <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                    <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                                <GraduationCap className="h-4 w-4" />
                                Course details
                            </span>
                            <h1 className="text-3xl font-black tracking-tight sm:text-4xl">{selectedCourse.name}</h1>
                            <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                                View course information, enrolled students, and schedule details in the same dashboard style.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/teacher/courses')}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to courses
                        </button>
                    </div>
                </section>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <MetricCard label="Code" value={selectedCourse.code} icon={<BookOpen className="h-5 w-5" />} />
                    <MetricCard label="Students" value={selectedCourse.studentsEnrolled || 0} icon={<Users className="h-5 w-5" />} />
                    <MetricCard label="Credits" value={selectedCourse.credits || 'N/A'} icon={<Clock className="h-5 w-5" />} />
                </div>

                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                    <div className="mb-5 flex flex-wrap gap-3 border-b border-slate-100 pb-4">
                        {['overview', 'schedule', 'students'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${activeTab === tab ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'overview' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold text-slate-900">About this course</h3>
                            <p className="text-sm leading-7 text-slate-600">{selectedCourse.description || 'No description available'}</p>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Department</p>
                                    <p className="mt-1 font-semibold text-slate-900">{selectedCourse.department || 'N/A'}</p>
                                </div>
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <p className="text-sm text-slate-500">Semester</p>
                                    <p className="mt-1 font-semibold text-slate-900">{selectedCourse.semester || 'N/A'}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'schedule' && (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm italic text-slate-500">
                            <Clock className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                            Schedule not configured yet
                        </div>
                    )}

                    {activeTab === 'students' && (
                        <div>
                            {selectedCourse.students && selectedCourse.students.length > 0 ? (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-bold text-slate-900">Enrolled students ({selectedCourse.students.length})</h3>
                                    <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                                        <table className="w-full">
                                            <thead className="bg-slate-50 border-b border-slate-200">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Name</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Username</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Email</th>
                                                    <th className="px-6 py-3 text-left text-sm font-semibold text-slate-700">Department</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {selectedCourse.students.map((student, index) => (
                                                    <tr key={index} className="border-b border-slate-100 transition hover:bg-slate-50/70">
                                                        <td className="px-6 py-4">
                                                            <div className="flex items-center space-x-3">
                                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-primary-500 to-cyan-500 text-sm font-bold text-white">
                                                                    {student.username?.charAt(0).toUpperCase() || 'S'}
                                                                </div>
                                                                <span className="font-medium text-slate-900">{student.fullName || 'N/A'}</span>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-slate-600">{student.username || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-slate-600">{student.email || 'N/A'}</td>
                                                        <td className="px-6 py-4 text-slate-600">{student.department || 'N/A'}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center text-sm text-slate-500">
                                    <Users className="mx-auto mb-3 h-12 w-12 text-slate-300" />
                                    No students enrolled
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <GraduationCap className="h-4 w-4" />
                            My courses
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">My Courses</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            Manage and view all your assigned academic courses in the same elevated dashboard style.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <HeroStat icon={<BookOpen className="h-4 w-4" />} label="Courses" value={totalCourses} />
                        <HeroStat icon={<TrendingUp className="h-4 w-4" />} label="Avg. students" value={averageStudents} />
                    </div>
                </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Overview</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">Course management</h2>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                        {filteredCourses.length} visible
                    </div>
                </div>

                <div className="mb-8 flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4 md:flex-row md:items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search by course name or code..."
                            className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-slate-900 outline-none transition focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-primary-200 hover:text-primary-700">
                        <Filter className="h-5 w-5" />
                        <span>Filter Status</span>
                    </button>
                </div>

                {error && <Alert type="error" message={error} className="mb-6" />}

                {filteredCourses.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredCourses.map((course) => (
                            <CourseCard key={course._id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                            <BookOpen className="h-10 w-10" />
                        </div>
                        <h3 className="mb-2 text-xl font-bold text-slate-900">No courses found</h3>
                        <p className="mx-auto max-w-sm text-slate-500">
                            We couldn't find any courses matching your search criteria or assigned to you yet.
                        </p>
                    </div>
                )}
            </section>
        </div>
    );
};

const HeroStat = ({ icon, label, value }) => (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur">
        <div className="flex items-center gap-2 text-white/70">
            {icon}
            <span className="text-xs font-semibold uppercase tracking-[0.18em]">{label}</span>
        </div>
        <p className="mt-3 text-2xl font-black">{value}</p>
    </div>
);

const MetricCard = ({ label, value, icon }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
                {icon}
            </div>
        </div>
    </div>
);

export default CoursesPage;
