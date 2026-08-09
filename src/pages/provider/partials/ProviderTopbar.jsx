import { FaBell, FaExchangeAlt } from 'react-icons/fa';

const ProviderTopbar = ({ activeTabName, setActiveTab }) => {
    return (
        <div className="bg-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top z-1">
            <h3 className="fw-bold mb-0 text-dark d-none d-md-block">{activeTabName}</h3>
            <div className="d-flex align-items-center gap-4 w-50 justify-content-end">
                
                {/* زر التبديل لدور العميل */}
                <button 
                    className="btn btn-outline-secondary fw-bold rounded-pill d-none d-md-flex align-items-center gap-2 shadow-sm"
                    onClick={() => window.location.href = '/client/dashboard'} // توجيه إلى مسار لوحة تحكم العميل
                >
                    <FaExchangeAlt /> التبديل لحساب العميل
                </button>

                <div className="position-relative" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('notifications')}>
                    <FaBell size={24} className="text-muted" />
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">5</span>
                </div>
                <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('profile')}>
                    <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>م</div>
                </div>
            </div>
        </div>
    );
};

export default ProviderTopbar;