import { 
    FaMapMarkerAlt, FaVectorSquare, FaChevronRight, 
    FaFilePdf, FaPaperPlane, FaHardHat, FaClock,
    FaFileAlt, FaImage, FaUserTie
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

            <div className="card-provider p-4 p-md-5 bg-white mb-5 border-top border-4" style={{ borderColor: tender.status === 'دعوة حصرية' ? '#ff8a00' : '#1b2a47' }}>
                
                {/* رأس الواجهة */}
                <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start mb-5 gap-3">
                    <div>
                        <h3 className="fw-bold mb-2" style={{ color: '#1b2a47', fontSize: '28px' }}>{tender.title}</h3>
                        {tender.client && (
                            <span className="text-muted fw-bold fs-5 d-flex align-items-center gap-2 mt-2">
                                <FaUserTie className="text-warning" /> صاحب الطلب: {tender.client}
                            </span>
                        )}
                    </div>
                    <span className="badge px-4 py-2 fs-6 shadow-sm rounded-pill border"
                        style={{ 
                            backgroundColor: tender.status === 'دعوة حصرية' ? '#fff4e5' : '#e9f2ff', 
                            color: tender.status === 'دعوة حصرية' ? '#ff8a00' : '#1b2a47',
                            borderColor: tender.status === 'دعوة حصرية' ? '#ff8a00' : '#1b2a47'
                        }}>
                        {tender.status || 'متاح للتقديم'}
                    </span>
                </div>
                
                {/* 1. وصف المشروع */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                        <FaFileAlt className="text-warning" /> وصف المشروع بدقة
                    </h5>
                    <div className="p-4 bg-light rounded-4 text-dark fw-semibold" style={{ border: '1px solid #e9ecef', fontSize: '18px', lineHeight: '1.8' }}>
                        {tender.description || 'لا يوجد وصف متاح لهذه المناقصة.'}
                    </div>
                </div>

                {/* 2. البيانات الأساسية (مطابقة لمدخلات العميل) */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '20px' }}>البيانات الأساسية للمشروع</h5>
                    <div className="row g-4">
                        {/* المحافظة */}
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaMapMarkerAlt className="fs-3 text-primary" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">المحافظة</small>
                                    <strong className="text-dark fs-5">{tender.location || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>
                        
                        {/* المساحة */}
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaVectorSquare className="fs-3 text-success" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">المساحة</small>
                                    <strong className="text-dark fs-5">{tender.area ? `${tender.area} م²` : 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>

                        {/* مزود الخدمة المطلوب */}
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaHardHat className="fs-3 text-warning" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">مزود الخدمة المطلوبة</small>
                                    <strong className="text-dark fs-5">{tender.providerType || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>

                        {/* مدة المناقصة / الموعد النهائي */}
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaClock className="fs-3 text-danger" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">الوقت المتبقي لتقديم عرض</small>
                                    <strong className="text-dark fs-5">{tender.deadline || 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. المرفقات */}
                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '20px' }}>المرفقات والصور</h5>
                    {tender.attachments && tender.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-3">
                            {tender.attachments.map((file, index) => (
                                <div key={index} className="border rounded-4 p-3 d-flex flex-column align-items-center justify-content-center text-center shadow-sm bg-light hover-effect" style={{ width: '160px', cursor: 'pointer' }}>
                                    {file.type === 'image' ? (
                                        <>
                                            <FaImage className="text-primary mb-2" style={{ fontSize: '40px' }} />
                                            <span className="text-truncate w-100 fw-bold text-dark">{file.name}</span>
                                        </>
                                    ) : (
                                        <>
                                            <FaFilePdf className="text-danger mb-2" style={{ fontSize: '40px' }} />
                                            <span className="text-truncate w-100 fw-bold text-dark">{file.name}</span>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-light rounded-4 text-center border" style={{ borderStyle: 'dashed' }}>
                            <p className="text-muted fw-bold m-0 fs-5">لم يقم العميل بإضافة أي مرفقات أو صور لهذا المشروع.</p>
                        </div>
                    )}
                </div>

                <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                {/* 4. زر تقديم العرض */}
                <div className="text-center bg-light p-5 rounded-4 border">
                    <div className="bg-white rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <FaPaperPlane className="fs-1" style={{ color: '#ff8a00' }} />
                    </div>
                    <h3 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>هل أنت مستعد للتنفيذ؟</h3>
                    <p className="text-secondary mb-4 fw-bold mx-auto" style={{ maxWidth: '600px', fontSize: '18px' }}>
                        قم بمراجعة تفاصيل المشروع الموضحة بدقة، وتأكد من قدرتك على تلبية متطلبات العميل قبل تقديم عرضك النهائي.
                    </p>
                    
                    <button 
                        onClick={onStartOffer} 
                        className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-3 py-3 px-5 shadow-lg"
                        style={{ fontSize: '22px', minWidth: '350px' }}
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