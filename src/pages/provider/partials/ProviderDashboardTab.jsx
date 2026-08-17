import { 
  FaStar, FaSearchDollar, FaSpinner, FaArrowLeft, 
  FaUserTie, FaCheckCircle, FaGlobe, FaLock, 
  FaFileInvoiceDollar, FaHardHat, FaMapMarkerAlt, 
  FaClock, FaMoneyBillWave 
} from 'react-icons/fa';

const ProviderDashboardTab = ({ setActiveTab }) => {
    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {/* ==================== 1. الترحيب والإحصائيات العلوية ==================== */}
            <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '32px' }}>مرحباً بك، م. أحمد 👋</h3>
                <div className="row g-4">
                    {/* بطاقة المشاريع المنجزة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-success hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مشاريع منجزة</p>
                                <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '36px' }}>24</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle" style={{ fontSize: '30px' }}><FaCheckCircle /></div>
                        </div>
                    </div>

                    {/* بطاقة مشاريع نشطة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مشاريع نشطة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>3</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle" style={{ fontSize: '30px' }}><FaSpinner className="fa-spin" /></div>
                        </div>
                    </div>
                    
                    {/* بطاقة مناقصات جديدة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مناقصات جديدة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>12</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle" style={{ fontSize: '30px' }}><FaSearchDollar /></div>
                        </div>
                    </div>
                    
                    {/* بطاقة التقييم العام */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>التقييم العام</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>4.8</h2>
                            </div>
                            <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle" style={{ fontSize: '30px' }}><FaStar /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== 2. الإجراء السريع (زر تصفح المناقصات) ==================== */}
            <div className="card border-0 shadow-sm rounded-4 p-5 mb-5 text-white text-center d-flex flex-column align-items-center justify-content-center hover-effect" style={{ backgroundColor: '#1b2a47' }}>
                <h3 className="fw-bold mb-4" style={{ fontSize: '32px' }}>هل تبحث عن مشاريع جديدة للعمل عليها؟</h3>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow" 
                    style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '28px', maxWidth: '700px', width: '100%' }} 
                    onClick={() => setActiveTab('tenders')}
                >
                    <FaSearchDollar className="me-2" /> تصفح المناقصات المتاحة
                </button>
            </div>

            {/* ==================== 3. شبكة البطاقات التفاعلية للوصول السريع ==================== */}
            <div className="row g-4 mb-5">
                
                {/* --- بطاقة 1: المناقصات العامة المتاحة --- */}
                <div className="col-lg-6 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '24px' }}><FaGlobe className="text-primary"/> مناقصات عامة متاحة</h4>
                        <button className="btn btn-link text-primary fw-bold text-decoration-none p-0" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tenders')}>سوق المناقصات</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1 bg-white border-end border-4 border-primary hover-effect d-flex flex-column">
                        <h4 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>تشطيب شقة سكنية 150م</h4>
                        <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                            <span className="d-flex align-items-center gap-1"><FaMapMarkerAlt /> دمشق، المزة</span>
                            <span className="d-flex align-items-center gap-1"><FaClock /> ينتهي بعد 3 أيام</span>
                        </div>
                        <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>مطلوب مقاول أو شركة متخصصة لتشطيب شقة سكنية على المفتاح بأفضل المواد وخلال فترة لا تتجاوز 3 أشهر...</p>
                        <button className="btn btn-outline-primary w-100 fw-bold rounded-pill mt-auto py-2 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tenders')}>
                            تصفح المناقصات وتقديم عرض <FaArrowLeft />
                        </button>
                    </div>
                </div>

                {/* --- بطاقة 2: الدعوات الخاصة والطلبات المباشرة --- */}
                <div className="col-lg-6 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '24px' }}><FaLock className="text-warning"/> دعوات خاصة بانتظار ردك</h4>
                        <button className="btn btn-link text-warning fw-bold text-decoration-none p-0" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tenders')}>عرض الدعوات</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1 bg-white border-end border-4 border-warning hover-effect d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>بناء ملحق خارجي 60م</h4>
                            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill border border-warning border-opacity-25" style={{ fontSize: '15px' }}>دعوة حصرية</span>
                        </div>
                        <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                            <span className="d-flex align-items-center gap-1"><FaUserTie /> خالد عبدالله</span>
                            <span className="d-flex align-items-center gap-1"><FaMapMarkerAlt /> حلب</span>
                        </div>
                        <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>تمت دعوتك بشكل مباشر من قبل العميل لتقديم عرض على هذا المشروع بناءً على تقييمك المرتفع.</p>
                        
                        {/* تم تعديل الزر ليصبح مثل بطاقة المناقصات العامة */}
                        <button className="btn btn-outline-warning text-dark w-100 fw-bold rounded-pill mt-auto py-2 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tenders')}>
                            تفاصيل الدعوة وتقديم عرض <FaArrowLeft />
                        </button>
                    </div>
                </div>

                {/* --- بطاقة 3: العروض المقدمة من قبلك --- */}
                <div className="col-lg-6 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '24px' }}><FaFileInvoiceDollar className="text-info"/> أحدث عروضي المقدمة</h4>
                        <button className="btn btn-link text-info fw-bold text-decoration-none p-0" style={{ fontSize: '18px' }} onClick={() => setActiveTab('offers')}>إدارة العروض</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1 bg-white border-end border-4 border-info hover-effect d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                            <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تصميم داخلي لفيلا</h4>
                            <span className="badge bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill" style={{ fontSize: '15px' }}><FaSpinner className="fa-spin ms-1"/> قيد المراجعة</span>
                        </div>
                        <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                            <span className="d-flex align-items-center gap-1"><FaMoneyBillWave className="text-success"/> 45,000 ل.س</span>
                            <span className="d-flex align-items-center gap-1"><FaClock className="text-primary"/> المدة: 30 يوم</span>
                        </div>
                        <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>تم تقديم العرض منذ يومين، العرض حالياً قيد المراجعة بانتظار موافقة العميل للبدء.</p>
                        <button className="btn btn-outline-info w-100 fw-bold rounded-pill mt-auto py-2 text-dark d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '18px' }} onClick={() => setActiveTab('offers')}>
                            متابعة وإدارة عروضي <FaArrowLeft />
                        </button>
                    </div>
                </div>

                {/* --- بطاقة 4: المشاريع قيد التنفيذ --- */}
                <div className="col-lg-6 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '24px' }}><FaHardHat className="text-danger"/> مشاريع قيد التنفيذ</h4>
                        <button className="btn btn-link text-danger fw-bold text-decoration-none p-0" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tracking')}>تحديث الإنجاز</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1 bg-white border-end border-4 border-danger hover-effect d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>تشطيب فيلا مودرن</h4>
                            <span className="fw-bold text-danger fs-4">40%</span>
                        </div>
                        <div className="progress mb-4" style={{ height: '14px', borderRadius: '10px' }}>
                            <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" style={{ width: '40%' }}></div>
                        </div>
                        <p className="text-muted fw-semibold mb-4 bg-light p-3 rounded-3 text-center border" style={{ fontSize: '16px' }}>
                            <FaCheckCircle className="text-success ms-1"/> المرحلة الحالية: الانتهاء من التمديدات
                        </p>
                        <button className="btn btn-danger text-white w-100 fw-bold rounded-pill mt-auto py-2 d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tracking')}>
                            تحديث مراحل المشروع <FaArrowLeft />
                        </button>
                    </div>
                </div>

            </div>
            
            <style>{`
                .hover-effect { transition: transform 0.2s ease, box-shadow 0.2s ease; }
                .hover-effect:hover { transform: translateY(-5px); box-shadow: 0 10px 25px rgba(0,0,0,0.08) !important; }
            `}</style>
        </div>
    );
};

export default ProviderDashboardTab;