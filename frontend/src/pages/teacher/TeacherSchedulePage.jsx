import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const TeacherSchedulePage = () => {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSchedule();
    }, []);

    const fetchSchedule = async () => {
        try {
            const res = await api.get('/teacher/courses');
            setCourses(res.data.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            toast.error("Failed to fetch schedule");
            setLoading(false);
        }
    };

    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const getScheduleForDay = (day) => {
        return courses.filter(course => course.schedule && course.schedule.day === day);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <Toaster position="top-right" />
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Weekly Schedule</h1>
                        <p className="text-gray-500 mt-1">Manage and view your weekly teaching sessions</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    {days.map(day => {
                        const daySchedule = getScheduleForDay(day);
                        return (
                            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center">
                                    <h2 className="text-lg font-bold text-gray-900">{day}</h2>
                                    {daySchedule.length > 0 && (
                                        <span className="ml-3 bg-primary-100 text-primary-700 text-xs font-bold px-2 py-1 rounded-full">
                                            {daySchedule.length} {daySchedule.length === 1 ? 'Session' : 'Sessions'}
                                        </span>
                                    )}
                                </div>
                                <div className="p-6">
                                    {daySchedule.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {daySchedule.map(course => (
                                                <div key={course._id} className="p-4 rounded-lg bg-white border border-gray-200 hover:border-primary-500 hover:shadow-md transition group">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <h3 className="font-bold text-gray-900 group-hover:text-primary-600 transition truncate">{course.name}</h3>
                                                        <span className="text-xs font-bold text-gray-400">{course.code}</span>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <Clock className="h-4 w-4 mr-2 text-primary-500" />
                                                            {course.schedule.startTime} - {course.schedule.endTime}
                                                        </div>
                                                        <div className="flex items-center text-sm text-gray-600">
                                                            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                                                            {course.schedule.room || 'TBD'}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-4 text-gray-400 italic text-sm">
                                            No classes scheduled for {day}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TeacherSchedulePage;
