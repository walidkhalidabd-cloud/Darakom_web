import { Navigate, Outlet } from 'react-router-dom';
import { getAuthUser, getDashboardPath, isLoggedIn, normalizeUserType } from '../services/auth';

const ProtectedRoute = ({ allowedRoles }) => {
    const loggedIn = isLoggedIn();
    const user = getAuthUser();

    // غير مسجل دخول → توجيه لتسجيل الدخول
    if (!loggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    const userType = normalizeUserType(user.type);

    // تحقق من نوع المستخدم (إذا كان محدداً)
    if (allowedRoles && !allowedRoles.some(role => normalizeUserType(role) === userType)) {
        // توجيه لنوع لوحة التحكم المناسب
        return <Navigate to={getDashboardPath(user)} replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
