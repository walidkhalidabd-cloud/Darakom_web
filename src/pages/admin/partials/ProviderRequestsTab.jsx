import { useState, useEffect } from 'react';
import {
  FaFileAlt, FaSearch, FaSpinner, FaCheckCircle,
  FaTimesCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaBriefcase, FaCalendarAlt, FaFilePdf, FaRegFileImage,
  FaEye, FaDownload, FaCheck, FaInfoCircle, FaHardHat
} from 'react-icons/fa';
import {
  fetchProviderRequests, approveProviderRequest, rejectProviderRequest
} from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات وهمية احتياطية لطلبات مزودي الخدمة
const mockRequests = [
  {
    id: 1,
    name: 'م. خالد عبدالله',
    email: 'khaled.a@arch.sy',
    phone: '0999345678',
    province: 'دمشق',
    specialization: 'مهندس معماري',
    experience_start: '2015',
    work_area: 'التصميم والإشراف المعماري',
    status: 'pending',
    submittedAt: '2026/06/20',
    documents: [
      { type: 'image', title: 'الهوية الشخصية', fileName: 'khaled-id.jpg', size: '1.2 MB' },
      { type: 'pdf', title: 'شهادة النقابة', fileName: 'khaled-syndicate.pdf', size: '850 KB' },
      { type: 'image', title: 'معاينة أعمال سابقة', fileName: 'khaled-portfolio.jpg', size: '2.4 MB' }
    ]
  },
  {
    id: 2,
    name: 'مكتب الإبداع الهندسي',
    email: 'ibdaa@eng.sy',
    phone: '0999234567',
    province: 'حلب',
    specialization: 'مكتب هندسي',
    experience_start: '2010',
    work_area: 'المكاتب الهندسية والشركات',
    status: 'pending',
    submittedAt: '2026/06/18',
    documents: [
      { type: 'pdf', title: 'السجل التجاري', fileName: 'ibdaa-commercial.pdf', size: '1.8 MB' },
      { type: 'pdf', title: 'ترخيص المكتب', fileName: 'ibdaa-license.pdf', size: '640 KB' },
      { type: 'pdf', title: 'شهادة ضريبية', fileName: 'ibdaa-tax.pdf', size: '420 KB' }
    ]
  },
  {
    id: 3,
    name: 'مؤسسة الأساس المتين',
    email: 'alass@construct.sy',
    phone: '0999567890',
    province: 'ريف دمشق',
    specialization: 'مقاول',
    experience_start: '2008',
    work_area: 'مقاولات البناء',
    status: 'pending',
    submittedAt: '2026/06/15',
    documents: [
      { type: 'image', title: 'السجل التجاري', fileName: 'alass-registry.jpg', size: '1.5 MB' },
      { type: 'pdf', title: 'شهادة تصنيف المقاولين', fileName: 'alass-class.pdf', size: '1.1 MB' }
    ]
  },
  {
    id: 4,
    name: 'فني كهرباء - محمد علي',
    email: 'mohd.elec@craft.sy',
    phone: '0999789012',
    province: 'حمص',
    specialization: 'حرفي',
    experience_start: '2018',
    work_area: 'فني كهرباء',
    status: 'approved',
    submittedAt: '2026/06/10',
    documents: [
      { type: 'image', title: 'الهوية الشخصية', fileName: 'mohd-id.jpg', size: '900 KB' },
      { type: 'image', title: 'شهادة خبرة', fileName: 'mohd-exp.jpg', size: '1.0 MB' }
    ]
  }
];

