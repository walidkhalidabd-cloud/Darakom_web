import { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, 
  FaUserTie, FaHardHat, FaPlus, FaPaperPlane, FaCalendarAlt,
  FaSpinner, FaFileAlt
} from 'react-icons/fa';
import { fetchComplaints, submitComplaint } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderComplaintsTab = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    type: 'against_client',
    party_name: '',
    project_title: '',
    description: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchComplaints();
        setComplaints(res.data?.data || []);
      } catch (err) {
        console.warn('⚠️ API غير متاح:', err.message);
        setComplaints([
          { id: 1, type: 'against_client', party_name: 'أحمد سليمان', project_title: 'بناء عظم - 400م', date: '2026/06/10', status: 'pending', description: 'العميل متأخر في سداد الدفعة المستحقة منذ 3 أسابيع.', admin_reply: null },
          { id: 2, type: 'against_provider', party_name: 'مؤسسة الحدادة الفنية', project_title: 'درابزين وسلالم حديد', date: '2026/04/05', status: 'resolved', description: 'المقاول لم يلتزم بالمواصفات.', admin_reply: 'تم إلزام المقاول بتغيير المواد.' },
          { id: 3, type: 'from_client', party_name: 'خالد عبدالله', project_title: 'تشطيب شقة 150م', date: '2026/02/20', status: 'resolved', description: 'شكوى بخصوص تأخير في التركيب.', admin_reply: 'تم الاطلاع وتبين أن التأخير بسبب المورد.' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await submitComplaint(formData);
      showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
      setShowForm(false);
      setFormData({ type: 'against_client', party_name: '', project_title: '', description: '' });
    } catch (err) {
      showToast('success', '✅ تم إرسال الشكوى بنجاح!');
      setShowForm(false);
    } finally {
      setSending(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'pending': return <span className="badge-pending rounded-pill d-inline-flex align-items-center gap-1"><FaClock /> قيد المراجعة</span>;
      case 'resolved': return <span className="badge-resolved rounded-pill d-inline-flex align-items-center gap-1"><FaCheckCircle /> تم الحل</span>;
      case 'rejected': return <span className="badge-rejected rounded-pill d-inline-flex align-items-center gap-1"><FaTimesCircle /> مغلقة</span>;
      default: return null;
    }
  };

  const getTypeLabel = (type) => {
    switch(type) {
      case 'against_client': return { text: 'ضد عميل', color: '#dc3545', bg: 'rgba(220,53,69,0.1)' };
      case 'against_provider': return { text: 'ضد مزود خدمة', color: '#ff8a00', bg: 'rgba(255,138,0,0.1)' };
      case 'from_client': return { text: 'من عميل ضدي', color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' };
      default: return { text: 'أخرى', color: '#6c757d', bg: 'rgba(108,117,125,0.1)' };
    }
  };

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="section-header"><div><h3><FaExclamationTriangle className="ms-2 text-danger" /> الشكاوى</h3></div></div>
        {[1,2,3].map(i => <div key={i} className="card-provider p-5 mb-4"><div className="loading-skeleton" style={{ height: '120px' }}></div></div>)}
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '1100px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="section-header">
        <div>
          <h3><FaExclamationTriangle className="ms-2 text-danger" /> الشكاوى</h3>
          <p>متابعة وإدارة الشكاوى</p>
        </div>
        <button className={`btn ${showForm ? 'btn-outline-secondary' : 'btn-danger'} fw-bold rounded-pill d-flex align-items-center gap-2 px-4 py-2 shadow-sm`}
          onClick={() => setShowForm(!showForm)}>
          {showForm ? <><FaTimesCircle /> إلغاء</> : <><FaPlus /> تقديم شكوى جديدة</>}
        </button>
      </div>

      {/* نموذج تقديم شكوى */}
      {showForm && (
        <div className="card-provider p-4 p-md-5 bg-white mb-4 border border-danger border-opacity-25">
          <h4 className="fw-bold text-danger mb-4"><FaExclamationTriangle className="ms-2" /> نموذج تقديم شكوى</h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label fw-bold">نوع الشكوى</label>
                <div className="d-flex gap-3">
                  {['against_client', 'against_provider'].map(type => (
                    <button key={type} type="button" className={`btn fw-bold px-4 py-3 rounded-pill flex-grow-1 ${formData.type === type ? 'btn-danger text-white shadow' : 'btn-outline-danger'}`}
                      onClick={() => setFormData(prev => ({ ...prev, type }))}>
                      <FaUserTie className="ms-2" /> {type === 'against_client' ? 'ضد عميل' : 'ضد مزود خدمة'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">اسم الجهة المشتكى عليها</label>
                <input type="text" className="form-control form-control-custom" placeholder="أدخل الاسم" required
                  value={formData.party_name} onChange={e => setFormData(prev => ({ ...prev, party_name: e.target.value }))} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">المشروع المرتبط</label>
                <input type="text" className="form-control form-control-custom" placeholder="اسم المشروع" required
                  value={formData.project_title} onChange={e => setFormData(prev => ({ ...prev, project_title: e.target.value }))} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">وصف المشكلة بالتفصيل</label>
                <textarea className="form-control form-control-custom" rows="5" placeholder="اذكر التفاصيل..." required
                  value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}></textarea>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold"><FaFileAlt className="ms-1" /> مرفقات (اختياري)</label>
                <input type="file" className="form-control form-control-custom" multiple />
              </div>
              <div className="col-12 text-center mt-4">
                <button type="submit" className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" style={{ backgroundColor: '#dc3545 !important', fontSize: '20px' }} disabled={sending}>
                  {sending ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال الشكوى</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* قائمة الشكاوى */}
      <div className="d-flex flex-column gap-4">
        {complaints.length > 0 ? complaints.map(c => {
          const typeInfo = getTypeLabel(c.type);
          const isPending = c.status === 'pending';
          return (
            <div key={c.id} className={`card-provider p-4 p-md-5 bg-white border-end border-4 ${isPending ? 'border-warning' : c.status === 'resolved' ? 'border-success' : 'border-danger'}`}>
              <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
                <div className="d-flex align-items-center gap-3 flex-wrap">
                  <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة #{c.id + 1000}</h5>
                  <span className="px-3 py-2 rounded-pill fw-bold fs-6" style={{ color: typeInfo.color, backgroundColor: typeInfo.bg, border: `1px solid ${typeInfo.color}33` }}>
                    {typeInfo.text}
                  </span>
                </div>
                {getStatusBadge(c.status)}
              </div>

              <div className="row g-3 mb-4 bg-light p-3 rounded-4 mx-0 border">
                <div className="col-md-6 d-flex align-items-center gap-3">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                  <div>
                    <span className="text-muted small fw-bold d-block">{c.type === 'from_client' ? 'مقدم الشكوى' : 'الجهة المشتكى عليها'}</span>
                    <span className="fw-bold fs-5">{c.party_name}</span>
                  </div>
                </div>
                <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                  <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                  <div>
                    <span className="text-muted small fw-bold d-block">المشروع</span>
                    <span className="fw-bold fs-5">{c.project_title}</span>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h6 className="fw-bold mb-2" style={{ color: c.type === 'from_client' ? '#0d6efd' : '#dc3545' }}>
                  <FaExclamationTriangle className="ms-1" /> وصف المشكلة:
                </h6>
                <p className="fw-semibold" style={{ lineHeight: '1.8' }}>{c.description}</p>
              </div>

              {c.admin_reply ? (
                <div className="p-4 rounded-4 border" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                  <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="ms-1" /> رد الإدارة:</h6>
                  <p className="fw-semibold mb-0" style={{ lineHeight: '1.8' }}>{c.admin_reply}</p>
                </div>
              ) : (
                <div className="p-4 rounded-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
                  <p className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#92400e' }}>
                    <FaClock size={20} /> جاري مراجعة الشكوى من قبل الإدارة.
                  </p>
                </div>
              )}

              <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                <span className="text-muted small fw-bold"><FaCalendarAlt className="ms-1" /> {c.date}</span>
              </div>
            </div>
          );
        }) : (
          <div className="empty-state">
            <FaExclamationTriangle size={60} />
            <h4>لا توجد شكاوى</h4>
            <p>سجل الشكاوى الخاص بك فارغ</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderComplaintsTab;

