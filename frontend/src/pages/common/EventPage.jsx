import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, Trash2, X, LayoutGrid, Edit2, Ban } from 'lucide-react';
import EventCalendar from '../../components/common/EventCalendar';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import toast, { Toaster } from 'react-hot-toast';

const EventPage = () => {
    const { user } = useAuth();
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'calendar'
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [editingEventId, setEditingEventId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState('');
    const [image, setImage] = useState(null);

    const isAuthorized = user && (user.role === 'TEACHER' || user.role === 'ADMIN');

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.get('/events');
            setEvents(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (eventId) => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await api.delete(`/events/${eventId}`);
            setEvents(events.filter(e => e._id !== eventId));
            toast.success("Event deleted");
        } catch (error) {
            toast.error("Failed to delete event");
        }
    };

    const handleCancelEvent = async (eventId) => {
        if (!window.confirm("Cancel this event?")) return;
        try {
            await api.patch(`/events/${eventId}/cancel`);
            setEvents((prev) => prev.filter((e) => e._id !== eventId));
            if (selectedEvent?._id === eventId) {
                setSelectedEvent(null);
            }
            toast.success("Event cancelled");
        } catch (error) {
            toast.error("Failed to cancel event");
        }
    };

    const handleEditEvent = (event) => {
        setEditingEventId(event._id);
        setTitle(event.title || '');
        setDescription(event.description || '');
        setDate(event.date ? new Date(event.date).toISOString().split('T')[0] : '');
        setTime(event.time || '');
        setLocation(event.location || '');
        setImage(null);
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location', location);
        if (image) formData.append('image', image);

        setIsSubmitting(true);
        try {
            if (editingEventId) {
                await api.put(`/events/${editingEventId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Event updated!");
            } else {
                await api.post('/events', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast.success("Event created!");
            }

            setShowModal(false);
            setEditingEventId(null);
            // Reset form
            setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setImage(null);
            fetchEvents();
        } catch (error) {
            toast.error(error.response?.data?.message || (editingEventId ? "Failed to update event" : "Failed to create event"));
        } finally {
            setIsSubmitting(false);
        }
    };

    const openCreateModal = () => {
        setEditingEventId(null);
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setLocation('');
        setImage(null);
        setShowModal(true);
    };

    const closeEventModal = () => {
        setShowModal(false);
        setEditingEventId(null);
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setLocation('');
        setImage(null);
    };

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            {/* Header Section */}
            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-primary-600 via-cyan-600 to-sky-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.5)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.18),transparent_28%)]" />
                <div className="relative space-y-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                        <Calendar className="h-4 w-4" />
                        Events
                    </span>
                    <h1 className="text-3xl font-black tracking-tight sm:text-4xl">College Events</h1>
                    <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                        Stay updated with the latest college activities, seminars, and important dates.
                    </p>
                </div>
            </section>

            {/* View Controls and Create Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex bg-white rounded-full shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] border border-slate-200 p-1">
                    <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-full transition font-medium text-sm ${viewMode === 'grid' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-900'}`}
                        title="Grid View"
                    >
                        <LayoutGrid className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => setViewMode('calendar')}
                        className={`p-2 rounded-full transition font-medium text-sm ${viewMode === 'calendar' ? 'bg-primary-600 text-white shadow-lg' : 'text-slate-600 hover:text-slate-900'}`}
                        title="Calendar View"
                    >
                        <Calendar className="h-5 w-5" />
                    </button>
                </div>
                {isAuthorized && (
                    <button
                        onClick={openCreateModal}
                        className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary-600/40 transition hover:bg-primary-700 hover:-translate-y-0.5"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Event
                    </button>
                )}
            </div>

            {/* Events Grid or Calendar */}
            {viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map(event => (
                        <div 
                            key={event._id} 
                            className="rounded-2xl border border-slate-200 bg-white overflow-hidden flex flex-col shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)] transition hover:shadow-[0_30px_70px_-40px_rgba(15,23,42,0.45)] hover:-translate-y-1 cursor-pointer"
                            onClick={() => setSelectedEvent(event)}
                        >
                            <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 relative overflow-hidden">
                                {event.image ? (
                                    <img src={event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="h-full w-full object-cover hover:scale-105 transition duration-300" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-orange-100 text-cyan-400">
                                        <Calendar className="h-16 w-16 opacity-50" />
                                    </div>
                                )}
                                {isAuthorized && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(event._id);
                                        }}
                                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full text-slate-600 hover:text-red-500 shadow-lg transition"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                )}
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <div className="text-xs font-bold text-primary-600 mb-2 uppercase tracking-widest">
                                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                </div>
                                <h3 className="text-lg font-black text-slate-900 mb-2 line-clamp-2">{event.title}</h3>
                                <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1 leading-relaxed">{event.description}</p>

                                <div className="space-y-2 text-sm text-slate-700 border-t border-slate-100 pt-4">
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-primary-600 flex-shrink-0" />
                                        <span className="font-medium">{event.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-4 w-4 text-primary-600 flex-shrink-0" />
                                        <span className="font-medium truncate">{event.location}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <EventCalendar events={events} onEventClick={(event) => setSelectedEvent(event)} />
            )}

            {events.length === 0 && (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center">
                    <Calendar className="h-16 w-16 mx-auto mb-3 opacity-30 text-slate-400" />
                    <h3 className="text-lg font-bold text-slate-900">No events scheduled</h3>
                    <p className="text-slate-500 mt-1">Check back later for updates</p>
                </div>
            )}

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-900">{editingEventId ? 'Update Event' : 'Create New Event'}</h3>
                            <button onClick={closeEventModal} className="text-slate-400 hover:text-slate-600 transition">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Title</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10" 
                                    value={title} 
                                    onChange={e => setTitle(e.target.value)}
                                    placeholder="Enter event title"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                                <textarea 
                                    required 
                                    rows="3" 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10 resize-none" 
                                    value={description} 
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Enter event description"
                                ></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Date</label>
                                    <input 
                                        type="date" 
                                        required 
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10" 
                                        value={date} 
                                        onChange={e => setDate(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Time</label>
                                    <input 
                                        type="time" 
                                        required 
                                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10" 
                                        value={time} 
                                        onChange={e => setTime(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    required 
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder-slate-400 transition focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/10" 
                                    value={location} 
                                    onChange={e => setLocation(e.target.value)}
                                    placeholder="Enter event location"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">Event Image</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    className="w-full rounded-xl border border-dashed border-slate-300 px-4 py-3 text-sm text-slate-600 transition hover:border-primary-500" 
                                    onChange={e => setImage(e.target.files[0])}
                                />
                            </div>
                            <div className="pt-4 flex justify-end space-x-3 border-t border-slate-200">
                                <button 
                                    type="button" 
                                    onClick={closeEventModal} 
                                    className="px-5 py-2 text-slate-700 font-semibold rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                                >
                                    Close
                                </button>
                                <button 
                                    type="submit" 
                                    className="px-6 py-2 bg-primary-600 text-white font-semibold rounded-xl hover:bg-primary-700 shadow-lg shadow-primary-600/30 transition"
                                >
                                    {isSubmitting ? 'Saving...' : (editingEventId ? 'Update Event' : 'Create Event')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                            {selectedEvent.image ? (
                                <img src={selectedEvent.image.startsWith('http') ? selectedEvent.image : `http://localhost:5000${selectedEvent.image}`} alt={selectedEvent.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-cyan-100 to-orange-100 text-cyan-300">
                                    <Calendar className="h-20 w-20 opacity-40" />
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="text-primary-600 font-bold text-xs uppercase tracking-widest mb-2">
                                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900">{selectedEvent.title}</h2>
                                </div>
                                {isAuthorized && (
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEditEvent(selectedEvent)}
                                            className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition font-medium"
                                            title="Update Event"
                                        >
                                            <Edit2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleCancelEvent(selectedEvent._id)}
                                            className="text-amber-600 hover:bg-amber-50 p-2 rounded-lg transition font-medium"
                                            title="Cancel Event"
                                        >
                                            <Ban className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                handleDelete(selectedEvent._id);
                                                setSelectedEvent(null);
                                            }}
                                            className="text-red-600 hover:bg-red-50 p-2 rounded-lg transition font-medium"
                                            title="Delete Event"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <p className="text-slate-700 leading-relaxed mb-8 text-base">
                                {selectedEvent.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-200">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm text-primary-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Time</p>
                                        <p className="text-slate-900 font-bold mt-1">{selectedEvent.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm text-primary-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Location</p>
                                        <p className="text-slate-900 font-bold mt-1">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/30 transition hover:bg-slate-800 hover:-translate-y-0.5"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventPage;
