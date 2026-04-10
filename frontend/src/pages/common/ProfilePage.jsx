import React, { useState, useEffect, useRef } from 'react';
import { User, Camera, Save, Loader, Sparkles } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

const ProfilePage = () => {
    const { user, loading } = useAuth();
    const { id } = useParams();
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
    const isOwnProfile = !id || id === user?._id || id === user?.id;

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user, id]);

    const fetchProfile = async () => {
        try {
            const endpoint = id ? `/users/${id}` : '/users/profile';
            const res = await api.get(endpoint);
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

    useEffect(() => {
        if (!isOwnProfile) {
            setIsEditing(false);
        }
    }, [isOwnProfile]);

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
        if (!isOwnProfile) return;
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
            <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-slate-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    const roleBadge = profile.role === 'TEACHER'
        ? 'bg-sky-100 text-sky-800'
        : profile.role === 'ADMIN'
            ? 'bg-violet-100 text-violet-800'
            : 'bg-emerald-100 text-emerald-800';

    const roleLabel = profile.role
        ? `${profile.role.charAt(0)}${profile.role.slice(1).toLowerCase()}`
        : 'Member';

    return (
        <div className="space-y-6">
            <Toaster position="top-right" />

            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <Sparkles className="h-4 w-4" />
                            Profile
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Your dashboard profile</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">
                            Keep your identity, role, and personal details in sync with the rest of your dashboard experience.
                        </p>
                    </div>
                    <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur">
                        <p className="text-xs uppercase tracking-[0.18em] text-white/70">Role</p>
                        <p className="mt-1 text-sm font-semibold text-white">{roleLabel}</p>
                    </div>
                </div>
            </section>

            <section className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center overflow-hidden shadow-lg">
                                {profile.profilePicture ? (
                                    <img src={profile.profilePicture} alt={profile.username} className="h-full w-full object-cover" />
                                ) : (
                                    <User className="h-10 w-10 text-slate-400" />
                                )}
                                {uploadingPicture && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-full">
                                        <Loader className="h-6 w-6 text-white animate-spin" />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={handleProfilePictureClick}
                                disabled={uploadingPicture || !isOwnProfile}
                                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md text-slate-600 hover:text-primary-600 border border-slate-200 transition disabled:opacity-50"
                            >
                                <Camera className="h-4 w-4" />
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                className="hidden"
                                onChange={handleFileChange}
                            />
                        </div>

                        <div>
                            <div className="flex flex-wrap items-center gap-3">
                                <h2 className="text-2xl font-black text-slate-900">{profile.username}</h2>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${roleBadge}`}>
                                    {roleLabel}
                                </span>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    disabled={!isOwnProfile}
                                    className="inline-flex items-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {isOwnProfile ? (isEditing ? 'Cancel' : 'Edit profile') : 'Profile'}
                                </button>
                            </div>
                            <p className="mt-1 text-sm text-slate-500">{profile.email || 'No email provided'}</p>
                            <p className="text-sm text-slate-500">{profile.department || 'No department'} {profile.department && profile.year && '•'} {profile.year || ''}</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Bio</label>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                rows="4"
                                className="w-full rounded-xl border border-slate-300 bg-white p-3 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                placeholder="Tell us about yourself..."
                                value={profile.bio}
                                onChange={handleChange}
                            />
                        ) : (
                            <p className="text-slate-700 rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-[112px]">
                                {profile.bio || <span className="text-slate-400 italic">No bio added yet</span>}
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Department</label>
                            {isEditing ? (
                                <input
                                    name="department"
                                    type="text"
                                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. Computer Science"
                                    value={profile.department}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900">
                                    {profile.department || <span className="font-normal text-slate-400">Not specified</span>}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Year</label>
                            {isEditing ? (
                                <input
                                    name="year"
                                    type="text"
                                    className="w-full rounded-xl border border-slate-300 bg-white p-2.5 text-sm text-slate-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                    placeholder="e.g. 2025"
                                    value={profile.year}
                                    onChange={handleChange}
                                />
                            ) : (
                                <p className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-900">
                                    {profile.year || <span className="font-normal text-slate-400">Not specified</span>}
                                </p>
                            )}
                        </div>
                    </div>

                    {isEditing && (
                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center rounded-full bg-primary-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-700"
                            >
                                <Save className="h-5 w-5 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </form>
            </section>
        </div>
    );
};

export default ProfilePage;
