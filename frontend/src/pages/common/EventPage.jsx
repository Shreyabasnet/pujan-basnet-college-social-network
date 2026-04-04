import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, Trash2, X, LayoutGrid } from 'lucide-react';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);
        formData.append('date', date);
        formData.append('time', time);
        formData.append('location', location);
        if (image) formData.append('image', image);

        try {
            await api.post('/events', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast.success("Event created!");
            setShowModal(false);
            // Reset form
            setTitle(''); setDescription(''); setDate(''); setTime(''); setLocation(''); setImage(null);
            fetchEvents();
        } catch (error) {
            toast.error("Failed to create event");
        }
    };

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-5xl mx-auto">

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Events</h1>
                        <p className="text-gray-500 mt-1">Stay updated with the latest college activities</p>
                    </div>
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <div className="flex bg-white rounded-lg shadow-sm border border-gray-200 p-1">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-md transition ${viewMode === 'grid' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                title="Grid View"
                            >
                                <LayoutGrid className="h-5 w-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('calendar')}
                                className={`p-2 rounded-md transition ${viewMode === 'calendar' ? 'bg-primary-50 text-primary-600' : 'text-gray-500 hover:bg-gray-50'}`}
                                title="Calendar View"
                            >
                                <Calendar className="h-5 w-5" />
                            </button>
                        </div>
                        {isAuthorized && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition shadow-md whitespace-now8 text-sm font-medium"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Create Event
                            </button>
                        )}
                    </div>
                </div>

                {viewMode === 'grid' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {events.map(event => (
                            <div key={event._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition">
                                <div className="h-48 bg-gray-200 relative">
                                    {event.image ? (
                                        <img src={event.image.startsWith('http') ? event.image : `http://localhost:5000${event.image}`} alt={event.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center bg-primary-50 text-primary-400">
                                            <Calendar className="h-12 w-12" />
                                        </div>
                                    )}
                                    {isAuthorized && (
                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-gray-500 hover:text-red-500 shadow-sm"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="text-sm font-bold text-primary-600 mb-1 uppercase tracking-wide">
                                        {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-3 flex-1">{event.description}</p>

                                    <div className="space-y-2 text-sm text-gray-600 border-t border-gray-100 pt-4">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 mr-2 text-primary-500" />
                                            {event.time}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                                            {event.location}
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
                    <div className="text-center py-20 text-gray-500">
                        <Calendar className="h-16 w-16 mx-auto mb-4 opacity-30" />
                        <h3 className="text-xl font-medium">No events scheduled</h3>
                        <p>Check back later for updates</p>
                    </div>
                )}
            </div>

            {/* Create Event Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-gray-900">Create New Event</h3>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title</label>
                                <input type="text" required className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea required rows="3" className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500" value={description} onChange={e => setDescription(e.target.value)}></textarea>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                    <input type="date" required className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                    <input type="time" required className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500" value={time} onChange={e => setTime(e.target.value)} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <input type="text" required className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500" value={location} onChange={e => setLocation(e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
                                <input type="file" accept="image/*" className="w-full" onChange={e => setImage(e.target.files[0])} />
                            </div>
                            <div className="pt-2 flex justify-end space-x-3">
                                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Create Event</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Event Detail Modal */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 backdrop-blur-sm shadow-2xl">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="relative h-64 bg-gray-200">
                            {selectedEvent.image ? (
                                <img src={selectedEvent.image.startsWith('http') ? selectedEvent.image : `http://localhost:5000${selectedEvent.image}`} alt={selectedEvent.title} className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center bg-primary-50 text-primary-300">
                                    <Calendar className="h-20 w-20" />
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedEvent(null)}
                                className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-md transition"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <div className="text-primary-600 font-bold text-sm uppercase tracking-wider mb-1">
                                        {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                                    </div>
                                    <h2 className="text-3xl font-extrabold text-gray-900">{selectedEvent.title}</h2>
                                </div>
                                {isAuthorized && (
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedEvent._id);
                                            setSelectedEvent(null);
                                        }}
                                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"
                                        title="Delete Event"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </button>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                {selectedEvent.description}
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-xl border border-gray-100">
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-primary-600">
                                        <Clock className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Time</p>
                                        <p className="text-gray-900 font-medium">{selectedEvent.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <div className="bg-white p-3 rounded-lg shadow-sm text-primary-600">
                                        <MapPin className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 font-semibold uppercase">Location</p>
                                        <p className="text-gray-900 font-medium">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 flex justify-end">
                                <button 
                                    onClick={() => setSelectedEvent(null)}
                                    className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition shadow-lg"
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
