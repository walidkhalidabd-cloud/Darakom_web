import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiBell, FiUser, FiHome, FiLogOut } from 'react-icons/fi';
import { getAuthUser, isLoggedIn, clearAuth, getDashboardPath } from '../services/auth';

const MainNavBar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isLogged = isLoggedIn();
    const user = getAuthUser();
    const isActive = (path) => location.pathname === path;

    const handleLogout = () => {
        clearAuth();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand-lg px-4 py-4 shadow-sm" style={{ backgroundColor: 'var(--primary-color)' }}>
            <div className="container-fluid">
                
                {/* 1. الشعار (اللوجو) مكبر */}
                <Link className="navbar-brand text-white fw-bold d-flex align-items-center gap-2" to="/" style={{ fontSize: '45px' }}>
                    <FiHome style={{ color: 'var(--secondary-color)', fontSize: '50px' }} />
                    <span>دار<span style={{ color: 'var(--secondary-color)' }}>كم</span></span>
                </Link>

                <button className="navbar-toggler bg-light" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                {/* 2. روابط التنقل بخط مكبر */}
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto mb-2 mb-lg-0 gap-4 fw-medium" style={{ fontSize: '24px' }}>
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                style={{ color: isActive('/') ? 'var(--secondary-color)' : 'white', transition: '0.3s' }} 
                                to="/">
                                الرئيسية
                            </Link>
                        </li>
                        
                        {/* انتقال ذكي لقسم الخدمات في الصفحة الرئيسية */}
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                style={{ color: 'white', transition: '0.3s', cursor: 'pointer' }} 
                                href="/#services">
                                خدماتنا
                            </a>
                        </li>
                        
                        {/* الصفحة الإرشادية */}
                        <li className="nav-item">
                            <Link 
                                className="nav-link" 
                                style={{ color: isActive('/guidance') ? 'var(--secondary-color)' : 'white', transition: '0.3s' }} 
                                to="/guidance">
                                الصفحة الإرشادية
                            </Link>
                        </li>
                        
                        {/* انتقال ذكي للفوتر (التواصل معنا) */}
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                style={{ color: 'white', transition: '0.3s', cursor: 'pointer' }} 
                                href="#footer">
                                التواصل معنا
                            </a>
                        </li>
                    </ul>

                    {/* 3. الأزرار الجانبية بخط مكبر */}
                    <div className="d-flex align-items-center gap-3">
                        {!isLogged ? (
                            <>
                                <Link to="/login" className="btn text-white fw-bold px-3" style={{ transition: '0.3s', fontSize: '24px' }}>
                                    تسجيل الدخول
                                </Link>
                                
                                <Link to="/register" className="btn fw-bold px-4 py-2 rounded-pill border-0 shadow-sm" style={{ backgroundColor: 'var(--secondary-color)', color: 'white', fontSize: '24px' }}>
                                    إنشاء حساب
                                </Link>
                            </>
) : (
                            <div className="d-flex align-items-center gap-4">
                                <Link to={getDashboardPath(user)} className="btn fw-bold px-3 py-2 rounded-pill border-0 shadow-sm" style={{ backgroundColor: 'var(--secondary-color)', color: 'white', fontSize: '22px' }}>
                                    لوحة التحكم
                                </Link>
                                <FiBell className="text-white" style={{ cursor: 'pointer', fontSize: '35px' }} />
                                <FiUser className="text-white" style={{ cursor: 'pointer', fontSize: '35px' }} />
                                <span className="text-white fw-bold" style={{ fontSize: '22px' }}>{user?.name || ''}</span>
                                <button onClick={handleLogout} className="btn btn-outline-light d-flex align-items-center gap-2 px-3 py-2 rounded-pill" style={{ fontSize: '22px' }}>
                                    <FiLogOut /> خروج
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default MainNavBar;