import api from './api';

const adminService = {
    // Teacher Management
    getTeachers: () => api.get('/admin/teachers'),
    deleteTeacher: (id) => api.delete(`/admin/user/${id}`),

    // Student Management
    getStudents: () => api.get('/admin/students'),
    deleteStudent: (id) => api.delete(`/admin/user/${id}`),

    // Course Management
    getCourses: () => api.get('/admin/courses'),
    createCourse: (data) => api.post('/admin/courses', data),
    updateCourse: (id, data) => api.put(`/admin/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/admin/courses/${id}`),

    // Dashboard
    getDashboardStats: () => api.get('/admin/dashboard/stats'),

    // Settings
    getSettings: () => api.get('/admin/settings'),
    updateSetting: (data) => api.put('/admin/settings', data),
};

export default adminService;
