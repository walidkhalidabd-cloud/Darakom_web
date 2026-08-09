import { FaHardHat, FaStar, FaSearchDollar, FaSpinner, FaArrowLeft, FaUserTie, FaCheckCircle } from 'react-icons/fa';

const ProviderDashboardTab = ({ setActiveTab }) => {
    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {/* 1. رسالة الترحيب والإحصائيات المهمة */}
            <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '32px' }}>مرحباً بك، م. أحمد 👋</h3>
                <div className="row g-4">
                    
                    {/* بطاقة المشاريع المنجزة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-success">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مشاريع منجزة</p>
                                <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '38px' }}>24</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle" style={{ fontSize: '32px' }}><FaCheckCircle /></div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مشاريع نشطة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>3</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle" style={{ fontSize: '32px' }}><FaSpinner className="fa-spin" /></div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مناقصات جديدة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>12</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle" style={{ fontSize: '32px' }}><FaSearchDollar /></div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>التقييم العام</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>4.8</h2>
                            </div>
                            <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle" style={{ fontSize: '32px' }}><FaStar /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. الإجراء السريع (زر تصفح المناقصات) */}
            <div className="card border-0 shadow-sm rounded-4 p-5 mb-5 text-white text-center d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#1b2a47' }}>
                <h3 className="fw-bold mb-4" style={{ fontSize: '32px' }}>هل تبحث عن مشاريع جديدة للعمل عليها؟</h3>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow" 
                    style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '28px', maxWidth: '700px', width: '100%' }} 
                    onClick={() => setActiveTab('tenders')}
                >
                    <FaSearchDollar className="me-2" /> تصفح المناقصات المتاحة
                </button>
            </div>

            {/* 3. التقسيم الثنائي (الطلبات المباشرة & مشاريع قيد التنفيذ) */}
            <div className="row g-4 mb-5">
                
                {/* عمود: طلبات مباشرة (دعوات خاصة) */}
                <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>طلبات مباشرة بانتظار الرد</h4>
                        <button className="btn btn-link text-warning fw-bold text-decoration-none" style={{ fontSize: '20px' }} onClick={() => setActiveTab('offers')}>عرض الكل</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-end border-4 border-warning">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <div>
                                <h4 className="fw-bold mb-2" style={{ color: '#1b2a47', fontSize: '26px' }}>بناء عظم - مساحة 600م</h4>
                                <span className="text-muted fw-bold" style={{ fontSize: '18px' }}><FaUserTie className="me-2"/> العميل: خالد عبدالله</span>
                            </div>
                            <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold border border-danger border-opacity-25" style={{ fontSize: '16px' }}>دعوة حصرية</span>
                        </div>
                        <p className="text-muted fw-semibold mb-4" style={{ fontSize: '20px', lineHeight: '1.6' }}>لقد تم اختيارك لتقديم عرض على هذا المشروع بناءً على تقييمك الممتاز في مشاريع سابقة...</p>
                        <div className="d-flex gap-3 mt-auto pt-4 border-top">
                            <button className="btn fw-bold py-2 rounded-pill shadow-sm flex-grow-1" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '22px' }} onClick={() => setActiveTab('offers')}>تقديم عرض</button>
                            <button className="btn btn-outline-danger fw-bold py-2 rounded-pill flex-grow-1" style={{ fontSize: '22px' }}>رفض الطلب</button>
                        </div>
                    </div>
                </div>

                {/* عمود: مشاريع قيد التنفيذ */}
                <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>أحدث المشاريع قيد التنفيذ</h4>
                        <button className="btn btn-link text-warning fw-bold text-decoration-none" style={{ fontSize: '20px' }} onClick={() => setActiveTab('tracking')}>عرض الكل</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-end border-4 border-primary">
                        <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>تشطيب فيلا مودرن</h4>
                        <div className="d-flex justify-content-between text-muted fw-semibold mt-3 mb-2" style={{ fontSize: '18px' }}>
                            <span>نسبة إنجازك للمشروع</span>
                            <span className="text-primary fw-bold" style={{ fontSize: '24px' }}>40%</span>
                        </div>
                        <div className="progress mb-4" style={{ height: '16px', borderRadius: '10px' }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: '40%' }}></div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mt-auto pt-4 border-top">
                            <span className="text-muted fw-bold" style={{ fontSize: '18px' }}>المرحلة الحالية: أعمال السباكة</span>
                            <button 
                                className="btn text-white fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                                style={{ backgroundColor: '#1b2a47', fontSize: '18px' }} 
                                onClick={() => setActiveTab('tracking')}
                            >
                                تحديث الإنجاز <FaArrowLeft />
                            </button>
                        </div>
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ProviderDashboardTab;