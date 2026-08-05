import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaSpinner } from 'react-icons/fa';
import { login } from '../services/api/authApi';

// استدعاء الصورة الجانبية الخاصة بتسجيل الدخول
import loginBg from '../assets/login-bg.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const res = await login({ email, password });
            const data = res.data?.data;

            if (data?.token) {
                // حفظ التوكن وبيانات المستخدم في ذاكرة المتصفح
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.id,
                    name: data.name,
                    email: data.email,
                    type: data.type,
                    status: data.status
                }));

                // توجيه المستخدم حسب نوع الحساب
                if (data.type === 'admin') {
                    window.location.href = '/admin/dashboard';
                } else if (data.type === 'provider') {
                    window.location.href = '/provider/dashboard';
                } else {
                    window.location.href = '/client/dashboard';
                }
            } else {
                setError(res.data?.message || 'تعذر تسجيل الدخول');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || 'تعذر الاتصال بالخادم، تأكد من تشغيل السيرفر');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="d-flex align-items-center justify-content-center py-5" style={{ minHeight: '90vh', backgroundColor: 'var(--bg-color)' }}>
            
            <div className="card border-0 shadow-lg overflow-hidden" style={{ maxWidth: '1800px', width: '95%', borderRadius: '20px' }}>
                <div className="row g-0 align-items-stretch">
                    
                    {/* النصف الأول: نموذج تسجيل الدخول */}
                    <div className="col-lg-6 p-4 p-md-5 bg-white d-flex flex-column justify-content-center">
                        
                        <div className="text-center mb-5 mt-4">
                            <h2 className="fw-bold" style={{ color: 'var(--primary-color)', fontSize: '45px' }}>مرحباً بك مجدداً! 👋</h2>
                            <p className="text-muted fw-semibold mt-3" style={{ fontSize: '24px' }}>قم بتسجيل الدخول لمتابعة مشاريعك وعروضك</p>
                        </div>

                        {error && (
                            <div className="alert alert-danger text-center fw-bold rounded-3 mb-4" style={{ fontSize: '18px' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleLogin} style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
                            <div className="row g-4">
                                
                                <div className="col-12">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>البريد الإلكتروني</label>
                                    <input 
                                        type="email" 
                                        className="form-control p-4 bg-light border" 
                                        style={{ fontSize: '22px', borderRadius: '12px' }} 
                                        placeholder="أدخل بريدك الإلكتروني" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required 
                                    />
                                </div>
                                
                                <div className="col-12 mt-4">
                                    <label className="form-label fw-bold" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>كلمة المرور</label>
                                    <input 
                                        type="password" 
                                        className="form-control p-4 bg-light border" 
                                        style={{ fontSize: '22px', borderRadius: '12px' }} 
                                        placeholder="********" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required 
                                    />
                                </div>

                                {/* تذكرني + نسيت كلمة المرور */}
                                <div className="col-12 d-flex justify-content-between align-items-center mt-4">
                                    <div className="form-check d-flex align-items-center">
                                        <input className="form-check-input border-secondary" type="checkbox" id="rememberMe" style={{ width: '25px', height: '25px', cursor: 'pointer' }} />
                                        <label className="form-check-label fw-bold text-muted" htmlFor="rememberMe" style={{ fontSize: '22px', marginRight: '40px', cursor: 'pointer' }}>
                                            تذكرني
                                        </label>
                                    </div>
                                    <Link to="#" className="fw-bold text-decoration-none" style={{ color: 'var(--secondary-color)', fontSize: '22px' }}>
                                        هل نسيت كلمة المرور؟
                                    </Link>
                                </div>

                                <div className="col-12 mt-5">
                                    <button 
                                        type="submit" 
                                        className="btn w-100 fw-bold shadow-sm d-inline-flex align-items-center justify-content-center gap-2" 
                                        style={{ backgroundColor: 'var(--secondary-color)', color: 'white', borderRadius: '15px', transition: '0.3s', fontSize: '30px', padding: '18px' }}
                                        disabled={loading}
                                    >
                                        {loading ? <><FaSpinner className="fa-spin" /> جاري تسجيل الدخول...</> : 'تسجيل الدخول'}
                                    </button>
                                </div>
                                
                                <div className="col-12 text-center mt-5 mb-4">
                                    <span className="text-muted fw-bold" style={{ fontSize: '24px' }}>ليس لديك حساب بعد؟ </span>
                                    <Link to="/register" className="fw-bold text-decoration-none" style={{ color: 'var(--primary-color)', fontSize: '24px' }}>
                                        إنشاء حساب جديد
                                    </Link>
                                </div>

                            </div>
                        </form>
                    </div>

                    {/* النصف الثاني: الصورة */}
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

export default Login;
