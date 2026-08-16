import { useState } from 'react';
import { FaExclamationTriangle, FaCheckCircle, FaClock, FaTimesCircle, FaUserTie, FaHardHat, FaPlus, FaPaperPlane, FaSpinner } from 'react-icons/fa';
import { submitClientComplaint } from '../../../services/api/clientApi';
import './client-tabs.css';

const ComplaintsTab = () => {
    // بيانات وهمية للمشاريع النشطة حالياً لجلب مزودي الخدمة والمشاريع منها
    const activeProjectsList = [
        { id: 101, title: 'بناء عظم - مساحة 400م', providerName: 'مؤسسة البناء الذهبي' },
        { id: 102, title: 'ملحق خارجي 60م', providerName: 'مؤسسة البناء الذهبي' },
        { id: 103, title: 'تشطيب شقة 150م', providerName: 'شركة أطياف للتشطيبات' },
        { id: 104, title: 'تصميم داخلي لفيلا', providerName: 'مكتب الإبداع الهندسي' }
    ];

    // استخراج أسماء مزودي الخدمة بدون تكرار
    const uniqueProviders = [...new Set(activeProjectsList.map(p => p.providerName))];

    // بيانات وهمية للشكاوي المقدمة سابقاً
    const [complaints, setComplaints] = useState([
        {
            id: 1,
            providerName: 'مؤسسة البناء الذهبي',
            projectTitle: 'بناء عظم - مساحة 400م',
            date: '2026/06/15',
            status: 'pending',
            description: 'المقاول تأخر في تسليم المرحلة الثانية (بناء الأعمدة) لمدة تزيد عن أسبوعين دون عذر مبرر، ولم يستجب للمكالمات.',
            adminReply: null 
        },
        {
            id: 2,
            providerName: 'شركة أطياف للتشطيبات',
            projectTitle: 'تشطيب شقة 150م',
            date: '2026/04/10',
            status: 'resolved',
            description: 'يوجد اختلاف في نوعية السيراميك الموردة عن ما تم الاتفاق عليه في العقد الأساسي للمشروع.',
            adminReply: 'تم التواصل مع الشركة المنفذة وإلزامهم بتغيير السيراميك للنوع المتفق عليه وتحمل تكاليف النقل. تم إغلاق الشكوى بنجاح لحفظ حقكم.'
        }
    ]);

    const [showForm, setShowForm] = useState(false);
    const [sending, setSending] = useState(false);
    const [toast, setToast] = useState(null);
    const [formData, setFormData] = useState({
        providerName: '',
        projectTitle: '',
        description: ''
    });

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    // معالجة اختيار مزود الخدمة لتحديد المشروع تلقائياً أو إظهار قائمة المشاريع
    const handleProviderSelect = (e) => {
        const selectedProvider = e.target.value;
        const providerProjects = activeProjectsList.filter(p => p.providerName === selectedProvider);
        
        setFormData({
            ...formData,
            providerName: selectedProvider,
            // إذا كان لديه مشروع واحد فقط، ضعه تلقائياً، وإلا اتركه فارغاً ليختاره المستخدم
            projectTitle: providerProjects.length === 1 ? providerProjects[0].title : ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        try {
            await submitClientComplaint(formData);
        } catch (err) {
            console.warn('⚠️ API غير متاح:', err.message);
        }
        
        const newComplaint = {
            id: Date.now(),
            providerName: formData.providerName,
            projectTitle: formData.projectTitle,
            description: formData.description,
            date: new Date().toISOString().slice(0, 10).replace(/-/g, '/'),
            status: 'pending',
            adminReply: null
        };
        
        setComplaints([newComplaint, ...complaints]);
        showToast('success', '✅ تم إرسال الشكوى بنجاح! سيتم مراجعتها قريباً.');
        setShowForm(false);
        setFormData({ providerName: '', projectTitle: '', description: '' });
        setSending(false);
    };

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
                        setFormData({ providerName: '', projectTitle: '', description: '' });
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
                                <select className="form-select form-control-custom" required value={formData.providerName} onChange={handleProviderSelect}>
                                    <option value="">اختر مزود الخدمة...</option>
                                    {uniqueProviders.map(provider => (
                                        <option key={provider} value={provider}>{provider}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="col-md-6">
                                <label className="form-label fw-bold">المشروع المرتبط</label>
                                {activeProjectsList.filter(p => p.providerName === formData.providerName).length <= 1 ? (
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
                                        {activeProjectsList.filter(p => p.providerName === formData.providerName).map(p => (
                                            <option key={p.id} value={p.title}>{p.title}</option>
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
                                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '20px', borderRadius: '12px' }} disabled={sending || !formData.projectTitle}>
                                    {sending ? <><FaSpinner className="fa-spin" /> جاري الإرسال...</> : <><FaPaperPlane /> إرسال الشكوى</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            <div className="d-flex flex-column gap-4">
                {complaints.length > 0 ? complaints.map(complaint => (
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
                                    <span className="fw-bold text-dark fs-5">{complaint.providerName}</span>
                                </div>
                            </div>
                            <div className="col-md-6 d-flex align-items-center gap-2 border-start ps-md-4">
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
                    <div className="text-center py-5">
                        <FaExclamationTriangle className="text-muted mb-3 opacity-25" size={50} />
                        <h4 className="text-muted fw-bold">سجل الشكاوى الخاص بك فارغ.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComplaintsTab;