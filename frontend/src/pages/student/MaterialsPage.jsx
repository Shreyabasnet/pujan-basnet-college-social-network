import React, { useState, useEffect } from 'react';
import { useStudent } from '../../hooks/useStudent';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { FileText, Download } from 'lucide-react';
import { API_BASE_URL } from '../../config/constants';

const MaterialsPage = () => {
    const { getMaterials, loading, error } = useStudent();
    const [materials, setMaterials] = useState([]);
    const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, '');

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
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow p-6 text-white">
                <h1 className="text-3xl font-bold">Study Materials</h1>
                <p className="mt-2 text-blue-100">Browse notes, slides, and class resources</p>
            </div>
            
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
                                    Course: {material.course?.name || material.course?.title || 'N/A'}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    if (!material.fileUrl) return;
                                    window.open(`${backendBaseUrl}${material.fileUrl}`, '_blank', 'noopener,noreferrer');
                                }}
                                disabled={!material.fileUrl}
                                className="mt-6 flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2 rounded-lg transition disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                <Download className="h-4 w-4" />
                                <span>{material.fileUrl ? 'Download' : 'Unavailable'}</span>
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MaterialsPage;
