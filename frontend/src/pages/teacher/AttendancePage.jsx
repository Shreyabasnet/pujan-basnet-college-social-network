import React, { useState, useEffect } from 'react';
import { useTeacher } from '../../hooks/useTeacher';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Alert from '../../components/common/Alert';
import teacherService from '../../services/teacher.service';
import { UserCheck, Calendar as CalendarIcon, Save, ChevronRight, Check, X, GraduationCap, TrendingUp, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const AttendancePage = () => {
    const { getMyCourses, markAttendance, loading, error } = useTeacher();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({});
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [fetchingStudents, setFetchingStudents] = useState(false);

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

    const handleCourseSelect = async (course) => {
        setSelectedCourse(course);
        setFetchingStudents(true);
        try {
            const res = await teacherService.getCourseStudents(course._id);
            setStudents(res.data.data);
            // Initialize attendance as all present
            const initialAttendance = {};
            res.data.data.forEach(student => {
                initialAttendance[student._id] = 'present';
            });
            setAttendance(initialAttendance);
        } catch (err) {
            toast.error("Failed to fetch students");
        } finally {
            setFetchingStudents(false);
        }
    };

    const toggleStatus = (studentId) => {
        setAttendance(prev => ({
            ...prev,
            [studentId]: prev[studentId] === 'present' ? 'absent' : 'present'
        }));
    };

    const handleSave = async () => {
        try {
            const promises = Object.entries(attendance).map(([studentId, status]) => 
                markAttendance({
                    courseId: selectedCourse._id,
                    studentId,
                    date,
                    status
                })
            );
            await Promise.all(promises);
            toast.success("Attendance saved successfully!");
        } catch (err) {
            toast.error("Failed to save some attendance records");
        }
    };

    if (loading && courses.length === 0) return <LoadingSpinner />;

    const selectedCourseStudents = students.length;
    const presentCount = Object.values(attendance).filter(status => status === 'present').length;

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <GraduationCap className="h-4 w-4" />
                            Attendance
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Attendance management</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            Mark roll call in the same dashboard style as the rest of the teacher area.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <HeroStat icon={<Users className="h-4 w-4" />} label="Students" value={selectedCourseStudents} />
                        <HeroStat icon={<TrendingUp className="h-4 w-4" />} label="Present" value={presentCount} />
                    </div>
                </div>
            </section>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] lg:col-span-1">
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Courses</p>
                            <h2 className="mt-1 text-lg font-black text-slate-900">Select course</h2>
                        </div>
                        <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                            {courses.length}
                        </div>
                    </div>
                    <div className="space-y-2">
                        {courses.map(course => (
                            <button
                                key={course._id}
                                onClick={() => handleCourseSelect(course)}
                                className={`w-full rounded-[1.25rem] border p-4 text-left transition hover:-translate-y-0.5 ${
                                    selectedCourse?._id === course._id
                                        ? 'border-primary-200 bg-primary-50 shadow-sm'
                                        : 'border-slate-200 bg-slate-50/70 hover:border-primary-200 hover:bg-primary-50/60'
                                }`}
                            >
                                <h3 className={`font-bold ${selectedCourse?._id === course._id ? 'text-primary-700' : 'text-slate-900'}`}>
                                    {course.name}
                                </h3>
                                <p className="mt-1 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{course.code}</p>
                            </button>
                        ))}
                    </div>
                </section>

                <div className="lg:col-span-3 space-y-6">
                    {selectedCourse ? (
                        <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                            <div className="flex flex-col gap-4 border-b border-slate-100 p-6 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="rounded-2xl bg-primary-50 p-3 text-primary-600">
                                        <CalendarIcon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Selected course</p>
                                        <h3 className="mt-1 text-xl font-black text-slate-900">{selectedCourse.name}</h3>
                                        <p className="text-sm text-slate-500">{selectedCourse.code}</p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <input
                                        type="date"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-900 shadow-sm focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-200"
                                    />
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        <Save className="h-4 w-4" />
                                        <span>Save Attendance</span>
                                    </button>
                                </div>
                            </div>

                            {fetchingStudents ? (
                                <div className="p-12 text-center">
                                    <LoadingSpinner />
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Student Name</th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Department</th>
                                                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-slate-400 text-right">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {students.map(student => (
                                                <tr key={student._id} className="transition hover:bg-slate-50/70">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={student.profilePicture || `https://ui-avatars.com/api/?name=${student.username}&background=random`}
                                                                className="mr-3 h-9 w-9 rounded-full border border-slate-100"
                                                                alt=""
                                                            />
                                                            <span className="font-semibold text-slate-900">{student.username}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                                                        {student.department || 'N/A'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                                        <button
                                                            onClick={() => toggleStatus(student._id)}
                                                            className={`ml-auto inline-flex items-center rounded-full px-4 py-1.5 text-sm font-bold transition ${
                                                                attendance[student._id] === 'present'
                                                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                                                    : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                                                            }`}
                                                        >
                                                            {attendance[student._id] === 'present' ? (
                                                                <><Check className="mr-1.5 h-4 w-4" /> Present</>
                                                            ) : (
                                                                <><X className="mr-1.5 h-4 w-4" /> Absent</>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {students.length === 0 && (
                                        <div className="p-16 text-center text-slate-500 italic">
                                            No students enrolled in this course.
                                        </div>
                                    )}
                                </div>
                            )}
                        </section>
                    ) : (
                        <section className="rounded-[1.75rem] border border-slate-200 bg-white p-20 text-center shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-300">
                                <ChevronRight className="h-10 w-10" />
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-slate-900">Ready to mark attendance?</h3>
                            <p className="mx-auto max-w-sm font-medium text-slate-500">Please select a course from the sidebar to view the roll call and start marking attendance records.</p>
                        </section>
                    )}
                </div>
            </div>
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

export default AttendancePage;
