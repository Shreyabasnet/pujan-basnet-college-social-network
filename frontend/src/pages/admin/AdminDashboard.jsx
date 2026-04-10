import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { BarChart3, GraduationCap, Plus, ShieldCheck, Users } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import AdminUserTable from '../../components/admin/AdminUserTable';
import AdminCourseTable from '../../components/admin/AdminCourseTable';
import CourseModal from '../../components/admin/CourseModal';

const AdminDashboard = () => {
    const {
        getTeachers, getStudents, deleteUser,
        getCourses, createCourse, updateCourse, deleteCourse,
        loading
    } = useAdmin();

    const [activeTab, setActiveTab] = useState('teachers');
    const [data, setData] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingItem, setEditingItem] = useState(null);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchData();
        if (activeTab === 'courses') fetchTeachers();
    }, [activeTab]);

    const fetchTeachers = async () => {
        const result = await getTeachers();
        setTeachers(result || []);
    };

    const fetchData = async () => {
        let result = [];
        if (activeTab === 'teachers') result = await getTeachers();
        else if (activeTab === 'students') result = await getStudents();
        else if (activeTab === 'courses') result = await getCourses();
        setData(result);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this?')) {
            const success = activeTab === 'courses' ? await deleteCourse(id) : await deleteUser(id);
            if (success) {
                toast.success('Deleted successfully');
                fetchData();
            } else {
                toast.error('Deletion failed');
            }
        }
    };

    const handleOpenModal = (item = null) => {
        setEditingItem(item);
        if (item) {
            setFormData({ ...item, teacher: item.teacher?._id || item.teacher });
        } else {
            setFormData({});
        }
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (activeTab === 'courses') {
            const result = editingItem
                ? await updateCourse(editingItem._id, formData)
                : await createCourse(formData);

            if (result) {
                toast.success(editingItem ? 'Updated!' : 'Created!');
                setShowModal(false);
                fetchData();
            } else {
                toast.error('Action failed');
            }
        }
    };

    return (
        <div className="mx-auto max-w-7xl p-6">
            <Toaster position="top-right" />

            <section className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-gradient-to-br from-slate-900 via-primary-800 to-cyan-700 p-6 text-white shadow-[0_30px_90px_-45px_rgba(15,23,42,0.6)]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.16),transparent_28%)]" />
                <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-4">
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/80">
                            <ShieldCheck className="h-4 w-4" />
                            Admin control panel
                        </span>
                        <h1 className="text-3xl font-black tracking-tight sm:text-4xl">Admin Control Panel</h1>
                        <p className="max-w-2xl text-sm leading-7 text-white/80 sm:text-base">Manage institutional resources, courses, teachers, and students from a cleaner command center.</p>
                    </div>
                    {activeTab === 'courses' && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-black/10 transition hover:-translate-y-0.5"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add course
                        </button>
                    )}
                </div>
            </section>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
                <QuickStat label="Teachers" value={data.length} icon={<Users className="h-5 w-5" />} />
                <QuickStat label="Students" value={activeTab === 'students' ? data.length : '—'} icon={<GraduationCap className="h-5 w-5" />} />
                <QuickStat label="Courses" value={activeTab === 'courses' ? data.length : '—'} icon={<BarChart3 className="h-5 w-5" />} />
            </div>

            <section className="mt-6 rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.35)]">
                <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-slate-100 pb-4">
                    <TabButton active={activeTab === 'teachers'} onClick={() => setActiveTab('teachers')} label="Teachers" />
                    <TabButton active={activeTab === 'students'} onClick={() => setActiveTab('students')} label="Students" />
                    <TabButton active={activeTab === 'courses'} onClick={() => setActiveTab('courses')} label="Courses" />
                </div>

                <div className="mb-5 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-black capitalize text-slate-900">{activeTab} list</h2>
                    {activeTab === 'courses' && (
                        <button
                            onClick={() => handleOpenModal()}
                            className="inline-flex items-center rounded-full bg-primary-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-700"
                        >
                            <Plus className="mr-2 h-4 w-4" /> Add course
                        </button>
                    )}
                </div>

                {activeTab === 'courses' ? (
                    <AdminCourseTable
                        data={data}
                        handleDelete={handleDelete}
                        handleOpenModal={handleOpenModal}
                        loading={loading}
                    />
                ) : (
                    <AdminUserTable
                        data={data}
                        activeTab={activeTab}
                        handleDelete={handleDelete}
                        loading={loading}
                    />
                )}
            </section>

            <CourseModal
                showModal={showModal}
                setShowModal={setShowModal}
                editingItem={editingItem}
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                teachers={teachers}
            />
        </div>
    );
};

const TabButton = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`rounded-full px-4 py-2 text-sm font-semibold transition ${active ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'}`}
    >
        {label}
    </button>
);

const QuickStat = ({ label, value, icon }) => (
    <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 shadow-[0_18px_50px_-35px_rgba(15,23,42,0.35)]">
        <div className="flex items-start justify-between gap-3">
            <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-50 text-primary-600">{icon}</div>
        </div>
    </div>
);

export default AdminDashboard;
