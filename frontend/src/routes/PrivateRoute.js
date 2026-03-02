import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/common/LoadingSpinner';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard based on role
        switch(user.role) {
            case 'admin':
                return <Navigate to="/admin/dashboard" />;
            case 'teacher':
                return <Navigate to="/teacher/dashboard" />;
            case 'student':
                return <Navigate to="/student/dashboard" />;
            default:
                return <Navigate to="/unauthorized" />;
        }
    }

    return children;
};

export default PrivateRoute;