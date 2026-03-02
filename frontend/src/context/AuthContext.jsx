import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    // Try to fetch fresh user data from backend
                    try {
                        const response = await api.get('/users/profile');
                        const userData = {
                            id: response.data._id,
                            _id: response.data._id,
                            username: response.data.username,
                            email: response.data.email,
                            role: response.data.role,
                            profilePicture: response.data.profilePicture,
                            bio: response.data.bio,
                            department: response.data.department,
                            year: response.data.year
                        };
                        setUser(userData);
                        localStorage.setItem('user', JSON.stringify(userData));
                    } catch (err) {
                        // Token might be invalid, try stored user
                        const storedUser = JSON.parse(localStorage.getItem('user'));
                        if (storedUser) {
                            setUser(storedUser);
                        } else {
                            // Clear invalid token
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                        }
                    }
                }
            } catch (error) {
                console.error('Auth check failed', error);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    const login = async (userData) => {
        const response = await api.post('/auth/login', userData);
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        return user;
    };

    const register = async (userData) => {
        const response = await api.post('/auth/register', userData);
        return response.data;
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const forgotPassword = async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    };

    const resetPassword = async (token, password) => {
        const response = await api.post(`/auth/reset-password/${token}`, { password });
        return response.data;
    };

    const updateUser = (updatedData) => {
        const newUser = { ...user, ...updatedData };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout, loading, updateUser, forgotPassword, resetPassword }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
