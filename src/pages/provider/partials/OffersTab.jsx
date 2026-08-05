import { useState, useEffect } from 'react';
import { FaFileInvoiceDollar, FaMoneyBillWave, FaClock, FaEdit, FaTrash, FaUserTie, FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import SubmitOffer from './SubmitOffer';
import { fetchOffers, deleteOffer } from '../../../services/api/providerApi';
import './provider-tabs.css';

const OffersTab = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editOffer, setEditOffer] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchOffers();
                setOffers(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setOffers([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleDeleteOffer = async (id) => {
        try {
            await deleteOffer(id);
            setOffers(prev => prev.filter(o => o.id !== id));
        } catch (err) {
            console.error('فشل الحذف:', err.message);
            alert('⚠️ تعذر حذف العرض.');
        }
        setShowDeleteConfirm(null);
    };

    const getStatusInfo = (status) => {
        if (status === 'accepted') return { text: 'مقبول', class: 'badge-resolved', icon: <FaCheckCircle />, color: '#10b981' };
        if (status === 'rejected') return { text: 'مرفوض', class: 'badge-rejected', icon: <FaTimesCircle />, color: '#ef4444' };
        return { text: 'قيد المراجعة', class: 'badge-pending', icon: <FaSpinner className="fa-spin" />, color: '#1b2a47' };
    };

    // عرض واجهة تعديل العرض
    if (editOffer) {
        return (
            <SubmitOffer
                tender={{ id: editOffer.project_id, title: editOffer.project?.title }}
                offerData={editOffer}
                onBack={() => setEditOffer(null)}
                isEditing={true}
            />
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

            {loading ? (
                <div className="d-flex flex-column gap-4">
                    {[1, 2].map(i => <div key={i} className="card-provider p-5"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {offers.length > 0 ? offers.map(o => {
                        const statusInfo = getStatusInfo(o.status);
                        const title = o.project?.title;
                        const client = o.project?.client?.full_name || o.project?.client?.name;
                        const canEdit = o.status === 'pending';
                        return (
                            <div key={o.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                                style={{ borderColor: statusInfo.color }}>

                                <div className="row align-items-center">
                                    <div className="col-lg-8 mb-4 mb-lg-0">
                                        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                            <span className={`${statusInfo.class} rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6`}>
                                                {statusInfo.icon} {statusInfo.text}
                                            </span>
                                            <span className="text-muted fw-bold fs-6">{o.created_at ? o.created_at.slice(0, 10) : ''}</span>
                                        </div>
                                        <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{title}</h4>

                                        {client && (
                                            <div className="d-flex align-items-center gap-2 text-muted fw-bold fs-5 mb-3">
                                                <FaUserTie className="text-warning" /> {client}
                                            </div>
                                        )}

                                        <div className="bg-light p-3 rounded-3">
                                            <div className="d-flex flex-wrap gap-4 text-dark fw-bold fs-5">
                                                <span className="d-flex align-items-center gap-2">
                                                    <FaMoneyBillWave style={{ color: '#1b2a47' }} /> قيمة العرض: {o.cost} ل.س
                                                </span>
                                                <span className="d-flex align-items-center gap-2">
                                                    <FaClock style={{ color: statusInfo.color }} /> مدة التنفيذ: {o.duration} {o.duration_unit === 'day' ? 'يوم' : 'ساعة'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 d-flex flex-column gap-2 text-center border-start border-light pt-3 pt-lg-0 ps-lg-4">
                                        {canEdit ? (
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
                                        ) : o.status === 'accepted' ? (
                                            <div className="bg-success bg-opacity-10 text-success rounded-4 p-3 fw-bold text-center">
                                                <FaCheckCircle className="ms-2" /> تم قبول عرضك!
                                            </div>
                                        ) : (
                                            <div className="bg-danger bg-opacity-10 text-danger rounded-4 p-3 fw-bold text-center">
                                                <FaTimesCircle className="ms-2" /> تم رفض عرضك
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="empty-state">
                            <FaFileInvoiceDollar size={60} />
                            <h4>لا توجد عروض مقدمه في هذا القسم</h4>
                            <p>عند تقديم عروضك ستظهر هنا</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OffersTab;
