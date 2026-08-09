import { useState } from 'react';
import { FaStar, FaUserTie, FaHardHat, FaQuoteRight, FaHandHoldingHeart, FaCommentDots } from 'react-icons/fa';

const ReviewsTab = () => {
    // التبديل بين التقييمات التي قدمها العميل والتي حصل عليها
    const [reviewType, setReviewType] = useState('given'); // 'given' or 'received'

    // بيانات وهمية: تقييمات قدمها العميل لمزودي الخدمة
    const givenReviews = [
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

    // دالة لطباعة النجوم برمجياً بناءً على التقييم
    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <FaStar key={index} className={index < rating ? "text-warning" : "text-muted opacity-25"} size={22} />
        ));
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل التقييمات <FaStar className="text-warning ms-2" /></h3>
                    <p className="text-muted fw-semibold">استعرض التقييمات التي قدمتها لمزودي الخدمة، والتقييمات التي حصلت عليها كعميل.</p>
                </div>
            </div>

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