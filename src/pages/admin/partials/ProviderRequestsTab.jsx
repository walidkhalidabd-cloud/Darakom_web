import { useState, useEffect } from 'react';
import {
  FaFileAlt, FaSearch, FaSpinner, FaCheckCircle,
  FaTimesCircle, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt,
  FaBriefcase, FaCalendarAlt, FaFilePdf, FaRegFileImage,
  FaEye, FaCheck, FaInfoCircle, FaHardHat
} from 'react-icons/fa';
import {
  fetchProviderRequests, approveProviderRequest, rejectProviderRequest
} from '../../../services/api/adminApi';
import './admin-tabs.css';

const ProviderRequestsTab = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending'); // pending, active, closed
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProviderRequests();
        // الباك إند يرسل البيانات داخل data.providers (وإذا كانت Paginated تكون داخل data)
        const payload = res.data?.data || res.data;
        const providersArray = payload?.providers?.data || payload?.providers || [];
        
        if (Array.isArray(providersArray)) {
          setRequests(providersArray);
        } else {
          console.warn("البيانات المستلمة ليست مصفوفة", payload);
        }
      } catch  {
        showToast('error', 'حدث خطأ أثناء جلب طلبات المزودين');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // مترجم حالات الباك إند إلى تصميم الفرونت إند
  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending"><FaInfoCircle /> قيد المراجعة</span>;
    if (status === 'active') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> تمت الموافقة</span>;
    if (status === 'closed') return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
    return <span className="admin-badge bg-secondary text-white">{status}</span>;
  };

  const safeRequests = Array.isArray(requests) ? requests : [];

  const handleApprove = async (req) => {
    const reqName = req.name || 'هذا المزود';
    if (!window.confirm(`تأكيد الموافقة على طلب "${reqName}"؟ سيتم تفعيل الحساب فوراً.`)) return;
    try {
      await approveProviderRequest(req.id);
      setRequests(safeRequests.map(r => r.id === req.id ? { ...r, status: 'active' } : r));
      showToast('success', `✅ تمت الموافقة على حساب ${reqName} وتفعيله`);
    } catch  {
      showToast('error', 'حدث خطأ أثناء الموافقة على الطلب');
    }
  };

  const handleReject = async (req) => {
    const reqName = req.name || 'هذا المزود';
    const reason = window.prompt(`اكتب سبب رفض طلب "${reqName}" (مثال: نقص الإثباتات):`);
    if (!reason) return; // تم الإلغاء
    try {
      await rejectProviderRequest(req.id, reason);
      // تحديث الحالة محلياً وإضافة سبب الرفض
      setRequests(safeRequests.map(r => r.id === req.id ? { 
        ...r, 
        status: 'closed', 
        profile: { ...r.profile, admin_comment: reason } 
      } : r));
      showToast('info', `تم رفض طلب ${reqName}`);
    } catch  {
      showToast('error', 'حدث خطأ أثناء رفض الطلب (تأكد من تعديل admin_comment في adminApi)');
    }
  };

  // فلترة متقدمة
  const filtered = safeRequests.filter(r => {
    const rName = r.name || '';
    const rEmail = r.email || '';
    const rSpec = r.profile?.role || '';

    const matchSearch = rName.toLowerCase().includes(search.toLowerCase()) ||
      rEmail.toLowerCase().includes(search.toLowerCase()) ||
      rSpec.toLowerCase().includes(search.toLowerCase());
      
    // مطابقة الفلتر مع حالات الباك إند
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const pendingCount = safeRequests.filter(r => r.status === 'pending').length;

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
                placeholder="ابحث بالاسم، البريد أو التخصص..."
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
              <option value="active">تمت الموافقة (نشط)</option>
              <option value="closed">مرفوضة (مغلق)</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة الطلبات */}
      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(req => {
            // تجهيز البيانات من ProfileResource و UserResource
            const displayName = req.name || 'بدون اسم';
            const displayEmail = req.email || 'لا يوجد بريد';
            const displayPhone = req.phone || 'غير متوفر';
            const displayProvince = req.province || 'غير محدد';
            
            const displaySpec = req.profile?.role || 'غير محدد';
            const displayWorkArea = req.profile?.work_area || 'غير محدد';
            const experienceYears = req.profile?.experience ? `${req.profile.experience} سنوات` : 'غير محدد';
            const rejectReason = req.profile?.admin_comment || 'مرفوض من قبل الإدارة';
            
            // تجهيز المستندات
            const documents = req.profile?.documents || [];

            return (
              <div key={req.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4"
                style={{ borderColor: req.status === 'pending' ? '#ff8a00' : req.status === 'active' ? '#10b981' : '#ef4444' }}>

                {/* رأس الطلب */}
                <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-2">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm overflow-hidden"
                      style={{ width: '60px', height: '60px', fontSize: '24px', background: 'linear-gradient(135deg,#1b2a47,#ff8a00)' }}>
                      {req.avatar ? (
                        <img src={req.avatar} alt={displayName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        displayName.charAt(0) || 'م'
                      )}
                    </div>
                    <div>
                      <h4 className="fw-bold mb-1" style={{ color: '#1b2a47', fontSize: '24px' }}>{displayName}</h4>
                      <span className="badge bg-light text-dark fw-bold px-3 py-2">{displaySpec}</span>
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
                      <span className="fw-bold text-dark" dir="ltr" style={{ fontSize: '15px' }}>{displayEmail}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                    <FaPhoneAlt className="text-warning" />
                    <div>
                      <span className="text-muted small fw-bold d-block">الهاتف</span>
                      <span className="fw-bold text-dark" dir="ltr" style={{ fontSize: '15px' }}>{displayPhone}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                    <FaMapMarkerAlt className="text-warning" />
                    <div>
                      <span className="text-muted small fw-bold d-block">المحافظة</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{displayProvince}</span>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3 d-flex align-items-center gap-2">
                    <FaCalendarAlt className="text-warning" />
                    <div>
                      <span className="text-muted small fw-bold d-block">الخبرة</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{experienceYears}</span>
                    </div>
                  </div>
                  <div className="col-12 d-flex align-items-center gap-2">
                    <FaBriefcase className="text-warning" />
                    <div>
                      <span className="text-muted small fw-bold d-block">مجال العمل / النبذة</span>
                      <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{displayWorkArea}</span>
                    </div>
                  </div>
                </div>

                {/* المستندات المرفوعة */}
                <div className="mb-4">
                  <h6 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                    <FaFileAlt className="text-warning" /> المستندات المرفوعة ({documents.length})
                  </h6>
                  <div className="d-flex flex-wrap gap-3">
                    {documents.map((doc, idx) => {
                      const isPdf = doc.url && doc.url.toLowerCase().endsWith('.pdf');
                      const docTypeIcon = isPdf ? <FaFilePdf /> : <FaRegFileImage />;
                      const fileName = doc.url ? doc.url.split('/').pop() : 'مستند';

                      return (
                        <div key={idx} className="d-flex align-items-center gap-2 p-3 rounded-3 border bg-white"
                          style={{ minWidth: '220px', borderColor: '#e2e8f0' }}>
                          <div className="text-warning fs-3">
                            {docTypeIcon}
                          </div>
                          <div className="flex-grow-1">
                            <div className="fw-bold text-dark" style={{ fontSize: '15px' }}>{doc.type || doc.description || 'مستند مرفق'}</div>
                            <div className="text-muted small fw-semibold" dir="ltr" style={{ maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fileName}
                            </div>
                          </div>
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary" title="معاينة/تحميل"
                              onClick={() => {
                                if(doc.url) window.open(doc.url, '_blank');
                              }}>
                              <FaEye />
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  {documents.length === 0 && (
                    <p className="text-muted fw-semibold">لم يرفع هذا المزود أي مستندات.</p>
                  )}
                </div>

                {/* سبب الرفض (إن وُجد) */}
                {req.status === 'closed' && rejectReason && (
                  <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <span className="fw-bold text-danger">سبب الرفض: </span>
                    <span className="fw-semibold text-dark">{rejectReason}</span>
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
            );
          })}
        </div>
      ) : (
        <div className="admin-empty">
          <FaHardHat size={50} />
          <h5>لا توجد طلبات مطابقة</h5>
          <p>جرّب تعديل البحث أو التصفية.</p>
        </div>
      )}
    </div>
  );
};

export default ProviderRequestsTab;