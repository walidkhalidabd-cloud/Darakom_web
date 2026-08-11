// تحديث استيراد الأيقونات بناءً على القائمة الجديدة (إضافة FaBell للإشعارات)
import { 
    FaHome, FaPlusSquare, FaListAlt, 
    FaHeart, FaBell, FaExclamationTriangle, FaStar, FaUserEdit,
    FaFileInvoiceDollar, FaHardHat, FaSignOutAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../../../services/auth';

const ClientSidebar = ({ activeTab, setActiveTab, setDirectProvider }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    // القائمة الجانبية بعد دمج "مشاريعي" و"متابعة سير المشروع"
    const menuItems = [
        { id: 'dashboard', name: 'الرئيسية', icon: <FaHome /> },
        { id: 'add-project', name: 'إضافة مشروع', icon: <FaPlusSquare /> },
        { id: 'offers-public', name: 'العروض', icon: <FaFileInvoiceDollar /> },
        { id: 'offers', name: 'مشاريعي', icon: <FaListAlt /> },
        { id: 'tracking', name: 'متابعة المشاريع', icon: <FaHardHat /> },
        { id: 'favorites', name: 'المفضلة', icon: <FaHeart /> },
        { id: 'notifications', name: 'الإشعارات', icon: <FaBell /> },
        { id: 'complaints', name: 'الشكاوي', icon: <FaExclamationTriangle /> },
        { id: 'reviews', name: 'التقييمات', icon: <FaStar /> },
        { id: 'profile', name: 'الملف الشخصي', icon: <FaUserEdit /> }
    ];

    return (
        <div className="col-auto col-md-3 col-lg-2 text-white d-flex flex-column shadow-sm" style={{ backgroundColor: '#1b2a47', zIndex: 10 }}>
            <div className="p-4 text-center border-bottom border-secondary mb-3">
                <div className="d-flex align-items-center justify-content-center gap-3">
                    <div className="bg-warning rounded p-2 text-dark"><FaHome size={30} /></div>
                    <div className="text-start">
                        <h4 className="fw-bold mb-0">داركم</h4>
                        <span className="small text-white-50">صاحب مشروع</span>
                    </div>
                </div>
            </div>
            <div className="nav flex-column px-2 gap-1 flex-grow-1 overflow-auto" style={{ paddingBottom: '30px' }}>
                {menuItems.map(item => (
                    <button 
                        key={item.id}
                        className={`btn text-start d-flex align-items-center gap-3 p-3 w-100 rounded-3 border-0 fw-bold ${activeTab === item.id ? 'bg-warning text-dark' : 'text-white bg-transparent'}`}
                        style={{ transition: '0.3s', fontSize: '18px' }}
                        onClick={() => { 
                            setActiveTab(item.id); 
                            if(item.id === 'add-project') setDirectProvider(null); 
                        }}
                    >
<span className="fs-5">{item.icon}</span>
                        <span className="d-none d-md-inline">{item.name}</span>
                    </button>
                ))}
            </div>

            {/* زر تسجيل الخروج أسفل القائمة الجانبية */}
            <div className="p-3 border-top border-secondary">
                <button 
                    className="btn text-start d-flex align-items-center gap-3 p-3 w-100 rounded-3 border-0 fw-bold text-danger bg-transparent"
                    style={{ transition: '0.3s', fontSize: '18px' }}
                    onClick={handleLogout}
                >
                    <span className="fs-5"><FaSignOutAlt /></span>
                    <span className="d-none d-md-inline">تسجيل الخروج</span>
                </button>
            </div>
        </div>
    );
};

export default ClientSidebar;
