import { Link } from 'react-router-dom';
import heroBg from '../../assets/hero-bg.jpg';
import Steps from './partials/Steps';
import ServicesSection from './partials/ServicesSection';
// استدعاء قسم التقييمات الجديد
import Testimonials from './partials/Testimonials'; 

const Home = () => {
    return (
        <div>
            {/* القسم الافتتاحي (Hero Section) */}
            <header 
                className="position-relative d-flex align-items-center justify-content-center" 
                style={{ 
                    minHeight: '85vh', 
                    backgroundImage: `url(${heroBg})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            >
                <div 
                    className="position-absolute top-0 start-0 w-100 h-100" 
                    style={{ backgroundColor: 'rgba(26, 42, 68, 0.85)' }}
                ></div>
                
                <div className="container position-relative text-center text-white z-1">
                    <h1 className="fw-bold mb-4" style={{ fontSize: '70px' }}>
                        دار<span style={{ color: 'var(--secondary-color)' }}>كم</span>
                    </h1>
                    <h2 className="mb-4" style={{ fontSize: '45px', fontWeight: '300' }}>
                        خطتك الذكية لبيت أحلامك
                    </h2>
                    <p className="mb-5 mx-auto text-white-50" style={{ fontSize: '26px', maxWidth: '900px', lineHeight: '1.8' }}>
                        وجهتك المتكاملة لإدارة مشاريع البناء والتشطيب. اربط تواصلك بأفضل المهندسين والمقاولين والحرفيين لبناء مستقبلك بثقة واحترافية.
                    </p>
                    <div className="d-flex justify-content-center">
                        <Link 
                            to="/register" 
                            className="btn fw-bold py-3 rounded-pill border-0 shadow-lg" 
                            style={{ 
                                backgroundColor: 'var(--secondary-color)', 
                                color: 'white', 
                                fontSize: '28px', 
                                transition: '0.3s',
                                minWidth: '350px' 
                            }}
                        >
                            ابدأ مشروعك الآن
                        </Link>
                    </div>
                </div>
            </header>

            {/* قسم خطوات العمل */}
            <Steps />

            {/* قسم الخدمات (مكون من 4 بطاقات) */}
            <ServicesSection />

            {/* قسم آراء العملاء */}
            <Testimonials />
            
        </div>
    );
};

export default Home;