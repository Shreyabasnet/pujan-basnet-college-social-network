import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, ChevronRight, GraduationCap, MessageCircle, Sparkles, Users } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const LandingPage = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && user) {
            const dashboardPath = user.role === 'ADMIN' ? '/admin/dashboard' :
                user.role === 'TEACHER' ? '/teacher/dashboard' :
                    '/student/dashboard';
            navigate(dashboardPath);
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
        <div className="min-h-screen bg-slate-50">
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.24),transparent_32%),radial-gradient(circle_at_top_right,rgba(14,165,233,0.18),transparent_26%)]" />
                <div className="absolute left-10 top-24 h-56 w-56 rounded-full bg-primary-200/30 blur-3xl" />
                <div className="absolute right-8 top-32 h-72 w-72 rounded-full bg-cyan-200/30 blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
                    <div className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/85 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.45)] backdrop-blur">
                        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)] lg:items-center p-8 sm:p-10 lg:p-14">
                            <div className="space-y-8">
                                <span className="inline-flex items-center gap-2 rounded-full border border-primary-100 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-primary-700 shadow-sm">
                                    <Sparkles className="h-4 w-4" />
                                    College social network
                                </span>
                                <div className="space-y-4">
                                    <h1 className="max-w-3xl text-4xl font-black tracking-tight text-slate-900 sm:text-5xl lg:text-7xl">
                                        Connect, collaborate, and build a stronger campus community.
                                    </h1>
                                    <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                                        A modern space for announcements, resources, conversations, events, and academic updates across students, teachers, and administrators.
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <Link to="/register" className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-0.5 hover:bg-slate-800">
                                        Get started
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                    <Link to="/login" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-6 py-3.5 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 hover:border-primary-200 hover:text-primary-700">
                                        Login
                                    </Link>
                                </div>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <HeroCard icon={<GraduationCap className="h-5 w-5" />} title="Academic feed" description="Share class updates and student discussions." />
                                <HeroCard icon={<MessageCircle className="h-5 w-5" />} title="Instant chat" description="Keep conversations going without leaving the app." />
                                <HeroCard icon={<BookOpen className="h-5 w-5" />} title="Resource sharing" description="Post PDFs, documents, and study material." />
                                <HeroCard icon={<Calendar className="h-5 w-5" />} title="Events & deadlines" description="Surface what matters next on campus." />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
                <div className="mb-8 flex items-end justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">Why join</p>
                        <h2 className="mt-2 text-3xl font-black text-slate-900">Built for the full college experience</h2>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
                    <FeatureCard
                        icon={<Users className="h-6 w-6" />}
                        title="Connect"
                        description="Find peers from your department and year easily."
                    />
                    <FeatureCard
                        icon={<MessageCircle className="h-6 w-6" />}
                        title="Chat & discuss"
                        description="Real-time messaging and discussion on posts."
                    />
                    <FeatureCard
                        icon={<BookOpen className="h-6 w-6" />}
                        title="Share resources"
                        description="Upload and share study materials and notes."
                    />
                    <FeatureCard
                        icon={<Calendar className="h-6 w-6" />}
                        title="Events"
                        description="Stay updated with college events and deadlines."
                    />
                </div>
            </div>
        </div>
    );
};

const HeroCard = ({ icon, title, description }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
);

const FeatureCard = ({ icon, title, description }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)] transition hover:-translate-y-1 hover:shadow-lg">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
);

export default LandingPage;
