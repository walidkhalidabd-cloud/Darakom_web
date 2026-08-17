import { FaBell, FaShieldAlt, FaBars } from 'react-icons/fa';

const AdminTopbar = ({ activeTabName, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div className="bg-white p-3 d-flex justify-content-between align-items-center shadow-sm sticky-top z-1">
      <div className="d-flex align-items-center gap-3">
        {/* زر فتح وإغلاق القائمة للجوال */}
        <button className="btn btn-light d-lg-none" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <FaBars />
        </button>
        <h3 className="fw-bold mb-0 text-dark d-none d-md-block">{activeTabName}</h3>
      </div>
      
      <div className="d-flex align-items-center gap-4">
        <div
          className="position-relative"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveTab('complaints')}
        >
          <FaBell size={24} className="text-muted" />
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white">2</span>
        </div>
        <div className="d-flex align-items-center gap-2" style={{ cursor: 'pointer' }}>
          <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '40px', height: '40px' }}>
            <FaShieldAlt size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTopbar;