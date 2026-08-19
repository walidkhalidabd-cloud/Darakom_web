import { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaUserTie, FaHardHat, FaMoneyBillWave, FaRegClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaGlobe, FaLock, FaStar, FaEye, FaSpinner } from 'react-icons/fa';
import OfferDetails from './OfferDetails';
import clientApi from '../../../services/api/clientApi'; // مسار الاستيراد

const OffersReceivedTab = () => {
    const [offerType, setOfferType] = useState('public'); 
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [publicOffers, setPublicOffers] = useState([]);
    const [privateOffers, setPrivateOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    // دالة مساعدة لترجمة وحدة الزمن
    const translateDuration = (duration, unit) => {
        if (unit === 'day') return `${duration} يوم`;
        if (unit === 'month') return `${duration} شهر`;
        if (unit === 'year') return `${duration} سنة`;
        return `${duration} ${unit}`;
    };

    // جلب البيانات من الباك إند
    const fetchAllOffers = async () => {
        setLoading(true);
        try {
            const [publicRes, privateRes] = await Promise.all([
                clientApi.fetchPublicOffers(),
                clientApi.fetchPrivateOffers()
            ]);

            // تهيئة بيانات العروض العامة
            const formattedPublic = (publicRes.data?.data || []).map(offer => ({
                id: offer.id,
                projectId: offer.project?.id,
                providerName: offer.provider?.user ? `${offer.provider.user.first_name} ${offer.provider.user.last_name}` : 'مزود خدمة',
                providerType: offer.provider?.role?.name || 'غير محدد',
                rating: offer.provider?.average_rating || 0,
                projectTitle: offer.project?.title || 'بدون عنوان',
                price: offer.cost,
                duration: translateDuration(offer.duration, offer.duration_unit),
                status: offer.status,
                offerDate: new Date(offer.created_at).toLocaleDateString('ar-EG'),
                details: offer.details || offer.provider_comment || 'لا يوجد وصف تفصيلي لهذا العرض.',
                startDate: '-', 
                stages: offer.stages || [],
                attachments: offer.documents || []
            }));

            // تهيئة بيانات العروض الخاصة (حسب الهيكلية المختلفة في الباك)
            const formattedPrivate = (privateRes.data?.data || []).map(offer => ({
                id: offer.id,
                projectId: offer.project?.id,
                providerName: offer.provider?.name || 'مزود خدمة',
                providerType: offer.provider?.role_name || 'غير محدد',
                rating: offer.provider?.average_rating || 0,
                projectTitle: offer.project?.title || 'بدون عنوان',
                price: offer.cost,
                duration: translateDuration(offer.duration, offer.duration_unit),
                status: offer.status,
                offerDate: offer.created_at, // الباك هنا يرسلها منسقة جاهزة
                details: offer.provider_comment || offer.details || 'لا يوجد وصف تفصيلي.',
                startDate: '-',
                stages: offer.stages || [],
                attachments: offer.documents || []
            }));

            setPublicOffers(formattedPublic);
            setPrivateOffers(formattedPrivate);
        } catch (error) {
            console.error("Error fetching offers:", error);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line
    useEffect(() => {
        fetchAllOffers();
    }, []);

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 shadow-sm"><FaHourglassHalf className="me-1"/> قيد الانتظار</span>;
            case 'accepted': 
                return <span className="badge bg-success px-3 py-2 rounded-pill fs-6 shadow-sm"><FaCheckCircle className="me-1"/> تم القبول</span>;
            case 'rejected': 
                return <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 shadow-sm"><FaTimesCircle className="me-1"/> مرفوض</span>;
            default: 
                return null;
        }
    };

    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'accepted': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    const getInfoBgClass = (type) => {
        return type === 'public' ? 'bg-light' : 'bg-warning bg-opacity-10 border border-warning border-opacity-25';
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-warning" size={16} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-warning" size={16} style={{ opacity: 0.5 }} />);
            } else {
                stars.push(<FaStar key={i} className="text-muted" size={16} style={{ opacity: 0.3 }} />);
            }
        }
        return stars;
    };

    // عند النقر على "عرض التفاصيل"
    const handleViewDetails = (offer) => {
        setSelectedOffer(offer);
    };

    // العودة من صفحة التفاصيل وتحديث البيانات إذا تم قبول/رفض العرض
    const handleBackFromDetails = (needsRefresh) => {
        setSelectedOffer(null);
        if (needsRefresh) {
            fetchAllOffers();
        }
    };

    if (selectedOffer) {
        return (
            <OfferDetails 
                offer={selectedOffer} 
                offerType={offerType}
                onBack={handleBackFromDetails} 
            />
        );
    }

    const currentOffers = offerType === 'public' ? publicOffers : privateOffers;

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">العروض <FaFileInvoiceDollar className="text-success ms-2" /></h3>
                    <p className="text-muted fw-semibold">استعرض العروض التي تلقيتها من مزودي الخدمة على مشاريعك.</p>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-5">
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerType === 'public' ? '#ff8a00' : '#e2e8f0', color: offerType === 'public' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setOfferType('public')}
                >
                    <FaGlobe /> العروض العامة
                </button>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerType === 'private' ? '#ff8a00' : '#e2e8f0', color: offerType === 'private' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setOfferType('private')}
                >
                    <FaLock /> العروض الخاصة
                </button>
            </div>

            {loading ? (
                 <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-primary mb-3" size={50} />
                    <h4 className="text-muted fw-bold">جاري تحميل العروض...</h4>
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {currentOffers.length > 0 ? currentOffers.map(offer => (
                        <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                            
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    {offerType === 'public' ? <FaGlobe className="text-primary" size={20} /> : <FaLock className="text-warning" size={20} />}
                                    <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>
                                        {offerType === 'public' ? `عرض عام #${offer.id}` : `عرض خاص #${offer.id}`}
                                    </h5>
                                </div>
                                {getStatusBadge(offer.status)}
                            </div>
                            
                            <div className={`row mb-4 p-3 rounded-4 mx-0 ${getInfoBgClass(offerType)}`}>
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className={`bg-white p-2 rounded-circle shadow-sm ${offerType === 'public' ? 'text-primary' : 'text-warning'}`}><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة</span>
                                        <span className="fw-bold text-dark fs-5">{offer.providerName}</span>
                                        <span className="d-block text-muted fw-semibold small">{offer.providerType}</span>
                                    </div>
                                </div>
                                <div className={`col-md-6 d-flex align-items-center gap-3 border-start ps-md-4 ${offerType === 'private' ? 'border-warning border-opacity-50' : ''}`}>
                                    <div className={`bg-white p-2 rounded-circle shadow-sm ${offerType === 'public' ? 'text-primary' : 'text-warning'}`}><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{offer.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="row mb-4 g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaStar className="text-warning" size={18} />
                                            <span className="text-muted fw-bold small">تقييم مزود الخدمة</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold fs-4 text-dark">{offer.rating}</span>
                                            <span className="d-flex align-items-center gap-1">{renderStars(offer.rating)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-success" size={18} />
                                            <span className="text-muted fw-bold small">قيمة العرض</span>
                                        </div>
                                        <span className="fw-bold fs-4" style={{ color: '#ff8a00' }}>{offer.price} ر.س</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaRegClock className="text-info" size={18} />
                                            <span className="text-muted fw-bold small">مدة التنفيذ</span>
                                        </div>
                                        <span className="fw-bold fs-4 text-dark">{offer.duration}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`position-relative p-4 rounded-4 ${offerType === 'public' ? 'bg-light' : 'bg-white border shadow-sm'}`}>
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    {offer.details}
                                </p>
                            </div>

                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <span className="text-muted small fw-bold">تاريخ العرض: {offer.offerDate}</span>
                                <div className="d-flex gap-2 flex-wrap">
                                    <button 
                                        className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                        onClick={() => handleViewDetails(offer)}
                                    >
                                        <FaEye /> عرض التفاصيل
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            {offerType === 'public' ? (
                                <FaGlobe className="text-muted mb-3 opacity-25" size={50} />
                            ) : (
                                <FaLock className="text-muted mb-3 opacity-25" size={50} />
                            )}
                            <h4 className="text-muted fw-bold">
                                {offerType === 'public' ? 'لا توجد عروض عامة حتى الآن.' : 'لا توجد عروض خاصة حتى الآن.'}
                            </h4>
                            <p className="text-muted fw-semibold">عندما يقوم مزودو الخدمة بتقديم عروض، ستظهر هنا.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OffersReceivedTab;