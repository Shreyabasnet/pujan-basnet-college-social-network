import Event from '../models/Event.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        let image = '';

        if (req.file) {
            try {
                const result = await uploadToCloudinary(req.file.buffer, 'collegesocial/events');
                image = result.url;
            } catch (uploadError) {
                console.error('Cloudinary upload failed:', uploadError);
                return res.status(500).json({ message: 'Image upload failed' });
            }
        }

        const newEvent = new Event({
            title,
            description,
            date,
            time,
            location,
            image,
            createdBy: req.user.id,
        });

        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const getEvents = async (req, res) => {
    try {
        // Sort by date (ascending - nearest upcoming first)
        const events = await Event.find().sort({ date: 1 }).populate('createdBy', 'username');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Since this route is protected by teacherOnly which includes Admins, 
        // we generally assume they can delete. 
        // If specific ownership is needed (e.g. Teacher A cannot delete Teacher B's event), add check here.
        // For now, allow any Teacher/Admin to manage events.

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
export const updateEvent = async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Allow any Teacher/Admin to manage events as per existing pattern
        // (could be restricted to creator if needed)

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.time = time || event.time;
        event.location = location || event.location;

        if (req.file) {
            const result = await uploadToCloudinary(req.file.buffer, 'collegesocial/events');
            event.image = result.url;
        }

        await event.save();
        res.json(event);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
