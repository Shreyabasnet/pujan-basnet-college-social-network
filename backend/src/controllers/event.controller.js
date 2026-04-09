import Event from '../models/Event.js';
import { uploadToCloudinary } from '../utils/cloudinaryUpload.js';

const getStartOfDay = (dateInput) => {
    const date = new Date(dateInput);
    date.setHours(0, 0, 0, 0);
    return date;
};

const getEventDateTime = (dateInput, timeInput) => {
    const baseDate = getStartOfDay(dateInput);
    const [hourRaw, minuteRaw] = String(timeInput || '').split(':');
    const hours = Number.isFinite(Number(hourRaw)) ? Number(hourRaw) : 0;
    const minutes = Number.isFinite(Number(minuteRaw)) ? Number(minuteRaw) : 0;

    baseDate.setHours(hours, minutes, 0, 0);
    return baseDate;
};

const escapeRegExp = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const createEvent = async (req, res) => {
    try {
        const { title, description, date, time, location } = req.body;
        let image = '';

        const normalizedDate = getStartOfDay(date);
        const normalizedTitle = (title || '').trim();
        const normalizedLocation = (location || '').trim();
        const normalizedTime = (time || '').trim();

        const duplicateEvent = await Event.findOne({
            status: 'ACTIVE',
            date: normalizedDate,
            time: normalizedTime,
            title: { $regex: `^${escapeRegExp(normalizedTitle)}$`, $options: 'i' },
            location: { $regex: `^${escapeRegExp(normalizedLocation)}$`, $options: 'i' },
        });

        if (duplicateEvent) {
            return res.status(409).json({ message: 'This event already exists' });
        }

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
            title: normalizedTitle,
            description,
            date: normalizedDate,
            time: normalizedTime,
            location: normalizedLocation,
            image,
            status: 'ACTIVE',
            expiresAt: getEventDateTime(normalizedDate, normalizedTime),
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
        const now = new Date();

        // Fast cleanup via TTL field and direct cutoff.
        await Event.deleteMany({ expiresAt: { $lte: now } });

        // Legacy safety cleanup for records where expiresAt was computed as end-of-day.
        const activeEvents = await Event.find({ status: 'ACTIVE' })
            .select('_id date time')
            .lean();

        const expiredEventIds = activeEvents
            .filter((event) => getEventDateTime(event.date, event.time) <= now)
            .map((event) => event._id);

        if (expiredEventIds.length > 0) {
            await Event.deleteMany({ _id: { $in: expiredEventIds } });
        }

        // Sort by date (ascending - nearest upcoming first)
        const events = await Event.find({ status: 'ACTIVE' })
            .sort({ date: 1 })
            .populate('createdBy', 'username');
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

        const nextTitle = (title || event.title || '').trim();
        const nextLocation = (location || event.location || '').trim();
        const nextTime = (time || event.time || '').trim();
        const nextDate = getStartOfDay(date || event.date);

        const duplicateEvent = await Event.findOne({
            _id: { $ne: event._id },
            status: 'ACTIVE',
            date: nextDate,
            time: nextTime,
            title: { $regex: `^${escapeRegExp(nextTitle)}$`, $options: 'i' },
            location: { $regex: `^${escapeRegExp(nextLocation)}$`, $options: 'i' },
        });

        if (duplicateEvent) {
            return res.status(409).json({ message: 'Another event with same details already exists' });
        }

        event.title = nextTitle;
        event.description = description || event.description;
        event.date = nextDate;
        event.time = nextTime;
        event.location = nextLocation;
        event.expiresAt = getEventDateTime(nextDate, nextTime);

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

export const cancelEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        event.status = 'CANCELLED';
        await event.save();

        return res.json({ message: 'Event cancelled successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
};
