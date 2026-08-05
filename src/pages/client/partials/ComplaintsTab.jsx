import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, FaUserTie, FaHardHat, FaSpinner, FaPlus, FaPaperPlane, FaTimes } from 'react-icons/fa';
import { fetchClientComplaints, submitClientComplaint } from '../../../services/api/clientApi';

const ComplaintsTab = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        provider_name: '',
        project_title: '',
        description: ''
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchClientComplaints();
                setComplaints(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setComplaints([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitClientComplaint({
                provider_name: formData.provider_name,
                project_title: formData.project_title,
                description: formData.description
            });
            showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
            setFormData({ provider_name: '', project_title: '', description: '' });
            setShowForm(false);
            // إعادة تحميل الشكاوى
            const res = await fetchClientComplaints();
            setComplaints(res.data?.data || []);
        } catch (err) {
            console.warn('⚠️ API غير متاح:', err.message);
            showToast('error', '⚠️ تعذر إرسال الشكوى. تأكد من تسجيل الدخول.');
        } finally {
            setSending(false);
        }
    };

    // دالة ذكية لإرجاع شكل ولون حالة الشكوى
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 shadow-sm"><FaClock className="me-1"/> قيد المراجعة</span>;
            case 'resolved': 
                return <span className="badge bg-success px-3 py-2 rounded-pill fs-6 shadow-sm"><FaCheckCircle className="me-1"/> تم الحل</span>;
            case 'rejected': 
                return <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 shadow-sm"><FaTimesCircle className="me-1"/> مغلقة (مرفوضة)</span>;
            default: 
                return null;
        }
    };

    // دالة لإرجاع لون الحدود للبطاقة حسب الحالة
    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'resolved': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return '';
        }
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            {toast && <div className={`toast-custom toast-${toast.type}`} style={{ direction: 'rtl' }}>{toast.message}</div>}

            {/* عنوان الواجهة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل الشكاوى <FaExclamationTriangle className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold">متابعة حالة الشكاوى التي قمت برفعها للإدارة ضد مزودي الخدمة.</p>
                </div>
                <button className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                    style={{ backgroundColor: showForm ? '#dc3545' : '#ff8a00', color: 'white', fontSize: '16px' }}
                    onClick={() => setShowForm(!showForm)}>
                    {showForm ? <><FaTimes /> إلغاء</> : <><FaPlus /> شكوى جديدة</>}
                </button>
            </div>

            {/* نموذج شكوى جديدة */}
            {showForm && (
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white border-end border-4 border-danger">
                    <h4 className="fw-bold text-danger mb-4"><FaExclamationTriangle className="ms-2" /> نموذج تقديم شكوى</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">اسم مزود الخدمة</label>
                                <input type="text" className="form-control form-control-lg" placeholder="أدخل اسم مزود الخدمة" required
                                    value={formData.provider_name} onChange={e => setFormData(prev => ({ ...prev, provider_name: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">المشروع المرتبط</label>
                                <input type="text" className="form-control form-control-lg" placeholder="اسم المشروع" required
                                    value={formData.project_title} onChange={e => setFormData(prev => ({ ...prev, project_title: e.target.value }))} />
                            </div>
                            <div className="col-12">
                                <label className="form-label fw-bold">وصف المشكلة بالتفصيل</label>
                                <textarea className="form-control form-control-lg" rows="5" placeholder="اذكر التفاصيل..." required
                                    value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}></textarea>
                            </div>
                            <div className="col-12 text-center mt-3">
                                <button type="submit" className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-inline-flex align-items-center gap-2"
                                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '20px' }} disabled={sending}>
                                    {sending ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال الشكوى</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* عرض بطاقات الشكاوى */}
            {loading ? (
                <div className="d-flex flex-column gap-4">
                    {[1, 2].map(i => <div key={i} className="card border-0 shadow-sm rounded-4 p-5"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {complaints.length > 0 ? complaints.map(complaint => (
                        <div key={complaint.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(complaint.status)}`}>
                            
                            {/* رقم التذكرة والحالة */}
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة رقم: #{complaint.id + 1000}</h5>
                                {getStatusBadge(complaint.status)}
                            </div>
                            
                            {/* معلومات الجهة والمشروع */}
                            <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-2">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">الجهة المشتكى عليها</span>
                                        <span className="fw-bold text-dark fs-5">{complaint.provider_name || complaint.party_name || 'مزوّد خدمة'}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-2 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع المرتبط</span>
                                        <span className="fw-bold text-dark fs-5">{complaint.project_title || complaint.project?.title || '—'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* نص الشكوى */}
                            <div className="mb-4">
                                <h6 className="fw-bold text-danger mb-2">وصف المشكلة:</h6>
                                <p className="text-dark fw-semibold fs-5" style={{ lineHeight: '1.8' }}>{complaint.description}</p>
                            </div>

                            {/* رد الإدارة (يظهر فقط إذا كان موجوداً) */}
                            {complaint.admin_reply ? (
                                <div className="p-4 rounded-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="me-1" /> رد إدارة داركم:</h6>
                                    <p className="text-dark fw-semibold mb-0" style={{ lineHeight: '1.8', fontSize: '18px' }}>{complaint.admin_reply}</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                                    <p className="text-warning-emphasis fw-bold mb-0 d-flex align-items-center gap-2">
                                        <FaClock size={20} /> جاري مراجعة الشكوى من قبل الإدارة وسيتم الرد قريباً.
                                    </p>
                                </div>
                            )}

                            {/* تاريخ التقديم */}
                            <div className="text-end mt-4 pt-3 border-top text-muted small fw-bold">
                                تاريخ التقديم: {complaint.created_at ? complaint.created_at.slice(0, 10) : '—'}
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaExclamationTriangle className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">سجل الشكاوى الخاص بك فارغ.</h4>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ComplaintsTab;
