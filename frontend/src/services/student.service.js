import api from './api';

const studentService = {
    // Dashboard
    getDashboardData: () => api.get('/student/dashboard'),
    
    // Courses
    getMyCourses: () => api.get('/student/courses'),
    getCourseDetails: (courseId) => api.get(`/student/courses/${courseId}`),
    
    // Grades
    getMyGrades: () => api.get('/student/grades'),
    getCourseGrades: (courseId) => api.get(`/student/grades/${courseId}`),
    
    // Attendance
    getMyAttendance: () => api.get('/student/attendance'),
    getAttendanceSummary: () => api.get('/student/attendance/summary'),
    
    // Timetable
    getTimetable: () => api.get('/student/timetable'),
    
    // Materials
    getMaterials: () => api.get('/student/materials'),
    downloadMaterial: (materialId) => api.get(`/student/materials/${materialId}/download`, {
        responseType: 'blob'
    }),
    
    // Assignments
    getAssignments: () => api.get('/student/assignments'),
    submitAssignment: (assignmentId, formData) => api.post(
        `/student/assignments/${assignmentId}/submit`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
    ),
    
    // Profile
    getProfile: () => api.get('/student/profile'),
    updateProfile: (data) => api.put('/student/profile', data)
};

export default studentService;