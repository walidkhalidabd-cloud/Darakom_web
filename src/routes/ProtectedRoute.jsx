import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
    // التحقق من وجود التوكن في ذاكرة المتصفح
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');

    // إذا لم يوجد توكن، التوجيه لصفحة تسجيل الدخول
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // إذا كان هناك دور محدد مطلوب ولم يطابق دور المستخدم، التوجيه للوحة التحكم الخاصة به
    if (allowedRoles && user && !allowedRoles.includes(user.type)) {
        // توجيه المستخدم للوحة التحكم المناسبة حسب نوعه
        if (user.type === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.type === 'provider') return <Navigate to="/provider/dashboard" replace />;
        return <Navigate to="/client/dashboard" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
