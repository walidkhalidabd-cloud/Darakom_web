import { useState } from 'react';
import { 
    FaHome, FaSearchDollar, FaFileContract, FaHardHat, 
    FaChartLine, FaBell, FaStar, FaExclamationTriangle, 
    FaUser, FaExchangeAlt, FaBars 
} from 'react-icons/fa';

// ==========================================
// 1. استيراد الواجهات (المكونات الداخلية)
// ==========================================
import ProviderDashboardTab from './partials/ProviderDashboardTab'; 
import TendersTab from './partials/TendersTab';
import OffersTab from './partials/OffersTab';
import ProjectsTab from './partials/ProjectsTab';

// ==========================================
// استيراد الواجهات الجديدة المطورة
// ==========================================
import ProviderTrackingTab from './partials/ProviderTrackingTab';
import ProviderNotificationsTab from './partials/ProviderNotificationsTab';
import ProviderReviewsTab from './partials/ProviderReviewsTab';
import ProviderComplaintsTab from './partials/ProviderComplaintsTab';
import ProviderProfileTab from './partials/ProviderProfileTab';

const ProviderDashboard = () => {
    // الحالة الافتراضية للتبويب النشط
    const [activeTab, setActiveTab] = useState('projects'); 
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    // قائمة التنقل الجانبية
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

    // جلب اسم التبويب النشط لعرضه في الشريط العلوي
    const activeMenuLabel = menuItems.find(item => item.id === activeTab)?.label || 'لوحة التحكم';

    return (
        <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
            
            {/* ==================== القائمة الجانبية (Sidebar) ==================== */}
            <div 
                className="d-flex flex-column flex-shrink-0 text-white transition-all" 
                style={{ 
                    width: isSidebarOpen ? '280px' : '0px', 
                    backgroundColor: '#1b2a47', 
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}
            >
                {/* الشعار */}
                <div className="p-4 text-center border-bottom border-secondary d-flex align-items-center justify-content-center gap-3">
                    <div className="bg-warning rounded d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
                        <FaHardHat className="text-dark fs-4" />
                    </div>
                    <div>
                        <h4 className="m-0 fw-bold text-white">داركم</h4>
                        <small className="text-warning">مزود خدمة</small>
                    </div>
                </div>

                {/* عناصر القائمة */}
                <ul className="nav nav-pills flex-column mb-auto p-3 gap-2">
                    {menuItems.map((item) => (
                        <li key={item.id} className="nav-item">
                            <button
                                onClick={() => setActiveTab(item.id)}
                                className={`nav-link w-100 text-end d-flex align-items-center gap-3 fw-bold px-3 py-2 ${activeTab === item.id ? 'active' : 'text-white'}`}
                                style={{
                                    backgroundColor: activeTab === item.id ? '#ff8a00' : 'transparent',
                                    color: activeTab === item.id ? '#fff' : 'rgba(255,255,255,0.8)',
                                    borderRadius: '8px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <span className="fs-5">{item.icon}</span>
                                {item.label}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* ==================== منطقة المحتوى الرئيسية ==================== */}
            <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
                
                {/* الشريط العلوي (Topbar) */}
                <header className="bg-white shadow-sm px-4 py-3 d-flex justify-content-between align-items-center border-bottom">
                    <div className="d-flex align-items-center gap-3">
                        <button 
                            className="btn btn-light d-lg-none" 
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <FaBars />
                        </button>
                        <h4 className="m-0 fw-bold" style={{ color: '#1b2a47' }}>{activeMenuLabel}</h4>
                    </div>

                    <div className="d-flex align-items-center gap-4">
                        {/* زر التبديل لحساب العميل */}
                        <button 
                            onClick={() => window.location.href = '/client/dashboard'}
                            className="btn btn-outline-secondary rounded-pill d-flex align-items-center gap-2 fw-bold px-3 transition-hover"
                            style={{ borderColor: '#e9ecef', color: '#1b2a47' }}
                        >
                            <FaExchangeAlt /> التبديل لحساب العميل
                        </button>
                        
                        {/* الإشعارات */}
                        <div className="position-relative cursor-pointer">
                            <FaBell className="fs-4 text-secondary" />
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                                5
                            </span>
                        </div>
                        
                        {/* صورة المستخدم */}
                        <div className="bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center fw-bold" style={{ width: '40px', height: '40px' }}>
                            م
                        </div>
                    </div>
                </header>

                {/* ==================== منطقة عرض التبويبات (Routing Area) ==================== */}
                <main className="flex-grow-1 p-4" style={{ overflowY: 'auto' }}>
                    {activeTab === 'dashboard' && <ProviderDashboardTab setActiveTab={setActiveTab} />}
                    {activeTab === 'tenders' && <TendersTab />}
                    {activeTab === 'offers' && <OffersTab />}
{activeTab === 'projects' && <ProjectsTab setActiveTab={setActiveTab} />}

                    {/* الواجهات الجديدة المطورة */}
                    {activeTab === 'tracking' && <ProviderTrackingTab />}
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