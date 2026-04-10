import React, { useState, useEffect } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { API_BASE_URL } from '../../config/constants';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const formatDay = (day) => day.charAt(0) + day.slice(1).toLowerCase();

const TimetablePage = () => {
    const { getTimetable, loading, error } = useStudent();
    const [timetable, setTimetable] = useState({ class: null, entries: [] });
    const [showPdf, setShowPdf] = useState(false);
    const [reading, setReading] = useState(false);
    const [pdfText, setPdfText] = useState('');
    const [readError, setReadError] = useState('');

    useEffect(() => {
        fetchTimetable();
    }, []);

    const fetchTimetable = async () => {
        const data = await getTimetable();
        setTimetable(data || { class: null, entries: [] });
    };

    const entries = Array.isArray(timetable.entries) ? timetable.entries : [];
    const periodNumbers = [...new Set(entries.map((entry) => entry.periodNumber))].sort((a, b) => a - b);

    const getEntry = (day, period) => entries.find(
        (item) => item.dayOfWeek === day && item.periodNumber === period
    );

    const resolveFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL.replace(/\/api$/, '')}${url}`;
    };

    const pdfFileUrl = resolveFileUrl(timetable.pdfUrl);

    const extractPdfText = async (url) => {
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        const pages = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum += 1) {
            const page = await pdf.getPage(pageNum);
            const content = await page.getTextContent();
            const text = content.items
                .map((item) => item.str)
                .join(' ')
                .replace(/\s+/g, ' ')
                .trim();

            if (text) {
                pages.push(text);
            }
        }

        return pages.join(' ');
    };

    const handleReadAloud = async () => {
        setReadError('');

        if (!window.speechSynthesis) {
            setReadError('Read aloud is not supported in this browser.');
            return;
        }

        if (reading) {
            window.speechSynthesis.cancel();
            setReading(false);
            return;
        }

        try {
            const content = pdfText || await extractPdfText(pdfFileUrl);
            if (!content) {
                setReadError('Could not read text from this PDF.');
                return;
            }

            if (!pdfText) {
                setPdfText(content);
            }

            const utterance = new SpeechSynthesisUtterance(content.slice(0, 12000));
            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.onend = () => setReading(false);
            utterance.onerror = () => {
                setReading(false);
                setReadError('Failed to read the PDF aloud.');
            };

            setReading(true);
            window.speechSynthesis.cancel();
            window.speechSynthesis.speak(utterance);
        } catch (err) {
            console.error(err);
            setReadError('Unable to parse PDF for read aloud.');
        }
    };

    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Weekly Timetable</h1>
                <p className="mt-2 text-blue-100">Check your class routine for the full week</p>
                {timetable.class && (
                    <p className="mt-2 text-sm text-blue-100">
                        Class: {timetable.class.name} - Section {timetable.class.section} ({timetable.academicYear})
                    </p>
                )}
            </div>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {pdfFileUrl && (
                <div className="bg-white rounded-lg shadow p-4 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                        <h2 className="text-lg font-semibold text-slate-900">Timetable PDF</h2>
                        <div className="flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowPdf((prev) => !prev)}
                                className="rounded-lg bg-primary-600 px-3 py-2 text-sm font-semibold text-white hover:bg-primary-700"
                            >
                                {showPdf ? 'Hide PDF' : 'Read PDF'}
                            </button>
                            <a
                                href={pdfFileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                            >
                                Open in new tab
                            </a>
                            <button
                                type="button"
                                onClick={handleReadAloud}
                                className={`rounded-lg px-3 py-2 text-sm font-semibold text-white ${reading ? 'bg-rose-600 hover:bg-rose-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {reading ? 'Stop Reading' : 'Read Aloud'}
                            </button>
                        </div>
                    </div>
                    {readError && (
                        <p className="text-sm text-rose-600">{readError}</p>
                    )}
                    {showPdf && (
                        <iframe
                            src={pdfFileUrl}
                            title="Timetable PDF"
                            className="h-[700px] w-full rounded-lg border border-slate-200"
                        />
                    )}
                </div>
            )}

            <div className="bg-white rounded-lg shadow p-6 overflow-x-auto">
                {periodNumbers.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center text-sm text-slate-500">
                        No timetable created for your class yet.
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
                                        const entry = getEntry(day, period);
                                        return (
                                            <td key={`${day}-${period}`} className="border border-slate-200 px-3 py-2 align-top text-sm text-slate-700">
                                                {entry ? (
                                                    <div>
                                                        <p className="font-semibold text-slate-900">{entry.subject}</p>
                                                        <p>{entry.startTime} - {entry.endTime}</p>
                                                        <p>{entry.teacher?.username || 'Teacher TBA'}</p>
                                                        <p>{entry.room || 'Room TBA'}</p>
                                                    </div>
                                                ) : (
                                                    <span className="text-slate-400">-</span>
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
        </div>
    );
};

export default TimetablePage;