const ProviderRequestsTab = () => {
  const [requests, setRequests] = useState(mockRequests);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [toast, setToast] = useState(null);
  const [selectedDoc, setSelectedDoc] = useState(null); // معاينة المستند

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProviderRequests();
        const data = res.data?.data;
        if (data) setRequests(data);
      } catch {
        // ابقِ على البيانات الوهمية
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending"><FaInfoCircle /> قيد المراجعة</span>;
    if (status === 'approved') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> تمت الموافقة</span>;
    return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
  };

  const handleApprove = async (req) => {
    if (!window.confirm(`تأكيد الموافقة على طلب "${req.name}"؟ سيتم تفعيل الحساب فوراً.`)) return;
    try {
      await approveProviderRequest(req.id);
    } catch {
      // محلياً
    }
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'approved' } : r));
    showToast('success', `✅ تمت الموافقة على حساب ${req.name} وتفعيله`);
  };

  const handleReject = async (req) => {
    const reason = window.prompt(`اكتب سبب رفض طلب "${req.name}" (مثال: نقص الإثباتات):`);
    if (!reason) return;
    try {
      await rejectProviderRequest(req.id, reason);
    } catch {
      // محلياً
    }
    setRequests(requests.map(r => r.id === req.id ? { ...r, status: 'rejected', rejectReason: reason } : r));
    showToast('info', `تم رفض طلب ${req.name}: ${reason}`);
  };

  const filtered = requests.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.specialization.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* رأس الواجهة */}
      <div className="admin-section-header">
        <div>
          <h3><FaHardHat className="ms-2 text-warning" /> طلبات مزودي الخدمة</h3>
          <p>مراجعة طلبات إنشاء الحسابات الواردة من مزودي الخدمة والاطلاع على بياناتهم ومستنداتهم المرفوعة.</p>
        </div>
        {pendingCount > 0 && (
          <span className="admin-badge admin-badge-pending">
            {pendingCount} طلب بانتظار المراجعة
          </span>
        )}
      </div>

      {/* البحث والتصفية */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-admin"
                placeholder="ابحث بالاسم أو البريد أو التخصص..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: '45px' }}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>
          <div className="col-md-6">
            <select className="form-control form-control-admin" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="pending">قيد المراجعة</option>
              <option value="all">الكل</option>
              <option value="approved">تمت الموافقة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة الطلبات */}
      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(req => (
            <div key={req.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4"
              style={{ borderColor: req.status === 'pending' ? '#ff8a00' : req.status === 'approved' ? '#10b981' : '#ef4444' }}>

              {/* رأس الطلب */}
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                    style={{ width: '60px', height: '60px', fontSize: '24px', background: 'linear-gradient(135deg,#1b2a47,#ff8a00)' }}>
                    {req.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="fw-bold mb-1" style={{ color: '#1b2a47', fontSize: '24px' }}>{req.name}</h4>
                    <span className="badge bg-light text-dark fw-bold px-3 py-2">{req.specialization}</span>
                  </div>
                </div>
                {getStatusBadge(req.status)}
              </div>

              {/* بيانات الحساب */}
              <div className="row g-3 mb-4 bg-light p-3 rounded-4 mx-0 border">
                <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                  <FaEnvelope className="text-warning" />
                  <div>
                    <span className="text-muted small fw-bold d-block">البريد الإلكتروني</span>
                    <span className="fw-bold text-dark" dir="ltr" style={{ fontSize: '15px' }}>{req.email}</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                  <FaPhoneAlt className="text-warning" />
                  <div>
                    <span className="text-muted small fw-bold d-block">الهاتف</span>
                    <span className="fw-bold text-dark" dir="ltr" style={{ fontSize: '15px' }}>{req.phone}</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                  <FaMapMarkerAlt className="text-warning" />
                  <div>
                    <span className="text-muted small fw-bold d-block">المحافظة</span>
                    <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{req.province}</span>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                  <FaCalendarAlt className="text-warning" />
                  <div>
                    <span className="text-muted small fw-bold d-block">تاريخ الخبرة</span>
                    <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>من {req.experience_start}</span>
                  </div>
                </div>
                <div className="col-12 d-flex align-items-center gap-2">
                  <FaBriefcase className="text-warning" />
                  <div>
                    <span className="text-muted small fw-bold d-block">مجال العمل</span>
                    <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{req.work_area}</span>
                  </div>
                </div>
              </div>

              {/* المستندات المرفوعة */}
              <div className="mb-4">
                <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                  <FaFileAlt className="text-warning" /> المستندات المرفوعة ({req.documents?.length || 0})
                </h6>
                <div className="d-flex flex-wrap gap-3">
                  {req.documents?.map((doc, idx) => (
                    <div key={idx} className="d-flex align-items-center gap-2 p-3 rounded-3 border bg-white"
                      style={{ minWidth: '220px', borderColor: '#e2e8f0' }}>
                      <div className="text-warning fs-3">
                        {doc.type === 'pdf' ? <FaFilePdf /> : <FaRegFileImage />}
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{doc.title}</div>
                        <div className="text-muted small fw-semibold" dir="ltr">{doc.fileName} · {doc.size}</div>
                      </div>
                      <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-primary" title="معاينة"
                          onClick={() => setSelectedDoc(doc)}>
                          <FaEye />
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" title="تحميل"
                          onClick={() => showToast('info', `جاري تحميل ${doc.fileName}...`)}>
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                {(!req.documents || req.documents.length === 0) && (
                  <p className="text-muted fw-semibold">لم يرفع هذا المزود أي مستندات.</p>
                )}
              </div>

              {/* سبب الرفض */}
              {req.status === 'rejected' && req.rejectReason && (
                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="fw-bold text-danger">سبب الرفض: </span>
                  <span className="fw-semibold text-dark">{req.rejectReason}</span>
                </div>
              )}

              {/* أزرار القبول/الرفض */}
              {req.status === 'pending' && (
                <div className="d-flex gap-2 mt-auto pt-3 border-top">
                  <button className="btn-admin-primary d-inline-flex align-items-center gap-2" onClick={() => handleApprove(req)}>
                    <FaCheck /> قبول الطلب وتفعيل الحساب
                  </button>
                  <button className="btn btn-outline-danger fw-bold d-inline-flex align-items-center gap-2" onClick={() => handleReject(req)}>
                    <FaTimesCircle /> رفض الطلب
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <FaHardHat size={50} />
          <h5>لا توجد طلبات مطابقة</h5>
          <p>جرّب تعديل البحث أو التصفية.</p>
        </div>
      )}

      {/* نافذة معاينة المستند */}
      {selectedDoc && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedDoc(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content rounded-4 border-0 shadow-lg">
              <div className="modal-header py-3" style={{ backgroundColor: '#1b2a47', color: 'white' }}>
                <h5 className="modal-title fw-bold"><FaFileAlt className="ms-2" /> معاينة {selectedDoc.title}</h5>
                <button className="btn btn-sm text-white" onClick={() => setSelectedDoc(null)}><FaTimesCircle /></button>
              </div>
              <div className="modal-body p-4 text-center">
                <div className="display-1 text-warning mb-3">
                  {selectedDoc.type === 'pdf' ? <FaFilePdf /> : <FaRegFileImage />}
                </div>
                <h6 className="fw-bold text-dark">{selectedDoc.fileName}</h6>
                <p className="text-muted fw-semibold" dir="ltr">{selectedDoc.size}</p>
                <p className="text-muted fw-semibold">هذه معاينة للمستند المرفوع من قبل مزود الخدمة.</p>
              </div>
              <div className="modal-footer border-0 pb-4">
                <button className="btn btn-link fw-bold" onClick={() => setSelectedDoc(null)}>إغلاق</button>
                <button className="btn-admin-orange d-inline-flex align-items-center gap-2"
                  onClick={() => { showToast('info', `جاري تحميل ${selectedDoc.fileName}...`); setSelectedDoc(null); }}>
                  <FaDownload /> تحميل
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRequestsTab;
