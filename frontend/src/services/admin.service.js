import api from './api';

const adminService = {
    // Teacher Management
    getTeachers: () => api.get('/admin/teachers'),
    deleteTeacher: (id) => api.delete(`/admin/user/${id}`),
    updateTeacher: (id, data) => api.put(`/admin/user/${id}`, data),

    // Student Management
    getStudents: () => api.get('/admin/students'),
    deleteStudent: (id) => api.delete(`/admin/user/${id}`),
    updateStudent: (id, data) => api.put(`/admin/user/${id}`, data),

    // Course Management
    getCourses: () => api.get('/admin/courses'),
    createCourse: (data) => api.post('/admin/courses', data),
    updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/admin/courses/${id}`),

    // Class Management
    getClassSections: () => api.get('/admin/classes'),
    createClassSection: (data) => api.post('/admin/classes', data),
    assignStudentClass: (studentId, classId) => api.put(`/admin/students/${studentId}/class`, { classId }),

    // Timetable Management
    getTimetableByClass: (classId, academicYear) => api.get(`/admin/timetables/${classId}/${academicYear}`),
    upsertClassTimetable: (classId, academicYear, entries) => api.put(`/admin/timetables/${classId}/${academicYear}`, { entries }),
    uploadTimetablePdf: (classId, academicYear, formData) => api.post(`/admin/timetables/${classId}/${academicYear}/pdf`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),

    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard/stats'),

    // Settings
    getSettings: () => api.get('/admin/settings'),
    updateSetting: (data) => api.put('/admin/settings', data),
};

export default adminService;
