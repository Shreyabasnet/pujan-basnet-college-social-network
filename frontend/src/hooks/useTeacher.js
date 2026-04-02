import { useState } from 'react';
import teacherService from '../services/teacher.service';

export const useTeacher = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboardData = async () => {
        setLoading(true);
        try {
            const response = await teacherService.getDashboardData();
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching dashboard');
            return {
                stats: {},
                recentCourses: [],
                todaySchedule: [],
                recentActivities: []
            };
        } finally {
            setLoading(false);
        }
    };

    const getMyCourses = async () => {
        setLoading(true);
        try {
            const response = await teacherService.getMyCourses();
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching courses');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const markAttendance = async (attendanceData) => {
        setLoading(true);
        try {
            const response = await teacherService.markAttendance(attendanceData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error marking attendance');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getAssignments = async (courseId) => {
        setLoading(true);
        try {
            const response = await teacherService.getAssignments(courseId);
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching assignments');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createAssignment = async (assignmentData) => {
        setLoading(true);
        try {
            const response = await teacherService.createAssignment(assignmentData);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Error creating assignment');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        getDashboardData,
        getMyCourses,
        markAttendance,
        getAssignments,
        createAssignment
    };
};
