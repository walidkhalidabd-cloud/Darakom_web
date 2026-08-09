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
  // الواجهة الافتراضية
  const [activeTab, setActiveTab] = useState('dashboard');

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
    <div className="container-fluid p-0" style={{ fontFamily: "'Tajawal', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <div className="row g-0 flex-nowrap" style={{ minHeight: '100vh' }}>
        {/* القائمة الجانبية */}
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* منطقة المحتوى */}
        <div className="col overflow-auto" style={{ height: '100vh' }}>
          <AdminTopbar activeTabName={getTabName()} setActiveTab={setActiveTab} />

          <div className="p-4 p-md-5">
{activeTab === 'dashboard' && <AdminDashboardTab setActiveTab={setActiveTab} />}
            {activeTab === 'provider-requests' && <ProviderRequestsTab />}
            {activeTab === 'users' && <UsersTab />}
            {activeTab === 'projects' && <ProjectsTab />}
            {activeTab === 'offers' && <OffersTab />}
            {activeTab === 'complaints' && <ComplaintsTab />}
            {activeTab === 'settings' && <SiteSettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
