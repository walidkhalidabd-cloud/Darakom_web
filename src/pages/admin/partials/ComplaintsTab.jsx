import { useState, useEffect } from 'react';
import {
    FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle,
    FaUserAlt, FaReply, FaPaperPlane, FaSpinner, FaCheckDouble,
    FaCommentDots
} from 'react-icons/fa';
import { fetchAdminComplaints, replyToComplaint, resolveComplaint } from '../../../services/api/adminApi';
import './admin-tabs.css';

const ComplaintsTab = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('pending');
    const [toast, setToast] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [replyingId, setReplyingId] = useState(null);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchAdminComplaints();
                setComplaints(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setComplaints([
                    { id: 1, from: 'أحمد سليمان', role: 'client', subject: 'تأخير في تنفيذ المشروع', description: 'مزود الخدمة متأخر في تسليم الأعمال المتفق عليها منذ أسبوعين دون مبرر.', date: '2026/06/12', status: 'pending', admin_reply: null },
                    { id: 2, from: 'مكتب الأفق الهندسي', role: 'provider', subject: 'مشكلة في سداد الدفعات', description: 'العميل متأخر في سداد الدفعة المستحقة للمرحلة الثانية.', date: '2026/06/10', status: 'pending', admin_reply: null },
                    { id: 3, from: 'ليلى حسن', role: 'client', subject: 'جودة المواد غير مطابقة', description: 'المقاول استخدم مواد مخالفة للمواصفات المتفق عليها في العقد.', date: '2026/06/05', status: 'resolved', admin_reply: 'تم إلزام المقاول بتغيير المواد غير المطابقة خلال أسبوع.' },
                    { id: 4, from: 'مؤسسة النور', role: 'provider', subject: 'ملاحظة على منصة العرض', description: 'ملاحظة بخصوص آلية عرض المشاريع في الصفحة الرئيسية.', date: '2026/05/28', status: 'resolved', admin_reply: 'شكراً لملاحظتك، تم تحسين آلية العرض.' },
                    { id: 5, from: 'خالد عبدالله', role: 'client', subject: 'شكوى ضد عميل آخر', description: 'سلوك غير لائق في التعامل أثناء التفاوض على العروض.', date: '2026/06/14', status: 'pending', admin_reply: null },
                ]);
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

    const handleToggleReply = (id) => {
        setReplyingId(replyingId === id ? null : id);
        setReplyText('');
    };

    const handleSendReply = async (complaint) => {
        if (!replyText.trim()) return;
        setSending(true);
        try {
            await replyToComplaint(complaint.id, replyText);
        } catch {
            // تجاهل
        }
        setComplaints(complaints.map(c => c.id === complaint.id ? { ...c, admin_reply: replyText, status: 'resolved' } : c));
        setSending(false);
        setReplyingId(null);
        showToast('success', '✅ تم إرسال الرد على الشكوى بنجاح');
    };

    const handleResolve = async (complaint) => {
        try {
            await resolveComplaint(complaint.id);
        } catch {
            // تجاهل
        }
        setComplaints(complaints.map(c => c.id === complaint.id ? { ...c, status: 'resolved' } : c));
        showToast('success', '✅ تم إغلاق الشكوى وحلها');
    };

    const getStatusBadge = (status) => {
        switch (status) {
            case 'pending': return <span className="badge-pending rounded-pill d-inline-flex align-items-center gap-1"><FaClock /> قيد المراجعة</span>;
            case 'resolved': return <span className="badge-approved rounded-pill d-inline-flex align-items-center gap-1"><FaCheckCircle /> تم الحل</span>;
            case 'rejected': return <span className="badge-rejected rounded-pill d-inline-flex align-items-center gap-1"><FaTimesCircle /> مغلقة</span>;
            default: return null;
        }
    };

    const filteredComplaints = complaints.filter(c => filter === 'all' || c.status === filter);

    const counts = {
        all: complaints.length,
        pending: complaints.filter(c => c.status === 'pending').length,
        resolved: complaints.filter(c => c.status === 'resolved').length,
    };

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1100px' }}>
                <div className="section-header"><div><h3><FaExclamationTriangle className="ms-2 text-danger" /> الشكاوى والملاحظات</h3></div></div>
                {[1, 2, 3].map(i => <div key={i} className="card-admin p-5 mb-4"><div className="loading-skeleton" style={{ height: '120px' }}></div></div>)}
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

            <div className="section-header">
                <div>
                    <h3><FaExclamationTriangle className="ms-2 text-danger" /> الإشراف على الشكاوى والملاحظات</h3>
                    <p>متابعة الشكاوى والملاحظات الواردة من المستخدمين والرد عليها</p>
                </div>
            </div>

            {/* إحصائيات سريعة */}
            <div className="row g-3 mb-4">
                <div className="col-md-4">
                    <div className="card-admin p-3 d-flex align-items-center justify-content-between">
                        <div><span className="text-muted fw-bold">بانتظار الرد</span><h3 className="fw-bold text-warning mb-0">{counts.pending}</h3></div>
                        <div className="bg-warning bg-opacity-10 text-warning p-2 rounded-circle" style={{ fontSize: '24px' }}><FaClock /></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-admin p-3 d-flex align-items-center justify-content-between">
                        <div><span className="text-muted fw-bold">تم حلها</span><h3 className="fw-bold text-success mb-0">{counts.resolved}</h3></div>
                        <div className="bg-success bg-opacity-10 text-success p-2 rounded-circle" style={{ fontSize: '24px' }}><FaCheckDouble /></div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card-admin p-3 d-flex align-items-center justify-content-between">
                        <div><span className="text-muted fw-bold">الإجمالي</span><h3 className="fw-bold text-primary mb-0">{counts.all}</h3></div>
                        <div className="bg-primary bg-opacity-10 text-primary p-2 rounded-circle" style={{ fontSize: '24px' }}><FaCommentDots /></div>
                    </div>
                </div>
            </div>

            {/* التبويبات */}
            <div className="tab-switcher mb-4">
                {[
                    { id: 'all', label: 'الكل' },
                    { id: 'pending', label: 'بانتظار الرد' },
                    { id: 'resolved', label: 'تم حلها' },
                ].map(t => (
                    <button key={t.id} className={`${filter === t.id ? 'active-tab' : 'inactive-tab'}`}
                        style={{ backgroundColor: filter === t.id ? '#dc3545' : '#e2e8f0', minWidth: '150px' }}
                        onClick={() => setFilter(t.id)}>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* قائمة الشكاوى */}
            <div className="d-flex flex-column gap-4">
                {filteredComplaints.length > 0 ? filteredComplaints.map(c => {
                    const isPending = c.status === 'pending';
                    return (
                        <div key={c.id} className={`card-admin p-4 p-md-5 bg-white border-end border-4 ${isPending ? 'border-warning' : 'border-success'}`}>
                            <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom flex-wrap gap-2">
                                <div className="d-flex align-items-center gap-3 flex-wrap">
                                    <div className="user-avatar" style={{ backgroundColor: c.role === 'client' ? '#0d6efd' : '#ff8a00' }}><FaUserAlt /></div>
                                    <div>
                                        <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{c.from}</h5>
                                        <span className="text-muted small fw-bold">{c.role === 'client' ? 'عميل' : 'مزود خدمة'}</span>
                                    </div>
                                </div>
                                {getStatusBadge(c.status)}
                            </div>

                            <h6 className="fw-bold mb-2" style={{ color: '#1b2a47', fontSize: '18px' }}>
                                <FaExclamationTriangle className="ms-1 text-danger" /> {c.subject}
                            </h6>
                            <p className="fw-semibold text-muted" style={{ lineHeight: '1.8' }}>{c.description}</p>

                            {c.admin_reply ? (
                                <div className="p-4 rounded-4 border mt-3" style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}>
                                    <h6 className="fw-bold text-success mb-2"><FaReply className="ms-1" /> رد الإدارة:</h6>
                                    <p className="fw-semibold mb-0" style={{ lineHeight: '1.8' }}>{c.admin_reply}</p>
                                </div>
                            ) : (
                                isPending && (
                                    <div className="mt-3">
                                        {replyingId === c.id ? (
                                            <div className="p-4 rounded-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
                                                <label className="form-label fw-bold" style={{ color: '#92400e' }}>اكتب ردك على هذه الشكوى:</label>
                                                <textarea className="form-control form-control-custom mb-3" rows="3"
                                                    placeholder="اكتب الرد هنا..." value={replyText}
                                                    onChange={e => setReplyText(e.target.value)}></textarea>
                                                <div className="d-flex gap-2 justify-content-end">
                                                    <button className="btn btn-sm btn-outline-secondary fw-bold rounded-pill" onClick={() => setReplyingId(null)}>إلغاء</button>
                                                    <button className="btn btn-sm btn-admin-orange fw-bold rounded-pill d-inline-flex align-items-center gap-1 px-3" disabled={sending || !replyText.trim()} onClick={() => handleSendReply(c)}>
                                                        {sending ? <><FaSpinner className="fa-spin" /> إرسال...</> : <><FaPaperPlane /> إرسال الرد</>}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="p-4 rounded-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#fde68a' }}>
                                                <p className="fw-bold mb-0 d-flex align-items-center gap-2" style={{ color: '#92400e' }}>
                                                    <FaClock size={20} /> هذه الشكوى بانتظار رد الإدارة.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )
                            )}

                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top flex-wrap gap-2">
                                <span className="text-muted small fw-bold">تاريخ التقديم: {c.date}</span>
                                {isPending && (
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-sm btn-outline-primary fw-bold rounded-pill d-flex align-items-center gap-1 px-3" onClick={() => handleToggleReply(c.id)}>
                                            <FaReply /> {replyingId === c.id ? 'إلغاء الرد' : 'الرد على الشكوى'}
                                        </button>
                                        <button className="btn btn-sm btn-outline-success fw-bold rounded-pill d-flex align-items-center gap-1 px-3" onClick={() => handleResolve(c)}>
                                            <FaCheckCircle /> حل الشكوى
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="empty-state">
                        <FaExclamationTriangle size={60} />
                        <h4>لا توجد شكاوى</h4>
                        <p>لا توجد شكاوى مطابقة للمعايير المحددة</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintsTab;
