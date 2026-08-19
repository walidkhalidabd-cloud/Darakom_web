import { useState, useEffect } from 'react';
import { 
  FaStar, FaRegStar, FaHandHoldingHeart, 
  FaHardHat, FaQuoteRight, FaCalendarAlt,
  FaExclamationTriangle
} from 'react-icons/fa';
import { fetchReceivedReviews } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderReviewsTab = () => {
  const [received, setReceived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchReceivedReviews();
        const recData = res.data?.data || [];
        
        if (recData.length > 0) {
            // تنسيق البيانات القادمة من الباك إند لتلائم الواجهة الأمامية
            const formattedData = recData.map(r => ({
                id: r.id,
                client_name: r.user ? `${r.user.first_name} ${r.user.last_name || ''}`.trim() : 'عميل غير معروف',
                client_avatar: r.user?.first_name ? r.user.first_name[0] : 'ع',
                project_title: r.project?.title || 'مشروع غير محدد',
                rating: r.rate || 0, // الباك يرسلها كـ rate
                review_text: r.comment || 'لا يوجد تعليق نصي', // الباك يرسلها كـ comment
                date: r.created_at ? new Date(r.created_at).toLocaleDateString('ar-EG') : 'غير محدد'
            }));
            setReceived(formattedData);
        } else {
            setReceived([]); // جعلها فارغة إذا لم تكن هناك بيانات فعلية
        }
      } catch (err) { 
        console.error('خطأ في جلب التقييمات:', err);
        setError('تعذر جلب التقييمات من الخادم. يرجى المحاولة لاحقاً.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

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
      <div className="section-header">
        <div>
          <h3><FaStar className="ms-2 text-warning" /> سجل التقييمات</h3>
          <p>تقييمات وآراء العملاء حول خدماتك ومشاريعك المنفذة</p>
        </div>
      </div>

      {error && <div className="alert alert-danger rounded-4 d-flex align-items-center gap-3 mb-4"><FaExclamationTriangle /> {error}</div>}

      <div className="d-flex flex-column gap-4 mt-3">
        {received.length > 0 ? received.map(r => (
          <div key={r.id} className="card-provider p-4 p-md-5 bg-white border-end border-4 border-warning">
            
            {/* التقييم والتاريخ */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-3">
              {renderStars(r.rating)}
              <span className="text-muted small fw-bold d-flex align-items-center gap-1"><FaCalendarAlt /> {r.date}</span>
            </div>
            
            {/* معلومات العميل والمشروع */}
            <div className="row g-3 mb-4 bg-warning bg-opacity-10 p-3 rounded-4 mx-0 border border-warning border-opacity-25">
              <div className="col-md-6 d-flex align-items-center gap-3">
                <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow-sm" style={{ width: '50px', height: '50px', fontSize: '22px' }}>
                  {r.client_avatar}
                </div>
                <div>
                  <span className="text-muted small fw-bold d-block">تقييم من العميل</span>
                  <span className="fw-bold fs-5 text-dark">{r.client_name}</span>
                </div>
              </div>
              <div className="col-md-6 d-flex align-items-center gap-3 border-md-start border-warning border-opacity-50 ps-md-4">
                <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaHardHat size={20} /></div>
                <div>
                  <span className="text-muted small fw-bold d-block">المشروع المرتبط</span>
                  <span className="fw-bold fs-5 text-dark">{r.project_title}</span>
                </div>
              </div>
            </div>

            {/* نص التقييم */}
            <div className="position-relative p-4 rounded-4 bg-white border shadow-sm">
              <FaQuoteRight className="position-absolute text-warning opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
              <p className="fw-semibold mb-0 position-relative z-1 fs-5 text-dark" style={{ lineHeight: '1.8' }}>"{r.review_text}"</p>
            </div>

          </div>
        )) : (
            <div className="empty-state">
                <FaHandHoldingHeart size={60} className="text-muted opacity-25 mb-3" />
                <h4 className="fw-bold text-muted">لا توجد تقييمات</h4>
                <p className="fw-semibold text-muted">لم يقم أي عميل بتقييم خدماتك حتى الآن.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProviderReviewsTab;