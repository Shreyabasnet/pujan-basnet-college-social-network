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
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getDashboardData,
        getMyCourses
    };
};
