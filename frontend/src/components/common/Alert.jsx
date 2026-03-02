import React from 'react';

const Alert = ({ type = 'info', message }) => {
    const alertStyles = {
        error: 'bg-red-100 border-red-400 text-red-700',
        success: 'bg-green-100 border-green-400 text-green-700',
        warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
        info: 'bg-blue-100 border-blue-400 text-blue-700'
    };

    const styleClass = alertStyles[type] || alertStyles.info;

    return (
        <div className={`border p-4 rounded-md ${styleClass} mb-4`} role="alert">
            <span className="block sm:inline">{message}</span>
        </div>
    );
};

export default Alert;
