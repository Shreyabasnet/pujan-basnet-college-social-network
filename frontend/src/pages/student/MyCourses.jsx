import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import CourseEnrollmentCard from '../../components/student/CourseEnrollmentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { BookOpen, GraduationCap, TrendingUp } from 'lucide-react';

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

    const totalCourses = Array.isArray(courses) ? courses.length : 0;
    const averageAttendance = totalCourses
        ? Math.round(
            courses.reduce((sum, course) => sum + (Number(course.attendance) || 0), 0) / totalCourses
        )
        : 0;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary-600 via-cyan-600 to-sky-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <GraduationCap className="h-4 w-4" />
                            My courses
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your enrolled classes</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            Track your subjects, attendance, and course progress in the same visual style as the dashboard.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <HeroStat icon={<BookOpen className="h-4 w-4" />} label="Courses" value={totalCourses} />
                        <HeroStat icon={<TrendingUp className="h-4 w-4" />} label="Avg attendance" value={`${averageAttendance}%`} />
                    </div>
                </div>
            </section>

            {error && (
                <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700 shadow-sm">
                    {error}
                </div>
            )}

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Learning</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">My Courses</h2>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                        {totalCourses} enrolled
                    </div>
                </div>

                {Array.isArray(courses) && courses.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
                        You are not enrolled in any courses yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {courses.map(course => (
                            <CourseEnrollmentCard
                                key={course._id}
                                course={course}
                            />
                        ))}
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

export default MyCourses;
