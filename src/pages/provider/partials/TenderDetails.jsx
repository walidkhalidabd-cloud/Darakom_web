import { 
    FaMapMarkerAlt, FaVectorSquare, FaChevronRight, 
    FaFilePdf, FaPaperPlane, FaHardHat, FaClock,
    FaCheckCircle, FaFileAlt, FaImage
} from 'react-icons/fa';
import './provider-tabs.css';

const TenderDetails = ({ tender, onBack, onStartOffer }) => {
    
    if (!tender) return null;

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            {/* زر العودة */}
            <button 
                onClick={onBack} 
                className="btn btn-link text-decoration-none mb-4 p-0 d-inline-flex align-items-center gap-2 fw-bold"
                style={{ color: '#1b2a47', fontSize: '20px' }}
            >
                <FaChevronRight /> العودة لسوق المناقصات
            </button>

            <div className="card-provider p-4 p-md-5 bg-white mb-5">
                
                {/* رأس الواجهة */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
                    <h3 className="fw-bold m-0" style={{ color: '#1b2a47', fontSize: '28px' }}>{tender.title}</h3>
                    <span className="badge-pending rounded-pill px-4 py-2 fs-6 shadow-sm">
                        {tender.status || 'متاح للتقديم'}
                    </span>
                </div>
                
                {/* 1. وصف المشروع */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                        <FaFileAlt className="text-warning" /> وصف المشروع بدقة
                    </h5>
                    <div className="p-4 bg-light rounded-4 text-dark lh-lg" style={{ border: '1px solid #e9ecef', fontSize: '17px' }}>
                        {tender.description || 'لا يوجد وصف متاح لهذه المناقصة.'}
                    </div>
                </div>

                {/* 2. تفاصيل المناقصة */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '18px' }}>بيانات المناقصة</h5>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaMapMarkerAlt className="fs-4" style={{ color: '#1b2a47' }} />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">المحافظة</small>
                                    <strong className="text-dark fs-5">{tender.location || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaVectorSquare className="fs-4" style={{ color: '#1b2a47' }} />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">المساحة</small>
                                    <strong className="text-dark fs-5">{tender.area || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaHardHat className="fs-4 text-warning" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">مزود الخدمة المطلوب</small>
                                    <strong className="text-dark fs-5">{tender.requiredService || 'مقاول بناء'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaClock className="fs-4 text-danger" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1">الموعد النهائي</small>
                                    <strong className="text-dark fs-5">{tender.deadline || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. متطلبات المشروع */}
                {tender.requirements && tender.requirements.length > 0 && (
                    <div className="mb-5">
                        <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                            <FaCheckCircle className="text-success" /> متطلبات المشروع
                        </h5>
                        <ul className="list-group list-group-flush">
                            {tender.requirements.map((req, i) => (
                                <li key={i} className="list-group-item bg-light border-0 mb-2 rounded-3 fw-semibold px-3"
                                    style={{ borderRight: '3px solid #ff8a00' }}>
                                    <FaCheckCircle className="ms-2 text-success" />
                                    {req}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 4. المرفقات */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '18px' }}>المرفقات:</h5>
                    {tender.attachments && tender.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-3">
                            {tender.attachments.map(file => (
                                <div key={file.id} className="border rounded-4 p-3 d-flex flex-column align-items-center justify-content-center text-center shadow-sm bg-white hover-effect" style={{ width: '150px', cursor: 'pointer' }}>
                                    {file.type === 'image' ? (
                                        <>
                                            <FaImage className="text-primary mb-2" style={{ fontSize: '50px' }} />
                                            <small className="text-truncate w-100 fw-bold text-secondary" title={file.name}>{file.name}</small>
                                        </>
                                    ) : (
                                        <>
                                            <FaFilePdf className="text-danger mb-2" style={{ fontSize: '50px' }} />
                                            <small className="text-truncate w-100 fw-bold text-secondary" title={file.name}>{file.name}</small>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-light rounded-4 text-center border">
                            <p className="text-muted fw-bold m-0">لا توجد مرفقات لهذه المناقصة.</p>
                        </div>
                    )}
                </div>

                <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                {/* 5. زر تقديم العرض */}
                <div className="text-center bg-light p-5 rounded-4 border">
                    <div className="bg-white rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <FaPaperPlane className="fs-2" style={{ color: '#ff8a00' }} />
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>هل أنت مستعد للتنفيذ؟</h4>
                    <p className="text-secondary mb-4 fw-bold mx-auto" style={{ maxWidth: '600px', fontSize: '15px' }}>
                        قم بمراجعة تفاصيل المشروع الموضحة بدقة، وتأكد من قدرتك على تلبية متطلبات العميل قبل تقديم عرضك النهائي.
                    </p>
                    
                    <button 
                        onClick={onStartOffer} 
                        className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-3 py-3 px-5"
                        style={{ fontSize: '20px', minWidth: '300px' }}
                    >
                        تقديم عرض الآن <FaChevronRight />
                    </button>
                </div>

            </div>
            
            <style>{`
                .hover-effect { transition: transform 0.2s, box-shadow 0.2s; }
                .hover-effect:hover { border-color: #ff8a00 !important; transform: translateY(-5px); box-shadow: 0 10px 20px rgba(0,0,0,0.08) !important; }
                .transition-hover { transition: all 0.3s ease; }
                .transition-hover:hover { border-color: #1b2a47 !important; transform: translateY(-3px); }
            `}</style>
        </div>
    );
};

export default TenderDetails;

