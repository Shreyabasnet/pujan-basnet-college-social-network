import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';
import teacherService from '../../services/teacher.service';
import toast, { Toaster } from 'react-hot-toast';
import { API_BASE_URL } from '../../config/constants';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
const formatDay = (day) => day.charAt(0) + day.slice(1).toLowerCase();

const TeacherSchedulePage = () => {
    const [entries, setEntries] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await teacherService.getSchedule();
            setEntries(res.data?.data?.entries || []);
            setDocuments(res.data?.data?.documents || []);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch schedule");
            setLoading(false);
        }
    };

    const periodNumbers = [...new Set(entries.map((entry) => entry.periodNumber))].sort((a, b) => a - b);
    const getEntriesForSlot = (day, period) => entries.filter(
        (item) => item.dayOfWeek === day && item.periodNumber === period
    );

    const resolveFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL.replace(/\/api$/, '')}${url}`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Schedule
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Weekly Schedule</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            Manage and view your weekly teaching sessions in the same elevated dashboard style.
                        </p>
                    </div>
                </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex items-center justify-between gap-3">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Overview</p>
                        <h2 className="mt-1 text-2xl font-black text-slate-900">Teaching routine</h2>
                    </div>
                    <div className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600">
                        {entries.length} sessions
                    </div>
                </div>

                <div className="overflow-x-auto">
                    {periodNumbers.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
                            No weekly schedule has been assigned yet.
                        </div>
                    ) : (
                        <table className="min-w-full border border-slate-200">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">Day</th>
                                    {periodNumbers.map((period) => (
                                        <th key={period} className="border border-slate-200 px-3 py-2 text-left text-sm font-semibold text-slate-700">
                                            Period {period}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {DAYS.map((day) => (
                                    <tr key={day}>
                                        <td className="border border-slate-200 px-3 py-2 font-semibold text-slate-800">{formatDay(day)}</td>
                                        {periodNumbers.map((period) => {
                                            const slotEntries = getEntriesForSlot(day, period);

                                            return (
                                                <td key={`${day}-${period}`} className="border border-slate-200 px-3 py-2 align-top text-sm text-slate-700">
                                                    {slotEntries.length === 0 ? (
                                                        <span className="text-slate-400">-</span>
                                                    ) : (
                                                        <div className="space-y-2">
                                                            {slotEntries.map((entry, idx) => (
                                                                <div key={`${entry.class?.id || idx}-${idx}`} className="rounded-lg border border-slate-100 bg-slate-50 px-2 py-1.5">
                                                                    <p className="font-semibold text-slate-900">{entry.subject}</p>
                                                                    <p>{entry.startTime} - {entry.endTime}</p>
                                                                    <p>Class: {entry.class?.name} - {entry.class?.section}</p>
                                                                    <p>{entry.room || 'Room TBA'}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {documents.length > 0 && (
                <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                    <h2 className="text-xl font-bold text-slate-900">Timetable PDFs</h2>
                    <p className="mt-1 text-sm text-slate-500">Open class timetable documents assigned to your schedule.</p>
                    <div className="mt-4 space-y-2">
                        {documents.map((doc, idx) => (
                            <a
                                key={`${doc.class?.id || idx}-${idx}`}
                                href={resolveFileUrl(doc.pdfUrl)}
                                target="_blank"
                                rel="noreferrer"
                                className="block rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 hover:border-primary-200 hover:text-primary-700"
                            >
                                {doc.class?.name} - {doc.class?.section} ({doc.academicYear})
                            </a>
                        ))}
                    </div>
                </section>
            )}
        </div>
    );
};

export default TeacherSchedulePage;
