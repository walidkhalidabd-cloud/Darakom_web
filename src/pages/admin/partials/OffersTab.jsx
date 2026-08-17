import { useState, useEffect } from 'react';
import {
  FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaSearch,
  FaHardHat, FaSpinner, FaCheck, FaCalendarAlt,
  FaMoneyBillWave, FaClock, FaProjectDiagram, FaPaperclip,
  FaFilePdf, FaImage, FaUserTie
} from 'react-icons/fa';
import { fetchAdminOffers, approveOffer, rejectOffer } from '../../../services/api/adminApi';
import './admin-tabs.css';

// تم تحديث البيانات الوهمية لتشمل تفاصيل العرض الفني والمالي كاملة (التي يرسلها المزود)
const mockOffers = [
  { 
    id: 1, 
    providerName: 'مؤسسة البناء الذهبي', 
    projectTitle: 'بناء عظم - مساحة 400م', 
    price: '26,500,000', 
    duration: '180', // بالأيام
    startDate: '2026/09/01',
    status: 'pending', 
    date: '2026/08/17',
    stages: [
        { id: 101, name: 'أعمال الحفر والأساسات', duration: '30' },
        { id: 102, name: 'صب الأعمدة والأسقف للدور الأول والثاني', duration: '90' },
        { id: 103, name: 'أعمال التقطيع الداخلي والمحارة', duration: '60' }
    ],
    attachments: [
        { type: 'file', title: 'جدول الكميات والتسعير المفصل', fileName: 'BOQ_details.pdf' }
    ]
  },
  { 
    id: 2, 
    providerName: 'مكتب الإبداع الهندسي', 
    projectTitle: 'تصميم داخلي لفيلا مودرن', 
    price: '4,200,000', 
    duration: '30', 
    startDate: '2026/08/25',
    status: 'accepted', 
    date: '2026/08/10',
    stages: [
        { id: 201, name: 'رفع المقاسات وتقديم الفكرة المبدئية', duration: '10' },
        { id: 202, name: 'تقديم مخططات 3D النهائية', duration: '20' }
    ],
    attachments: []
  },
  { 
    id: 3, 
    providerName: 'فني كهرباء - محمد علي', 
    projectTitle: 'تمديدات كهربائية كاملة', 
    price: '1,600,000', 
    duration: '15',
    startDate: '2026/08/20',
    status: 'rejected', 
    date: '2026/08/15', 
    rejectReason: 'السعر مبالغ فيه جداً مقارنة بحجم العمل.',
    stages: [],
    attachments: []
  },
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
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
            setOffers(data);
        }
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
    if(!window.confirm(`هل أنت متأكد من قبول العرض المقدم من "${offer.providerName}"؟`)) return;

    const safeOffersList = Array.isArray(offers) ? offers : [];
    try {
      await approveOffer(offer.id);
    } catch {
      // محلياً
    }
    setOffers(safeOffersList.map(o => o.id === offer.id ? { ...o, status: 'accepted' } : o));
    showToast('success', `✅ تم قبول عرض ${offer.providerName} بنجاح`);
  };

  const handleReject = async (offer) => {
    const reason = window.prompt('يرجى كتابة سبب رفض هذا العرض (سيظهر لمزود الخدمة):');
    if (!reason) return;

    const safeOffersList = Array.isArray(offers) ? offers : [];
    try {
      await rejectOffer(offer.id, reason);
    } catch {
      // محلياً
    }
    setOffers(safeOffersList.map(o => o.id === offer.id ? { ...o, status: 'rejected', rejectReason: reason } : o));
    showToast('info', `تم رفض عرض ${offer.providerName}`);
  };

  const safeOffers = Array.isArray(offers) ? offers : [];

  const filtered = safeOffers.filter(o => {
    const pName = o.providerName || '';
    const pTitle = o.projectTitle || '';
    const matchSearch = pName.toLowerCase().includes(search.toLowerCase()) || pTitle.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="admin-section-header">
        <div>
          <h3><FaFileInvoiceDollar className="ms-2 text-warning" /> مراجعة العروض المقدمة</h3>
          <p>مراجعة العروض الفنية والمالية التي قدمها مزودو الخدمة وقبولها أو رفضها.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-admin"
                placeholder="ابحث باسم المزود أو اسم المشروع..."
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
              <option value="pending">عروض قيد المراجعة</option>
              <option value="accepted">عروض مقبولة</option>
              <option value="rejected">عروض مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(offer => (
            <div key={offer.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4" style={{ borderColor: offer.status === 'pending' ? '#ff8a00' : offer.status === 'accepted' ? '#10b981' : '#ef4444' }}>
              
              {/* رأس البطاقة - اسم المزود والمشروع */}
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-primary">
                        <FaUserTie size={24} />
                    </div>
                    <div>
                        <span className="text-muted small fw-bold d-block mb-1">مقدم العرض</span>
                        <h4 className="fw-bold text-dark mb-0" style={{ fontSize: '22px' }}>{offer.providerName}</h4>
                    </div>
                </div>
                <div className="text-end">
                    {getStatusBadge(offer.status)}
                    <div className="text-muted small fw-bold mt-2 d-flex align-items-center justify-content-end gap-1">
                        تاريخ التقديم: {offer.date}
                    </div>
                </div>
              </div>

              <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47' }}>
                 <FaHardHat className="text-warning" /> عرض على مشروع: {offer.projectTitle}
              </h5>

              {/* === تفاصيل العرض الفني والمالي === */}
              <div className="bg-light p-4 rounded-4 mb-4 border">
                
                {/* 1. الملخص المالي والزمني */}
                <div className="row g-4 mb-4 pb-4 border-bottom">
                    <div className="col-md-4">
                        <div className="d-flex flex-column bg-white p-3 rounded-3 border border-success border-opacity-25 shadow-sm">
                            <span className="text-muted small fw-bold mb-2 d-flex align-items-center gap-1"><FaMoneyBillWave className="text-success" /> السعر الإجمالي</span>
                            <span className="fw-bold text-dark fs-5">{offer.price || 'غير محدد'} ل.س</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex flex-column bg-white p-3 rounded-3 border shadow-sm">
                            <span className="text-muted small fw-bold mb-2 d-flex align-items-center gap-1"><FaClock className="text-primary" /> مدة التنفيذ الكلية</span>
                            <span className="fw-bold text-dark fs-5">{offer.duration || 'غير محدد'} يوم</span>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="d-flex flex-column bg-white p-3 rounded-3 border shadow-sm">
                            <span className="text-muted small fw-bold mb-2 d-flex align-items-center gap-1"><FaCalendarAlt className="text-danger" /> تاريخ بدء العمل المقترح</span>
                            <span className="fw-bold text-dark fs-5" dir="ltr">{offer.startDate || 'غير محدد'}</span>
                        </div>
                    </div>
                </div>

                {/* 2. مراحل التنفيذ */}
                <div className="mb-4">
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                        <FaProjectDiagram /> خطة العمل ومراحل التنفيذ
                    </h6>
                    {offer.stages && offer.stages.length > 0 ? (
                        <div className="d-flex flex-column gap-2">
                            {offer.stages.map((stage, index) => (
                                <div key={stage.id || index} className="d-flex justify-content-between align-items-center bg-white p-3 rounded-3 border shadow-sm">
                                    <div className="d-flex align-items-center gap-2">
                                        <span className="badge bg-warning text-dark rounded-circle p-2 px-3 fw-bold">{index + 1}</span>
                                        <span className="fw-bold text-dark" style={{ fontSize: '15px' }}>{stage.name}</span>
                                    </div>
                                    <span className="badge bg-light text-dark border px-3 py-2 fw-bold d-flex align-items-center gap-1">
                                        <FaClock className="text-muted" /> {stage.duration} يوم
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted fw-semibold bg-white p-3 rounded-3 border">لم يقم المزود بتقسيم العمل إلى مراحل.</p>
                    )}
                </div>

                {/* 3. المرفقات */}
                <div>
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                        <FaPaperclip /> الملفات المرفقة مع العرض
                    </h6>
                    {offer.attachments && offer.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {offer.attachments.map((att, i) => (
                                <div key={i} className="bg-white border rounded-3 p-2 px-3 d-flex align-items-center gap-2 shadow-sm">
                                    {att.type === 'file' ? <FaFilePdf className="text-danger fs-4" /> : <FaImage className="text-primary fs-4" />}
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{att.title || att.fileName || 'مرفق'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-muted fw-semibold bg-white p-3 rounded-3 border">لم يقم المزود بإرفاق أي ملفات توضيحية.</p>
                    )}
                </div>

              </div>

              {/* سبب الرفض إن وجد */}
              {offer.status === 'rejected' && offer.rejectReason && (
                <div className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FaTimesCircle className="text-danger fs-3" />
                  <div>
                      <span className="fw-bold text-danger d-block mb-1">سبب رفض هذا العرض:</span>
                      <span className="fw-semibold text-dark">{offer.rejectReason}</span>
                  </div>
                </div>
              )}

              {/* أزرار الإدارة */}
              {offer.status === 'pending' && (
                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top flex-wrap">
                  <button className="btn btn-outline-danger fw-bold d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2" onClick={() => handleReject(offer)}>
                    <FaTimesCircle /> رفض العرض
                  </button>
                  <button className="btn-admin-primary d-inline-flex align-items-center justify-content-center gap-2 px-5 py-2 shadow-sm" onClick={() => handleApprove(offer)}>
                    <FaCheck /> قبول العرض
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