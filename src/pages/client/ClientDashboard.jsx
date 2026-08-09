import { useState } from 'react';

// استدعاء جميع المكونات المفصولة (النظيفة)
import ClientSidebar from './partials/ClientSidebar';
import ClientTopbar from './partials/ClientTopbar';
import DashboardTab from './partials/DashboardTab'; 
import FavoritesTab from './partials/FavoritesTab';
import AddProjectTab from './partials/AddProjectTab';
import OffersTab from './partials/OffersTab';
import OffersReceivedTab from './partials/OffersReceivedTab'; // <--- واجهة العروض الجديدة
import NotificationsTab from './partials/NotificationsTab'; 
import ComplaintsTab from './partials/ComplaintsTab';
import ReviewsTab from './partials/ReviewsTab'; 
import ProfileTab from './partials/ProfileTab'; // <--- استدعاء واجهة الملف الشخصي الأخيرة!
import TrackingTab from './partials/TrackingTab'; // <--- واجهة متابعة سير المشاريع

const ClientDashboard = () => {
    // الواجهة الافتراضية للوحة تحكم العميل
    const [activeTab, setActiveTab] = useState('dashboard'); 
    
    // متغيرات إضافة مشروع 
    const [projectType, setProjectType] = useState('construction');
    const [directProvider, setDirectProvider] = useState(null);

    const handleDirectOffer = (provider) => {
        const constructionTypes = ['مكتب هندسي', 'مهندس معماري', 'مهندس مدني', 'مهندس استشاري', 'مقاول بناء', 'مكاتب هندسية وشركات'];
        setProjectType(constructionTypes.includes(provider.type) ? 'construction' : 'finishing');
        setDirectProvider(provider.name); 
        setActiveTab('add-project');
        window.scrollTo(0, 0); 
    };

    const getTabName = () => {
        const tabs = {
            'dashboard': 'الرئيسية', 'add-project': 'إضافة مشروع', 'offers': 'مشاريعي', 
            'favorites': 'المفضلة', 'notifications': 'الإشعارات',
            'complaints': 'الشكاوي', 'reviews': 'التقييمات', 'profile': 'الملف الشخصي',
            'offers-public': 'العروض العامة', 'offers-private': 'العروض الخاصة',
            'tracking': 'متابعة سير المشاريع'
        };
        return tabs[activeTab] || 'لوحة التحكم';
    };

    return (
        <div className="container-fluid p-0" style={{ fontFamily: "'Tajawal', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <div className="row g-0 flex-nowrap" style={{ minHeight: '100vh' }}>
                
                {/* القائمة الجانبية */}
                <ClientSidebar 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    setDirectProvider={setDirectProvider} 
                />

                {/* منطقة المحتوى */}
                <div className="col overflow-auto" style={{ height: '100vh' }}>
                    
                    {/* الشريط العلوي */}
                    <ClientTopbar activeTabName={getTabName()} setActiveTab={setActiveTab} />

                    <div className="p-4 p-md-5">

                        {/* ================= نظام التوجيه الداخلي (Router) السلس والمكتمل ================= */}
                        
                        {activeTab === 'dashboard' && <DashboardTab setActiveTab={setActiveTab} />}
                        {activeTab === 'favorites' && <FavoritesTab handleDirectOffer={handleDirectOffer} />}
                        
                        {activeTab === 'add-project' && (
                            <AddProjectTab 
                                projectType={projectType} 
                                setProjectType={setProjectType} 
                                directProvider={directProvider} 
                                setDirectProvider={setDirectProvider}
                                setActiveTab={setActiveTab}
                            />
                        )}

                        {activeTab === 'offers' && <OffersTab />}
                        
                        {/* العروض العامة والخاصة */}
                        {(activeTab === 'offers-public' || activeTab === 'offers-private') && <OffersReceivedTab />}
                        
                        {activeTab === 'notifications' && <NotificationsTab />}
                        {activeTab === 'complaints' && <ComplaintsTab />}
                        {activeTab === 'reviews' && <ReviewsTab />}
                        
                        {/* الواجهة الأخيرة: الملف الشخصي */}
                        {activeTab === 'profile' && <ProfileTab />}
                        
                        {/* واجهة متابعة سير المشاريع */}
                        {activeTab === 'tracking' && <TrackingTab setActiveTab={setActiveTab} />}
                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClientDashboard;
