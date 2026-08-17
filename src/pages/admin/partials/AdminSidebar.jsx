import { useNavigate } from 'react-router-dom';
import {
  FaHome, FaUsers, FaHardHat, FaFileInvoiceDollar,
  FaExclamationTriangle, FaCog, FaShieldAlt, FaUserTie, FaSignOutAlt
} from 'react-icons/fa';

const AdminSidebar = ({ activeTab, setActiveTab, isSidebarOpen }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
      navigate('/login'); 
  };

  const menuItems = [
    { id: 'dashboard', name: 'لوحة التحكم', icon: <FaHome /> },
    { id: 'provider-requests', name: 'طلبات المزودين', icon: <FaUserTie /> },
    { id: 'users', name: 'المستخدمون', icon: <FaUsers /> },
    { id: 'projects', name: 'المشاريع', icon: <FaHardHat /> },
    { id: 'offers', name: 'العروض', icon: <FaFileInvoiceDollar /> },
    { id: 'complaints', name: 'الشكاوى', icon: <FaExclamationTriangle /> },
    { id: 'settings', name: 'إعدادات الموقع', icon: <FaCog /> }
  ];

  return (
    <div className="d-flex flex-column flex-shrink-0 text-white transition-all shadow-lg" 
         style={{ width: isSidebarOpen ? '280px' : '0px', height: '100vh', backgroundColor: '#1b2a47', overflow: 'hidden', whiteSpace: 'nowrap', zIndex: 10 }}>
      
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
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* زر تسجيل الخروج ثابت بالأسفل */}
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
  );
};

export default AdminSidebar;