import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { CalendarDays, GraduationCap, TrendingUp } from 'lucide-react';

const AttendancePage = () => {
    const { getMyAttendance, loading, error } = useStudent();
    const [attendance, setAttendance] = useState([]);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        const data = await getMyAttendance();
        setAttendance(data || []);
    };

    if (loading) return <LoadingSpinner />;

    const totalRecords = attendance.length;
    const presentRecords = attendance.filter(record => record.status === 'present').length;
    const attendanceRate = totalRecords ? Math.round((presentRecords / totalRecords) * 100) : 0;

    return (
        <div className="space-y-6">
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary-600 via-cyan-600 to-sky-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-end">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <GraduationCap className="h-4 w-4" />
                            Attendance
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Attendance records</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            A dashboard-style view of your attendance history with the same visual treatment as the rest of the student area.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <HeroStat icon={<CalendarDays className="h-4 w-4" />} label="Records" value={totalRecords} />
                        <HeroStat icon={<TrendingUp className="h-4 w-4" />} label="Present" value={`${attendanceRate}%`} />
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
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Records</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">Attendance log</h2>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                        {totalRecords} entries
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Course</th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {attendance.length === 0 ? (
                                    <tr>
                                        <td colSpan="3" className="px-6 py-10 text-center text-slate-500">No attendance records found.</td>
                                    </tr>
                                ) : (
                                    attendance.map((record, index) => (
                                        <tr key={index} className="transition hover:bg-slate-50/80">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                                                {new Date(record.date).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                                                {record.course?.name || 'Unknown Course'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                                                    record.status === 'present' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
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

export default AttendancePage;
