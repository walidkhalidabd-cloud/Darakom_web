import { useState } from 'react';
import { FaStar, FaUserTie, FaHardHat, FaQuoteRight, FaHandHoldingHeart, FaCommentDots, FaSpinner, FaCheckCircle, FaTimes } from 'react-icons/fa';
import StarRatingInput from '../../../components/StarRatingInput';
import { rateProject } from '../../../services/api/clientApi';
import './client-tabs.css';

const ReviewsTab = () => {
    const [reviewType, setReviewType] = useState('given');
    const [toast, setToast] = useState(null);
    
    // نموذج التقييم
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        providerId: '',
        projectId: '',
        rating: 0,
        reviewText: ''
    });
    const [submitting, setSubmitting] = useState(false);

    // بيانات وهمية: تقييمات قدمها العميل لمزودي الخدمة
    const mockGivenData = [
        {
            id: 1,
            providerName: 'مؤسسة البناء الذهبي',
            projectTitle: 'بناء عظم - مساحة 400م',
            rating: 5,
            reviewText: 'عمل ممتاز جداً واحترافية عالية في التنفيذ. تم تسليم المشروع قبل الموعد المحدد بأسبوعين، والمهندس المشرف كان متعاوناً جداً في تعديل بعض التفاصيل.',
            date: '2026/05/15'
        },
        {
            id: 2,
            providerName: 'مكتب الإبداع الهندسي',
            projectTitle: 'تصميم داخلي لفيلا',
            rating: 4,
            reviewText: 'التصاميم جميلة جداً ومبتكرة وتلبي الطموحات، ولكن كان هناك تأخير بسيط في تسليم المخططات النهائية لمدة يومين. بشكل عام تجربة جيدة جداً.',
            date: '2026/02/20'
        }
    ];
    const [givenReviews, setGivenReviews] = useState(mockGivenData);

    // بيانات وهمية: تقييمات حصل عليها العميل من مزودي الخدمة
    const receivedReviews = [
        {
            id: 3,
            providerName: 'مؤسسة البناء الذهبي',
            projectTitle: 'بناء عظم - مساحة 400م',
            rating: 5,
            reviewText: 'عميل راقي جداً وواضح في طلباته. الدفعات المالية كانت تسلم في وقتها تماماً دون أي تأخير، نتشرف بالعمل معه دائماً.',
            date: '2026/05/16'
        },
        {
            id: 4,
            providerName: 'م. أحمد خالد',
            projectTitle: 'تأسيس شبكة كاميرات مراقبة',
            rating: 5,
            reviewText: 'تعامل احترافي، وفر لنا كل التسهيلات لدخول الموقع وإنجاز العمل في وقت قياسي.',
            date: '2025/11/22'
        }
    ];

    // بيانات وهمية لمزودي الخدمة (لقائمة الاختيار)
    const providersList = [
        { id: 'PR-001', name: 'مؤسسة البناء الذهبي' },
        { id: 'PR-002', name: 'مكتب الإبداع الهندسي' },
        { id: 'PR-003', name: 'م. خالد عبدالله' },
        { id: 'PR-004', name: 'شركة أطياف للتشطيبات' },
    ];

    // بيانات وهمية للمشاريع (لقائمة الاختيار)
    const projectsList = [
        { id: 'PJ-001', title: 'بناء عظم - مساحة 400م', providerId: 'PR-001' },
        { id: 'PJ-002', title: 'تصميم داخلي لفيلا', providerId: 'PR-002' },
        { id: 'PJ-003', title: 'تشطيب شقة 150م', providerId: 'PR-003' },
        { id: 'PJ-004', title: 'تمديدات كهرباء لفيلا', providerId: 'PR-004' },
    ];

    // تصفية المشاريع حسب مزود الخدمة المختار
    const filteredProjects = formData.providerId
        ? projectsList.filter(p => p.providerId === formData.providerId)
        : projectsList;

    // إظهار التوست
    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3500);
    };

    // إرسال التقييم
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        if (!formData.providerId) {
            showToast('error', '⚠️ الرجاء اختيار مزود الخدمة');
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

        try {
            // إرسال التقييم عبر الباك: POST /client/projects/{project}/rate
            // الحقول المطلوبة: to_user_id (معرّف مزود الخدمة)، rate (1-5)، comment
            await rateProject(formData.projectId, {
                to_user_id: formData.providerId,
                rate: formData.rating,
                comment: formData.reviewText
            });
        } catch (err) {
            // في حال فشل API، نستخدم البيانات الوهمية
            console.warn('⚠️ API غير متاح، استخدام بيانات وهمية:', err.message);
        }

        // إضافة التقييم إلى القائمة الوهمية
        const selectedProvider = providersList.find(p => p.id === formData.providerId);
        const selectedProject = projectsList.find(p => p.id === formData.projectId);
        
        const newReview = {
            id: Date.now(),
            providerName: selectedProvider?.name || 'مزود خدمة',
            projectTitle: selectedProject?.title || 'مشروع',
            rating: formData.rating,
            reviewText: formData.reviewText,
            date: new Date().toLocaleDateString('en-CA')
        };

        setGivenReviews(prev => [newReview, ...prev]);
        
        // إعادة تعيين النموذج
        setFormData({ providerId: '', projectId: '', rating: 0, reviewText: '' });
        setShowForm(false);
        setSubmitting(false);
        showToast('success', '✅ تم إرسال التقييم بنجاح!');
    };

    // دالة لطباعة النجوم برمجياً بناءً على التقييم
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < rating ? "text-warning" : "text-muted opacity-25"} size={22} />
        ));
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* Toast Notification */}
            {toast && (
                <div className={`toast-custom toast-${toast.type}`} style={{ direction: 'rtl' }}>
                    {toast.message}
                </div>
            )}

            {/* عنوان الصفحة */}
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل التقييمات <FaStar className="text-warning ms-2" /></h3>
                    <p className="text-muted fw-semibold">قيّم مزودي الخدمة واستعرض تقييماتك</p>
                </div>
                <button 
                    className="btn fw-bold px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    style={{ backgroundColor: showForm ? '#dc3545' : '#ff8a00', color: 'white', fontSize: '18px' }}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? <><FaTimes /> إلغاء</> : <><FaStar /> تقييم مزود خدمة</>}
                </button>
            </div>

            {/* ===== نموذج إضافة تقييم جديد ===== */}
            {showForm && (
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-5 bg-white border-end border-4 border-warning">
                    <h4 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>تقديم تقييم جديد</h4>
                    <p className="text-muted fw-semibold mb-4">قيّم أداء مزود الخدمة في مشروعك</p>
                    
                    <form onSubmit={handleSubmitReview}>
                        <div className="row g-4">
                            {/* اختيار مزود الخدمة */}
                            <div className="col-md-6">
                                <label className="form-label fw-bold">مزود الخدمة *</label>
                                <select 
                                    className="form-control form-control-custom"
                                    value={formData.providerId}
                                    onChange={(e) => setFormData(prev => ({ ...prev, providerId: e.target.value, projectId: '' }))}
                                    required
                                >
                                    <option value="">-- اختر مزود الخدمة --</option>
                                    {providersList.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
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
                                    placeholder="اكتب تقييمك التفصيلي هنا..."
                                    value={formData.reviewText}
                                    onChange={(e) => setFormData(prev => ({ ...prev, reviewText: e.target.value }))}
                                    required
                                ></textarea>
                            </div>

                            {/* زر الإرسال */}
                            <div className="col-12 text-center mt-3">
                                <button 
                                    type="submit" 
                                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                                    disabled={submitting}
                                >
                                    {submitting ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaCheckCircle /> إرسال التقييم</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* أزرار التبديل (Tabs) */}
            <div className="d-flex justify-content-center gap-3 mb-5">
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: reviewType === 'given' ? '#ff8a00' : '#e2e8f0', color: reviewType === 'given' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setReviewType('given')}
                >
                    <FaCommentDots /> تقييمات قدمتها
                </button>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: reviewType === 'received' ? '#ff8a00' : '#e2e8f0', color: reviewType === 'received' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setReviewType('received')}
                >
                    <FaHandHoldingHeart /> تقييمات حصلت عليها
                </button>
            </div>

            {/* عرض بطاقات التقييم */}
            <div className="d-flex flex-column gap-4">
                
                {/* 1. التقييمات المقدمة */}
                {reviewType === 'given' && (
                    givenReviews.length > 0 ? givenReviews.map(review => (
                        <div key={review.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex gap-1">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-muted small fw-bold">{review.date}</span>
                            </div>
                            
                            <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة المُقَيَّم</span>
                                        <span className="fw-bold text-dark fs-5">{review.providerName}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{review.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                <FaQuoteRight className="position-absolute text-muted opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    "{review.reviewText}"
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaCommentDots className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لم تقم بتقييم أي مزود خدمة حتى الآن.</h4>
                        </div>
                    )
                )}

                {/* 2. التقييمات المُتلقاة */}
                {reviewType === 'received' && (
                    receivedReviews.length > 0 ? receivedReviews.map(review => (
                        <div key={review.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 border-warning">
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex gap-1">
                                    {renderStars(review.rating)}
                                </div>
                                <span className="text-muted small fw-bold">{review.date}</span>
                            </div>
                            
                            <div className="row mb-4 bg-warning bg-opacity-10 p-3 rounded-4 mx-0 border border-warning border-opacity-25">
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">تقييم من قِبَل</span>
                                        <span className="fw-bold text-dark fs-5">{review.providerName}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start border-warning border-opacity-50 ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">في مشروع</span>
                                        <span className="fw-bold text-dark fs-5">{review.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="position-relative p-4 rounded-4 bg-white border shadow-sm">
                                <FaQuoteRight className="position-absolute text-warning opacity-25" size={40} style={{ top: '10px', right: '15px' }} />
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    "{review.reviewText}"
                                </p>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaHandHoldingHeart className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لم تحصل على أي تقييمات حتى الآن.</h4>
                        </div>
                    )
                )}

            </div>
        </div>
    );
};

export default ReviewsTab;
