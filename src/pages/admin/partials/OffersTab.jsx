import { useState, useEffect } from 'react';
import {
  FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaSearch,
FaHardHat, FaSpinner, FaCheck, FaCalendarAlt
} from 'react-icons/fa';
import { fetchAdminOffers, approveOffer, rejectOffer } from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات وهمية احتياطية
const mockOffers = [
  { id: 1, providerName: 'مؤسسة البناء الذهبي', projectTitle: 'بناء عظم - مساحة 400م', price: '26,500,000', status: 'pending', date: '2026/06/11', proposalPeriod: '6 أشهر' },
  { id: 2, providerName: 'مكتب الإبداع الهندسي', projectTitle: 'تصميم داخلي لفيلا مودرن', price: '4,200,000', status: 'accepted', date: '2026/05/22', proposalPeriod: 'شهر' },
  { id: 3, providerName: 'شركة أطياف للتشطيبات', projectTitle: 'تشطيب شقة سكنية 120م', price: '11,800,000', status: 'pending', date: '2026/06/13', proposalPeriod: '3 أشهر' },
  { id: 4, providerName: 'فني سباكة - أحمد', projectTitle: 'أعمال سباكة كاملة', price: '1,600,000', status: 'rejected', date: '2026/05/30', proposalPeriod: 'أسبوعان' },
];

const OffersTab = () => {
  const [offers, setOffers] = useState(mockOffers);
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
        const res = await fetchAdminOffers();
        const data = res.data?.data;
        if (data) setOffers(data);
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
    if (status === 'accepted') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> مقبول</span>;
    return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
  };

  const handleApprove = async (offer) => {
    try {
      await approveOffer(offer.id);
    } catch {
      // محلياً
    }
    setOffers(offers.map(o => o.id === offer.id ? { ...o, status: 'accepted' } : o));
    showToast('success', `✅ تم قبول عرض ${offer.providerName}`);
  };

  const handleReject = async (offer) => {
    const reason = window.prompt('يرجى كتابة سبب الرفض:');
    if (reason === null) return;
    try {
      await rejectOffer(offer.id, reason);
    } catch {
      // محلياً
    }
    setOffers(offers.map(o => o.id === offer.id ? { ...o, status: 'rejected', rejectReason: reason } : o));
    showToast('info', `تم رفض عرض ${offer.providerName}`);
  };

  const filtered = offers.filter(o => {
    const matchSearch = o.providerName.toLowerCase().includes(search.toLowerCase()) || o.projectTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* رأس الواجهة */}
      <div className="admin-section-header">
        <div>
          <h3><FaFileInvoiceDollar className="ms-2 text-warning" /> مراجعة العروض المقدمة</h3>
          <p>مراجعة وقبول أو رفض العروض المقدمة من مزودي الخدمة.</p>
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
                placeholder="ابحث باسم المزود أو المشروع..."
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
              <option value="accepted">مقبولة</option>
              <option value="rejected">مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {/* قائمة العروض */}
      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(offer => (
            <div key={offer.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4" style={{ borderColor: offer.status === 'pending' ? '#ff8a00' : offer.status === 'accepted' ? '#10b981' : '#ef4444' }}>
              <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
                <div>
                  <h4 className="fw-bold mb-1" style={{ color: '#1b2a47', fontSize: '24px' }}>{offer.providerName}</h4>
                  <div className="d-flex gap-3 text-muted fw-semibold flex-wrap" style={{ fontSize: '16px' }}>
                    <span><FaHardHat className="ms-1 text-warning" /> {offer.projectTitle}</span>
                    <span><FaCalendarAlt className="ms-1" /> {offer.date}</span>
                  </div>
                </div>
                {getStatusBadge(offer.status)}
              </div>

              <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                <div className="rounded-3 p-3 d-flex align-items-center gap-2" style={{ backgroundColor: 'rgba(255,138,0,0.08)' }}>
                  <FaFileInvoiceDollar className="text-warning" />
                  <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '18px' }}>السعر: {offer.price} ل.س</span>
                </div>
                <span className="badge bg-light text-dark fw-bold px-3 py-2">مدة التنفيذ: {offer.proposalPeriod}</span>
              </div>

              {offer.status === 'rejected' && offer.rejectReason && (
                <div className="p-3 rounded-3 mb-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <span className="fw-bold text-danger">سبب الرفض: </span>
                  <span className="fw-semibold text-dark">{offer.rejectReason}</span>
                </div>
              )}

              {offer.status === 'pending' && (
                <div className="d-flex gap-2 mt-auto pt-3 border-top">
                  <button className="btn-admin-primary d-inline-flex align-items-center gap-2" onClick={() => handleApprove(offer)}>
                    <FaCheck /> قبول العرض
                  </button>
                  <button className="btn btn-outline-danger fw-bold d-inline-flex align-items-center gap-2" onClick={() => handleReject(offer)}>
                    <FaTimesCircle /> رفض
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <FaFileInvoiceDollar size={50} />
          <h5>لا توجد عروض مطابقة</h5>
          <p>جرّب تعديل البحث أو التصفية.</p>
        </div>
      )}
    </div>
  );
};

export default OffersTab;
