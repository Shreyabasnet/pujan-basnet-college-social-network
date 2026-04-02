import React from 'react';
import { X } from 'lucide-react';

const CourseModal = ({ 
    showModal, 
    setShowModal, 
    editingItem, 
    formData, 
    setFormData, 
    handleSubmit, 
    teachers = [] 
}) => {
    if (!showModal) return null;

    const safeTeachers = Array.isArray(teachers) ? teachers : [];

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-lg w-full p-8 shadow-2xl relative">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold">
                        {editingItem ? 'Edit Course' : 'Add New Course'}
                    </h3>
                    <button 
                        type="button"
                        onClick={() => setShowModal(false)}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Code
                        </label>
                        <input
                            type="text" 
                            required
                            placeholder="e.g., CS101"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            value={formData.code || ''}
                            onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Course Name
                        </label>
                        <input
                            type="text" 
                            required
                            placeholder="e.g., Introduction to Computer Science"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Department
                        </label>
                        <input
                            type="text" 
                            required
                            placeholder="e.g., CS, BBA, etc."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            value={formData.department || ''}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Students in this department will see this course automatically.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Assign Teacher
                        </label>
                        <select
                            required
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            value={formData.teacher || ''}
                            onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
                        >
                            <option value="">Select a Teacher</option>
                            {safeTeachers.map(teacher => (
                                <option key={teacher._id} value={teacher._id}>
                                    {teacher.username} ({teacher.email})
                                </option>
                            ))}
                        </select>
                        <p className="text-xs text-gray-500 mt-1">
                            Select the instructor responsible for this course.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            placeholder="Briefly describe the course objectives..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                            rows="3"
                            value={formData.description || ''}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6 border-t mt-6">
                        <button 
                            type="button" 
                            onClick={() => setShowModal(false)} 
                            className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium transition"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-8 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 shadow-md transition font-semibold"
                        >
                            {editingItem ? 'Save Changes' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CourseModal;
