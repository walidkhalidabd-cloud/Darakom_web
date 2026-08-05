import { useState } from 'react';

// استدعاء المكونات المفصولة
import AdminSidebar from './partials/AdminSidebar';
import AdminTopbar from './partials/AdminTopbar';
import AdminDashboardTab from './partials/AdminDashboardTab';
import UsersTab from './partials/UsersTab';
import ComplaintsTab from './partials/ComplaintsTab';
import SiteSettingsTab from './partials/SiteSettingsTab';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');

    const getTabName = () => {
        const tabs = {
            'dashboard': 'لوحة التحكم',
            'users': 'إدارة المستخدمين',
            'complaints': 'الشكاوى والملاحظات',
            'settings': 'إدارة الموقع'
        };
        return tabs[activeTab] || 'لوحة الإدارة';
    };

    return (
        <div className="container-fluid p-0" style={{ fontFamily: "'Tajawal', sans-serif", backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
            <div className="row g-0 flex-nowrap" style={{ minHeight: '100vh' }}>

                {/* القائمة الجانبية */}
                <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

                {/* منطقة المحتوى */}
                <div className="col overflow-auto" style={{ height: '100vh' }}>

                    {/* الشريط العلوي */}
                    <AdminTopbar activeTabName={getTabName()} />

                    <div className="p-4 p-md-5">

                        {/* نظام التوجيه الداخلي */}
{activeTab === 'dashboard' && <AdminDashboardTab />}
                        {activeTab === 'users' && <UsersTab />}
                        {activeTab === 'complaints' && <ComplaintsTab />}
                        {activeTab === 'settings' && <SiteSettingsTab />}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
