import { useState, useEffect } from 'react';
import {
  FaHardHat, FaCheckCircle, FaTimesCircle, FaSearch,
  FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaSpinner,
  FaCheck, FaFileInvoiceDollar
} from 'react-icons/fa';
import { fetchAdminProjects, approveProject, rejectProject } from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات وهمية احتياطية
const mockProjects = [
  { id: 1, title: 'بناء عظم - مساحة 400م', owner: 'أحمد سليمان', location: 'دمشق، المزة', budget: '28,000,000', status: 'pending', date: '2026/06/10', type: 'construction' },
  { id: 2, title: 'تشطيب شقة سكنية 120م', owner: 'سمر حسن', location: 'حلب، الجميلية', budget: '12,500,000', status: 'pending', date: '2026/06/12', type: 'finishing' },
  { id: 3, title: 'تصميم داخلي لفيلا مودرن', owner: 'خالد عبدالله', location: 'اللاذقية، الكورنيش', budget: '5,000,000', status: 'approved', date: '2026/05/20', type: 'design' },
  { id: 4, title: 'تركيب سيراميك ورخام', owner: 'سمر حسن', location: 'حمص، المحطة', budget: '3,200,000', status: 'rejected', date: '2026/05/15', type: 'finishing' },
  { id: 5, title: 'أعمال سباكة كاملة', owner: 'أحمد سليمان', location: 'دمشق، المهاجرين', budget: '1,800,000', status: 'pending', date: '2026/06/14', type: 'plumbing' },
];

const ProjectsTab = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminProjects();
        const data = res.data?.data;
        if (data) setProjects(data);
      } catch {
        // ابقِ على البيانات الوهمية
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending">قيد المراجعة</span>;
    if (status === 'approved') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> مقبول</span>;
    return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
  };

  const handleApprove = async (project) => {
    try {
      await approveProject(project.id);
    } catch {
      // محلياً
    }
    setProjects(projects.map(p => p.id === project.id ? { ...p, status: 'approved' } : p));
    showToast('success', `✅ تم قبول المشروع "${project.title}"`);
  };

  const handleReject = async (project) => {
    const reason = window.prompt('يرجى كتابة سبب الرفض:');
    if (reason === null) return;
    try {
      await rejectProject(project.id, reason);
    } catch {
      // محلياً
    }
    setProjects(projects.map(p => p.id === project.id ? { ...p, status: 'rejected', rejectReason: reason } : p));
    showToast('info', `تم رفض المشروع "${project.title}"`);
  };

  const filtered = projects.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* رأس الواجهة */}
      <div className="admin-section-header">
        <div>
          <h3><FaHardHat className="ms-2 text-warning" /> مراجعة المشاريع المطروحة</h3>
          <p>مراجعة وقبول أو رفض المشاريع المقدمة من المستخدمين.</p>
        </div>
      </div>

      {/* البحث والتصفية */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-admin"
                placeholder="ابحث باسم المشروع أو صاحبه..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: '45px' }}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>
          <div className="col-md-6">
            <select className="form-control form-control-admin" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">كل الحالات</option>
              <option value="pending">قيد المراجعة</option>
              <option value="approved">مقبولة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة المشاريع */}
      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(project => (
            <div key={project.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4" style={{ borderColor: project.status === 'pending' ? '#ff8a00' : project.status === 'approved' ? '#10b981' : '#ef4444' }}>
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: '#1b2a47', fontSize: '24px' }}>{project.title}</h4>
                  <div className="d-flex gap-3 text-muted fw-semibold flex-wrap" style={{ fontSize: '16px' }}>
                    <span><FaUserTie className="ms-1 text-warning" /> {project.owner}</span>
                    <span><FaMapMarkerAlt className="ms-1" /> {project.location}</span>
                    <span><FaCalendarAlt className="ms-1" /> {project.date}</span>
                  </div>
                </div>
                {getStatusBadge(project.status)}
              </div>

              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-3 p-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255,138,0,0.08)' }}>
                  <FaFileInvoiceDollar className="text-warning" />
                  <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '18px' }}>الميزانية: {project.budget} ل.س</span>
                </div>
                <span className="badge bg-light text-dark fw-bold px-3 py-2">{project.type}</span>
              </div>

              {project.status === 'rejected' && project.rejectReason && (
                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="fw-bold text-danger">سبب الرفض: </span>
                  <span className="fw-semibold text-dark">{project.rejectReason}</span>
                </div>
              )}

              {project.status === 'pending' && (
                <div className="d-flex gap-2 mt-auto pt-3 border-top">
                  <button className="btn-admin-primary d-inline-flex align-items-center gap-2" onClick={() => handleApprove(project)}>
                    <FaCheck /> قبول المشروع
                  </button>
                  <button className="btn btn-outline-danger fw-bold d-inline-flex align-items-center gap-2" onClick={() => handleReject(project)}>
                    <FaTimesCircle /> رفض
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <FaHardHat size={50} />
          <h5>لا توجد مشاريع مطابقة</h5>
          <p>جرّب تعديل البحث أو التصفية.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;
