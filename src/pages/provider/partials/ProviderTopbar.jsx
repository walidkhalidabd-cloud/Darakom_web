import { FaBell, FaSignOutAlt } from 'react-icons/fa';

const ProviderTopbar = ({ activeTabName, setActiveTab }) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const name = user.name || 'مزود خدمة';
    const initial = name?.charAt(0) || 'م';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    return (
        <div className="bg-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top z-1">
            <h3 className="fw-bold mb-0 text-dark d-none d-md-block">{activeTabName}</h3>
            <div className="d-flex align-items-center gap-4 w-50 justify-content-end">
                
                {/* زر تسجيل الخروج */}
                <button 
                    className="btn btn-outline-danger fw-bold rounded-pill d-flex align-items-center gap-2 shadow-sm"
                    onClick={handleLogout}
                    title="تسجيل الخروج"
                >
                    <FaSignOutAlt /> <span className="d-none d-md-inline">خروج</span>
                </button>

                <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
                    <FaBell size={24} className="text-muted" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">5</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>{initial}</div>
                    <span className="fw-bold d-none d-md-inline text-muted">{name.split(' ')[0]}</span>
                </div>
            </div>
        </div>
    );
};

export default ProviderTopbar;
