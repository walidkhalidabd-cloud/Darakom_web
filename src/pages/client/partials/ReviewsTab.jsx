import { useState, useEffect } from 'react';
import { FaStar, FaUserTie, FaHardHat, FaQuoteRight, FaCommentDots, FaPlus, FaArrowRight, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import { fetchClientMyRatings, fetchClientProjects, rateProject } from '../../../services/api/clientApi';

const ReviewsTab = () => {
    const [view, setView] = useState('list');
    const [givenReviews, setGivenReviews] = useState([]);
    
    // مشاريع العميل المتاحة للتقييم (التي اكتمل تنفيذها)
    const [availableProjects, setAvailableProjects] = useState([]);

    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);

    // جلب التقييمات السابقة والمشاريع المكتملة
    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            try {
                // 1. جلب التقييمات التي قدمها العميل
                const ratingsRes = await fetchClientMyRatings();
                const ratingsData = ratingsRes.data?.data || ratingsRes.data || [];
                if (Array.isArray(ratingsData)) {
                    setGivenReviews(ratingsData);
                }

                // 2. جلب المشاريع لمعرفة ما يمكن تقييمه
                // (نجلب كل المشاريع ثم نفلتر المنتهي منها والذي يملك مزود خدمة)
                const projectsRes = await fetchClientProjects();
                const projectsData = projectsRes.data?.data || projectsRes.data || [];
                if (Array.isArray(projectsData)) {
                    const finishedProjects = projectsData.filter(
                        p => p.execution_status === 'finished' && p.performed_by
                    );
                    setAvailableProjects(finishedProjects);
                }
            } catch (err) {
                console.error("Error loading reviews or projects", err);
            } finally {
                setLoading(false);
            }
        };

        if (view === 'list') {
            loadData();
        } else if (view === 'new' && availableProjects.length === 0) {
            // جلب المشاريع فقط إذا لم تكن موجودة وفتحنا واجهة الجديد
            loadData();
        }
    }, [view]);

    // المشروع المختار للتقييم
    const selectedProject = availableProjects.find(p => p.id === Number(selectedProjectId));

    // إرسال التقييم الجديد للباك إند
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedProject || rating === 0) return;
        setSubmitting(true);
        setError(null);
        
        try {
            await rateProject(selectedProject.id, {
                rate: rating,
                comment: reviewText
            });
            
            setSubmitting(false);
            setSubmitted(true);
            
            // تحديث قائمة التقييمات بعد الإرسال الناجح
            const ratingsRes = await fetchClientMyRatings();
            const ratingsData = ratingsRes.data?.data || ratingsRes.data || [];
            if (Array.isArray(ratingsData)) {
                 setGivenReviews(ratingsData);
            }
        } catch (err) {
            console.error("Error submitting review", err);
            setError(err.response?.data?.message || 'حدث خطأ أثناء إرسال التقييم.');
            setSubmitting(false);
        }
    };

    // إعادة تعيين النموذج بعد الإرسال
    const resetForm = () => {
        setView('list');
        setSelectedProjectId('');
        setRating(0);
        setReviewText('');
        setSubmitted(false);
        setError(null);
    };

    // دالة لطباعة النجوم برمجياً بناءً على التقييم
    const renderStars = (value) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < value ? "text-warning" : "text-muted opacity-25"} size={22} />
        ));
    };

    // واجهة إضافة تقييم جديد
    if (view === 'new') {
        return (
            <div className="mx-auto" style={{ maxWidth: '100%' }}>
                <button 
                    className="btn btn-light fw-bold mb-4 d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
                    onClick={resetForm}
                >
                    <FaArrowRight /> العودة لسجل التقييمات
                </button>

                {submitted ? (
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white text-center mx-auto" style={{ maxWidth: '800px' }}>
                        <div className="text-success bg-success bg-opacity-10 p-4 rounded-circle d-inline-flex mb-4">
                            <FaCheckCircle size={50} />
                        </div>
                        <h2 className="fw-bold mb-3" style={{ color: '#10b981' }}>شكراً لك! ✅</h2>
                        <p className="text-muted fw-semibold fs-5 mb-4" style={{ lineHeight: '1.8' }}>
                            تم إرسال تقييمك لمزود الخدمة <strong style={{ color: '#1b2a47' }}>{selectedProject?.performer?.user?.name || 'المزود'}</strong> على مشروع
                            <strong style={{ color: '#1b2a47' }}> {selectedProject?.title}</strong> بنجاح.
                        </p>
                        <div className="d-flex justify-content-center gap-1 mb-4">
                            {[...Array(rating)].map((_, i) => (
                                <FaStar key={i} className="text-warning" size={34} />
                            ))}
                        </div>
                        <button
                            className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white"
                            style={{ backgroundColor: '#1b2a47', fontSize: '18px' }}
                            onClick={resetForm}
                        >
                            <FaArrowRight className="ms-2" /> العودة لسجل التقييمات
                        </button>
                    </div>
                ) : (
                    <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '850px' }}>
                        <div className="text-center mb-5">
                            <div className="bg-warning bg-opacity-10 text-warning p-4 rounded-circle d-inline-flex mb-3">
                                <FaStar size={40} />
                            </div>
                            <h3 className="fw-bold" style={{ color: '#1b2a47' }}>إضافة تقييم جديد</h3>
                            <p className="text-muted fw-semibold fs-5">اختر المشروع المكتمل الذي ترغب بتقييم مزود الخدمة الخاص به</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger fw-bold rounded-3 shadow-sm mb-4">
                                ⚠️ {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            {/* اختيار المشروع المنتهي */}
                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>
                                    <FaHardHat className="ms-2 text-warning" /> اختر المشروع
                                </label>
                                {availableProjects.length === 0 ? (
                                    <div className="alert alert-warning fw-bold">
                                        لا يوجد لديك مشاريع مكتملة للتقييم حالياً.
                                    </div>
                                ) : (
                                    <select
                                        className="form-select p-4 bg-light border"
                                        style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                        value={selectedProjectId}
                                        onChange={(e) => setSelectedProjectId(e.target.value)}
                                        required
                                    >
                                        <option value="">-- اختر المشروع المكتمل --</option>
                                        {availableProjects.map(p => (
                                            <option key={p.id} value={p.id}>
                                                {p.title} (المزود: {p.performer?.user?.name || 'غير متوفر'})
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>

                            {/* اختيار النجوم */}
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

                            {/* التعليق */}
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
                                ></textarea>
                            </div>

                            {/* أزرار الإجراءات */}
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <button
                                    type="submit"
                                    disabled={!selectedProject || rating === 0 || submitting}
                                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#ff8a00', fontSize: '20px', opacity: (!selectedProject || rating === 0) ? 0.6 : 1 }}
                                >
                                    {submitting ? <><FaSpinner className="fa-spin" /> جارٍ الإرسال...</> : <><FaStar /> إرسال التقييم</>}
                                </button>
                                <button
                                    type="button"
                                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '20px' }}
                                    onClick={resetForm}
                                >
                                    إلغاء
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        );
    }

    // ====== العرض الرئيسي: سجل التقييمات التي قدمها العميل فقط ======
    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل التقييمات <FaStar className="text-warning ms-2" /></h3>
                    <p className="text-muted fw-semibold mb-0">استعرض التقييمات التي قدمتها لمزودي الخدمة على مشاريعك.</p>
                </div>
                <button 
                    className="btn fw-bold px-4 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
                    style={{ backgroundColor: '#ff8a00', fontSize: '18px' }}
                    onClick={() => setView('new')}
                >
                    <FaPlus /> إضافة تقييم جديد
                </button>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin fs-1 text-warning" />
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {givenReviews.length > 0 ? givenReviews.map(review => (
                        <div key={review.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex gap-1">
                                    {renderStars(review.rate || review.rating)}
                                </div>
                                <span className="text-muted small fw-bold">
                                    {review.created_at ? new Date(review.created_at).toLocaleDateString('ar-EG') : 'تاريخ غير متوفر'}
                                </span>
                            </div>
                            
                            <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة المُقَيَّم</span>
                                        <span className="fw-bold text-dark fs-5">{review.to_user?.name || review.toUser?.name || 'مزود الخدمة'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{review.project?.title || 'غير متوفر'}</span>
                                    </div>
                                </div>
                            </div>

                            {review.comment && (
                                <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <FaQuoteRight className="position-absolute text-muted opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
                                    <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                        "{review.comment}"
                                    </p>
                                </div>
                            )}
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaCommentDots className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لم تقم بتقييم أي مزود خدمة حتى الآن.</h4>
                            <button 
                                className="btn fw-bold px-4 py-3 rounded-pill shadow-sm text-white mt-4 d-flex align-items-center gap-2 mx-auto"
                                style={{ backgroundColor: '#ff8a00', fontSize: '18px' }}
                                onClick={() => setView('new')}
                            >
                                <FaPlus /> إضافة تقييم جديد
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ReviewsTab;