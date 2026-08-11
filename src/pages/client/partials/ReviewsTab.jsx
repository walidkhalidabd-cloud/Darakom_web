import { useState } from 'react';
import { FaStar, FaUserTie, FaHardHat, FaQuoteRight, FaCommentDots, FaPlus, FaArrowRight, FaCheckCircle, FaSpinner } from 'react-icons/fa';

const ReviewsTab = () => {
    // view: 'list' | 'new'
    const [view, setView] = useState('list');

    // بيانات وهمية: مزودو الخدمة الذين تعامل معهم العميل (مع المشاريع المرتبطة)
    const providers = [
        {
            id: 1,
            name: 'مؤسسة البناء الذهبي',
            type: 'مقاول بناء',
            projects: [
                { id: 101, title: 'بناء عظم - مساحة 400م' },
                { id: 102, title: 'تأسيس شبكة كاميرات مراقبة' }
            ]
        },
        {
            id: 2,
            name: 'مكتب الإبداع الهندسي',
            type: 'مكتب هندسي',
            projects: [
                { id: 201, title: 'تصميم داخلي لفيلا' },
                { id: 202, title: 'تصميم داخلي لمكتب' }
            ]
        },
        {
            id: 3,
            name: 'م. أحمد خالد',
            type: 'مهندس اتصالات',
            projects: [
                { id: 301, title: 'تأسيس شبكة كاميرات مراقبة' }
            ]
        }
    ];

    // بيانات وهمية: تقييمات قدمها العميل لمزودي الخدمة
    const [givenReviews, setGivenReviews] = useState([
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
    ]);

    // حالة نموذج التقييم الجديد
    const [selectedProviderId, setSelectedProviderId] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // المزود المختار
    const selectedProvider = providers.find(p => p.id === Number(selectedProviderId));
    const selectedProject = selectedProvider?.projects.find(p => p.id === Number(selectedProjectId));

    // عند اختيار مزود الخدمة: استعادة المشاريع المرتبطة به
    const handleProviderChange = (e) => {
        const pid = e.target.value;
        setSelectedProviderId(pid);
        setSelectedProjectId(''); // إعادة تعيين المشروع حتى يختار/يضاف تلقائياً
    };

    // اختيار المزود تلقائياً يضيف المشروع إذا كان لديه مشروع واحد فقط
    const handleProjectAutoSelect = (pid) => {
        const provider = providers.find(p => p.id === Number(pid));
        if (provider && provider.projects.length === 1) {
            setSelectedProjectId(provider.projects[0].id);
        }
    };

    // إرسال التقييم الجديد
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedProvider || !selectedProject || rating === 0) return;
        setSubmitting(true);
        setTimeout(() => {
            const newReview = {
                id: Date.now(),
                providerName: selectedProvider.name,
                projectTitle: selectedProject.title,
                rating,
                reviewText,
                date: new Date().toLocaleDateString('sv-SE')
            };
            setGivenReviews([newReview, ...givenReviews]);
            setSubmitting(false);
            setSubmitted(true);
        }, 600);
    };

    // إعادة تعيين النموذج بعد الإرسال
    const resetForm = () => {
        setView('list');
        setSelectedProviderId('');
        setSelectedProjectId('');
        setRating(0);
        setReviewText('');
        setSubmitted(false);
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
                            تم إرسال تقييمك لمزود الخدمة <strong style={{ color: '#1b2a47' }}>{selectedProvider?.name}</strong> على مشروع
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
                            <p className="text-muted fw-semibold fs-5">اختر مزود الخدمة وسيتم إضافة المشروع المرتبط به تلقائياً</p>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {/* اختيار مزود الخدمة */}
                            <div className="mb-4">
                                <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>
                                    <FaUserTie className="ms-2 text-warning" /> اختر مزود الخدمة
                                </label>
                                <select
                                    className="form-select p-4 bg-light border"
                                    style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px' }}
                                    value={selectedProviderId}
                                    onChange={(e) => { handleProviderChange(e); handleProjectAutoSelect(e.target.value); }}
                                    required
                                >
                                    <option value="">-- اختر مزود الخدمة --</option>
                                    {providers.map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.type})</option>
                                    ))}
                                </select>
                            </div>

                            {/* المشروع المرتبط - يظهر بعد اختيار المزود */}
                            {selectedProvider && (
                                <div className="mb-4">
                                    <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>
                                        <FaHardHat className="ms-2 text-warning" /> المشروع المرتبط
                                    </label>
                                    {selectedProvider.projects.length === 1 ? (
                                        <div className="p-4 bg-light border rounded-4 d-flex align-items-center gap-3">
                                            <FaCheckCircle className="text-success" size={24} />
                                            <div>
                                                <span className="text-muted small fw-bold d-block">تمت إضافة المشروع تلقائياً</span>
                                                <span className="fw-bold text-dark fs-5">{selectedProvider.projects[0].title}</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <>
                                            <p className="text-muted fw-semibold mb-3">لدى هذا المزود أكثر من مشروع لديك، اختر المشروع الذي تريد تقييمه:</p>
                                            <div className="d-flex flex-column gap-2">
                                                {selectedProvider.projects.map(project => (
                                                    <label key={project.id}
                                                        className={`p-4 rounded-4 border d-flex align-items-center gap-3 shadow-sm ${Number(selectedProjectId) === project.id ? 'border-warning bg-warning bg-opacity-10' : 'bg-white'}`}
                                                        style={{ cursor: 'pointer' }}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name="projectSelect"
                                                            className="form-check-input"
                                                            checked={Number(selectedProjectId) === project.id}
                                                            onChange={() => setSelectedProjectId(project.id)}
                                                        />
                                                        <div>
                                                            <span className="text-muted small fw-bold d-block">المشروع</span>
                                                            <span className="fw-bold text-dark fs-5">{project.title}</span>
                                                        </div>
                                                    </label>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}

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
                                    required
                                ></textarea>
                            </div>

                            {/* أزرار الإجراءات */}
                            <div className="d-flex justify-content-center gap-3 flex-wrap">
                                <button
                                    type="submit"
                                    disabled={!selectedProvider || !selectedProject || rating === 0 || submitting}
                                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#ff8a00', fontSize: '20px', opacity: (!selectedProvider || !selectedProject || rating === 0) ? 0.6 : 1 }}
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

            {/* عرض بطاقات التقييمات المقدمة */}
            <div className="d-flex flex-column gap-4">
                {givenReviews.length > 0 ? givenReviews.map(review => (
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
                                    <span className="text-muted small fw-bold d-block">مزود الخدمة المُقَيَّم</span>
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
        </div>
    );
};

export default ReviewsTab;
