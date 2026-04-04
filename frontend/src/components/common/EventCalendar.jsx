import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

const EventCalendar = ({ events, onEventClick }) => {
    // Transform our event data into FullCalendar's expected format
    const calendarEvents = events.map(event => ({
        id: event._id,
        title: event.title,
        start: `${event.date.split('T')[0]}T${event.time}:00`, // Assuming date is ISO string and time is HH:mm
        allDay: false,
        extendedProps: {
            description: event.description,
            location: event.location,
            image: event.image
        }
    }));

    const handleEventClick = (info) => {
        // Find the original event object
        const clickedEvent = events.find(e => e._id === info.event.id);
        if (onEventClick && clickedEvent) {
            onEventClick(clickedEvent);
        }
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6">
            <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={calendarEvents}
                eventClick={handleEventClick}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,dayGridWeek'
                }}
                height="auto"
                eventTimeFormat={{
                    hour: 'numeric',
                    minute: '2-digit',
                    meridiem: 'short'
                }}
                eventDisplay="block"
                eventBackgroundColor="#6366f1" // primary-600
                eventBorderColor="#4f46e5" // primary-700
                displayEventTime={true}
                dayMaxEvents={true} // allow "more" link when too many events
                themeSystem="standard"
            />
            
            <style jsx global>{`
                .fc {
                    --fc-button-bg-color: #6366f1;
                    --fc-button-border-color: #6366f1;
                    --fc-button-hover-bg-color: #4f46e5;
                    --fc-button-hover-border-color: #4f46e5;
                    --fc-button-active-bg-color: #4338ca;
                    --fc-button-active-border-color: #4338ca;
                    --fc-today-bg-color: #eff6ff;
                    font-family: inherit;
                }
                .fc-toolbar-title {
                    font-size: 1.25rem !important;
                    font-weight: 700 !important;
                    color: #111827;
                }
                .fc-col-header-cell-cushion {
                    color: #4b5563;
                    font-weight: 600;
                    text-decoration: none !important;
                }
                .fc-daygrid-day-number {
                    color: #4b5563;
                    text-decoration: none !important;
                }
                .fc-event {
                    cursor: pointer;
                    padding: 2px 4px;
                    border-radius: 4px;
                    font-size: 0.85rem;
                }
                .fc-event-title {
                    font-weight: 600;
                }
            `}</style>
        </div>
    );
};

export default EventCalendar;
