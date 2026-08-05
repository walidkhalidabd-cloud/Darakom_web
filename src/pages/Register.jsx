import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserAlt, FaHardHat, FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import { register, fetchProvinces } from '../services/api/authApi';

// استدعاء الصورة الجانبية من مجلد assets
import registerBg from '../assets/register-bg.jpg';

// أدوار مزودي الخدمة (مطابقة للباك)
const ROLES = [
    { id: 1, name: 'مقاول' },
    { id: 2, name: 'مهندس معماري' },
    { id: 3, name: 'مهندس مدني' },
    { id: 4, name: 'مهندس مدني استشاري' },
    { id: 5, name: 'المكاتب الهندسية' },
    { id: 6, name: 'حرفي' },
];

// أنواع الوثائق (مطابقة للباك)
const DOCUMENT_TYPES = [
    { id: 1, name: 'image', label: 'صورة (JPG, PNG)' },
    { id: 2, name: 'pdf', label: 'مستند (PDF)' },
];

const Register = () => {
    const [role, setRole] = useState('client');
    const [provinces, setProvinces] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // حالة النموذج
    const [form, setForm] = useState({
        first_name: '', last_name: '', email: '', password: '', password_confirmation: '',
        province_id: '', experience_start: '', role_id: '', work_area: ''
    });

    // جلب المحافظات عند تشغيل الصفحة
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const res = await fetchProvinces();
                setProvinces(res.data?.data || []);
            } catch (err) {
                console.warn('تعذر جلب المحافظات:', err.message);
                // بيانات احتياطية
                setProvinces([
                    { id: 1, name: 'دمشق' }, { id: 2, name: 'حلب' }, { id: 3, name: 'ريف دمشق' },
                    { id: 4, name: 'درعا' }, { id: 5, name: 'السويداء' }, { id: 6, name: 'القنيطرة' },
                    { id: 7, name: 'اللاذقية' }, { id: 8, name: 'طرطوس' }, { id: 9, name: 'إدلب' },
                    { id: 10, name: 'حماة' }, { id: 11, name: 'الحسكة' }, { id: 12, name: 'الرقة' },
                    { id: 13, name: 'ديرالزور' }, { id: 14, name: 'حمص' },
                ]);
            }
        };
        loadProvinces();
    }, []);

    // دالة لإضافة مستطيل وثيقة جديد
    const addDocumentRow = () => {
        setDocuments([...documents, { id: Date.now(), type: '', title: '', file: null }]);
    };

    // دالة لتحديث بيانات مستطيل معين عند الكتابة أو الاختيار
    const handleDocChange = (id, field, value) => {
        setDocuments(documents.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    };

    // دالة لحذف مستطيل وثيقة
    const removeDocumentRow = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const handleChange = (field, value) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();
        formData.append('first_name', form.first_name);
        formData.append('last_name', form.last_name);
        formData.append('email', form.email);
        formData.append('password', form.password);
        formData.append('password_confirmation', form.password_confirmation);
        formData.append('province_id', form.province_id);
        formData.append('type', role);

        if (role === 'provider') {
            formData.append('experience_start', form.experience_start);
            formData.append('role_id', form.role_id);
            formData.append('work_area', form.work_area);

            // رفع الوثائق
            documents.forEach((doc, index) => {
                if (doc.file) {
                    formData.append(`documents[${index}][file]`, doc.file);
                    formData.append(`documents[${index}][type]`, doc.type);
                    formData.append(`documents[${index}][description]`, doc.title);
                }
            });
        }

        try {
            const res = await register(formData);
            const data = res.data?.data;

            if (data?.token) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    name: data.name,
                    type: data.type,
                }));
                setSuccess(res.data?.message || 'تم إنشاء الحساب بنجاح!');

                // توجيه المستخدم حسب نوع الحساب
                setTimeout(() => {
                    window.location.href = data.type === 'provider' ? '/provider/dashboard' : '/client/dashboard';
                }, 1500);
            } else {
                setError(res.data?.message || 'تعذر إنشاء الحساب');
            }
        } catch (err) {
            console.error('Register error:', err);
            const backendErrors = err.response?.data?.errors;
            if (backendErrors) {
                // جمع الأخطاء من الباك
                const errorMessages = Object.values(backendErrors).flat().join(' - ');
                setError(errorMessages || err.response?.data?.message);
            } else {
                setError(err.response?.data?.message || 'تعذر الاتصال بالخادم، تأكد من تشغيل السيرفر');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh', backgroundColor: 'var(--bg-color)' }}>
            
            <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '1800px', width: '95%', borderRadius: '20px' }}>
                <div className="row g-0 align-items-stretch">
                    
                    {/* النصف الأول: نموذج التسجيل */}
                    <div className="col-lg-6 p-4 p-md-5 bg-white">
                        <div className="text-center mb-5">
                            <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '40px' }}>إنشاء حساب جديد</h2>
                            <p className="text-muted fw-semibold" style={{ fontSize: '22px' }}>انضم إلى منصة داركم وابدأ رحلتك معنا</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger text-center fw-bold rounded-3 mb-4" style={{ fontSize: '16px' }}>
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="alert alert-success text-center fw-bold rounded-3 mb-4" style={{ fontSize: '18px' }}>
                                {success}
                            </div>
                        )}

                        {/* أزرار التبديل */}
                        <div className="d-flex justify-content-center mb-5 gap-3">
                            <button 
                                type="button"
                                className="btn d-flex align-items-center gap-2 px-5 py-3 fw-bold rounded-pill shadow-sm"
                                onClick={() => setRole('client')}
                                style={{
                                    backgroundColor: role === 'client' ? 'var(--secondary-color)' : '#e2e8f0',
                                    color: role === 'client' ? 'white' : 'var(--primary-color)',
                                    border: 'none', transition: '0.3s', fontSize: '24px'
                                }}
                            >
                                <FaUserAlt /> عميل
                            </button>
                            <button 
                                type="button"
                                className="btn d-flex align-items-center gap-2 px-5 py-3 fw-bold rounded-pill shadow-sm"
                                onClick={() => { setRole('provider'); setDocuments([]); }}
                                style={{
                                    backgroundColor: role === 'provider' ? 'var(--secondary-color)' : '#e2e8f0',
                                    color: role === 'provider' ? 'white' : 'var(--primary-color)',
                                    border: 'none', transition: '0.3s', fontSize: '24px'
                                }}
                            >
                                <FaHardHat /> مزود خدمة
                            </button>
                        </div>

                        <form onSubmit={handleRegister}>
                            <div className="row g-4">
                                
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>الاسم الأول</label>
                                    <input type="text" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل اسمك الأول" required value={form.first_name} onChange={(e) => handleChange('first_name', e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>الاسم الأخير</label>
                                    <input type="text" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل اسمك الأخير" required value={form.last_name} onChange={(e) => handleChange('last_name', e.target.value)} />
                                </div>
                                
                                <div className="col-12">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>البريد الإلكتروني</label>
                                    <input type="email" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="walid@test.com" required value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>كلمة المرور</label>
                                    <input type="password" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="********" required minLength={6} value={form.password} onChange={(e) => handleChange('password', e.target.value)} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>تأكيد كلمة المرور</label>
                                    <input type="password" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="********" required value={form.password_confirmation} onChange={(e) => handleChange('password_confirmation', e.target.value)} />
                                </div>

                                {/* حقل المحافظة */}
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>المحافظة</label>
                                    <select 
                                        className="form-select p-3 bg-light border" 
                                        style={{ fontSize: '20px' }}
                                        value={form.province_id}
                                        onChange={(e) => handleChange('province_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر المحافظة...</option>
                                        {provinces.map((gov) => (
                                            <option key={gov.id} value={gov.id}>{gov.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* الحقول الخاصة بمزود الخدمة */}
                                {role === 'provider' && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>التخصص</label>
                                            <select 
                                                className="form-select p-3 bg-light border" 
                                                style={{ fontSize: '20px' }}
                                                value={form.role_id} 
                                                onChange={(e) => handleChange('role_id', e.target.value)} 
                                                required
                                            >
                                                <option value="">اختر التخصص...</option>
                                                {ROLES.map((r) => (
                                                    <option key={r.id} value={r.id}>{r.name}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>سنة بداية الخبرة</label>
                                            <input 
                                                type="date" 
                                                className="form-control p-3 bg-light border" 
                                                style={{ fontSize: '20px' }} 
                                                value={form.experience_start}
                                                onChange={(e) => handleChange('experience_start', e.target.value)}
                                                required 
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>منطقة العمل</label>
                                            <input 
                                                type="text" 
                                                className="form-control p-3 bg-light border" 
                                                style={{ fontSize: '20px' }} 
                                                placeholder="مثال: دمشق" 
                                                value={form.work_area}
                                                onChange={(e) => handleChange('work_area', e.target.value)}
                                                required 
                                            />
                                        </div>

                                        {/* قسم رفع الوثائق الديناميكي */}
                                        <div className="col-12 mt-4">
                                            <div className="d-flex align-items-center justify-content-between p-3 rounded" style={{ backgroundColor: '#f8f9fa', border: '1px solid #dee2e6' }}>
                                                <span className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>رفع الوثائق والمرفقات</span>
                                                <button 
                                                    type="button" 
                                                    className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill" 
                                                    style={{ backgroundColor: 'var(--secondary-color)', color: 'white', fontSize: '20px' }}
                                                    onClick={addDocumentRow}
                                                >
                                                    <FaPlus /> إضافة ملف
                                                </button>
                                            </div>

                                            {documents.map((doc) => (
                                                <div key={doc.id} className="row g-3 p-3 mt-3 rounded align-items-end" style={{ border: '2px dashed #cbd5e1', backgroundColor: '#ffffff' }}>
                                                    
                                                    <div className="col-md-3">
                                                        <label className="form-label fw-bold" style={{ fontSize: '18px' }}>نوع الملف</label>
                                                        <select 
                                                            className="form-select p-3 bg-light border" 
                                                            value={doc.type} 
                                                            onChange={(e) => handleDocChange(doc.id, 'type', e.target.value)}
                                                            required
                                                        >
                                                            <option value="">اختر...</option>
                                                            {DOCUMENT_TYPES.map((dt) => (
                                                                <option key={dt.id} value={dt.id}>{dt.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold" style={{ fontSize: '18px' }}>عنوان الملف</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control p-3 bg-light border" 
                                                            placeholder="مثال: صورة الهوية" 
                                                            value={doc.title}
                                                            onChange={(e) => handleDocChange(doc.id, 'title', e.target.value)}
                                                            required 
                                                        />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold" style={{ fontSize: '18px' }}>اختر الملف</label>
                                                        <input 
                                                            type="file" 
                                                            className="form-control p-3 bg-light border" 
                                                            accept={doc.type === '1' ? 'image/png, image/jpeg, image/jpg' : doc.type === '2' ? '.pdf' : ''}
                                                            disabled={!doc.type}
                                                            onChange={(e) => handleDocChange(doc.id, 'file', e.target.files[0])}
                                                            required 
                                                        />
                                                    </div>

                                                    <div className="col-md-1 text-center">
                                                        <button 
                                                            type="button" 
                                                            className="btn btn-outline-danger p-3 w-100 rounded" 
                                                            onClick={() => removeDocumentRow(doc.id)}
                                                        >
                                                            <FaTrash size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {/* سياسة الخصوصية */}
                                <div className="col-12 mt-4">
                                    <div className="form-check d-flex align-items-center">
                                        <input className="form-check-input border-secondary" type="checkbox" id="privacy" style={{ width: '25px', height: '25px', cursor: 'pointer' }} required />
                                        <label className="form-check-label fw-bold text-muted" htmlFor="privacy" style={{ fontSize: '22px', marginRight: '40px', cursor: 'pointer' }}>
                                            أوافق على <span style={{ color: 'var(--secondary-color)' }}>سياسة الخصوصية</span> و <span style={{ color: 'var(--secondary-color)' }}>شروط الاستخدام</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" className="btn w-100 fw-bold shadow d-inline-flex align-items-center justify-content-center gap-2" style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '12px', transition: '0.3s', fontSize: '28px', padding: '15px' }} disabled={loading}>
                                        {loading ? <><FaSpinner className="fa-spin" /> جاري إنشاء الحساب...</> : 'إنشاء الحساب'}
                                    </button>
                                </div>
                                
                                <div className="col-12 text-center mt-4">
                                    <span className="text-muted fw-bold" style={{ fontSize: '22px' }}>لديك حساب بالفعل؟ </span>
                                    <Link to="/login" className="fw-bold text-decoration-none" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>
                                        تسجيل الدخول
                                    </Link>
                                </div>

                            </div>
                        </form>
                    </div>

                    {/* النصف الثاني: الصورة (على اليسار) */}
                    <div className="col-lg-6 d-none d-lg-flex position-relative align-items-center justify-content-center text-center p-5" 
                        style={{ 
                            backgroundImage: `url(${registerBg})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}>
                        
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(26, 42, 68, 0.85)' }}></div>
                        
                        <div className="position-relative z-1 text-white">
                            <h1 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '70px' }}>
                                داركم
                            </h1>
                            <p className="fw-semibold" style={{ fontSize: '28px', lineHeight: '1.8' }}>
                                ابدأ رحلتك معنا، وكن جزءاً من المنصة الأذكى لقطاع الهندسة والمقاولات.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Register;
