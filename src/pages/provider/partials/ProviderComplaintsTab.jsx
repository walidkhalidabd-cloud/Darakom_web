import { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, 
  FaUserTie, FaHardHat, FaPlus, FaPaperPlane, FaSpinner
} from 'react-icons/fa';
import { fetchComplaints, submitComplaint, fetchProviderProjects } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderComplaintsTab = () => {
    const [activeProjects, setActiveProjects] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    
    // تم التعديل لتخزين الـ IDs بدلاً من الأسماء لتتوافق مع الباك إند
    const [formData, setFormData] = useState({
        projectId: '',
        clientId: '',
        description: '' // سيتم إرسالها باسم text
    });

    const loadData = async () => {
        setLoading(true);
        try {
            // جلب الشكاوى والمشاريع الحقيقية في نفس الوقت
            const [complaintsRes, projectsRes] = await Promise.all([
                fetchComplaints().catch(() => ({ data: { data: [] } })),
                fetchProviderProjects().catch(() => ({ data: { data: [] } }))
            ]);

            // تهيئة المشاريع لاستخدامها في القائمة المنسدلة
            const projectsData = projectsRes.data?.data?.data || projectsRes.data?.data || [];
            setActiveProjects(Array.isArray(projectsData) ? projectsData : []);

            // تهيئة الشكاوى الواردة من الباك إند
            const complaintsData = complaintsRes.data?.data || [];
            const formattedComplaints = complaintsData.map(c => {
                // محاولة جلب اسم العميل واسم المشروع من العلاقات المرجعة
                let clientName = 'غير معروف';
                if (c.project && c.project.client) {
                    clientName = c.project.client.first_name ? `${c.project.client.first_name} ${c.project.client.last_name || ''}` : (c.project.client.name || 'غير معروف');
                } else if (c.against_user) {
                    clientName = c.against_user.first_name ? `${c.against_user.first_name} ${c.against_user.last_name || ''}` : (c.against_user.name || 'غير معروف');
                }

                return {
                    id: c.id,
                    clientName: clientName,
                    projectTitle: c.project?.title || 'غير محدد',
                    date: c.created_at ? new Date(c.created_at).toLocaleDateString('ar-EG') : 'غير محدد',
                    status: c.status || 'pending',
                    description: c.text || '', // الباك يعيدها باسم text
                    adminReply: c.admin_response || null // الباك يعيدها باسم admin_response
                };
            });
            
            setComplaints(formattedComplaints);
        } catch (err) {
            console.error('خطأ في جلب البيانات:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    // معالجة اختيار المشروع لتعيين الـ Client ID تلقائياً
    const handleProjectSelect = (e) => {
        const selectedProjectId = e.target.value;
        const selectedProject = activeProjects.find(p => p.id.toString() === selectedProjectId);
        
        setFormData({
            ...formData,
            projectId: selectedProjectId,
            clientId: selectedProject?.client_id || selectedProject?.client?.id || ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            // تجهيز البيانات بالأسماء التي يطلبها الباك إند
            const payload = {
                text: formData.description,
                project_id: formData.projectId,
                against_user_id: formData.clientId
            };

            await submitComplaint(payload);
            showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
            setShowForm(false);
            setFormData({ projectId: '', clientId: '', description: '' });
            loadData(); // إعادة جلب البيانات لتحديث القائمة
        } catch (err) {
            console.error(err);
            showToast('error', '❌ فشل إرسال الشكوى، يرجى المحاولة لاحقاً.');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge-pending rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaClock /> قيد المراجعة</span>;
            case 'resolved': 
            case 'closed':
                return <span className="badge-resolved rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaCheckCircle /> تمت المعالجة</span>;
            case 'rejected': 
                return <span className="badge-rejected rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaTimesCircle /> مرفوضة</span>;
            default: 
                return <span className="badge bg-secondary rounded-pill d-inline-flex align-items-center gap-1 fs-6">{status}</span>;
        }
    };

    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'resolved':
            case 'closed': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '100%' }}>
                <div className="section-header"><div><h3><FaExclamationTriangle className="ms-2 text-danger" /> سجل الشكاوى</h3></div></div>
                {[1,2,3].map(i => <div key={i} className="card-provider p-5 mb-4"><div className="loading-skeleton" style={{ height: '120px' }}></div></div>)}
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            {toast && <div className={`toast-custom toast-${toast.type === 'error' ? 'danger' : toast.type}`}>{toast.message}</div>}

            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3 flex-wrap gap-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل الشكاوى <FaExclamationTriangle className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold mb-0">متابعة حالة الشكاوى التي قمت برفعها للإدارة ضد العملاء.</p>
                </div>
                <button
                    className={`btn fw-bold rounded-pill d-flex align-items-center gap-2 px-4 py-2 shadow-sm ${showForm ? 'btn-outline-secondary' : 'btn-danger text-white'}`}
                    style={{ fontSize: '16px' }}
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormData({ projectId: '', clientId: '', description: '' });
                    }}
                >
                    {showForm ? <><FaTimesCircle /> إلغاء</> : <><FaPlus /> تقديم شكوى جديدة</>}
                </button>
            </div>

            {showForm && (
                <div className="card-provider border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5 border-end border-4 border-danger">
                    <h4 className="fw-bold text-danger mb-4"><FaExclamationTriangle className="ms-2" /> نموذج تقديم شكوى</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            
                            <div className="col-md-12">
                                <label className="form-label fw-bold">اختر المشروع المرتبط بالشكوى</label>
                                <select className="form-select form-control-custom" required value={formData.projectId} onChange={handleProjectSelect}>
                                    <option value="">اختر المشروع...</option>
                                    {activeProjects.map(p => {
                                        const clientName = p.client?.first_name ? `${p.client.first_name} ${p.client.last_name || ''}` : (p.client?.name || 'عميل');
                                        return (
                                            <option key={p.id} value={p.id}>{p.title} (العميل: {clientName})</option>
                                        );
                                    })}
                                </select>
                                {activeProjects.length === 0 && (
                                    <small className="text-danger mt-1 d-block">لا يوجد لديك مشاريع نشطة لتقديم شكوى مرتبطة بها.</small>
                                )}
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label fw-bold">وصف المشكلة بالتفصيل</label>
                                <textarea className="form-control form-control-custom" rows="5" placeholder="اذكر تفاصيل الشكوى بوضوح والمشكلة التي تواجهها مع العميل..." required
                                    value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}></textarea>
                            </div>
                            
                            <div className="col-12 text-center mt-4">
                                <button type="submit" className="btn fw-bold d-inline-flex align-items-center gap-2 px-5 py-3 shadow"
                                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '20px', borderRadius: '12px' }} disabled={sending || !formData.projectId}>
                                    {sending ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال الشكوى</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="d-flex flex-column gap-4">
                {complaints.length > 0 ? complaints.map(complaint => (
                    <div key={complaint.id} className={`card-provider border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(complaint.status)}`}>
                        
                        <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3 flex-wrap gap-2">
                            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة رقم: #{complaint.id + 1000}</h5>
                            {getStatusBadge(complaint.status)}
                        </div>
                        
                        <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                            <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                <div>
                                    <span className="text-muted small fw-bold d-block">العميل المشتكى عليه</span>
                                    <span className="fw-bold text-dark fs-5">{complaint.clientName}</span>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                <div>
                                    <span className="text-muted small fw-bold d-block">المشروع المرتبط</span>
                                    <span className="fw-bold text-dark fs-5">{complaint.projectTitle}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <h6 className="fw-bold text-danger mb-2">وصف المشكلة:</h6>
                            <p className="text-dark fw-semibold fs-5" style={{ lineHeight: '1.8' }}>{complaint.description}</p>
                        </div>

                        {complaint.adminReply ? (
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="me-1" /> رد إدارة داركم:</h6>
                                <p className="text-dark fw-semibold mb-0" style={{ lineHeight: '1.8', fontSize: '18px' }}>{complaint.adminReply}</p>
                            </div>
                        ) : (
                            <div className="p-4 rounded-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                                <p className="text-warning-emphasis fw-bold mb-0 d-flex align-items-center gap-2">
                                    <FaClock size={20} /> جاري مراجعة الشكوى من قبل الإدارة وسيتم الرد قريباً.
                                </p>
                            </div>
                        )}

                        <div className="text-end mt-4 pt-3 border-top text-muted small fw-bold">
                            تاريخ التقديم: {complaint.date}
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-5 empty-state">
                        <FaExclamationTriangle className="text-muted mb-3 opacity-25" size={60} />
                        <h4 className="text-muted fw-bold">سجل الشكاوى الخاص بك فارغ.</h4>
                        <p>لم تقم بتقديم أي شكاوى ضد العملاء حتى الآن.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProviderComplaintsTab;