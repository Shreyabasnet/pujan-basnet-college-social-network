import api from './api';

const teacherService = {
    // Dashboard
    getDashboardData: () => api.get('/teacher/dashboard'),
    
    // Courses
    getMyCourses: () => api.get('/teacher/courses'),
    getCourseDetails: (courseId) => api.get(`/teacher/courses/${courseId}`),
    getCourseStudents: (courseId) => api.get(`/teacher/courses/${courseId}/students`),
    
    // Attendance
    markAttendance: (data) => api.post('/teacher/attendance', data),
    getAttendanceReport: (courseId, date) => api.get(`/teacher/attendance/${courseId}`, { params: { date } }),
    
    // Grades
    updateGrades: (data) => api.post('/teacher/grades', data),
    getGradeBook: (courseId) => api.get(`/teacher/grades/${courseId}`),
    
    // Assignments
    createAssignment: (data) => api.post('/teacher/assignments', data),
    getAssignments: (courseId) => api.get(`/teacher/assignments/${courseId}`),
    
    // Materials
    uploadMaterial: (formData) => api.post('/teacher/materials', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getMaterials: (courseId) => api.get(`/teacher/materials/${courseId}`),
    
    // Announcements
    createAnnouncement: (data) => api.post('/announcements', data),
    getAnnouncements: () => api.get('/announcements'),
    
    // Schedule
    getSchedule: () => api.get('/teacher/timetable/me'),
    
    // Profile
    getProfile: () => api.get('/teacher/profile'),
    updateProfile: (data) => api.put('/teacher/profile', data)
};

export default teacherService;