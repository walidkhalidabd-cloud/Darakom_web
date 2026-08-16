import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import loginBg from '../assets/login-bg.jpg';
import { forgotPassword, resetPassword } from '../services/api/authApi';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // الخطوة 1: البريد | الخطوة 2: الكود وكلمة المرور
    const [loading, setLoading] = useState(false);
    
    // الداتا المطلوبة للباك إند
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        password: '',
        password_confirmation: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // دالة إرسال الإيميل لطلب الكود
    const handleSendEmail = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await forgotPassword({ email: formData.email });
            toast.success(res.data?.message || 'تم إرسال رمز التحقق إلى بريدك الإلكتروني');
            setStep(2); // الانتقال لخطوة إدخال الكود
        } catch (err) {
            toast.error(err.response?.data?.message || 'تأكد من صحة البريد الإلكتروني');
        } finally {
            setLoading(false);
        }
    };

    // دالة إرسال الكود وكلمة المرور الجديدة
    const handleResetPassword = async (e) => {
        e.preventDefault();
        if(formData.password !== formData.password_confirmation) {
            toast.error("كلمتا المرور غير متطابقتين!");
            return;
        }

        setLoading(true);
        try {
            const res = await resetPassword(formData);
            toast.success(res.data?.message || 'تم تغيير كلمة المرور بنجاح!');
            navigate('/login'); // توجيه لصفحة تسجيل الدخول
        } catch (err) {
            toast.error(err.response?.data?.message || 'الكود غير صحيح أو انتهت صلاحيته');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh', backgroundColor: 'var(--bg-color)' }}>
            <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '1800px', width: '95%', borderRadius: '20px' }}>
                <div className="row g-0 align-items-stretch">
                    
                    {/* النصف الأول: نموذج استعادة كلمة المرور */}
                    <div className="col-lg-6 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        
                        {step === 1 ? (
                            // واجهة الخطوة الأولى: إدخال الإيميل
                            <>
                                <div className="text-center mb-5 mt-4">
                                    <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '45px' }}>هل نسيت كلمة المرور؟ 🔒</h2>
                                    <p className="text-muted fw-semibold mt-3" style={{ fontSize: '24px' }}>أدخل بريدك الإلكتروني المسجل وسنرسل لك رمز التحقق</p>
                                </div>

                                <form onSubmit={handleSendEmail} style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>البريد الإلكتروني</label>
                                            <input 
                                                type="email" 
                                                name="email"
                                                className="form-control p-4 bg-light border" 
                                                style={{ fontSize: '22px', borderRadius: '12px' }} 
                                                placeholder="أدخل بريدك الإلكتروني" 
                                                value={formData.email}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        <div className="col-12 mt-5">
                                            <button type="submit" className="btn w-100 fw-bold shadow-sm" disabled={loading}
                                                style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '15px', transition: '0.3s', fontSize: '30px', padding: '18px' }}>
                                                {loading ? 'جاري الإرسال...' : 'إرسال الرمز'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        ) : (
                            // واجهة الخطوة الثانية: إدخال الكود وكلمة المرور الجديدة
                            <>
                                <div className="text-center mb-4 mt-2">
                                    <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '40px' }}>تعيين كلمة مرور جديدة ✨</h2>
                                    <p className="text-muted fw-semibold mt-2" style={{ fontSize: '20px' }}>
                                        أدخل الكود المرسل إلى <span dir="ltr" className="text-primary">{formData.email}</span>
                                    </p>
                                </div>

                                <form onSubmit={handleResetPassword} style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                                    <div className="row g-4">
                                        <div className="col-12">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '20px' }}>رمز التحقق (OTP)</label>
                                            <input 
                                                type="text" 
                                                name="otp"
                                                className="form-control p-3 bg-light border text-center" 
                                                style={{ fontSize: '24px', borderRadius: '12px', letterSpacing: '5px' }} 
                                                placeholder="123456"
                                                maxLength="6"
                                                value={formData.otp}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        <div className="col-12 mt-3">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '20px' }}>كلمة المرور الجديدة</label>
                                            <input 
                                                type="password" 
                                                name="password"
                                                className="form-control p-3 bg-light border" 
                                                style={{ fontSize: '20px', borderRadius: '12px' }} 
                                                placeholder="أدخل كلمة المرور الجديدة (6 أحرف على الأقل)" 
                                                minLength="6"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        <div className="col-12 mt-3">
                                            <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '20px' }}>تأكيد كلمة المرور</label>
                                            <input 
                                                type="password" 
                                                name="password_confirmation"
                                                className="form-control p-3 bg-light border" 
                                                style={{ fontSize: '20px', borderRadius: '12px' }} 
                                                placeholder="أعد إدخال كلمة المرور" 
                                                minLength="6"
                                                value={formData.password_confirmation}
                                                onChange={handleChange}
                                                required 
                                            />
                                        </div>

                                        <div className="col-12 mt-4">
                                            <button type="submit" className="btn w-100 fw-bold shadow-sm" disabled={loading}
                                                style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '15px', transition: '0.3s', fontSize: '26px', padding: '16px' }}>
                                                {loading ? 'جاري الحفظ...' : 'تغيير كلمة المرور'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </>
                        )}

                        {/* زر العودة للتبديل بين الخطوات أو العودة لتسجيل الدخول */}
                        <div className="col-12 text-center mt-5 mb-4">
                            {step === 2 ? (
                                <button type="button" onClick={() => setStep(1)} className="btn btn-link text-decoration-none fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>
                                    رجوع لتعديل الإيميل
                                </button>
                            ) : (
                                <Link to="/login" className="text-decoration-none fw-bold" style={{ color: 'var(--primary-color)', fontSize: '22px' }}>
                                    العودة لتسجيل الدخول
                                </Link>
                            )}
                        </div>

                    </div>

                    {/* النصف الثاني: الصورة (نفس صفحة الدخول) */}
                    <div className="col-lg-6 d-none d-lg-flex position-relative align-items-center justify-content-center text-center p-5" 
                        style={{ 
                            backgroundImage: `url(${loginBg})`, 
                            backgroundSize: 'cover', 
                            backgroundPosition: 'center' 
                        }}>
                        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ backgroundColor: 'rgba(26, 42, 68, 0.85)' }}></div>
                        <div className="position-relative z-1 text-white px-4">
                            <h1 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '75px' }}>
                                داركم
                            </h1>
                            <p className="fw-semibold" style={{ fontSize: '30px', lineHeight: '1.8' }}>
                                منصتك الموثوقة لإدارة وتطوير مشاريعك الهندسية والمقاولات بكل احترافية.
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ResetPassword;