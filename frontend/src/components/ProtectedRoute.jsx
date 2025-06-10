import { Navigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (!token) {
        toast.error('Please login to continue');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (adminOnly && user?.role !== 'admin') {
        toast.error('Access denied. Admin only.');
        return <Navigate to="/browse-projects" replace />;
    }

    return children;
};

export default ProtectedRoute;