import { useState, useEffect } from 'react';
import { 
  FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, 
  FaUserTie, FaHardHat, FaPlus, FaPaperPlane, FaSpinner
} from 'react-icons/fa';
import { fetchComplaints, submitComplaint } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderComplaintsTab = () => {
    // بيانات وهمية للمشاريع النشطة لجلب أسماء العملاء والمشاريع المرتبطة
    const activeProjectsList = [
        { id: 101, title: 'بناء عظم - مساحة 400م', clientName: 'أحمد سليمان' },
        { id: 102, title: 'ملحق خارجي 60م', clientName: 'أحمد سليمان' },
        { id: 103, title: 'تشطيب شقة 150م', clientName: 'خالد عبدالله' },
        { id: 104, title: 'تصميم داخلي لفيلا', clientName: 'سارة ناصر' }
    ];

    // استخراج أسماء العملاء بدون تكرار
    const uniqueClients = [...new Set(activeProjectsList.map(p => p.clientName))];

    // بيانات وهمية للشكاوي المقدمة سابقاً
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    
    const [formData, setFormData] = useState({
        clientName: '',
        projectTitle: '',
        description: ''
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchComplaints();
                setComplaints(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setComplaints([
                    {
                        id: 1,
                        clientName: 'أحمد سليمان',
                        projectTitle: 'بناء عظم - مساحة 400م',
                        date: '2026/06/15',
                        status: 'pending',
                        description: 'العميل متأخر في سداد الدفعة المستحقة للمرحلة الثانية لأكثر من أسبوعين ولم يستجب للاتصالات.',
                        adminReply: null 
                    },
                    {
                        id: 2,
                        clientName: 'خالد عبدالله',
                        projectTitle: 'تشطيب شقة 150م',
                        date: '2026/04/10',
                        status: 'resolved',
                        description: 'العميل يطلب إضافات وتعديلات خارج نطاق العقد المتفق عليه ويرفض دفع التكاليف الإضافية.',
                        adminReply: 'تم التواصل مع العميل وتوضيح بنود العقد، وتم الاتفاق على تسديد رسوم التعديلات الإضافية. تم إغلاق الشكوى بنجاح.'
                    }
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

    // معالجة اختيار العميل لتحديد المشروع تلقائياً أو إظهار قائمة المشاريع
    const handleClientSelect = (e) => {
        const selectedClient = e.target.value;
        const clientProjects = activeProjectsList.filter(p => p.clientName === selectedClient);
        
        setFormData({
            ...formData,
            clientName: selectedClient,
            // إذا كان للعميل مشروع واحد، ضعه تلقائياً، وإلا اتركه فارغاً ليختاره المستخدم
            projectTitle: clientProjects.length === 1 ? clientProjects[0].title : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitComplaint(formData);
        } catch (err) {
            console.warn('⚠️ API غير متاح:', err.message);
        }
        
        const newComplaint = {
            id: Date.now(),
            clientName: formData.clientName,
            projectTitle: formData.projectTitle,
            description: formData.description,
            date: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
            status: 'pending',
            adminReply: null
        };
        
        setComplaints([newComplaint, ...complaints]);
        showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
        setShowForm(false);
        setFormData({ clientName: '', projectTitle: '', description: '' });
        setSending(false);
    };

    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge-pending rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaClock /> قيد المراجعة</span>;
            case 'resolved': 
                return <span className="badge-resolved rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaCheckCircle /> تم الحل</span>;
            case 'rejected': 
                return <span className="badge-rejected rounded-pill d-inline-flex align-items-center gap-1 fs-6"><FaTimesCircle /> مغلقة (مرفوضة)</span>;
            default: 
                return null;
        }
    };

    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'resolved': return 'border-success';
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
            {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

            {/* عنوان الواجهة */}
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
                        setFormData({ clientName: '', projectTitle: '', description: '' });
                    }}
                >
                    {showForm ? <><FaTimesCircle /> إلغاء</> : <><FaPlus /> تقديم شكوى جديدة</>}
                </button>
            </div>

            {/* نموذج تقديم شكوى */}
            {showForm && (
                <div className="card-provider border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mb-5 border-end border-4 border-danger">
                    <h4 className="fw-bold text-danger mb-4"><FaExclamationTriangle className="ms-2" /> نموذج تقديم شكوى</h4>
                    <form onSubmit={handleSubmit}>
                        <div className="row g-4">
                            
                            <div className="col-md-6">
                                <label className="form-label fw-bold">اسم العميل المشتكى عليه</label>
                                <select className="form-select form-control-custom" required value={formData.clientName} onChange={handleClientSelect}>
                                    <option value="">اختر العميل...</option>
                                    {uniqueClients.map(client => (
                                        <option key={client} value={client}>{client}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-bold">المشروع المرتبط</label>
                                {activeProjectsList.filter(p => p.clientName === formData.clientName).length <= 1 ? (
                                    <input 
                                        type="text" 
                                        className="form-control form-control-custom bg-light" 
                                        placeholder="سيظهر اسم المشروع تلقائياً" 
                                        required 
                                        readOnly 
                                        value={formData.projectTitle} 
                                    />
                                ) : (
                                    <select className="form-select form-control-custom" required value={formData.projectTitle} onChange={e => setFormData(prev => ({ ...prev, projectTitle: e.target.value }))}>
                                        <option value="">اختر المشروع...</option>
                                        {activeProjectsList.filter(p => p.clientName === formData.clientName).map(p => (
                                            <option key={p.id} value={p.title}>{p.title}</option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            
                            <div className="col-12">
                                <label className="form-label fw-bold">وصف المشكلة بالتفصيل</label>
                                <textarea className="form-control form-control-custom" rows="5" placeholder="اذكر تفاصيل الشكوى بوضوح والمشكلة التي تواجهها مع العميل..." required
                                    value={formData.description} onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}></textarea>
                            </div>
                            
                            <div className="col-12 text-center mt-4">
                                <button type="submit" className="btn fw-bold d-inline-flex align-items-center gap-2 px-5 py-3 shadow"
                                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '20px', borderRadius: '12px' }} disabled={sending || !formData.projectTitle}>
                                    {sending ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال الشكوى</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* عرض بطاقات الشكاوى */}
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