import { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaUserTie, FaHardHat, FaMoneyBillWave, FaRegClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaGlobe, FaLock, FaEye } from 'react-icons/fa';
import OfferDetails from './OfferDetails';
import { fetchClientProjects, fetchClientProjectOffers, acceptOffer, rejectOffer } from '../../../services/api/clientApi';

const OffersReceivedTab = () => {
    // التبديل بين العروض العامة والعروض الخاصة
    const [offerType, setOfferType] = useState('public'); // 'public' or 'private'
    // العرض المحدد لعرض التفاصيل
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);

    const mapOffer = (o, project) => {
        const status = o.status || 'pending';
        const provider = o.provider || {};
        const providerUser = provider.user || {};
        const isPrivate = (project && (project.visibility === 'private' || project.invitation_type === 'private')) || false;
        return {
            id: o.id,
            providerName: providerUser.full_name || providerUser.name || 'مزود خدمة',
            providerType: provider.role?.name || 'مزود خدمة',
            rating: 0,
            projectTitle: project?.title || '',
            price: o.cost ? Number(o.cost).toLocaleString() : '',
            duration: o.duration ? `${o.duration} ${o.duration_unit === 'hour' ? 'ساعة' : 'يوم'}` : '',
            status,
            isPrivate: !!isPrivate,
            offerDate: o.created_at ? o.created_at.slice(0, 10) : '',
            details: o.details || o.provider_comment || '',
            startDate: o.start_date || '',
            stages: []
        };
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchClientProjects();
                const projects = res.data?.data || [];
                const all = [];
                for (const p of projects) {
                    try {
                        const offRes = await fetchClientProjectOffers(p.id);
                        const projectOffers = offRes.data?.data || [];
                        projectOffers.forEach(o => all.push(mapOffer(o, p)));
                    } catch { /* تجاهل المشاريع بدون عروض */ }
                }
                setOffers(all);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setOffers([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleAccept = async (offer) => {
        try {
            // نحتاج معرفة المشروع؛ نبحث عنه في offers
            await acceptOffer(0, offer.id);
        } catch (err) {
            console.warn('قبول من هذه الواجهة يتطلب المشروع:', err.message);
            alert('⚠️ للقبول أو الرفض، استخدم واجهة "مشاريعي" حيث تكون تفاصيل المشروع متاحة.');
        }
    };

    const handleReject = async (offer) => {
        try {
            await rejectOffer(0, offer.id);
        } catch (err) {
            console.warn('رفض من هذه الواجهة يتطلب المشروع:', err.message);
            alert('⚠️ للقبول أو الرفض، استخدم واجهة "مشاريعي" حيث تكون تفاصيل المشروع متاحة.');
        }
    };

    // دالة لإرجاع شكل ولون حالة العرض
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

    // دالة لإرجاع لون الحدود للبطاقة حسب الحالة
    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'accepted': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

// دالة لإرجاع لون خلفية معلومات مزود الخدمة حسب نوع العرض
    const getInfoBgClass = (type) => {
        return type === 'public' ? 'bg-light' : 'bg-warning bg-opacity-10 border border-warning border-opacity-25';
    };

    // إذا تم تحديد عرض، اظهر صفحة التفاصيل
    if (selectedOffer) {
        return (
            <OfferDetails 
                offer={selectedOffer} 
                offerType={offerType}
                onBack={() => setSelectedOffer(null)} 
            />
        );
    }

    const currentOffers = offerType === 'public' ? offers.filter(o => !o.isPrivate) : offers.filter(o => o.isPrivate);

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">العروض <FaFileInvoiceDollar className="text-success ms-2" /></h3>
                    <p className="text-muted fw-semibold">استعرض العروض التي تلقيتها من مزودي الخدمة على مشاريعك.</p>
                </div>
            </div>

            {/* أزرار التبديل (Tabs) بين العروض العامة والخاصة */}
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
                <div className="d-flex flex-column gap-4">
                    {[1, 2].map(i => <div key={i} className="card border-0 shadow-sm rounded-4 p-5"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {currentOffers.length > 0 ? currentOffers.map(offer => (
                        <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                            
                            {/* رأس البطاقة: رقم العرض والحالة */}
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    {offer.isPrivate ? <FaLock className="text-warning" size={20} /> : <FaGlobe className="text-primary" size={20} />}
                                    <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{offer.isPrivate ? 'عرض خاص' : 'عرض عام'}</h5>
                                </div>
                                {getStatusBadge(offer.status)}
                            </div>
                            
                            {/* معلومات مزود الخدمة مع المشروع */}
                            <div className={`row mb-4 p-3 rounded-4 mx-0 ${getInfoBgClass(offer.isPrivate ? 'private' : 'public')}`}>
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة</span>
                                        <span className="fw-bold text-dark fs-5">{offer.providerName}</span>
                                        <span className="d-block text-muted fw-semibold small">{offer.providerType}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{offer.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            {/* صف السعر + المدة */}
                            <div className="row mb-4 g-3">
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-success" size={18} />
                                            <span className="text-muted fw-bold small">قيمة العرض</span>
                                        </div>
                                        <span className="fw-bold fs-4" style={{ color: '#ff8a00' }}>{offer.price} ل.س</span>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaRegClock className="text-info" size={18} />
                                            <span className="text-muted fw-bold small">مدة التنفيذ</span>
                                        </div>
                                        <span className="fw-bold fs-4 text-dark">{offer.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* وصف العرض */}
                            <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    {offer.details}
                                </p>
                            </div>

                            {/* تاريخ التقديم وأزرار الإجراءات */}
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <span className="text-muted small fw-bold">تاريخ العرض: {offer.offerDate}</span>
                                <div className="d-flex gap-2 flex-wrap">
                                    <button 
                                        className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                        onClick={() => setSelectedOffer(offer)}
                                    >
                                        <FaEye /> عرض التفاصيل
                                    </button>
                                    {offer.status === 'pending' && (
                                        <>
                                            <button className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ fontSize: '16px' }} onClick={() => handleAccept(offer)}>
                                                <FaCheckCircle className="me-1" /> قبول العرض
                                            </button>
                                            <button className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill" style={{ fontSize: '16px' }} onClick={() => handleReject(offer)}>
                                                <FaTimesCircle className="me-1" /> رفض
                                            </button>
                                        </>
                                    )}
                                    {offer.status === 'accepted' && (
                                        <span className="text-success fw-bold fs-6"><FaCheckCircle className="me-1" /> تم قبول هذا العرض</span>
                                    )}
                                    {offer.status === 'rejected' && (
                                        <span className="text-danger fw-bold fs-6"><FaTimesCircle className="me-1" /> تم رفض هذا العرض</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaFileInvoiceDollar className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لا توجد عروض مستلمة حتى الآن.</h4>
                            <p className="text-muted fw-semibold">عندما يقوم مزودو الخدمة بتقديم عروض على مشاريعك، ستظهر هنا.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OffersReceivedTab;

