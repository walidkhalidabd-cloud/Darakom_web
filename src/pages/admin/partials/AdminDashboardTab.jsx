import { useState, useEffect } from 'react';
import {
  FaUsers, FaUserTie, FaBuilding, FaHardHat, FaWrench,
  FaListAlt, FaCheckCircle, FaClock, FaFileInvoiceDollar,
  FaCheckDouble, FaSpinner, FaChartPie, FaUserPlus,
  FaExclamationTriangle
} from 'react-icons/fa';
import { fetchAdminDashboard } from '../../../services/api/adminApi';
import './admin-tabs.css';

// هيكل البيانات الأساسي المطابق للباك إند لمنع أي انهيار
const initialStats = {
  users: { total: 0, clients: 0, engineers: 0, offices: 0, contractors: 0, craftsmen: 0 },
  projects: { total: 0, open: 0, completed: 0, paused: 0 },
  offers: { total: 0, accepted: 0 }
};

const AdminDashboardTab = ({ setActiveTab }) => {
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminDashboard();
        const data = res.data?.data || res.data;
        if (data) setStats(data);
      } catch (err) {
        console.error("تعذر جلب الإحصائيات", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // تعديل المفاتيح لتتطابق مع الـ Keys القادمة من الباك إند
  const typeCards = [
    { key: 'clients', label: 'عملاء', icon: <FaUserTie />, color: '#0d6efd' },
    { key: 'engineers', label: 'مهندسين', icon: <FaHardHat />, color: '#6f42c1' },
    { key: 'offices', label: 'مكاتب', icon: <FaBuilding />, color: '#0dcaf0' },
    { key: 'contractors', label: 'مقاولين', icon: <FaWrench />, color: '#ff8a00' },
    { key: 'craftsmen', label: 'حرفيين', icon: <FaUsers />, color: '#10b981' }
  ];

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {loading && (
        <div className="text-center py-4">
          <FaSpinner className="fa-spin fs-1 text-warning" />
        </div>
      )}

      {/* ===== مقدمة ترحيبية ===== */}
      <div className="mb-4">
        <h3 className="fw-bold mb-1" style={{ color: '#1b2a47', fontSize: '30px' }}>مرحباً بك في لوحة الإدارة 👋</h3>
        <p className="text-muted fw-semibold mb-0" style={{ fontSize: '18px' }}>
          نظرة عامة على أداء منصة داركم وإحصائياتها العامة.
        </p>
      </div>

      {/* ===== بطاقات رئيسية ===== */}
      <div className="row g-4 mb-4">
        <div className="col-md-4 col-6">
          <div className="admin-stat-card p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ borderBottomColor: '#0d6efd' }}>
            <div>
              <p className="text-muted fw-bold mb-1" style={{ fontSize: '17px' }}>إجمالي المستخدمين</p>
              <h2 className="fw-bold mb-0 text-primary" style={{ fontSize: '38px' }}>{stats?.users?.total || 0}</h2>
            </div>
            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-3"><FaUsers /></div>
          </div>
        </div>

        <div className="col-md-4 col-6">
          <div className="admin-stat-card p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ borderBottomColor: '#ff8a00' }}>
            <div>
              <p className="text-muted fw-bold mb-1" style={{ fontSize: '17px' }}>إجمالي المشاريع</p>
              <h2 className="fw-bold mb-0" style={{ color: '#ff8a00', fontSize: '38px' }}>{stats?.projects?.total || 0}</h2>
            </div>
            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-3"><FaListAlt /></div>
          </div>
        </div>

        <div className="col-md-4 col-6">
          <div className="admin-stat-card p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ borderBottomColor: '#10b981' }}>
            <div>
              <p className="text-muted fw-bold mb-1" style={{ fontSize: '17px' }}>إجمالي العروض</p>
              <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '38px' }}>{stats?.offers?.total || 0}</h2>
            </div>
            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-3"><FaFileInvoiceDollar /></div>
          </div>
        </div>
      </div>

      {/* ===== تصنيف المستخدمين حسب النوع ===== */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-4 bg-white">
        <div className="d-flex align-items-center gap-2 mb-4">
          <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(13, 110, 253, 0.1)' }}>
            <FaChartPie className="text-primary fs-3" />
          </div>
          <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>تصنيف المستخدمين حسب النوع</h5>
        </div>
        <div className="row g-3">
          {typeCards.map(card => (
            <div className="col-md-4 col-lg text-center" key={card.key}>
              <div className="p-3 rounded-4 border bg-white h-100" style={{ borderColor: '#e2e8f0' }}>
                <div className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2" style={{ width: '50px', height: '50px', backgroundColor: `${card.color}1a`, color: card.color }}>
                  {card.icon}
                </div>
                <h4 className="fw-bold mb-0" style={{ fontSize: '30px', color: card.color }}>{stats?.users?.[card.key] || 0}</h4>
                <span className="text-muted fw-bold" style={{ fontSize: '16px' }}>{card.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== حالة المشاريع + حالة العروض ===== */}
      <div className="row g-4 mb-4">
        {/* المشاريع */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(255, 138, 0, 0.1)' }}>
                <FaListAlt className="text-warning fs-3" />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>حالة المشاريع</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(13,110,253,0.06)' }}>
                <span className="fw-bold text-muted"><FaClock className="ms-1 text-primary" /> المشاريع المفتوحة</span>
                <span className="badge bg-primary rounded-pill fw-bold fs-6 px-3">{stats?.projects?.open || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                <span className="fw-bold text-muted"><FaCheckCircle className="ms-1 text-success" /> المشاريع المكتملة</span>
                <span className="badge bg-success rounded-pill fw-bold fs-6 px-3">{stats?.projects?.completed || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                <span className="fw-bold text-muted"><FaClock className="ms-1 text-danger" /> المشاريع المعلقة</span>
                <span className="badge bg-danger rounded-pill fw-bold fs-6 px-3">{stats?.projects?.paused || 0}</span>
              </div>
            </div>
          </div>
        </div>

        {/* العروض */}
        <div className="col-lg-6">
          <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}>
                <FaFileInvoiceDollar className="text-success fs-3" />
              </div>
              <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>حالة العروض</h5>
            </div>
            <div className="d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(13,110,253,0.06)' }}>
                <span className="fw-bold text-muted"><FaFileInvoiceDollar className="ms-1 text-primary" /> العروض المقدمة</span>
                <span className="badge bg-primary rounded-pill fw-bold fs-6 px-3">{stats?.offers?.total || 0}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center p-3 rounded-3" style={{ backgroundColor: 'rgba(16,185,129,0.06)' }}>
                <span className="fw-bold text-muted"><FaCheckDouble className="ms-1 text-success" /> العروض المقبولة</span>
                <span className="badge bg-success rounded-pill fw-bold fs-6 px-3">{stats?.offers?.accepted || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== إجراءات سريعة ===== */}
      <div className="card border-0 shadow-sm rounded-4 p-4 text-white mb-4" style={{ background: 'linear-gradient(135deg, #1b2a47 0%, #2d4a7a 100%)' }}>
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
          <div>
            <h5 className="fw-bold mb-1" style={{ fontSize: '24px' }}>إجراءات سريعة</h5>
            <p className="mb-0 text-white-50 fw-semibold">إدارة المستخدمين، مراجعة المشاريع والعروض، ومتابعة الشكاوى.</p>
          </div>
          <div className="d-flex gap-2 flex-wrap">
            <button className="btn-admin-orange d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('provider-requests')}>
              <FaUserTie /> طلبات المزودين
            </button>
            <button className="btn-admin-primary d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('users')}>
              <FaUserPlus /> إدارة المستخدمين
            </button>
            <button className="btn btn-outline-light fw-bold d-inline-flex align-items-center gap-2" onClick={() => setActiveTab('complaints')}>
              <FaExclamationTriangle /> متابعة الشكاوى
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardTab;