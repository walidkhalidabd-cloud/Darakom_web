import { useState, useEffect } from 'react';
import { 
  FaStar, FaRegStar, FaHandHoldingHeart, FaCommentDots, 
  FaHardHat, FaQuoteRight, FaCalendarAlt,
  FaExclamationTriangle, FaSpinner, FaCheckCircle, FaTimes,
  FaUser
} from 'react-icons/fa';
import { fetchReceivedReviews } from '../../../services/api/providerApi';
import StarRatingInput from '../../../components/StarRatingInput';
import './provider-tabs.css';

const ProviderReviewsTab = () => {
  const [reviewType, setReviewType] = useState('received');
  const [received, setReceived] = useState([]);
  const [given, setGiven] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // نموذج التقييم
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientId: '',
    projectId: '',
    rating: 0,
    reviewText: ''
  });
  const [submitting, setSubmitting] = useState(false);

  // بيانات وهمية للعملاء (لقائمة الاختيار)
  const clientsList = [
    { id: 'CL-001', name: 'أحمد سليمان' },
    { id: 'CL-002', name: 'خالد عبدالله' },
    { id: 'CL-003', name: 'سارة ناصر' },
    { id: 'CL-004', name: 'محمد علي' },
  ];

  // بيانات وهمية للمشاريع (لقائمة الاختيار)
  const projectsList = [
    { id: 'PJ-001', title: 'بناء عظم - مساحة 400م', clientId: 'CL-001' },
    { id: 'PJ-002', title: 'تشطيب شقة 150م', clientId: 'CL-002' },
    { id: 'PJ-003', title: 'تصميم داخلي لفيلا', clientId: 'CL-003' },
    { id: 'PJ-004', title: 'تمديدات كهرباء لفيلا', clientId: 'CL-004' },
  ];

  // تصفية المشاريع حسب العميل المختار
  const filteredProjects = formData.clientId
    ? projectsList.filter(p => p.clientId === formData.clientId)
    : projectsList;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
try {
        const recRes = await fetchReceivedReviews();
        if (recRes.data?.data) setReceived(recRes.data.data);
      } catch (e) {
        console.warn('⚠️ API غير متاح، استخدام بيانات وهمية:', e?.message);
      }

      // Fallback data if empty
      setReceived(prev => prev.length > 0 ? prev : [
        { id: 1, client_name: 'أحمد سليمان', client_avatar: 'أ', project_title: 'بناء عظم - 400م', rating: 5, review_text: 'مهندس محترف جداً ومخلص في عمله. تم تسليم المشروع قبل الموعد.', date: '2026/05/15' },
        { id: 2, client_name: 'خالد عبدالله', client_avatar: 'خ', project_title: 'تشطيب شقة 150م', rating: 4, review_text: 'عمل جيد والتزم بالجدول الزمني.', date: '2026/03/20' },
        { id: 3, client_name: 'سارة ناصر', client_avatar: 'س', project_title: 'تصميم داخلي لفيلا', rating: 5, review_text: 'تصاميم إبداعية وذوق رفيع!', date: '2025/11/10' },
      ]);
      setGiven(prev => prev.length > 0 ? prev : [
        { id: 4, client_name: 'فني كهرباء: محمد علي', project_title: 'تمديدات كهرباء لفيلا', rating: 5, review_text: 'فني ممتاز ومتقن لعمله.', date: '2026/06/01' },
        { id: 5, client_name: 'مؤسسة الحدادة الفنية', project_title: 'درابزين وسلالم حديد', rating: 4, review_text: 'جودة ممتازة، تأخير بسيط.', date: '2026/04/18' },
      ]);
      setLoading(false);
    };
    load();
  }, []);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();

    if (!formData.clientId) {
      showToast('error', '⚠️ الرجاء اختيار العميل');
      return;
    }
    if (!formData.projectId) {
      showToast('error', '⚠️ الرجاء اختيار المشروع');
      return;
    }
    if (formData.rating === 0) {
      showToast('error', '⚠️ الرجاء تحديد التقييم بالنجوم');
      return;
    }
    if (!formData.reviewText.trim()) {
      showToast('error', '⚠️ الرجاء كتابة نص التقييم');
      return;
    }

setSubmitting(true);

    const selectedClient = clientsList.find(c => c.id === formData.clientId);
    const selectedProject = projectsList.find(p => p.id === formData.projectId);

    const newReview = {
      id: Date.now(),
      client_name: selectedClient?.name || 'عميل',
      client_avatar: selectedClient?.name?.charAt(0) || 'ع',
      project_title: selectedProject?.title || 'مشروع',
      rating: formData.rating,
      review_text: formData.reviewText,
      date: new Date().toLocaleDateString('en-CA')
    };

    setGiven(prev => [newReview, ...prev]);

    setFormData({ clientId: '', projectId: '', rating: 0, reviewText: '' });
    setShowForm(false);
    setSubmitting(false);
    showToast('success', '✅ تم إرسال التقييم بنجاح!');
  };

  const renderStars = (rating) => (
    <div className="stars-container">
      {[...Array(5)].map((_, i) => (
        i < rating ? <FaStar key={i} className="star-filled" size={22} /> : <FaRegStar key={i} className="star-empty" size={22} />
      ))}
    </div>
  );

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1100px' }}>
        <div className="section-header"><div><h3><FaStar className="ms-2 text-warning" /> التقييمات</h3></div></div>
        {[1,2,3].map(i => <div key={i} className="card-provider p-5 mb-4"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '1100px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`} style={{ direction: 'rtl' }}>{toast.message}</div>}

      <div className="section-header">
        <div>
          <h3><FaStar className="ms-2 text-warning" /> سجل التقييمات</h3>
          <p>تقييمات العملاء لك والتقييمات التي قدمتها</p>
        </div>
        <button 
          className="btn fw-bold px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
          style={{ backgroundColor: showForm ? '#dc3545' : '#1b2a47', color: 'white', fontSize: '18px', border: 'none' }}
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? <><FaTimes /> إلغاء</> : <><FaStar /> تقييم عميل</>}
        </button>
      </div>

      {/* ===== نموذج إضافة تقييم جديد ===== */}
      {showForm && (
        <div className="card-provider p-4 p-md-5 mb-5 bg-white border-end border-4 border-warning">
          <h4 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>تقديم تقييم لعميل</h4>
          <p className="text-muted fw-semibold mb-4">قيّم تجربتك مع العميل في المشروع</p>
          
          <form onSubmit={handleSubmitReview}>
            <div className="row g-4">
              {/* اختيار العميل */}
              <div className="col-md-6">
                <label className="form-label fw-bold">العميل *</label>
                <select 
                  className="form-control form-control-custom"
                  value={formData.clientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, clientId: e.target.value, projectId: '' }))}
                  required
                >
                  <option value="">-- اختر العميل --</option>
                  {clientsList.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* اختيار المشروع */}
              <div className="col-md-6">
                <label className="form-label fw-bold">المشروع *</label>
                <select 
                  className="form-control form-control-custom"
                  value={formData.projectId}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                  required
                >
                  <option value="">-- اختر المشروع --</option>
                  {filteredProjects.map(p => (
                    <option key={p.id} value={p.id}>{p.title}</option>
                  ))}
                </select>
              </div>

              {/* تقييم النجوم */}
              <div className="col-12">
                <label className="form-label fw-bold d-block">التقييم بالنجوم *</label>
                <div className="bg-light p-3 rounded-4 d-inline-block border">
                  <StarRatingInput 
                    rating={formData.rating}
                    onRate={(value) => setFormData(prev => ({ ...prev, rating: value }))}
                    size={36}
                  />
                </div>
                {formData.rating > 0 && (
                  <span className="d-block mt-2 fw-bold" style={{ color: '#ff8a00' }}>
                    {formData.rating === 1 ? 'سيء' :
                     formData.rating === 2 ? 'ضعيف' :
                     formData.rating === 3 ? 'جيد' :
                     formData.rating === 4 ? 'جيد جداً' : 'ممتاز'}
                  </span>
                )}
              </div>

              {/* نص التقييم */}
              <div className="col-12">
                <label className="form-label fw-bold">نص التقييم *</label>
                <textarea 
                  className="form-control form-control-custom" 
                  rows="4"
                  placeholder="اكتب تقييمك للعميل هنا..."
                  value={formData.reviewText}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                  required
                ></textarea>
              </div>

              {/* زر الإرسال */}
              <div className="col-12 text-center mt-3">
                <button 
                  type="submit" 
                  className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3"
                  style={{ fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                  disabled={submitting}
                >
                  {submitting ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaCheckCircle /> إرسال التقييم</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {error && <div className="alert alert-danger rounded-4 d-flex align-items-center gap-3 mb-4"><FaExclamationTriangle /> {error}</div>}

      {/* Tabs */}
      <div className="tab-switcher">
        <button className={reviewType === 'received' ? 'active-tab' : 'inactive-tab'} style={{ backgroundColor: reviewType === 'received' ? '#1b2a47' : '', color: reviewType === 'received' ? 'white' : '' }}
          onClick={() => setReviewType('received')}>
          <FaHandHoldingHeart className="ms-2" /> تقييمات العملاء لي
        </button>
        <button className={reviewType === 'given' ? 'active-tab' : 'inactive-tab'} style={{ backgroundColor: reviewType === 'given' ? '#ff8a00' : '', color: reviewType === 'given' ? 'white' : '' }}
          onClick={() => setReviewType('given')}>
          <FaCommentDots className="ms-2" /> تقييمات قدمتها
        </button>
      </div>

      <div className="d-flex flex-column gap-4">
        {/* Received */}
        {reviewType === 'received' && (received.length > 0 ? received.map(r => (
          <div key={r.id} className="card-provider p-4 p-md-5 bg-white border-end border-4 border-warning">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
              {renderStars(r.rating)}
              <span className="text-muted small fw-bold d-flex align-items-center gap-1"><FaCalendarAlt /> {r.date}</span>
            </div>
            <div className="row g-3 mb-4 bg-warning bg-opacity-10 p-3 rounded-4 mx-0 border border-warning border-opacity-25">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '50px', height: '50px', fontSize: '22px' }}>
                  {r.client_avatar || 'ع'}
                </div>
                <div>
                  <span className="text-muted small fw-bold d-block">تقييم من</span>
                  <span className="fw-bold fs-5">{r.client_name}</span>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3 border-md-start border-warning border-opacity-50 ps-md-4">
                <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaHardHat size={20} /></div>
                <div>
                  <span className="text-muted small fw-bold d-block">المشروع</span>
                  <span className="fw-bold fs-5">{r.project_title}</span>
                </div>
              </div>
            </div>
            <div className="position-relative p-4 rounded-4 bg-white border shadow-sm">
              <FaQuoteRight className="position-absolute text-warning opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
              <p className="fw-semibold mb-0 position-relative z-1 fs-5" style={{ lineHeight: '1.8' }}>"{r.review_text}"</p>
            </div>
          </div>
        )) : <div className="empty-state"><FaHandHoldingHeart size={60} /><h4>لا توجد تقييمات</h4></div>)}

        {/* Given */}
        {reviewType === 'given' && (given.length > 0 ? given.map(r => (
          <div key={r.id} className="card-provider p-4 p-md-5 bg-white border-end border-4 border-primary">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
              {renderStars(r.rating)}
              <span className="text-muted small fw-bold">{r.date}</span>
            </div>
            <div className="row g-3 mb-4 bg-light p-3 rounded-4 mx-0 border">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded-circle shadow-sm text-primary"><FaUser size={22} /></div>
                <div>
                  <span className="text-muted small fw-bold d-block">العميل المُقَيَّم</span>
                  <span className="fw-bold fs-5">{r.client_name}</span>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                <div className="bg-light p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                <div>
                  <span className="text-muted small fw-bold d-block">المشروع</span>
                  <span className="fw-bold fs-5">{r.project_title}</span>
                </div>
              </div>
            </div>
            <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
              <FaQuoteRight className="position-absolute text-muted opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
              <p className="fw-semibold mb-0 position-relative z-1 fs-5" style={{ lineHeight: '1.8' }}>"{r.review_text}"</p>
            </div>
          </div>
        )) : <div className="empty-state"><FaCommentDots size={60} /><h4>لم تقم بتقييم أحد</h4></div>)}
      </div>
    </div>
  );
};

export default ProviderReviewsTab;

