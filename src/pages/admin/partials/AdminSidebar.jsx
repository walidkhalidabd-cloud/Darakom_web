import {
    FaTachometerAlt, FaUsers,
    FaExclamationTriangle, FaCog, FaShieldAlt
} from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', name: 'لوحة التحكم', icon: <FaTachometerAlt /> },
        { id: 'users', name: 'إدارة المستخدمين', icon: <FaUsers /> },
        { id: 'complaints', name: 'الشكاوى والملاحظات', icon: <FaExclamationTriangle /> },
        { id: 'settings', name: 'إدارة الموقع', icon: <FaCog /> }
    ];

    return (
        <div className="col-auto col-md-3 col-lg-2 text-white d-flex flex-column shadow-sm" style={{ backgroundColor: '#1b2a47', zIndex: 10 }}>
            <div className="p-4 text-center border-bottom border-secondary mb-3">
                <div className="d-flex align-items-center justify-content-center gap-3">
                    <div className="bg-warning rounded p-2 text-dark"><FaShieldAlt size={30} /></div>
                    <div className="text-start">
                        <h4 className="fw-bold mb-0">داركم</h4>
                        <span className="small text-white-50">لوحة الإدارة</span>
                    </div>
                </div>
            </div>
            <div className="nav flex-column px-2 gap-1 flex-grow-1 overflow-auto" style={{ paddingBottom: '30px' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className={`btn text-start d-flex align-items-center gap-3 p-3 w-100 rounded-3 border-0 fw-bold ${activeTab === item.id ? 'bg-warning text-dark' : 'text-white bg-transparent'}`}
                        style={{ transition: '0.3s', fontSize: '18px' }}
                        onClick={() => setActiveTab(item.id)}
                    >
                        <span className="fs-5">{item.icon}</span>
                        <span className="d-none d-md-inline">{item.name}</span>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default AdminSidebar;
