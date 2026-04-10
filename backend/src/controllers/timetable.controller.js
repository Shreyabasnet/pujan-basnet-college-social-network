import User from '../models/User.js';
import ClassSection from '../models/ClassSection.js';
import Timetable from '../models/Timetable.js';

const DAY_ORDER = {
    MONDAY: 1,
    TUESDAY: 2,
    WEDNESDAY: 3,
    THURSDAY: 4,
    FRIDAY: 5,
    SATURDAY: 6,
    SUNDAY: 7
};

const normalizeDay = (day) => String(day || '').trim().toUpperCase();

const sortEntries = (entries) =>
    [...entries].sort((a, b) => {
        const dayA = DAY_ORDER[a.dayOfWeek] || 99;
        const dayB = DAY_ORDER[b.dayOfWeek] || 99;
        if (dayA !== dayB) {
            return dayA - dayB;
        }

        return (a.periodNumber || 0) - (b.periodNumber || 0);
    });

const mapEntry = (entry, classInfo) => ({
    dayOfWeek: entry.dayOfWeek,
    periodNumber: entry.periodNumber,
    startTime: entry.startTime,
    endTime: entry.endTime,
    subject: entry.subject,
    room: entry.room || '',
    teacher: entry.teacherId
        ? {
              id: entry.teacherId._id,
              username: entry.teacherId.username,
              email: entry.teacherId.email
          }
        : null,
    class: classInfo
});

