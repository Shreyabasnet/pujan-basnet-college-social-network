import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, BookOpen, Calendar, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            navigate('/feed');
        }
    }, [user, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
                            Connect, Collaborate, & Create
                        </h1>
                        <p className="text-xl md:text-2xl text-primary-100 mb-10 max-w-3xl mx-auto">
                            Your exclusive college network to stay updated with events, share resources, and connect with peers and faculty.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <Link to="/register" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-primary-50 transition shadow-lg">
                                Get Started
                            </Link>
                            <Link to="/login" className="bg-transparent border-2 border-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-white/10 transition">
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">Why Join Us?</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <FeatureCard
                        icon={<Users className="h-10 w-10 text-primary-500" />}
                        title="Connect"
                        description="Find peers from your department and year easily."
                    />
                    <FeatureCard
                        icon={<MessageCircle className="h-10 w-10 text-primary-500" />}
                        title="Chat & Discuss"
                        description="Real-time messaging and discussion on posts."
                    />
                    <FeatureCard
                        icon={<BookOpen className="h-10 w-10 text-primary-500" />}
                        title="Share Resources"
                        description="Upload and share study materials and notes."
                    />
                    <FeatureCard
                        icon={<Calendar className="h-10 w-10 text-primary-500" />}
                        title="Events"
                        description="Stay updated with college events and deadlines."
                    />
                </div>
            </div>
        </div>
    );
};

const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition border border-gray-100 text-center">
        <div className="flex justify-center mb-4">{icon}</div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
    </div>
);

export default LandingPage;
