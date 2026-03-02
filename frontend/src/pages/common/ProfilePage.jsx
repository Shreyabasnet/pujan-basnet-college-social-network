import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, Save, Loader } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const fileInputRef = useRef(null);
    const [uploadingPicture, setUploadingPicture] = useState(false);
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        bio: '',
        department: '',
        year: '',
        profilePicture: '',
        role: ''
    });

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/users/profile');
            setProfile({
                username: res.data.username || '',
                email: res.data.email || '',
                bio: res.data.bio || '',
                department: res.data.department || '',
                year: res.data.year || '',
                profilePicture: res.data.profilePicture || '',
                role: res.data.role || ''
            });
        } catch (error) {
            console.error(error);
        }
    };

    const [isEditing, setIsEditing] = useState(false);

    const handleChange = (e) => {
        setProfile({ ...profile, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put('/users/profile', {
                bio: profile.bio,
                department: profile.department,
                year: profile.year
            });
            // Update local storage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.data.user }));
            }
            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            toast.error('Failed to update profile');
        }
    };

    const handleProfilePictureClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error('Image size should be less than 5MB');
            return;
        }

        const formData = new FormData();
        formData.append('profilePicture', file);

        setUploadingPicture(true);
        try {
            const res = await api.post('/users/profile/picture', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setProfile({ ...profile, profilePicture: res.data.profilePicture });
            
            // Update local storage
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) {
                localStorage.setItem('user', JSON.stringify({ ...storedUser, profilePicture: res.data.profilePicture }));
            }
            
            toast.success('Profile picture updated!');
        } catch (error) {
            console.error(error);
            toast.error('Failed to upload profile picture');
        } finally {
            setUploadingPicture(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-64px)] bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <Toaster position="top-right" />
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">

                {/* Header / Cover */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="relative">
                            <div className="h-32 w-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden shadow-lg">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt={profile.username} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-16 w-16 text-gray-400" />
                                )}
                                {uploadingPicture && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                        <Loader className="h-8 w-8 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button 
                                onClick={handleProfilePictureClick}
                                disabled={uploadingPicture}
                                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-primary-600 border border-gray-200 transition disabled:opacity-50"
                            >
                                <Camera className="h-5 w-5" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex justify-between items-end mb-6">
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold text-gray-900">{profile.username}</h1>
                                {profile.role === 'TEACHER' && (
                                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">Teacher</span>
                                )}
                                {profile.role === 'ADMIN' && (
                                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium">Admin</span>
                                )}
                            </div>
                            <p className="text-gray-500">{profile.department} {profile.department && profile.year && '•'} {profile.year}</p>
                            <p className="text-gray-400 text-sm">{profile.email}</p>
                        </div>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="text-primary-600 hover:text-primary-800 font-medium"
                        >
                            {isEditing ? 'Cancel' : 'Edit Profile'}
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                            {isEditing ? (
                                <textarea
                                    name="bio"
                                    rows="3"
                                    className="w-full rounded-lg border-gray-300 border p-3 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="Tell us about yourself..."
                                    value={profile.bio}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                                    {profile.bio || <span className="text-gray-400 italic">No bio added yet</span>}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                                {isEditing ? (
                                    <input
                                        name="department"
                                        type="text"
                                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="e.g. Computer Science"
                                        value={profile.department}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="text-gray-900 font-medium">
                                        {profile.department || <span className="text-gray-400 font-normal">Not specified</span>}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                                {isEditing ? (
                                    <input
                                        name="year"
                                        type="text"
                                        className="w-full rounded-lg border-gray-300 border p-2 focus:ring-primary-500 focus:border-primary-500"
                                        placeholder="e.g. 2025"
                                        value={profile.year}
                                        onChange={handleChange}
                                    />
                                ) : (
                                    <div className="text-gray-900 font-medium">
                                        {profile.year || <span className="text-gray-400 font-normal">Not specified</span>}
                                    </div>
                                )}
                            </div>
                        </div>

                        {isEditing && (
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    className="flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
                                >
                                    <Save className="h-5 w-5 mr-2" />
                                    Save Changes
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
