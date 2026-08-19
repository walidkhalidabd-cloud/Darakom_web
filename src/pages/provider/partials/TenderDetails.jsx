import { useState, useEffect } from 'react';
import { 
    FaMapMarkerAlt, FaVectorSquare, FaChevronRight, 
    FaFilePdf, FaPaperPlane, FaHardHat, FaClock,
    FaFileAlt, FaImage, FaUserTie, FaSpinner
} from 'react-icons/fa';
import { fetchTenderDetails } from '../../../services/api/providerApi';
import './provider-tabs.css';

const TenderDetails = ({ tenderId, tenderType, invitationId, onBack, onStartOffer }) => {
    const [tender, setTender] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTender = async () => {
            setLoading(true);
            try {
                // جلب التفاصيل باستخدام المعرف الحقيقي للمشروع
                const res = await fetchTenderDetails(tenderId);
                const data = res.data?.data;
                
                // الباك إند يعيد بيانات مختلفة قليلاً بناءً على ما إذا كانت مناقصة عامة أو دعوة خاصة
                const projectData = tenderType === 'private' ? data.project : data;
                
                const clientObj = projectData.client;
                const clientName = clientObj?.first_name ? `${clientObj.first_name} ${clientObj.last_name || ''}`.trim() : (clientObj?.name || 'غير معروف');

                setTender({
                    id: projectData.id,
                    title: projectData.title || 'مشروع بدون عنوان',
                    description: projectData.description || 'لا يوجد وصف متاح لهذه المناقصة.',
                    location: projectData.location_details || projectData.province?.name || 'غير محدد',
                    area: projectData.area || 'غير محدد',
                    client: clientName,
                    providerType: projectData.craftsman_type || 'مكاتب هندسية وشركات',
                    deadline: projectData.tender_duration ? `${projectData.tender_duration} ${projectData.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : 'غير محدد',
                    status: tenderType === 'private' ? 'دعوة حصرية' : 'متاح للتقديم',
                    attachments: projectData.documents?.map(doc => ({
                        name: doc.description || 'مرفق',
                        url: `http://127.0.0.1:8000/storage/${doc.path}`,
                        type: doc.path.endsWith('.pdf') ? 'pdf' : 'image'
                    })) || []
                });

            } catch (error) {
                console.error("خطأ في جلب تفاصيل المناقصة:", error);
                alert("❌ حدث خطأ أثناء تحميل تفاصيل المناقصة.");
                onBack(); // العودة تلقائياً عند الفشل
            } finally {
                setLoading(false);
            }
        };

        if (tenderId) {
            loadTender();
        }
    }, [tenderId, tenderType, onBack]);

    if (loading) {
        return (
            <div className="mx-auto text-center py-5" style={{ maxWidth: '1000px' }}>
                <FaSpinner className="fa-spin text-warning mb-3" size={50} />
                <h4 className="fw-bold text-muted">جاري تحميل تفاصيل المناقصة...</h4>
            </div>
        );
    }

    if (!tender) return null;

    return (
        <div className="mx-auto" style={{ maxWidth: '1000px' }}>
            <button 
                onClick={onBack} 
                className="btn btn-link text-decoration-none mb-4 p-0 d-inline-flex align-items-center gap-2 fw-bold"
                style={{ color: '#1b2a47', fontSize: '20px' }}
            >
                <FaChevronRight /> العودة لسوق المناقصات
            </button>

            <div className="card-provider p-4 p-md-5 bg-white mb-5 border-top border-4" style={{ borderColor: tender.status === 'دعوة حصرية' ? '#ff8a00' : '#1b2a47' }}>
                
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
                        {tender.status}
                    </span>
                </div>
                
                <div className="mb-5">
                    <h5 className="fw-bold mb-3 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '20px' }}>
                        <FaFileAlt className="text-warning" /> وصف المشروع بدقة
                    </h5>
                    <div className="p-4 bg-light rounded-4 text-dark fw-semibold" style={{ border: '1px solid #e9ecef', fontSize: '18px', lineHeight: '1.8' }}>
                        {tender.description}
                    </div>
                </div>

                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '20px' }}>البيانات الأساسية للمشروع</h5>
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaMapMarkerAlt className="fs-3 text-primary" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">المحافظة</small>
                                    <strong className="text-dark fs-5">{tender.location}</strong>
                                </div>
                            </div>
                        </div>
                        
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaVectorSquare className="fs-3 text-success" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">المساحة</small>
                                    <strong className="text-dark fs-5">{tender.area !== 'غير محدد' ? `${tender.area} م²` : 'غير محدد'}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaHardHat className="fs-3 text-warning" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">مزود الخدمة المطلوبة</small>
                                    <strong className="text-dark fs-5">{tender.providerType}</strong>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3 p-3 border rounded-4 bg-white shadow-sm transition-hover h-100">
                                <div className="bg-light p-3 rounded-circle d-flex align-items-center justify-content-center">
                                    <FaClock className="fs-3 text-danger" />
                                </div>
                                <div>
                                    <small className="text-muted d-block fw-bold mb-1 fs-6">مدة المناقصة</small>
                                    <strong className="text-dark fs-5">{tender.deadline}</strong>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-5">
                    <h5 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '20px' }}>المرفقات والصور</h5>
                    {tender.attachments && tender.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-3">
                            {tender.attachments.map((file, index) => (
                                <a 
                                    key={index} 
                                    href={file.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="border rounded-4 p-3 d-flex flex-column align-items-center justify-content-center text-center shadow-sm bg-light hover-effect text-decoration-none" 
                                    style={{ width: '160px', cursor: 'pointer' }}
                                >
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
                                </a>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-light rounded-4 text-center border" style={{ borderStyle: 'dashed' }}>
                            <p className="text-muted fw-bold m-0 fs-5">لم يقم العميل بإضافة أي مرفقات أو صور لهذا المشروع.</p>
                        </div>
                    )}
                </div>

                <hr className="text-muted my-5" style={{ opacity: '0.1' }} />

                <div className="text-center bg-light p-5 rounded-4 border">
                    <div className="bg-white rounded-circle shadow-sm d-inline-flex justify-content-center align-items-center mx-auto mb-4" style={{ width: '80px', height: '80px' }}>
                        <FaPaperPlane className="fs-1" style={{ color: '#ff8a00' }} />
                    </div>
                    <h3 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>هل أنت مستعد للتنفيذ؟</h3>
                    <p className="text-secondary mb-4 fw-bold mx-auto" style={{ maxWidth: '600px', fontSize: '18px' }}>
                        قم بمراجعة تفاصيل المشروع الموضحة بدقة، وتأكد من قدرتك على تلبية متطلبات العميل قبل تقديم عرضك النهائي.
                    </p>
                    
                    <button 
                        onClick={() => onStartOffer(tender)} 
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