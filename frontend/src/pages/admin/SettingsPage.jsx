import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import { Settings, Shield, Bell, Database, Save, Loader2 } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';

const SettingsPage = () => {
    const { getSettings, updateSetting, loading, error } = useAdmin();
    const [settingsList, setSettingsList] = useState([]);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        const data = await getSettings();
        setSettingsList(data);
    };

    const handleToggle = async (key, currentValue) => {
        const newValue = !currentValue;
        const result = await updateSetting({ key, value: newValue });
        if (result) {
            setSettingsList(settingsList.map(s => s.key === key ? { ...s, value: newValue } : s));
            toast.success(`Updated ${key.replace(/_/g, ' ')}`);
        } else {
            toast.error('Failed to update setting');
        }
    };

    const renderSetting = (setting) => {
        if (typeof setting.value === 'boolean') {
            return (
                <button
                    onClick={() => handleToggle(setting.key, setting.value)}
                    disabled={loading}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                        setting.value ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                >
                    <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            setting.value ? 'translate-x-6' : 'translate-x-1'
                        }`}
                    />
                </button>
            );
        }
        return (
            <input 
                type="text" 
                defaultValue={setting.value}
                className="text-sm border rounded px-2 py-1 w-48 text-right bg-gray-50 focus:bg-white"
                readOnly
            />
        );
    };

    const securitySettings = settingsList.filter(s => s.category === 'SECURITY');
    const notifySettings = settingsList.filter(s => s.category === 'NOTIFICATION');
    const systemSettings = settingsList.filter(s => s.category === 'SYSTEM');

    return (
        <div className="space-y-6 max-w-4xl">
            <Toaster position="top-right" />
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
                {loading && <Loader2 className="animate-spin text-primary-600" />}
            </div>

            <div className="grid grid-cols-1 gap-6">
                {/* Security */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold">Security Settings</h2>
                    </div>
                    <div className="space-y-4">
                        {securitySettings.map(s => (
                            <div key={s.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-colors">
                                <div>
                                    <p className="font-medium text-gray-800">{s.description || s.key.replace(/_/g, ' ')}</p>
                                    <p className="text-xs text-gray-500">Require authorization for this action</p>
                                </div>
                                {renderSetting(s)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                            <Bell className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold">Notification Settings</h2>
                    </div>
                    <div className="space-y-4">
                        {notifySettings.map(s => (
                            <div key={s.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">{s.description || s.key.replace(/_/g, ' ')}</p>
                                </div>
                                {renderSetting(s)}
                            </div>
                        ))}
                    </div>
                </div>

                {/* System */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center space-x-3 mb-6">
                        <div className="p-2 bg-green-100 rounded-lg text-green-600">
                            <Database className="h-6 w-6" />
                        </div>
                        <h2 className="text-xl font-semibold">General System</h2>
                    </div>
                    <div className="space-y-4">
                        {systemSettings.map(s => (
                            <div key={s.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                                <div>
                                    <p className="font-medium text-gray-800">{s.description || s.key.replace(/_/g, ' ')}</p>
                                </div>
                                {renderSetting(s)}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;
