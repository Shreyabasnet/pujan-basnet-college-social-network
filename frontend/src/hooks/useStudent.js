import { useState, useCallback } from 'react';
import studentService from '../services/student.service';

export const useStudent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await studentService.getDashboardData();
            return response.data.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard data');
            return {
                enrolledCourses: [],
                recentGrades: [],
                todayClasses: [],
                attendance: {},
                upcomingDeadlines: []
            };
        } finally {
            setLoading(false);
        }
    }, []);

    const getMyCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getMyCourses();
            return response.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getMyGrades = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getMyGrades();
            return response.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch grades');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getMyAttendance = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getMyAttendance();
            return response.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch attendance');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getTimetable = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getTimetable();
            return response.data.data || { class: null, entries: [] };
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch timetable');
            return { class: null, entries: [] };
        } finally {
            setLoading(false);
        }
    }, []);

    const getMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getMaterials();
            return response.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch materials');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getAssignments = useCallback(async () => {
        setLoading(true);
        try {
            const response = await studentService.getAssignments();
            return response.data.data || [];
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch assignments');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getDashboardData,
        getMyCourses,
        getMyGrades,
        getMyAttendance,
        getTimetable,
        getMaterials,
        getAssignments
    };
};
