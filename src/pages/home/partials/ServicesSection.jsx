import { Link } from 'react-router-dom';

// استدعاء الصور من مجلد الأصول (assets)
import officeImg from '../../../assets/office.jpg';
import archImg from '../../../assets/arch.jpg';
import constImg from '../../../assets/const.jpg';
import tradesImg from '../../../assets/trades.jpg';

const ServicesSection = () => {
    return (
        <section id="services" className="container py-5 mb-5">   
            <h2 className="fw-bold text-center mb-5 display-5" style={{ color: '#1b2a47' }}>الخدمات التي تدعمها المنصة</h2>
            <div className="row g-4 mt-2">
                
                {/* كرت المكاتب الهندسية والشركات */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center pb-4" style={{ transition: 'transform 0.3s' }}>
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', backgroundImage: `url(${officeImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-body mt-2 d-flex flex-column">
                            <h4 className="fw-bold" style={{ color: '#1b2a47' }}>مكاتب هندسية وشركات</h4>
                            <p className="text-muted small fw-semibold px-2 mt-2 mb-4 flex-grow-1" style={{ lineHeight: '1.7' }}>
                                مكاتب وشركات متخصصة تتولى إدارة وتنفيذ مشروعك بالكامل؛ من الفكرة والمخططات الأولية وحتى التسليم النهائي (تسليم مفتاح).
                            </p>
                            <div className="px-3 mt-auto">
                                <Link to="/register" className="btn w-100 fw-bold py-2 shadow-sm" style={{ backgroundColor: '#ff8a00', color: 'white', borderRadius: '8px' }}>اطلب الخدمة</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* كرت المهندسين */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center pb-4" style={{ transition: 'transform 0.3s' }}>
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', backgroundImage: `url(${archImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-body mt-2 d-flex flex-column">
                            <h4 className="fw-bold" style={{ color: '#1b2a47' }}>مهندسون</h4>
                            <p className="text-muted small fw-semibold px-2 mt-2 mb-4 flex-grow-1" style={{ lineHeight: '1.7' }}>
                                نخبة من المهندسين (مدني، معماري، استشاري) لتصميم وتخطيط واعتماد كافة المخططات الهندسية والتنفيذية اللازمة لمشروعك.
                            </p>
                            <div className="px-3 mt-auto">
                                <Link to="/register" className="btn w-100 fw-bold py-2 shadow-sm" style={{ backgroundColor: '#ff8a00', color: 'white', borderRadius: '8px' }}>اطلب الخدمة</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* كرت المقاولين */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center pb-4" style={{ transition: 'transform 0.3s' }}>
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', backgroundImage: `url(${constImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-body mt-2 d-flex flex-column">
                            <h4 className="fw-bold" style={{ color: '#1b2a47' }}>مقاولون</h4>
                            <p className="text-muted small fw-semibold px-2 mt-2 mb-4 flex-grow-1" style={{ lineHeight: '1.7' }}>
                                مقاولون معتمدون وذوو خبرة واسعة لتنفيذ الأعمال الإنشائية (العظم) والتشطيبات بأعلى معايير الجودة، مع الالتزام التام بالجدول الزمني.
                            </p>
                            <div className="px-3 mt-auto">
                                <Link to="/register" className="btn w-100 fw-bold py-2 shadow-sm" style={{ backgroundColor: '#ff8a00', color: 'white', borderRadius: '8px' }}>اطلب الخدمة</Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* كرت الحرفيين */}
                <div className="col-lg-3 col-md-6">
                    <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden text-center pb-4" style={{ transition: 'transform 0.3s' }}>
                        <div style={{ height: '200px', backgroundColor: '#e2e8f0', backgroundImage: `url(${tradesImg})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                        <div className="card-body mt-2 d-flex flex-column">
                            <h4 className="fw-bold" style={{ color: '#1b2a47' }}>حرفيون</h4>
                            <p className="text-muted small fw-semibold px-2 mt-2 mb-4 flex-grow-1" style={{ lineHeight: '1.7' }}>
                                أمهر الحرفيين في مختلف التخصصات (سباكة، كهرباء، جبس بورد، دهانات، وغيرها) لتنفيذ التفاصيل الدقيقة باحترافية عالية.
                            </p>
                            <div className="px-3 mt-auto">
                                <Link to="/register" className="btn w-100 fw-bold py-2 shadow-sm" style={{ backgroundColor: '#ff8a00', color: 'white', borderRadius: '8px' }}>اطلب الخدمة</Link>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default ServicesSection;