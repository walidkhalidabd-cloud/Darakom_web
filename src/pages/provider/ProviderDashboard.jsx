import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaHome, FaSearchDollar, FaFileContract, FaHardHat, 
    FaChartLine, FaBell, FaStar, FaExclamationTriangle, 
    FaUser, FaExchangeAlt, FaBars, FaSignOutAlt 
} from 'react-icons/fa';

import ProviderDashboardTab from './partials/ProviderDashboardTab'; 
import TendersTab from './partials/TendersTab';
import OffersTab from './partials/OffersTab';
import ProjectsTab from './partials/ProjectsTab';
import ProviderTrackingTab from './partials/ProviderTrackingTab';
import ProviderNotificationsTab from './partials/ProviderNotificationsTab';
import ProviderReviewsTab from './partials/ProviderReviewsTab';
import ProviderComplaintsTab from './partials/ProviderComplaintsTab';
import ProviderProfileTab from './partials/ProviderProfileTab';

const ProviderDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const navigate = useNavigate(); 

    const handleSwitchToClient = () => {
        navigate('/client/dashboard'); 
    };

    const handleLogout = () => {
        navigate('/login'); 
    };

    const menuItems = [
        { id: 'dashboard', label: 'لوحة التحكم', icon: <FaHome /> },
        { id: 'tenders', label: 'المناقصات', icon: <FaSearchDollar /> },
        { id: 'offers', label: 'العروض', icon: <FaFileContract /> },
        { id: 'projects', label: 'مشاريعي', icon: <FaHardHat /> },
        { id: 'tracking', label: 'متابعة المشاريع', icon: <FaChartLine /> },
        { id: 'notifications', label: 'الإشعارات', icon: <FaBell /> },
        { id: 'reviews', label: 'التقييمات', icon: <FaStar /> },
        { id: 'complaints', label: 'الشكاوي', icon: <FaExclamationTriangle /> },
        { id: 'profile', label: 'الملف الشخصي', icon: <FaUser /> },
    ];

    const activeMenuLabel = menuItems.find(item => item.id === activeTab)?.label || 'لوحة التحكم';

    return (
        // التعديل الرئيسي: استخدام height: 100vh و overflow: hidden لتثبيت الشاشة
        <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f8f9fa', fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
            
            {/* القائمة الجانبية */}
            <div className="d-flex flex-column flex-shrink-0 text-white transition-all shadow-lg" style={{ width: isSidebarOpen ? '280px' : '0px', height: '100vh', backgroundColor: '#1b2a47', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                
                <div className="p-4 text-center border-bottom border-secondary d-flex align-items-center justify-content-center gap-3">
                    <div className="bg-warning rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FaHardHat className="text-dark fs-4" />
                    </div>
                    <div>
                        <h4 className="m-0 fw-bold text-white">داركم</h4>
                        <small className="text-warning">مزود خدمة</small>
                    </div>
                </div>
                
                {/* التبويبات (تأخذ المساحة المتاحة وتسمح بالتمرير الداخلي إن لزم الأمر) */}
                <ul className="nav nav-pills flex-column mb-auto p-3 gap-2" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
                    {menuItems.map((item) => (
                        <li key={item.id} className="nav-item">
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`nav-link w-100 text-end d-flex align-items-center gap-3 fw-bold px-3 py-2 ${activeTab === item.id ? 'active' : 'text-white'}`}
                                style={{ backgroundColor: activeTab === item.id ? '#ff8a00' : 'transparent', color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.8)', borderRadius: '8px', transition: 'all 0.3s ease', border: 'none' }}
                            >
                                <span className="fs-5">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>

                {/* زر تسجيل الخروج ثابت بالأسفل بشكل دائم */}
                <div className="p-3 mt-auto" style={{ backgroundColor: 'rgba(0, 0, 0, 0.15)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        onClick={handleLogout}
                        className="btn w-100 text-end d-flex align-items-center gap-3 fw-bold px-3 py-2 text-white rounded-3"
                        style={{ transition: 'all 0.3s ease', border: 'none', background: 'transparent' }}
                        onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#dc3545'; e.currentTarget.style.color = '#fff'; }}
                        onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#fff'; }}
                    >
                        <span className="fs-5 text-danger"><FaSignOutAlt /></span>
                        تسجيل الخروج
                    </button>
                </div>

            </div>

            {/* محتوى الصفحة الرئيسي */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
                <header className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <button className="btn btn-light d-lg-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                            <FaBars />
                        </button>
                        <h4 className="m-0 fw-bold" style={{ color: '#1b2a47' }}>{activeMenuLabel}</h4>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        <button onClick={handleSwitchToClient} className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 fw-bold px-3 transition-hover" style={{ borderColor: '#e9ecef', color: '#1b2a47' }}>
                            <FaExchangeAlt /> التبديل لحساب العميل
                        </button>
                        <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
                            <FaBell className="fs-4 text-secondary" />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">5</span>
                        </div>
                        <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px', cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
                            م
                        </div>
                    </div>
                </header>

                <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                    {activeTab === 'dashboard' && <ProviderDashboardTab setActiveTab={setActiveTab} />}
                    {activeTab === 'tenders' && <TendersTab />}
                    {activeTab === 'offers' && <OffersTab />}
                    {activeTab === 'projects' && <ProjectsTab setActiveTab={setActiveTab} />}
                    {activeTab === 'tracking' && <ProviderTrackingTab setActiveTab={setActiveTab} />}
                    {activeTab === 'notifications' && <ProviderNotificationsTab />}
                    {activeTab === 'reviews' && <ProviderReviewsTab />}
                    {activeTab === 'complaints' && <ProviderComplaintsTab />}
                    {activeTab === 'profile' && <ProviderProfileTab />}
                </main>
            </div>
        </div>
    );
};

export default ProviderDashboard;