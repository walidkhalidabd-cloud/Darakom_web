import { useState, useEffect } from 'react';
import {
  FaExclamationTriangle, FaCheckCircle, FaTimesCircle, FaClock,
  FaSpinner, FaReply, FaUserTie, FaHardHat
} from 'react-icons/fa';
import { fetchAdminComplaints, replyToComplaint, closeComplaint } from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات وهمية احتياطية
const mockComplaints = [
  { id: 1, fromName: 'أحمد سليمان', againstName: 'مؤسسة البناء الذهبي', projectTitle: 'بناء عظم - مساحة 400م', date: '2026/06/15', status: 'pending', description: 'المقاول تأخر في تسليم المرحلة الثانية لمدة أسبوعين دون عذر مبرر.', adminReply: null },
  { id: 2, fromName: 'سمر حسن', againstName: 'شركة أطياف للتشطيبات', projectTitle: 'تشطيب شقة 150م', date: '2026/06/10', status: 'pending', description: 'اختلاف في نوعية السيراميك الموردة عن المتفق عليه.', adminReply: null },
  { id: 3, fromName: 'خالد عبدالله', againstName: 'مكتب الإبداع الهندسي', projectTitle: 'تصميم داخلي لفيلا', date: '2026/05/20', status: 'resolved', description: 'المهندس يطلب مبلغاً إضافياً لتعديل المخطط.', adminReply: 'تم حل النزاع والتوصل لاتفاق بين الطرفين.' },
  { id: 4, fromName: 'سمر حسن', againstName: 'فني كهرباء - محمد علي', projectTitle: 'أعمال كهرباء', date: '2026/05/05', status: 'closed', description: 'أعمال غير مكتملة وغير مطابقة للمواصفات.', adminReply: 'تم إغلاق الشكوى بعد تنفيذ الإصلاحات المطلوبة.' },
];

const ComplaintsTab = () => {
  const [complaints, setComplaints] = useState(mockComplaints);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [replyText, setReplyText] = useState({});

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminComplaints();
        const data = res.data?.data;
        if (data) setComplaints(data);
      } catch {
        // ابقِ على البيانات الوهمية
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending"><FaClock /> قيد المراجعة</span>;
    if (status === 'resolved') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> تم الحل</span>;
    return <span className="admin-badge admin-badge-blocked"><FaTimesCircle /> مغلقة</span>;
  };

  const handleReply = async (complaint) => {
    const text = replyText[complaint.id]?.trim();
    if (!text) {
      showToast('error', 'يرجى كتابة نص الرد أولاً');
      return;
    }
    try {
      await replyToComplaint(complaint.id, { reply: text });
    } catch {
      // محلياً
    }
    setComplaints(complaints.map(c => c.id === complaint.id ? { ...c, status: 'resolved', adminReply: text } : c));
    setReplyText({ ...replyText, [complaint.id]: '' });
    showToast('success', '✅ تم إرسال الرد وحل الشكوى');
  };

  const handleClose = async (complaint) => {
    try {
      await closeComplaint(complaint.id);
    } catch {
      // محلياً
    }
    setComplaints(complaints.map(c => c.id === complaint.id ? { ...c, status: 'closed' } : c));
    showToast('info', 'تم إغلاق الشكوى');
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* رأس الواجهة */}
      <div className="admin-section-header">
        <div>
          <h3><FaExclamationTriangle className="ms-2 text-danger" /> الإشراف على الشكاوى</h3>
          <p>مراجعة الشكاوى والملاحظات الواردة من المستخدمين والرد عليها.</p>
        </div>
      </div>

      {/* قائمة الشكاوى */}
      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : complaints.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {complaints.map(complaint => (
            <div key={complaint.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4" style={{ borderColor: complaint.status === 'pending' ? '#ff8a00' : complaint.status === 'resolved' ? '#10b981' : '#6c757d' }}>
              {/* التذكرة والحالة */}
              <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة رقم: #{complaint.id + 1000}</h5>
                {getStatusBadge(complaint.status)}
              </div>

              {/* الأطراف والمشروع */}
              <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-2">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                  <div>
                    <span className="text-muted small fw-bold d-block">مقدّم الشكوى</span>
                    <span className="fw-bold text-dark fs-5">{complaint.fromName}</span>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center gap-2">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                  <div>
                    <span className="text-muted small fw-bold d-block">على / المشروع</span>
                    <span className="fw-bold text-dark fs-5">{complaint.againstName} - {complaint.projectTitle}</span>
                  </div>
                </div>
              </div>

              {/* نص الشكوى */}
              <div className="mb-4">
                <h6 className="fw-bold text-danger mb-2">وصف الشكوى:</h6>
                <p className="text-dark fw-semibold fs-5" style={{ lineHeight: '1.8' }}>{complaint.description}</p>
              </div>

              {/* الرد السابق */}
              {complaint.adminReply && (
                <div className="p-4 rounded-4 mb-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="me-1" /> رد الإدارة:</h6>
                  <p className="text-dark fw-semibold mb-0" style={{ lineHeight: '1.8', fontSize: '18px' }}>{complaint.adminReply}</p>
                </div>
              )}

              {/* منطقة الرد (للشكاوى قيد المراجعة) */}
              {complaint.status === 'pending' && (
                <div className="mt-auto pt-3 border-top">
                  <label className="form-label fw-bold">كتابة رد الإدارة:</label>
                  <textarea
                    className="form-control form-control-admin mb-3"
                    rows="3"
                    placeholder="اكتب ردك على هذه الشكوى..."
                    value={replyText[complaint.id] || ''}
                    onChange={e => setReplyText({ ...replyText, [complaint.id]: e.target.value })}
                  />
                  <div className="d-flex gap-2">
                    <button className="btn-admin-primary d-inline-flex align-items-center gap-2" onClick={() => handleReply(complaint)}>
                      <FaReply /> إرسال الرد وحل الشكوى
                    </button>
                    <button className="btn btn-outline-secondary fw-bold" onClick={() => handleClose(complaint)}>
                      إغلاق الشكوى
                    </button>
                  </div>
                </div>
              )}

              <div className="text-end mt-4 pt-3 border-top text-muted small fw-bold">
                تاريخ التقديم: {complaint.date}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <FaExclamationTriangle size={50} />
          <h5>لا توجد شكاوى حالياً</h5>
          <p>كل شيء تحت السيطرة.</p>
        </div>
      )}
    </div>
  );
};

export default ComplaintsTab;