export const createClassSection = async (req, res) => {
    try {
        const { name, section, academicYear } = req.body;

        if (!name || !section || !academicYear) {
            return res.status(400).json({ message: 'name, section and academicYear are required' });
        }

        const classSection = await ClassSection.create({
            name: String(name).trim(),
            section: String(section).trim(),
            academicYear: Number(academicYear)
        });

        return res.status(201).json({ success: true, data: classSection });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAllClassSections = async (req, res) => {
    try {
        const classes = await ClassSection.find().sort({ academicYear: -1, name: 1, section: 1 });
        return res.json({ success: true, data: classes });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const assignStudentToClass = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { classId } = req.body;

        const student = await User.findOne({ _id: studentId, role: 'STUDENT' });
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const classSection = await ClassSection.findById(classId);
        if (!classSection) {
            return res.status(404).json({ message: 'Class not found' });
        }

        student.classSection = classSection._id;
        await student.save();

        return res.json({ success: true, data: student, message: 'Student assigned to class successfully' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const upsertClassTimetable = async (req, res) => {
    try {
        const { classId, academicYear } = req.params;
        const { entries = [] } = req.body;

        const classSection = await ClassSection.findById(classId);
        if (!classSection) {
            return res.status(404).json({ message: 'Class not found' });
        }

        const normalizedEntries = entries.map((entry) => ({
            dayOfWeek: normalizeDay(entry.dayOfWeek),
            periodNumber: Number(entry.periodNumber),
            startTime: entry.startTime,
            endTime: entry.endTime,
            subject: entry.subject,
            teacherId: entry.teacherId,
            room: entry.room || ''
        }));

        const duplicates = new Set();
        for (const item of normalizedEntries) {
            const key = `${item.dayOfWeek}_${item.periodNumber}`;
            if (duplicates.has(key)) {
                return res.status(400).json({ message: `Duplicate slot found for ${item.dayOfWeek} period ${item.periodNumber}` });
            }
            duplicates.add(key);
        }

        const timetable = await Timetable.findOneAndUpdate(
            { classId, academicYear: Number(academicYear) },
            {
                classId,
                academicYear: Number(academicYear),
                entries: normalizedEntries
            },
            { new: true, upsert: true, runValidators: true }
        )
            .populate('classId')
            .populate('entries.teacherId', 'username email');

        return res.json({ success: true, data: timetable });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const uploadClassTimetablePdf = async (req, res) => {
    try {
        const { classId, academicYear } = req.params;

        const classSection = await ClassSection.findById(classId);
        if (!classSection) {
            return res.status(404).json({ message: 'Class not found' });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'PDF file is required' });
        }

        const pdfUrl = `/uploads/pdfs/${req.file.filename}`;

        const timetable = await Timetable.findOneAndUpdate(
            { classId, academicYear: Number(academicYear) },
            {
                classId,
                academicYear: Number(academicYear),
                pdfUrl
            },
            { new: true, upsert: true, runValidators: true }
        );

        return res.json({
            success: true,
            data: {
                id: timetable._id,
                classId: timetable.classId,
                academicYear: timetable.academicYear,
                pdfUrl: timetable.pdfUrl
            },
            message: 'Timetable PDF uploaded successfully'
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getTimetableByClass = async (req, res) => {
    try {
        const { classId, academicYear } = req.params;

        const timetable = await Timetable.findOne({ classId, academicYear: Number(academicYear) })
            .populate('classId')
            .populate('entries.teacherId', 'username email');

        if (!timetable) {
            return res.status(404).json({ message: 'Timetable not found' });
        }

        return res.json({
            success: true,
            data: {
                id: timetable._id,
                class: timetable.classId,
                academicYear: timetable.academicYear,
                pdfUrl: timetable.pdfUrl || '',
                entries: sortEntries(timetable.entries).map((entry) => mapEntry(entry, {
                    id: timetable.classId._id,
                    name: timetable.classId.name,
                    section: timetable.classId.section,
                    academicYear: timetable.classId.academicYear
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyClassTimetable = async (req, res) => {
    try {
        const student = await User.findById(req.user.id).populate('classSection');
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        if (!student.classSection) {
            return res.status(400).json({ message: 'Student is not assigned to a class yet' });
        }

        const requestedYear = req.query.academicYear ? Number(req.query.academicYear) : student.classSection.academicYear;

        const timetable = await Timetable.findOne({
            classId: student.classSection._id,
            academicYear: requestedYear
        }).populate('entries.teacherId', 'username email');

        if (!timetable) {
            return res.json({
                success: true,
                data: {
                    class: student.classSection,
                    academicYear: requestedYear,
                    pdfUrl: '',
                    entries: []
                }
            });
        }

        return res.json({
            success: true,
            data: {
                class: student.classSection,
                academicYear: timetable.academicYear,
                pdfUrl: timetable.pdfUrl || '',
                entries: sortEntries(timetable.entries).map((entry) => mapEntry(entry, {
                    id: student.classSection._id,
                    name: student.classSection.name,
                    section: student.classSection.section,
                    academicYear: student.classSection.academicYear
                }))
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getMyTeacherTimetable = async (req, res) => {
    try {
        const teacherId = req.user.id;
        const requestedYear = req.query.academicYear ? Number(req.query.academicYear) : null;

        const query = requestedYear ? { academicYear: requestedYear } : {};

        const timetables = await Timetable.find(query)
            .populate('classId')
            .populate('entries.teacherId', 'username email');

        const flattened = [];
        const documents = [];

        timetables.forEach((timetable) => {
            let hasTeacherEntry = false;
            timetable.entries.forEach((entry) => {
                if (String(entry.teacherId?._id || entry.teacherId) !== String(teacherId)) {
                    return;
                }

                hasTeacherEntry = true;

                flattened.push({
                    dayOfWeek: entry.dayOfWeek,
                    periodNumber: entry.periodNumber,
                    startTime: entry.startTime,
                    endTime: entry.endTime,
                    subject: entry.subject,
                    room: entry.room || '',
                    class: {
                        id: timetable.classId?._id,
                        name: timetable.classId?.name,
                        section: timetable.classId?.section,
                        academicYear: timetable.classId?.academicYear
                    },
                    academicYear: timetable.academicYear
                });
            });

            if (hasTeacherEntry && timetable.pdfUrl) {
                documents.push({
                    class: {
                        id: timetable.classId?._id,
                        name: timetable.classId?.name,
                        section: timetable.classId?.section,
                        academicYear: timetable.classId?.academicYear
                    },
                    academicYear: timetable.academicYear,
                    pdfUrl: timetable.pdfUrl
                });
            }
        });

        return res.json({
            success: true,
            data: {
                teacherId,
                entries: sortEntries(flattened),
                documents
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
