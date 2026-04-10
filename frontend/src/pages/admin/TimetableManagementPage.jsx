import React, { useEffect, useMemo, useState } from 'react';
import adminService from '../../services/admin.service';
import { API_BASE_URL } from '../../config/constants';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const emptyEntry = {
    dayOfWeek: 'MONDAY',
    periodNumber: 1,
    startTime: '09:00',
    endTime: '10:00',
    subject: '',
    teacherId: '',
    room: ''
};

const TimetableManagementPage = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [classes, setClasses] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [entries, setEntries] = useState([]);
    const [selectedClassId, setSelectedClassId] = useState('');
    const [academicYear, setAcademicYear] = useState(new Date().getFullYear());
    const [classForm, setClassForm] = useState({
        name: '',
        section: '',
        academicYear: new Date().getFullYear()
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [pdfUrl, setPdfUrl] = useState('');
    const [selectedPdf, setSelectedPdf] = useState(null);

    const selectedClass = useMemo(
        () => classes.find((classItem) => classItem._id === selectedClassId),
        [classes, selectedClassId]
    );

    useEffect(() => {
        const init = async () => {
            setLoading(true);
            setError('');
            try {
                const [classesRes, teachersRes] = await Promise.all([
                    adminService.getClassSections(),
                    adminService.getTeachers()
                ]);

                const classData = classesRes.data?.data || [];
                setClasses(classData);
                setTeachers(teachersRes.data || []);

                if (classData.length > 0) {
                    setSelectedClassId(classData[0]._id);
                    setAcademicYear(classData[0].academicYear || new Date().getFullYear());
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load timetable setup data');
            } finally {
                setLoading(false);
            }
        };

        init();
    }, []);

    useEffect(() => {
        const fetchTimetable = async () => {
            if (!selectedClassId || !academicYear) {
                return;
            }

            setMessage('');
            setError('');
            try {
                const res = await adminService.getTimetableByClass(selectedClassId, academicYear);
                setPdfUrl(res.data?.data?.pdfUrl || '');
                setEntries(res.data?.data?.entries?.map((entry) => ({
                    dayOfWeek: entry.dayOfWeek,
                    periodNumber: entry.periodNumber,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    subject: entry.subject,
                    teacherId: entry.teacher?.id || '',
                    room: entry.room || ''
                })) || []);
            } catch (err) {
                if (err.response?.status === 404) {
                    setEntries([]);
                    setPdfUrl('');
                    return;
                }

                setError(err.response?.data?.message || 'Failed to fetch timetable');
            }
        };

        fetchTimetable();
    }, [selectedClassId, academicYear]);

    const refreshClasses = async () => {
        const classesRes = await adminService.getClassSections();
        const classData = classesRes.data?.data || [];
        setClasses(classData);
        return classData;
    };

    const handleCreateClass = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        try {
            const res = await adminService.createClassSection(classForm);
            const created = res.data?.data;
            const allClasses = await refreshClasses();
            setSelectedClassId(created?._id || allClasses[0]?._id || '');
            setAcademicYear(created?.academicYear || classForm.academicYear);
            setClassForm({ name: '', section: '', academicYear: new Date().getFullYear() });
            setMessage('Class created successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create class');
        }
    };

    const updateEntry = (index, key, value) => {
        setEntries((prev) => prev.map((item, idx) => {
            if (idx !== index) {
                return item;
            }

            return {
                ...item,
                [key]: key === 'periodNumber' ? Number(value) : value
            };
        }));
    };

    const addEntry = () => {
        setEntries((prev) => [...prev, { ...emptyEntry, periodNumber: prev.length + 1 }]);
    };

    const removeEntry = (index) => {
        setEntries((prev) => prev.filter((_, idx) => idx !== index));
    };

    const handleSave = async () => {
        if (!selectedClassId) {
            setError('Please select a class before saving timetable');
            return;
        }

        setSaving(true);
        setError('');
        setMessage('');
        try {
            await adminService.upsertClassTimetable(selectedClassId, academicYear, entries);
            setMessage('Timetable saved successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to save timetable');
        } finally {
            setSaving(false);
        }
    };

    const handlePdfUpload = async () => {
        if (!selectedClassId || !academicYear) {
            setError('Select class and academic year before uploading PDF');
            return;
        }

        if (!selectedPdf) {
            setError('Please choose a PDF file first');
            return;
        }

        setError('');
        setMessage('');
        try {
            const formData = new FormData();
            formData.append('file', selectedPdf);
            const res = await adminService.uploadTimetablePdf(selectedClassId, academicYear, formData);
            setPdfUrl(res.data?.data?.pdfUrl || '');
            setSelectedPdf(null);
            setMessage('Timetable PDF uploaded successfully');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to upload timetable PDF');
        }
    };

    const resolveFileUrl = (url) => {
        if (!url) return '';
        if (url.startsWith('http')) return url;
        return `${API_BASE_URL.replace(/\/api$/, '')}${url}`;
    };

    if (loading) {
        return <div className="text-sm text-slate-500">Loading timetable manager...</div>;
    }

    return (
        <div className="space-y-6">
            <section className="rounded-xl bg-white p-6 shadow">
                <h1 className="text-2xl font-bold text-slate-900">Timetable Management</h1>
                <p className="mt-2 text-sm text-slate-600">Create class sections and manage fixed weekly routine for the academic year.</p>
            </section>

            <section className="rounded-xl bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-slate-900">Create Class/Section</h2>
                <form onSubmit={handleCreateClass} className="grid grid-cols-1 gap-3 md:grid-cols-4">
                    <input
                        type="text"
                        placeholder="Class name (e.g., Grade 8)"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={classForm.name}
                        onChange={(e) => setClassForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Section"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={classForm.section}
                        onChange={(e) => setClassForm((prev) => ({ ...prev, section: e.target.value }))}
                        required
                    />
                    <input
                        type="number"
                        placeholder="Academic year"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={classForm.academicYear}
                        onChange={(e) => setClassForm((prev) => ({ ...prev, academicYear: Number(e.target.value) }))}
                        required
                    />
                    <button type="submit" className="rounded-lg bg-primary-600 px-4 py-2 font-semibold text-white hover:bg-primary-700">
                        Create Class
                    </button>
                </form>
            </section>

            <section className="rounded-xl bg-white p-6 shadow space-y-4">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                    <select
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="">Select class</option>
                        {classes.map((classItem) => (
                            <option key={classItem._id} value={classItem._id}>
                                {classItem.name} - {classItem.section} ({classItem.academicYear})
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        value={academicYear}
                        onChange={(e) => setAcademicYear(Number(e.target.value))}
                    />

                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700 disabled:opacity-70"
                    >
                        {saving ? 'Saving...' : 'Save Timetable'}
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_auto]">
                    <input
                        type="file"
                        accept="application/pdf"
                        className="rounded-lg border border-slate-300 px-3 py-2"
                        onChange={(e) => setSelectedPdf(e.target.files?.[0] || null)}
                    />
                    <button
                        type="button"
                        onClick={handlePdfUpload}
                        className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
                    >
                        Upload Timetable PDF
                    </button>
                    {pdfUrl ? (
                        <a
                            href={resolveFileUrl(pdfUrl)}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            View Current PDF
                        </a>
                    ) : (
                        <div className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm text-slate-500">
                            No PDF uploaded
                        </div>
                    )}
                </div>

                {selectedClass && (
                    <p className="text-sm text-slate-600">Editing: {selectedClass.name} - Section {selectedClass.section}</p>
                )}

                {error && <div className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</div>}
                {message && <div className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-700">{message}</div>}

                <div className="overflow-x-auto">
                    <table className="min-w-full border border-slate-200">
                        <thead className="bg-slate-100">
                            <tr>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Day</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Period</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Start</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">End</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Subject</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Teacher</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Room</th>
                                <th className="border border-slate-200 px-3 py-2 text-left text-sm">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {entries.map((entry, index) => (
                                <tr key={`${entry.dayOfWeek}-${entry.periodNumber}-${index}`}>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <select
                                            value={entry.dayOfWeek}
                                            onChange={(e) => updateEntry(index, 'dayOfWeek', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        >
                                            {DAYS.map((day) => (
                                                <option key={day} value={day}>{day}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <input
                                            type="number"
                                            min="1"
                                            value={entry.periodNumber}
                                            onChange={(e) => updateEntry(index, 'periodNumber', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <input
                                            type="time"
                                            value={entry.startTime}
                                            onChange={(e) => updateEntry(index, 'startTime', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <input
                                            type="time"
                                            value={entry.endTime}
                                            onChange={(e) => updateEntry(index, 'endTime', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <input
                                            type="text"
                                            value={entry.subject}
                                            onChange={(e) => updateEntry(index, 'subject', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <select
                                            value={entry.teacherId}
                                            onChange={(e) => updateEntry(index, 'teacherId', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        >
                                            <option value="">Select teacher</option>
                                            {teachers.map((teacher) => (
                                                <option key={teacher._id} value={teacher._id}>{teacher.username}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <input
                                            type="text"
                                            value={entry.room}
                                            onChange={(e) => updateEntry(index, 'room', e.target.value)}
                                            className="w-full rounded border border-slate-300 px-2 py-1"
                                        />
                                    </td>
                                    <td className="border border-slate-200 px-2 py-2">
                                        <button
                                            onClick={() => removeEntry(index)}
                                            className="rounded bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700 hover:bg-rose-200"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <button
                    onClick={addEntry}
                    className="rounded-lg border border-dashed border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 hover:border-primary-400 hover:text-primary-700"
                >
                    + Add Timetable Row
                </button>
            </section>
        </div>
    );
};

export default TimetableManagementPage;
