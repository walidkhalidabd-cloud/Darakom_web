import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserAlt, FaHardHat, FaPlus, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import registerBg from '../assets/register-bg.jpg';
// تأكد من استيراد fetchDocumentTypes
import { register, fetchProvinces, fetchDocumentTypes } from '../services/api/authApi'; 
import { setAuth, getDashboardPath } from '../services/auth';

const Register = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState('client');
    const [specialization, setSpecialization] = useState('');
    
    // قوائم البيانات من الباك إند
    const [provinces, setProvinces] = useState([]);
    const [documentTypesList, setDocumentTypesList] = useState([]); 
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        first_name: '', last_name: '', phone: '', email: '',
        password: '', password_confirmation: '',
        province_id: '', type: 'client',
        role_id: '', work_area: ''
    });

    const [documents, setDocuments] = useState([]);

    // جلب البيانات عند التحميل (المحافظات وأنواع الوثائق)
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                // جلب المحافظات
                const provRes = await fetchProvinces();
                setProvinces(provRes.data?.data || []);
            } catch (err) {
                console.warn('تعذر جلب المحافظات', err.message);
            }

            try {
                // جلب أنواع الوثائق
                const docTypesRes = await fetchDocumentTypes();
                setDocumentTypesList(docTypesRes.data?.data || []);
            } catch (err) {
                console.warn('تعذر جلب أنواع الوثائق', err.message);
            }
        };
        loadInitialData();
    }, []);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRoleSwitch = (type) => {
        setRole(type);
        setFormData(prev => ({ ...prev, type }));
        if (type === 'client') {
            setSpecialization('');
            setDocuments([]);
        }
    };

    const addDocumentRow = () => {
        setDocuments([...documents, { id: Date.now(), type: '', title: '', file: null }]);
    };

    const handleDocChange = (id, field, value) => {
        setDocuments(documents.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    };

    const removeDocumentRow = (id) => {
        setDocuments(documents.filter(doc => doc.id !== id));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const payload = new FormData();
        payload.append('first_name', formData.first_name);
        payload.append('last_name', formData.last_name);
        payload.append('phone', formData.phone);
        payload.append('email', formData.email);
        payload.append('password', formData.password);
        payload.append('password_confirmation', formData.password_confirmation);
        payload.append('province_id', formData.province_id);
        payload.append('type', formData.type);

        if (formData.type === 'provider') {
            payload.append('role_id', formData.role_id);
            payload.append('work_area', formData.work_area);
            
            // إضافة الوثائق مع إرسال الـ ID الخاص بنوع الوثيقة
            documents.forEach((doc, index) => {
                if (doc.file && doc.type) {
                    payload.append(`documents[${index}][file]`, doc.file);
                    payload.append(`documents[${index}][description]`, doc.title || '');
                    payload.append(`documents[${index}][type]`, doc.type); // إرسال الـ ID ليتوافق مع exists:document_types,id
                }
            });
        }

        try {
            const res = await register(payload);
            const data = res.data?.data || {};
            const token = data.token;
            if (token) {
                setAuth(token, data);
                toast.success(res.data?.message || 'تم إنشاء الحساب بنجاح!');
                navigate(getDashboardPath(data));
            } else {
                toast.success(res.data?.message || 'تم إنشاء الحساب بنجاح! بانتظار التفعيل.');
                navigate('/login');
            }
        } catch (err) {
            // التعامل مع أخطاء التحقق القادمة من Laravel
            if (err.response?.status === 422) {
                const errors = err.response.data.errors;
                const firstError = Object.values(errors)[0][0]; // جلب أول خطأ
                toast.error(firstError);
            } else {
                const msg = err.response?.data?.message || 'فشل إنشاء الحساب';
                toast.error(typeof msg === 'string' ? msg : 'فشل إنشاء الحساب، تحقق من البيانات');
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

                        {/* أزرار التبديل */}
                        <div className="d-flex justify-content-center mb-5 gap-3">
                            <button 
                                type="button"
                                className="btn d-flex align-items-center gap-2 px-5 py-3 fw-bold rounded-pill shadow-sm"
                                onClick={() => handleRoleSwitch('client')}
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
                                onClick={() => handleRoleSwitch('provider')}
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
                                    <input type="text" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل اسمك الأول"
                                        value={formData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>الاسم الأخير</label>
                                    <input type="text" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل اسمك الأخير"
                                        value={formData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} required />
                                </div>
                                
                                <div className="col-12">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>رقم الهاتف</label>
                                    <input type="tel" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل رقم هاتفك"
                                        value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} required />
                                </div>

                                <div className="col-12">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>البريد الإلكتروني</label>
                                    <input type="email" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="walid@test.com"
                                        value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                                </div>
                                
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>كلمة المرور</label>
                                    <input type="password" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="********"
                                        value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>تأكيد كلمة المرور</label>
                                    <input type="password" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="********"
                                        value={formData.password_confirmation} onChange={(e) => handleChange('password_confirmation', e.target.value)} required />
                                </div>

                                <div className="col-md-12">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>المحافظة</label>
                                    <select 
                                        className="form-select p-3 bg-light border" 
                                        style={{ fontSize: '20px' }}
                                        value={formData.province_id}
                                        onChange={(e) => handleChange('province_id', e.target.value)}
                                        required
                                    >
                                        <option value="">اختر المحافظة...</option>
                                        {provinces.map((prov) => (
                                            <option key={prov.id} value={prov.id}>{prov.name}</option>
                                        ))}
                                    </select>
                                </div>

                                {role === 'provider' && (
                                    <>
                                        <div className="col-md-6">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>التخصص</label>
                                            <select 
                                                className="form-select p-3 bg-light border" 
                                                style={{ fontSize: '20px' }}
                                                value={specialization} 
                                                onChange={(e) => { setSpecialization(e.target.value); handleChange('work_area', e.target.value); handleChange('role_id', e.target.value); }} 
                                                required
                                            >
                                                <option value="">اختر التخصص...</option>
                                                {/* تأكد من أن هذه الأرقام تتطابق مع معرفات (IDs) الأدوار في جدول roles لديك */}
                                                <option value="1">مكتب هندسي</option>
                                                <option value="2">مهندس مدني</option>
                                                <option value="3">مهندس معماري</option>
                                                <option value="4">مهندس استشاري</option>
                                                <option value="5">مقاول</option>
                                                <option value="6">حرفي</option>
                                            </select>
                                        </div>

                                        {specialization === '6' ? (
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>نوع الحرفة</label>
                                                <select className="form-select p-3 bg-light border" style={{ fontSize: '20px' }} required>
                                                    <option value="">اختر الحرفة...</option>
                                                    <option value="فني كهرباء">فني كهرباء</option>
                                                    <option value="فني سباكة">فني سباكة</option>
                                                    <option value="فني بلاط">فني بلاط</option>
                                                    <option value="فني دهان">فني دهان</option>
                                                    <option value="فني تكييف">فني تكييف</option>
                                                </select>
                                            </div>
                                        ) : specialization !== '' ? (
                                            <div className="col-md-6">
                                                <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>الرقم النقابي / السجل</label>
                                                <input type="text" className="form-control p-3 bg-light border" style={{ fontSize: '20px' }} placeholder="أدخل رقمك النقابي" required />
                                            </div>
                                        ) : null}

                                        {/* قسم الوثائق بعد ربطه بـ DB */}
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
                                                            <option value="">اختر النوع...</option>
                                                            {/* عرض أنواع الوثائق القادمة من الباك إند */}
                                                            {documentTypesList.map(type => (
                                                                <option key={type.id} value={type.id}>{type.name || type.type_name}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold" style={{ fontSize: '18px' }}>عنوان/وصف الملف</label>
                                                        <input 
                                                            type="text" 
                                                            className="form-control p-3 bg-light border" 
                                                            placeholder="وصف مختصر للوثيقة" 
                                                            value={doc.title}
                                                            onChange={(e) => handleDocChange(doc.id, 'title', e.target.value)}
                                                        />
                                                    </div>

                                                    <div className="col-md-4">
                                                        <label className="form-label fw-bold" style={{ fontSize: '18px' }}>اختر الملف</label>
                                                        <input 
                                                            type="file" 
                                                            className="form-control p-3 bg-light border" 
                                                            accept=".pdf,.jpg,.jpeg,.png,.webp"
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

                                <div className="col-12 mt-4">
                                    <div className="form-check d-flex align-items-center">
                                        <input className="form-check-input border-secondary" type="checkbox" id="privacy" style={{ width: '25px', height: '25px', cursor: 'pointer' }} required />
                                        <label className="form-check-label fw-bold text-muted" htmlFor="privacy" style={{ fontSize: '22px', marginRight: '40px', cursor: 'pointer' }}>
                                            أوافق على <span style={{ color: 'var(--secondary-color)' }}>سياسة الخصوصية</span> و <span style={{ color: 'var(--secondary-color)' }}>شروط الاستخدام</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="col-12 mt-4">
                                    <button type="submit" className="btn w-100 fw-bold shadow" disabled={loading}
                                        style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '12px', transition: '0.3s', fontSize: '28px', padding: '15px' }}>
                                        {loading ? 'جاري الإرسال...' : 'إنشاء الحساب'}
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

                    <div className="col-lg-6 d-none d-lg-flex position-relative align-items-center justify-content-center text-center p-5" 
                        style={{ 
                            backgroundImage: `url(${registerBg})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(26, 42, 68, 0.85)' }}></div>
                        <div className="position-relative z-1 text-white">
                            <h1 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '70px' }}>داركم</h1>
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