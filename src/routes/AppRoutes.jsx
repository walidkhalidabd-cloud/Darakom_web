import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MainNavBar from '../components/MainNavBar';
import Footer from '../components/Footer';

// استدعاء الصفحات
import Home from '../pages/home/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Guidance from '../pages/Guidance';
import ClientDashboard from '../pages/client/ClientDashboard';

// تم تصحيح مسار الاستيراد هنا (استخدام ../ بدلاً من ./)
import ResetPassword from '../pages/ResetPassword'; 

// استدعاء لوحة تحكم مزود الخدمة الحقيقية
import ProviderDashboard from '../pages/provider/ProviderDashboard';

// استدعاء لوحة الإدارة الحقيقية
import AdminDashboard from '../pages/admin/AdminDashboard';

// 1. القالب العام (يحتوي على القائمة العلوية والفوتر)
const PublicLayout = () => (
    <div className="d-flex flex-column min-vh-100">
        <MainNavBar />
        <main className="flex-grow-1">
            <Outlet />
        </main>
        <Footer />
    </div>
);

// 2. قالب لوحات التحكم (شاشة كاملة، بدون قائمة الموقع والفوتر)
const DashboardLayout = () => (
    <div className="d-flex flex-column min-vh-100" style={{ backgroundColor: '#f4f6f9' }}>
        <Outlet />
    </div>
);

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                
                {/* --- المسارات العامة (داخل القالب العام) --- */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/guidance" element={<Guidance />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* --- مسارات لوحات التحكم (داخل قالب لوحة التحكم المستقل) --- */}
                <Route element={<DashboardLayout />}>
                    {/* العميل */}
                    <Route element={<ProtectedRoute allowedRoles={['client']} />}>
                        <Route path="/client/dashboard" element={<ClientDashboard />} />
                    </Route>
                    
                    {/* مزود الخدمة */}
                    <Route element={<ProtectedRoute allowedRoles={['provider']} />}>
                        <Route path="/provider/dashboard" element={<ProviderDashboard />} />
                    </Route>
                    
                    {/* الإدارة */}
                    <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                        <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    </Route>
                </Route>

            </Routes>
        </Router>
    );
};

export default AppRoutes;