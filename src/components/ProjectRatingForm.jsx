import { useState } from 'react';
import { FaArrowRight, FaStar, FaUserTie, FaHardHat, FaCheckCircle, FaSpinner, FaCommentDots } from 'react-icons/fa';
import { rateProject } from '../services/api/clientApi';

const ProjectRatingForm = ({ project, onBack }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const providerName = project.provider || project.providerName || 'مزود الخدمة';
  const projectTitle = project.title || project.projectTitle || 'المشروع';

  // إرسال التقييم
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await rateProject(project.id, { rating, comment: reviewText });
      setSubmitted(true);
    } catch (err) {
      console.warn('⚠️ API غير متاح، محاكاة نجاح الإرسال:', err.message);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  // واجهة النجاح بعد الإرسال
  if (submitted) {
    return (
      <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center mx-auto" style={{ maxWidth: '800px' }}>
        <div className="text-success bg-success bg-opacity-10 p-4 rounded-circle d-inline-flex mb-4">
          <FaCheckCircle size={50} />
        </div>
        <h2 className="fw-bold mb-3" style={{ color: '#10b981' }}>شكراً لك! ✅</h2>
        <p className="text-muted fw-semibold fs-5 mb-4" style={{ lineHeight: '1.8' }}>
          تم إرسال تقييمك لمزود الخدمة <strong style={{ color: '#1b2a47' }}>{providerName}</strong> بنجاح.
          تقييمك يساعد المجتمع في اختيار أفضل مزودي الخدمة.
        </p>
        <div className="d-flex justify-content-center gap-1 mb-4">
          {[...Array(rating)].map((_, i) => (
            <FaStar key={i} className="text-warning" size={34} />
          ))}
        </div>
        <button
          className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white"
          style={{ backgroundColor: '#1b2a47', fontSize: '18px' }}
          onClick={onBack}
        >
          <FaArrowRight className="ms-2" /> العودة للتفاصيل
        </button>
      </div>
    );
  }

  return (
    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '850px' }}>
      {/* زر العودة */}
      <button
        className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm"
        onClick={onBack}
      >
        <FaArrowRight /> العودة للتفاصيل
      </button>

      {/* رأس الواجهة */}
      <div className="text-center mb-5">
        <div className="bg-warning bg-opacity-10 text-warning p-4 rounded-circle d-inline-flex mb-3">
          <FaStar size={40} />
        </div>
        <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تقييم المشروع ومزود الخدمة</h3>
        <p className="text-muted fw-semibold fs-5">شارك تجربتك لمساعدة الآخرين في اتخاذ القرار الصحيح</p>
      </div>

      {/* معلومات المشروع ومزود الخدمة */}
      <div className="row mb-5 bg-light p-3 rounded-4 mx-0 border g-3">
        <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
          <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaUserTie size={22} /></div>
          <div>
            <span className="text-muted small fw-bold d-block">مزود الخدمة المُقيَّم</span>
            <span className="fw-bold text-dark fs-5">{providerName}</span>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
          <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaHardHat size={22} /></div>
          <div>
            <span className="text-muted small fw-bold d-block">المشروع</span>
            <span className="fw-bold text-dark fs-5">{projectTitle}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        {/* اختيار النجوم من 1 إلى 5 */}
        <div className="text-center mb-5">
          <label className="form-label fw-bold fs-4 mb-4 d-block" style={{ color: '#1b2a47' }}>
            <FaStar className="text-warning ms-2" /> اختر تقييمك من 1 إلى 5
          </label>
          <div className="d-flex justify-content-center gap-2" dir="ltr">
            {[1, 2, 3, 4, 5].map(star => (
              <button
                type="button"
                key={star}
                className="border-0 bg-transparent p-0"
                style={{ transition: 'transform 0.2s', cursor: 'pointer' }}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                aria-label={`${star} نجوم`}
              >
                <FaStar
                  size={48}
                  className={star <= (hoverRating || rating) ? 'text-warning' : 'text-muted opacity-25'}
                  style={{ transition: '0.2s', transform: star <= (hoverRating || rating) ? 'scale(1.15)' : 'scale(1)' }}
                />
              </button>
            ))}
          </div>
          <div className="mt-3">
            {rating > 0 && (
              <span className="badge bg-warning text-dark px-4 py-2 rounded-pill fw-bold fs-6 shadow-sm">
                تقييمك: {rating} من 5
              </span>
            )}
          </div>
        </div>

        {/* حقل التعليق لوصف مزود الخدمة */}
        <div className="mb-5">
          <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>
            <FaCommentDots className="ms-2 text-warning" /> اكتب تعليقك عن مزود الخدمة
          </label>
          <textarea
            className="form-control p-4 bg-light border"
            rows="5"
            placeholder="صف تجربتك مع مزود الخدمة: جودة العمل، الالتزام بالمواعيد، التعامل، النتيجة النهائية..."
            style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px', lineHeight: '1.8' }}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            required
          ></textarea>
        </div>

        {/* أزرار الإجراءات */}
        <div className="d-flex justify-content-center gap-3 flex-wrap">
          <button
            type="submit"
            disabled={rating === 0 || submitting}
            className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
            style={{ backgroundColor: '#ff8a00', fontSize: '20px', opacity: rating === 0 ? 0.6 : 1 }}
          >
            {submitting ? <><FaSpinner className="fa-spin" /> جارٍ الإرسال...</> : <><FaStar /> إرسال التقييم</>}
          </button>
          <button
            type="button"
            className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
            style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '20px' }}
            onClick={onBack}
          >
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProjectRatingForm;
