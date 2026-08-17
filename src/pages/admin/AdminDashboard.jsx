import { useState } from 'react';

// استدعاء الأجزاء المشتركة
import AdminSidebar from './partials/AdminSidebar';
import AdminTopbar from './partials/AdminTopbar';

// استدعاء التبويبات
import AdminDashboardTab from './partials/AdminDashboardTab';
import ProviderRequestsTab from './partials/ProviderRequestsTab';
import UsersTab from './partials/UsersTab';
import ProjectsTab from './partials/ProjectsTab';
import OffersTab from './partials/OffersTab';
import ComplaintsTab from './partials/ComplaintsTab';
import SiteSettingsTab from './partials/SiteSettingsTab';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // حالة القائمة للجوال

  const getTabName = () => {
    const tabs = {
      'dashboard': 'لوحة التحكم',
      'provider-requests': 'طلبات مزودي الخدمة',
      'users': 'إدارة المستخدمين',
      'projects': 'مراجعة المشاريع',
      'offers': 'مراجعة العروض',
      'complaints': 'الشكاوى',
      'settings': 'إعدادات الموقع'
    };
    return tabs[activeTab] || 'لوحة التحكم';
  };

  return (
    // التعديل هنا: استخدام height: 100vh و overflow: hidden
    <div className="d-flex" style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#f4f6f9', fontFamily: "'Tajawal', sans-serif" }} dir="rtl">
      
      {/* القائمة الجانبية */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} isSidebarOpen={isSidebarOpen} />

      {/* منطقة المحتوى */}
      <div className="flex-grow-1 d-flex flex-column" style={{ overflowX: 'hidden' }}>
        <AdminTopbar 
            activeTabName={getTabName()} 
            setActiveTab={setActiveTab} 
            isSidebarOpen={isSidebarOpen} 
            setIsSidebarOpen={setIsSidebarOpen} 
        />

        <main className="flex-grow-1 p-4 p-md-5" style={{ overflowY: 'auto' }}>
            {activeTab === 'dashboard' && <AdminDashboardTab setActiveTab={setActiveTab} />}
            {activeTab === 'provider-requests' && <ProviderRequestsTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'offers' && <OffersTab />}
            {activeTab === 'complaints' && <ComplaintsTab />}
            {activeTab === 'settings' && <SiteSettingsTab />}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;