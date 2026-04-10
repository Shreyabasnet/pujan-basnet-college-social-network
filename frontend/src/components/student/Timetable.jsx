import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import studentService from '../../services/student.service';

const Timetable = ({ classes = [], compact = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [formData, setFormData] = useState({ title: '', date: '', time: '', description: '' });

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                const res = await studentService.getReminders();
                setReminders(res.data?.data || []);
            } catch (error) {
                console.error(error);
            }
        };

        fetchReminders();
    }, []);

    const handleAddReminder = async () => {
        if (formData.title.trim() && formData.date && formData.time) {
            try {
                const res = await studentService.createReminder(formData);
                const newReminder = res.data?.data;
                if (newReminder) {
                    setReminders((prev) => [newReminder, ...prev]);
                }
                setFormData({ title: '', date: '', time: '', description: '' });
                setShowModal(false);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleDeleteReminder = async (id) => {
        try {
            await studentService.deleteReminder(id);
            setReminders(reminders.filter(r => r._id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            {classes.length > 0 ? (
                classes.map((cls, index) => (
                    <div
                        key={index}
                        className={`flex items-center rounded-2xl border border-slate-100 p-3 ${compact ? 'bg-white' : 'bg-slate-50'} transition hover:border-primary-200`}
                    >
                        <div className="mr-3 flex min-w-[70px] flex-col items-center justify-center border-r border-slate-200 pr-3">
                            <span className="text-sm font-bold text-primary-600">{cls.startTime}</span>
                            <span className="text-[10px] uppercase text-slate-400">{cls.duration}</span>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-semibold text-slate-900">{cls.courseName}</p>
                            <div className="mt-1 flex items-center text-xs text-slate-500">
                                <span className="mr-3">📍 {cls.room}</span>
                                <span>👨‍🏫 {cls.instructor}</span>
                            </div>
                        </div>
                        {!compact && (
                            <div className="ml-2">
                                <button className="rounded-full p-2 text-primary-600 transition hover:bg-primary-50">
                                    🔔
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-10 text-center">
                    <span className="text-3xl block mb-2">🎈</span>
                    <p className="text-sm italic text-slate-500">Relax! No classes for today.</p>
                </div>
            )}

            {reminders.length > 0 && (
                <div className="mt-6 space-y-3 border-t border-slate-200 pt-6">
                    <h3 className="px-1 text-sm font-semibold text-slate-700">Your Reminders</h3>
                    {reminders.map(reminder => (
                        <div key={reminder._id} className="flex items-start justify-between rounded-2xl border border-primary-100 bg-primary-50 p-3">
                            <div className="flex-1">
                                <p className="text-sm font-medium text-slate-900">{reminder.title}</p>
                                <p className="mt-1 text-xs text-slate-500">📅 {reminder.date} | ⏰ {reminder.time}</p>
                                {reminder.description && (
                                    <p className="mt-1 text-xs text-slate-600">{reminder.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteReminder(reminder._id)}
                                className="ml-2 text-slate-400 transition-colors hover:text-rose-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {!compact && (
                <>
                    <button 
                        onClick={() => setShowModal(true)}
                        className="w-full rounded-2xl border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-400 transition-all hover:border-primary-300 hover:text-primary-600"
                    >
                        + Add Custom Reminder
                    </button>

                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm">
                            <div className="mx-4 w-full max-w-md rounded-[1.75rem] bg-white p-6 shadow-2xl">
                                <div className="mb-4 flex items-center justify-between">
                                    <h2 className="text-xl font-black text-slate-900">Add Custom Reminder</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-slate-400 hover:text-slate-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Reminder Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Assignment Submission"
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleFormChange}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleFormChange}
                                            className="w-full rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-slate-700">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            placeholder="Add any notes..."
                                            rows="3"
                                            className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 outline-none focus:border-primary-300 focus:ring-4 focus:ring-primary-100"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 rounded-full border border-slate-200 py-2 font-medium text-slate-700 transition hover:bg-slate-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddReminder}
                                            className="flex-1 rounded-full bg-gradient-to-r from-primary-600 to-cyan-600 py-2 font-medium text-white transition hover:from-primary-700 hover:to-cyan-700"
                                        >
                                            Add Reminder
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Timetable;
