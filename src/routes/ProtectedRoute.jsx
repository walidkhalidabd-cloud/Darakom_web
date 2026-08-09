import { Navigate, Outlet } from 'react-router-dom';
import { getAuthUser, isLoggedIn } from '../services/auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const loggedIn = isLoggedIn();
    const user = getAuthUser();

    // غير مسجل دخول → توجيه لتسجيل الدخول
    if (!loggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    // تحقق من نوع المستخدم (إذا كان محدداً)
    if (allowedRoles && !allowedRoles.includes(user.type)) {
        // توجيه لنوع لوحة التحكم المناسب
        if (user.type === 'client') return <Navigate to="/client/dashboard" replace />;
        if (user.type === 'provider') return <Navigate to="/provider/dashboard" replace />;
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
