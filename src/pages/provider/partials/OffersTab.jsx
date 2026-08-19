import { useState, useEffect } from 'react';
import { FaGlobe, FaLock, FaMoneyBillWave, FaClock, FaEdit, FaTrash, FaUserTie, FaFileInvoiceDollar, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { fetchMyOffers, deleteOffer } from '../../../services/api/providerApi';
import SubmitOffer from './SubmitOffer';
import './provider-tabs.css';

const OffersTab = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [editOffer, setEditOffer] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [offers, setOffers] = useState({ general: [], private: [] });

    const loadOffers = async () => {
        setLoading(true);
        try {
            const res = await fetchMyOffers();
            const data = res.data?.data || [];
            
            const gen = [];
            const priv = [];

            data.forEach(o => {
                const clientObj = o.project?.client;
                const clientName = clientObj?.first_name ? `${clientObj.first_name} ${clientObj.last_name || ''}`.trim() : (clientObj?.name || 'غير معروف');
                
                // تحديد مدة العرض
                let durationText = o.duration;
                if(o.duration_unit === 'day') durationText += ' يوم';
                else if(o.duration_unit === 'month') durationText += ' شهر';
                else if(o.duration_unit === 'year') durationText += ' سنة';

                // ترجمة الحالة
                let statusAr = 'قيد المراجعة';
                if(o.status === 'accepted') statusAr = 'مقبول';
                if(o.status === 'rejected') statusAr = 'مرفوض';

                // استخراج المراحل من التفاصيل إذا كانت محفوظة
                let parsedDetails = { stages: [], startDate: '' };
                try {
                    if (o.details) parsedDetails = JSON.parse(o.details);
                } catch(e) { /* تجاهل الخطأ في حال لم تكن JSON */ }

                const formatted = {
                    id: o.id,
                    status: statusAr,
                    time: new Date(o.created_at).toLocaleDateString('ar-EG'),
                    title: o.project?.title || 'مشروع غير محدد',
                    client: clientName,
                    amount: o.cost,
                    duration: durationText,
                    duration_value: o.duration,
                    canEdit: o.status === 'pending',
                    project_id: o.project_id,
                    stages: parsedDetails.stages || [],
                    startDate: parsedDetails.startDate || ''
                };

                if (o.project?.invitation_type === 'private') {
                    priv.push(formatted);
                } else {
                    gen.push(formatted);
                }
            });

            setOffers({ general: gen, private: priv });
        } catch (error) {
            console.error("خطأ في جلب العروض:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOffers();
    }, []);

    const currentData = activeSection === 'general' ? offers.general : offers.private;

    const handleDeleteOffer = async (id) => {
        try {
            await deleteOffer(id);
            setOffers(prev => ({
                ...prev,
                [activeSection]: prev[activeSection].filter(o => o.id !== id)
            }));
        } catch (err) {
            console.error("فشل حذف العرض:", err);
            alert("حدث خطأ أثناء حذف العرض.");
        } finally {
            setShowDeleteConfirm(null);
        }
    };

    const getStatusIcon = (status) => {
        if (status === 'مقبول') return <FaCheckCircle />;
        if (status === 'مرفوض') return <FaTimesCircle />;
        return <FaSpinner className="fa-spin" />;
    };

    const getStatusClass = (status) => {
        if (status === 'مقبول') return 'badge-resolved';
        if (status === 'مرفوض') return 'badge-rejected';
        return 'badge-pending';
    };

    // عرض واجهة تعديل العرض
    if (editOffer) {
        const tenderData = {
            id: editOffer.project_id,
            title: editOffer.title,
        };
        return (
            <SubmitOffer
                tender={tenderData}
                offerData={editOffer}
                onBack={() => {
                    setEditOffer(null);
                    loadOffers(); // تحديث القائمة بعد العودة من التعديل
                }}
                isEditing={true}
            />
        );
    }

    if (loading) {
        return (
            <div className="mx-auto text-center py-5" style={{ maxWidth: '1400px' }}>
                <FaSpinner className="fa-spin text-warning mb-3" size={50} />
                <h4 className="fw-bold text-muted">جاري تحميل عروضك...</h4>
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="section-header">
                <div>
                    <h3><FaFileInvoiceDollar className="ms-2 text-warning" /> عروضي المقدمة</h3>
                    <p>جميع العروض التي قدمتها على المناقصات</p>
                </div>
            </div>

            <div className="tab-switcher justify-content-center">
                <button className={activeSection === 'general' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'general' ? '#1b2a47' : '', color: activeSection === 'general' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('general')}>
                    <FaGlobe className="ms-2" /> عروض المناقصات العامة
                </button>
                <button className={activeSection === 'private' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'private' ? '#ff8a00' : '', color: activeSection === 'private' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('private')}>
                    <FaLock className="ms-2" /> عروض الدعوات الخاصة
                </button>
            </div>

            <div className="d-flex flex-column gap-4">
                {currentData.length > 0 ? currentData.map(o => (
                    <div key={o.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                        style={{ borderColor: o.status === 'مقبول' ? '#10b981' : o.status === 'مرفوض' ? '#ef4444' : '#1b2a47' }}>

                        <div className="row align-items-center">
                            <div className="col-lg-8 mb-4 mb-lg-0">
                                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                    <span className={`${getStatusClass(o.status)} rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6`}>
                                        {getStatusIcon(o.status)} {o.status}
                                    </span>
                                    <span className="text-muted fw-bold fs-6">تاريخ التقديم: {o.time}</span>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{o.title}</h4>

                                {o.client && (
                                    <div className="d-flex align-items-center gap-2 text-muted fw-bold fs-5 mb-3">
                                        <FaUserTie className="text-warning" /> {o.client}
                                    </div>
                                )}

                                <div className="bg-light p-3 rounded-3">
                                    <div className="d-flex flex-wrap gap-4 text-dark fw-bold fs-5">
                                        <span className="d-flex align-items-center gap-2">
                                            <FaMoneyBillWave style={{ color: '#1b2a47' }} /> قيمة العرض: {o.amount} ل.س
                                        </span>
                                        <span className="d-flex align-items-center gap-2">
                                            <FaClock style={{ color: o.status === 'مقبول' ? '#10b981' : '#1b2a47' }} /> مدة التنفيذ: {o.duration}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-lg-4 d-flex flex-column gap-2 text-center border-start border-light pt-3 pt-lg-0 ps-lg-4">
                                {o.canEdit ? (
                                    <>
                                        <button
                                            onClick={() => setEditOffer(o)}
                                            className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                            style={{ fontSize: '18px' }}>
                                            <FaEdit /> تعديل العرض
                                        </button>
                                        {showDeleteConfirm === o.id ? (
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteOffer(o.id)}
                                                    className="btn btn-danger fw-bold py-2 rounded-pill w-50"
                                                    style={{ fontSize: '14px' }}>
                                                    تأكيد الحذف
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="btn btn-secondary fw-bold py-2 rounded-pill w-50"
                                                    style={{ fontSize: '14px' }}>
                                                    إلغاء
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowDeleteConfirm(o.id)}
                                                className="btn btn-outline-danger fw-bold py-2 rounded-pill w-100 d-flex align-items-center justify-content-center gap-2"
                                                style={{ fontSize: '16px' }}>
                                                <FaTrash /> سحب / حذف العرض
                                            </button>
                                        )}
                                    </>
                                ) : o.status === 'مقبول' ? (
                                    <div className="bg-success bg-opacity-10 text-success rounded-4 p-3 fw-bold text-center">
                                        <FaCheckCircle className="ms-2" /> تم قبول عرضك!
                                    </div>
                                ) : (
                                    <>
                                        <button className="btn btn-secondary fw-bold py-2 rounded-pill shadow-sm w-100" disabled style={{ fontSize: '18px' }}>
                                            لا يمكن التعديل
                                        </button>
                                        {showDeleteConfirm === o.id ? (
                                            <div className="d-flex gap-2">
                                                <button
                                                    onClick={() => handleDeleteOffer(o.id)}
                                                    className="btn btn-danger fw-bold py-2 rounded-pill w-50"
                                                    style={{ fontSize: '14px' }}>
                                                    تأكيد الحذف
                                                </button>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                    className="btn btn-secondary fw-bold py-2 rounded-pill w-50"
                                                    style={{ fontSize: '14px' }}>
                                                    إلغاء
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setShowDeleteConfirm(o.id)}
                                                className="btn btn-outline-danger fw-bold py-2 rounded-pill w-100 d-flex align-items-center justify-content-center gap-2"
                                                style={{ fontSize: '16px' }}>
                                                <FaTrash /> حذف من القائمة
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state py-5">
                        <FaFileInvoiceDollar size={60} className="text-muted opacity-25 mb-3" />
                        <h4 className="fw-bold text-muted">لا توجد عروض مقدمة في هذا القسم</h4>
                        <p className="text-muted fw-semibold">عند تقديم عروضك ستظهر هنا</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersTab;