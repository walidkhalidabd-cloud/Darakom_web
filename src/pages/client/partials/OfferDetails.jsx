import { useState } from 'react';
import { FaChevronRight, FaUserTie, FaHardHat, FaMoneyBillWave, FaRegClock, FaCalendarAlt, FaProjectDiagram, FaFileAlt, FaImage, FaFilePdf, FaStar, FaGlobe, FaLock, FaHourglassHalf, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';

const OfferDetails = ({ offer, offerType, onBack }) => {
    const [currentStatus, setCurrentStatus] = useState(offer?.status || 'pending');

    // دالة لعرض التقييم بالنجوم
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-warning" size={18} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-warning" size={18} style={{ opacity: 0.5 }} />);
            } else {
                stars.push(<FaStar key={i} className="text-muted" size={18} style={{ opacity: 0.3 }} />);
            }
        }
        return stars;
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            {/* زر العودة */}
            <button 
                onClick={onBack} 
                className="btn btn-link text-decoration-none mb-4 p-0 d-inline-flex align-items-center gap-2 fw-bold"
                style={{ color: '#1b2a47', fontSize: '20px' }}
            >
                <FaChevronRight /> العودة للعروض
            </button>

            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5">
                
                {/* رأس الواجهة */}
                <div className="text-center mb-5">
                    <div className="bg-light rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mb-3" style={{ width: '80px', height: '80px' }}>
                        {offerType === 'public' ? (
                            <FaGlobe className="fs-2 text-primary" />
                        ) : (
                            <FaLock className="fs-2 text-warning" />
                        )}
                    </div>
                    <h3 className="fw-bold" style={{ color: '#1b2a47', fontSize: '28px' }}>
                        تفاصيل العرض
                    </h3>
                    <p className="text-muted fw-bold fs-5 mb-1">
                        {offerType === 'public' ? `عرض عام #${offer.id + 100}` : `عرض خاص #${offer.id + 200}`}
                    </p>
                    <span className="badge bg-secondary bg-opacity-10 text-dark px-4 py-2 rounded-pill fw-bold fs-6">
                        <FaHourglassHalf className="ms-1" /> 
                        {offer.status === 'pending' ? 'قيد الانتظار' : offer.status === 'accepted' ? 'مقبول' : 'مرفوض'}
                    </span>
                    <hr className="text-muted my-4" style={{ opacity: '0.15' }} />
                </div>

                {/* 1. معلومات مزود الخدمة */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                        <FaUserTie className="text-warning" /> معلومات مزود الخدمة
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-4 border rounded-4 bg-light shadow-sm h-100">
                                <div className="bg-white p-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                                    <FaUserTie className="fs-4" style={{ color: '#1b2a47' }} />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">اسم مزود الخدمة</small>
                                    <strong className="text-dark fs-4">{offer.providerName}</strong>
                                    <small className="d-block text-muted fw-semibold mt-1">{offer.providerType}</small>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-4 border rounded-4 bg-light shadow-sm h-100">
                                <div className="bg-white p-3 rounded-circle d-flex align-items-center justify-content-center shadow-sm">
                                    <FaStar className="fs-4 text-warning" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">التقييم</small>
                                    <div className="d-flex align-items-center gap-2">
                                        <strong className="text-dark fs-4">{offer.rating}</strong>
                                        <span className="d-flex align-items-center gap-1">{renderStars(offer.rating)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 2. عنوان المشروع */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                        <FaHardHat className="text-success" /> عنوان المشروع
                    </h5>
                    <div className="p-4 bg-light rounded-4 border" style={{ borderColor: '#e9ecef' }}>
                        <span className="fw-bold fs-4 text-dark">{offer.projectTitle}</span>
                    </div>
                </div>

                {/* 3. وصف العرض */}
                {offer.details && (
                    <div className="mb-5">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                            <FaFileAlt className="text-info" /> وصف العرض
                        </h5>
                        <div className="p-4 bg-light rounded-4 border" style={{ borderColor: '#e9ecef' }}>
                            <p className="text-dark fw-semibold fs-5 mb-0" style={{ lineHeight: '1.8' }}>
                                {offer.details}
                            </p>
                        </div>
                    </div>
                )}

                {/* 4. تفاصيل العرض (المدة، السعر، تاريخ البدء) */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                        <FaMoneyBillWave className="text-success" /> تفاصيل العرض
                    </h5>
                    <div className="row g-4">
                        <div className="col-md-4">
                            <div className="d-flex align-items-center gap-3 p-4 border rounded-4 bg-white shadow-sm h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaMoneyBillWave className="fs-3 text-success" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">قيمة العرض</small>
                                    <strong className="fs-4" style={{ color: '#ff8a00' }}>{offer.price} ر.س</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center gap-3 p-4 border rounded-4 bg-white shadow-sm h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaRegClock className="fs-3 text-info" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">مدة التنفيذ</small>
                                    <strong className="fs-4 text-dark">{offer.duration}</strong>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="d-flex align-items-center gap-3 p-4 border rounded-4 bg-white shadow-sm h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaCalendarAlt className="fs-3 text-danger" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">تاريخ بدء العمل</small>
                                    <strong className="fs-4 text-dark">{offer.startDate || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 5. مراحل المشروع */}
                {offer.stages && offer.stages.length > 0 && (
                    <div className="mb-5">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                            <FaProjectDiagram className="text-warning" /> مراحل المشروع
                        </h5>
                        <div className="d-flex flex-column gap-3">
                            {offer.stages.map((stage, index) => (
                                <div key={stage.id} className="d-flex align-items-center gap-3 p-4 rounded-4 border shadow-sm bg-white">
                                    <span 
                                        className="badge rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                                        style={{ backgroundColor: '#ff8a00', width: '44px', height: '44px', fontSize: '18px' }}
                                    >
                                        {index + 1}
                                    </span>
                                    <div className="flex-grow-1">
                                        <strong className="d-block fs-5 text-dark mb-1">{stage.name}</strong>
                                        <span className="text-muted fw-semibold">
                                            <FaRegClock className="ms-1 text-info" />
                                            {stage.duration}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* 6. المرفقات (الملفات والصور) */}
                {offer.attachments && offer.attachments.length > 0 && (
                    <div className="mb-5">
                        <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                            <FaFileAlt className="text-danger" /> الملفات والصور
                        </h5>
                        <div className="row g-3">
                            {offer.attachments.map(att => (
                                <div key={att.id} className="col-md-4 col-6">
                                    <div className="border rounded-4 p-4 d-flex flex-column align-items-center justify-content-center text-center shadow-sm bg-light h-100" style={{ cursor: 'pointer', transition: 'all 0.3s ease', minHeight: '140px' }}
                                        onMouseOver={(e) => { e.currentTarget.style.borderColor = '#ff8a00'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                                        onMouseOut={(e) => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
                                    >
                                        {att.type === 'image' ? (
                                            <>
                                                <FaImage className="text-primary mb-2" style={{ fontSize: '48px' }} />
                                                <span className="fw-bold text-dark small text-truncate w-100">{att.title}</span>
                                                <span className="text-muted small fw-semibold mt-1">صورة</span>
                                            </>
                                        ) : (
                                            <>
                                                <FaFilePdf className="text-danger mb-2" style={{ fontSize: '48px' }} />
                                                <span className="fw-bold text-dark small text-truncate w-100">{att.title}</span>
                                                <span className="text-muted small fw-semibold mt-1">ملف PDF</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                {/* 7. تاريخ العرض */}
                <div className="text-center mb-5">
                    <div className="bg-light p-4 rounded-4 border d-inline-block">
                        <span className="fw-bold text-muted fs-5">
                            <FaCalendarAlt className="ms-2 text-danger" />
                            تاريخ تقديم العرض: {offer.offerDate}
                        </span>
                    </div>
                </div>

                {/* 8. أزرار الإجراءات (قبول / قيد الدراسة / رفض) */}
                <div className="text-center">
                    <div className="bg-light p-5 rounded-4 border shadow-sm">
                        <h5 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '20px' }}>
                            إجراءات العرض
                        </h5>
                        <div className="d-flex justify-content-center gap-3 flex-wrap">
                            {/* زر قبول العرض */}
                            <button
                                onClick={() => setCurrentStatus('accepted')}
                                className={`btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 ${
                                    currentStatus === 'accepted' ? 'btn-success' : 'btn-outline-success'
                                }`}
                                style={{ fontSize: '18px', minWidth: '180px', justifyContent: 'center' }}
                                disabled={currentStatus === 'accepted'}
                            >
                                <FaCheckCircle /> 
                                {currentStatus === 'accepted' ? 'تم القبول ✓' : 'قبول العرض'}
                            </button>

                            {/* زر قيد الدراسة */}
                            <button
                                onClick={() => setCurrentStatus('studying')}
                                className={`btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 ${
                                    currentStatus === 'studying' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'
                                }`}
                                style={{ fontSize: '18px', minWidth: '180px', justifyContent: 'center' }}
                                disabled={currentStatus === 'studying'}
                            >
                                <FaSpinner className={currentStatus === 'studying' ? 'fa-spin' : ''} /> 
                                {currentStatus === 'studying' ? 'قيد الدراسة ✓' : 'قيد الدراسة'}
                            </button>

                            {/* زر رفض العرض */}
                            <button
                                onClick={() => setCurrentStatus('rejected')}
                                className={`btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2 ${
                                    currentStatus === 'rejected' ? 'btn-danger' : 'btn-outline-danger'
                                }`}
                                style={{ fontSize: '18px', minWidth: '180px', justifyContent: 'center' }}
                                disabled={currentStatus === 'rejected'}
                            >
                                <FaTimesCircle /> 
                                {currentStatus === 'rejected' ? 'تم الرفض ✓' : 'رفض العرض'}
                            </button>
                        </div>

                        {/* رسالة تأكيد عند اختيار حالة */}
                        {currentStatus !== 'pending' && currentStatus !== offer.status && (
                            <div className={`mt-4 p-3 rounded-3 fw-bold fs-5 ${
                                currentStatus === 'accepted' ? 'bg-success bg-opacity-10 text-success' :
                                currentStatus === 'studying' ? 'bg-warning bg-opacity-10 text-warning' :
                                'bg-danger bg-opacity-10 text-danger'
                            }`}>
                                {currentStatus === 'accepted' && '✅ تم قبول هذا العرض، سيتم إعلام مزود الخدمة بقرارك.'}
                                {currentStatus === 'studying' && '⏳ تم وضع هذا العرض قيد الدراسة، سيتم إعلامك لاحقاً.'}
                                {currentStatus === 'rejected' && '❌ تم رفض هذا العرض، يمكنك مراجعة العروض الأخرى.'}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfferDetails;

