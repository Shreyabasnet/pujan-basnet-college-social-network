import React, { useState } from 'react';
import { X } from 'lucide-react';

const Timetable = ({ classes = [], compact = false }) => {
    const [showModal, setShowModal] = useState(false);
    const [reminders, setReminders] = useState([]);
    const [formData, setFormData] = useState({ title: '', date: '', time: '', description: '' });

    const handleAddReminder = () => {
        if (formData.title.trim() && formData.date && formData.time) {
            setReminders([...reminders, { id: Date.now(), ...formData }]);
            setFormData({ title: '', date: '', time: '', description: '' });
            setShowModal(false);
        }
    };

    const handleDeleteReminder = (id) => {
        setReminders(reminders.filter(r => r.id !== id));
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
                        className={`flex items-center p-3 rounded-lg border border-gray-100 ${compact ? 'bg-white' : 'bg-gray-50'
                            } hover:border-blue-200 transition-colors`}
                    >
                        <div className="min-w-[70px] flex flex-col items-center justify-center border-r border-gray-200 pr-3 mr-3">
                            <span className="text-sm font-bold text-blue-600">{cls.startTime}</span>
                            <span className="text-[10px] text-gray-400 uppercase">{cls.duration}</span>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{cls.courseName}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-1">
                                <span className="mr-3">📍 {cls.room}</span>
                                <span>👨‍🏫 {cls.instructor}</span>
                            </div>
                        </div>
                        {!compact && (
                            <div className="ml-2">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
                                    🔔
                                </button>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="text-center py-10 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                    <span className="text-3xl block mb-2">🎈</span>
                    <p className="text-sm text-gray-500 italic">Relax! No classes for today.</p>
                </div>
            )}

            {reminders.length > 0 && (
                <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-700 px-1">Your Reminders</h3>
                    {reminders.map(reminder => (
                        <div key={reminder.id} className="flex items-start justify-between bg-blue-50 border border-blue-200 rounded-lg p-3">
                            <div className="flex-1">
                                <p className="font-medium text-gray-800 text-sm">{reminder.title}</p>
                                <p className="text-xs text-gray-500 mt-1">📅 {reminder.date} | ⏰ {reminder.time}</p>
                                {reminder.description && (
                                    <p className="text-xs text-gray-600 mt-1">{reminder.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => handleDeleteReminder(reminder.id)}
                                className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
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
                        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-lg text-gray-400 text-sm font-medium hover:border-blue-300 hover:text-blue-500 transition-all"
                    >
                        + Add Custom Reminder
                    </button>

                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
                            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold text-gray-900">Add Custom Reminder</h2>
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Reminder Title
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleFormChange}
                                            placeholder="e.g., Assignment Submission"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            name="time"
                                            value={formData.time}
                                            onChange={handleFormChange}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            name="description"
                                            value={formData.description}
                                            onChange={handleFormChange}
                                            placeholder="Add any notes..."
                                            rows="3"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <button
                                            onClick={() => setShowModal(false)}
                                            className="flex-1 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleAddReminder}
                                            className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition"
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
