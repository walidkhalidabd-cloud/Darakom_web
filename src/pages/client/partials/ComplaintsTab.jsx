import { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, FaUserTie, FaHardHat, FaPlus, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { submitClientComplaint, fetchClientComplaints, fetchClientProjects } from '../../../services/api/clientApi';
import './client-tabs.css';

const ComplaintsTab = () => {
    const [complaints, setComplaints] = useState([]);
    const [activeProjectsList, setActiveProjectsList] = useState([]);
    const [uniqueProviders, setUniqueProviders] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        providerId: '',
        providerName: '',
        projectId: '',
        projectTitle: '',
        description: ''
    });

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const loadData = async () => {
        setLoadingData(true);
        try {
            // جلب الشكاوى السابقة
            const complaintsRes = await fetchClientComplaints();
            const complaintsData = complaintsRes.data?.data || complaintsRes.data || [];
            if (Array.isArray(complaintsData)) {
                setComplaints(complaintsData);
            }

            // جلب المشاريع لاستخراج المزودين للشكوى الجديدة
            const projectsRes = await fetchClientProjects();
            const projectsData = projectsRes.data?.data || projectsRes.data || [];
            if (Array.isArray(projectsData)) {
                // تصفية المشاريع التي لها مزود خدمة
                const projectsWithProviders = projectsData
                    .filter(p => p.performer && p.performer.user)
                    .map(p => ({
                        id: p.id,
                        title: p.title,
                        providerId: p.performer.user.id,
                        providerName: p.performer.user.name || p.performer.user.full_name || 'غير معروف'
                    }));

                setActiveProjectsList(projectsWithProviders);

                // استخراج قائمة المزودين بدون تكرار
                const providersMap = new Map();
                projectsWithProviders.forEach(p => {
                    if (!providersMap.has(p.providerId)) {
                        providersMap.set(p.providerId, { id: p.providerId, name: p.providerName });
                    }
                });
                setUniqueProviders(Array.from(providersMap.values()));
            }
        } catch (err) {
            console.error('Error fetching data:', err);
            showToast('error', 'فشل في جلب البيانات.');
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    // معالجة اختيار مزود الخدمة لتحديد المشروع تلقائياً أو إظهار قائمة المشاريع
    const handleProviderSelect = (e) => {
        const selectedProviderId = e.target.value;
        const selectedProviderName = e.target.options[e.target.selectedIndex].text;
        
        const providerProjects = activeProjectsList.filter(p => p.providerId.toString() === selectedProviderId);
        
        setFormData({
            ...formData,
            providerId: selectedProviderId,
            providerName: selectedProviderName,
            // إذا كان لديه مشروع واحد فقط، ضعه تلقائياً، وإلا اتركه فارغاً ليختاره المستخدم
            projectId: providerProjects.length === 1 ? providerProjects[0].id : '',
            projectTitle: providerProjects.length === 1 ? providerProjects[0].title : ''
        });
    };

    const handleProjectSelect = (e) => {
        const selectedProjectId = e.target.value;
        const selectedProjectTitle = e.target.options[e.target.selectedIndex].text;
        setFormData({
            ...formData,
            projectId: selectedProjectId,
            projectTitle: selectedProjectTitle
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            const payload = {
                text: formData.description,
                type: 'general', // نوع افتراضي يمكن تغييره إذا أردت
                project_id: formData.projectId || null,
                against_user_id: formData.providerId || null
            };

            await submitClientComplaint(payload);
            showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
            
            setShowForm(false);
            setFormData({ providerId: '', providerName: '', projectId: '', projectTitle: '', description: '' });
            
            // إعادة تحميل الشكاوى لظهور الشكوى الجديدة
            loadData();
        } catch (err) {
            console.error('API Error:', err);
            showToast('error', err.response?.data?.message || 'فشل في إرسال الشكوى.');
        } finally {
            setSending(false);
        }
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
            case 'under_review':
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 shadow-sm"><FaClock className="me-1"/> قيد المراجعة</span>;
            case 'resolved': 
            case 'closed':
                return <span className="badge bg-success px-3 py-2 rounded-pill fs-6 shadow-sm"><FaCheckCircle className="me-1"/> تم الحل</span>;
            case 'rejected': 
                return <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 shadow-sm"><FaTimesCircle className="me-1"/> مغلقة (مرفوضة)</span>;
            default: 
                return <span className="badge bg-secondary px-3 py-2 rounded-pill fs-6 shadow-sm">{status}</span>;
        }
    };

    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': 
            case 'under_review': return 'border-warning';
            case 'resolved': 
            case 'closed': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">سجل الشكاوى <FaExclamationTriangle className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold">متابعة حالة الشكاوى التي قمت برفعها للإدارة ضد مزودي الخدمة.</p>
                </div>
                <button
                    className="btn fw-bold rounded-pill d-flex align-items-center gap-2 px-4 py-2 shadow-sm"
                    style={{ backgroundColor: showForm ? '#e2e8f0' : '#dc3545', color: showForm ? '#1b2a47' : 'white' }}
                    onClick={() => {
                        setShowForm(!showForm);
                        setFormData({ providerId: '', providerName: '', projectId: '', projectTitle: '', description: '' });
                    }}
                >
                    {showForm ? <><FaTimesCircle /> إلغاء</> : <><FaPlus /> تقديم شكوى جديدة</>}
                </button>
            </div>

            {showForm && (
                <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5 border-end border-4 border-danger">
                    <h4 className="fw-bold text-danger mb-4"><FaExclamationTriangle className="ms-2" /> نموذج تقديم شكوى</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">اسم مزود الخدمة</label>
                                <select className="form-select form-control-custom" required value={formData.providerId} onChange={handleProviderSelect}>
                                    <option value="">اختر مزود الخدمة...</option>
                                    {uniqueProviders.map(provider => (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-bold">المشروع المرتبط</label>
                                {activeProjectsList.filter(p => p.providerId.toString() === formData.providerId).length <= 1 ? (
                                    <input 
                                        type="text" 
                                        className="form-control form-control-custom bg-light" 
                                        placeholder="سيظهر اسم المشروع تلقائياً" 
                                        required 
                                        readOnly 
                                        value={formData.projectTitle} 
                                    />
                                ) : (
                                    <select className="form-select form-control-custom" required value={formData.projectId} onChange={handleProjectSelect}>
                                        <option value="">اختر المشروع...</option>
                                        {activeProjectsList.filter(p => p.providerId.toString() === formData.providerId).map(p => (
                                            <option key={p.id} value={p.id}>{p.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label fw-bold">وصف المشكلة بالتفصيل</label>
                                <textarea className="form-control form-control-custom" rows="5" placeholder="اذكر تفاصيل الشكوى بوضوح..." required
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

            {loadingData ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin fs-1 text-danger" />
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {complaints.length > 0 ? complaints.map(complaint => {
                        // استخراج الأسماء بناءً على العلاقات المرجعة من الباك إند
                        const providerName = complaint.against_user?.name || complaint.against_user?.full_name || 'مزود الخدمة';
                        const projectTitle = complaint.project?.title || 'غير محدد';
                        
                        return (
                        <div key={complaint.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(complaint.status)}`}>
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تذكرة رقم: #{complaint.id + 1000}</h5>
                                {getStatusBadge(complaint.status)}
                            </div>
                            
                            <div className="row mb-4 bg-light p-3 rounded-4 mx-0 border">
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-2">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">الجهة المشتكى عليها</span>
                                        <span className="fw-bold text-dark fs-5">{providerName}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-2 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-secondary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع المرتبط</span>
                                        <span className="fw-bold text-dark fs-5">{projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h6 className="fw-bold text-danger mb-2">وصف المشكلة:</h6>
                                <p className="text-dark fw-semibold fs-5" style={{ lineHeight: '1.8' }}>{complaint.text}</p>
                            </div>

                            {complaint.admin_response ? (
                                <div className="p-4 rounded-4" style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                                    <h6 className="fw-bold text-success mb-2"><FaCheckCircle className="me-1" /> رد إدارة داركم:</h6>
                                    <p className="text-dark fw-semibold mb-0" style={{ lineHeight: '1.8', fontSize: '18px' }}>{complaint.admin_response}</p>
                                </div>
                            ) : (
                                <div className="p-4 rounded-4" style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}>
                                    <p className="text-warning-emphasis fw-bold mb-0 d-flex align-items-center gap-2">
                                        <FaClock size={20} /> جاري مراجعة الشكوى من قبل الإدارة وسيتم الرد قريباً.
                                    </p>
                                </div>
                            )}

                            <div className="text-end mt-4 pt-3 border-top text-muted small fw-bold">
                                تاريخ التقديم: {complaint.created_at ? new Date(complaint.created_at).toLocaleDateString('ar-EG') : 'غير متوفر'}
                            </div>
                        </div>
                    )
                    }) : (
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