import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiHome, FiMail, FiPhone } from 'react-icons/fi';

const Footer = () => {
    return (
        <footer id="footer" className="pt-5 pb-3 mt-auto" style={{ backgroundColor: 'var(--primary-color)', color: 'white' }}>
            <div className="container">
                <div className="row gy-4">
                    
                    {/* القسم الأول: الشعار ونبذة عن المنصة */}
                    <div className="col-lg-4 col-md-6">
                        <div className="d-flex align-items-center gap-2 mb-3">
                            <FiHome style={{ color: 'var(--secondary-color)', fontSize: '50px' }} />
                            <span className="fw-bold" style={{ fontSize: '45px' }}>دار<span style={{ color: 'var(--secondary-color)' }}>كم</span></span>
                        </div>
                        <p className="text-white-50 pe-lg-4" style={{ lineHeight: '1.8', fontSize: '22px' }}>
                            منصة "داركم" هي وجهتك الأولى والمتكاملة لإدارة مشاريع البناء والتشطيب. نربطك بأفضل المهندسين، المقاولين، والحرفيين لضمان تنفيذ خطتك الذكية لبيت أحلامك بكل احترافية وموثوقية.
                        </p>
                    </div>

                    {/* القسم الثاني: روابط سريعة */}
                    <div className="col-lg-2 col-md-6">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '26px' }}>روابط سريعة</h4>
                        <ul className="list-unstyled d-flex flex-column gap-3" style={{ fontSize: '22px' }}>
                            <li><Link to="/" className="text-white-50 text-decoration-none">الرئيسية</Link></li>
                            <li><Link to="/services" className="text-white-50 text-decoration-none">خدماتنا</Link></li>
                            <li><Link to="/guidance" className="text-white-50 text-decoration-none">الصفحة الإرشادية</Link></li>
                            <li><Link to="/contact" className="text-white-50 text-decoration-none">تواصل معنا</Link></li>
                        </ul>
                    </div>

                    {/* القسم الثالث: معلومات التواصل */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '26px' }}>تواصل معنا</h4>
                        <ul className="list-unstyled d-flex flex-column gap-3 text-white-50" style={{ fontSize: '22px' }}>
                            <li className="d-flex align-items-center gap-3">
                                <FiMail style={{ color: 'var(--secondary-color)', fontSize: '28px' }} />
                                <span>info@darakom.com</span>
                            </li>
                            <li className="d-flex align-items-center gap-3">
                                <FiPhone style={{ color: 'var(--secondary-color)', fontSize: '28px' }} />
                                <span>+963 999 999 999</span>
                            </li>
                        </ul>
                    </div>

                    {/* القسم الرابع: وسائل التواصل الاجتماعي */}
                    <div className="col-lg-3 col-md-6">
                        <h4 className="fw-bold mb-4" style={{ color: 'var(--secondary-color)', fontSize: '26px' }}>تابعنا على</h4>
                        <div className="d-flex gap-3">
                            <a href="#" className="text-white" style={{ fontSize: '32px' }}><FiFacebook /></a>
                            <a href="#" className="text-white" style={{ fontSize: '32px' }}><FiTwitter /></a>
                            <a href="#" className="text-white" style={{ fontSize: '32px' }}><FiInstagram /></a>
                            <a href="#" className="text-white" style={{ fontSize: '32px' }}><FiLinkedin /></a>
                        </div>
                    </div>
                </div>

                {/* حقوق النشر */}
                <hr className="mt-5 mb-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
                <div className="text-center text-white-50" style={{ fontSize: '21px' }}>
                    <p className="mb-0">جميع الحقوق محفوظة © 2026 منصة داركم</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;