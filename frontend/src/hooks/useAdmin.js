import { useState, useCallback } from 'react';
import adminService from '../services/admin.service';

export const useAdmin = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getTeachers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getTeachers();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch teachers');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getStudents = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getStudents();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch students');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteUser = useCallback(async (id) => {
        setLoading(true);
        try {
            await adminService.deleteTeacher(id); // Works for students too as it's the same endpoint
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete user');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getCourses = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getCourses();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch courses');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const createCourse = useCallback(async (data) => {
        setLoading(true);
        try {
            const response = await adminService.createCourse(data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create course');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateCourse = useCallback(async (id, data) => {
        setLoading(true);
        try {
            const response = await adminService.updateCourse(id, data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update course');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const deleteCourse = useCallback(async (id) => {
        setLoading(true);
        try {
            await adminService.deleteCourse(id);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to delete course');
            return false;
        } finally {
            setLoading(false);
        }
    }, []);

    const getDashboardStats = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getDashboardStats();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch dashboard stats');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getSettings = useCallback(async () => {
        setLoading(true);
        try {
            const response = await adminService.getSettings();
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch settings');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSetting = useCallback(async (data) => {
        setLoading(true);
        try {
            const response = await adminService.updateSetting(data);
            return response.data;
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update setting');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getTeachers,
        getStudents,
        deleteUser,
        getCourses,
        createCourse,
        updateCourse,
        deleteCourse,
        getDashboardStats,
        getSettings,
        updateSetting
    };
};
