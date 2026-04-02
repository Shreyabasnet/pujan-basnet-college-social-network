import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, Download } from 'lucide-react';

const MaterialsPage = () => {
    const { getMaterials, loading, error } = useStudent();
    const [materials, setMaterials] = useState([]);

    useEffect(() => {
        fetchMaterials();
    }, []);

    const fetchMaterials = async () => {
        const data = await getMaterials();
        setMaterials(data || []);
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">Study Materials</h1>
            
            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {materials.length === 0 ? (
                    <div className="col-span-full bg-white rounded-lg shadow p-8 text-center text-gray-500">
                        No study materials available at the moment.
                    </div>
                ) : (
                    materials.map(material => (
                        <div key={material._id} className="bg-white rounded-lg shadow p-6 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                        <FileText className="h-6 w-6" />
                                    </div>
                                    <h3 className="font-semibold text-lg">{material.title}</h3>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">{material.description}</p>
                                <div className="text-xs text-gray-400">
                                    Course: {material.course?.title}
                                </div>
                            </div>
                            <button className="mt-6 flex items-center justify-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg transition border border-gray-200">
                                <Download className="h-4 w-4" />
                                <span>Download</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MaterialsPage;
