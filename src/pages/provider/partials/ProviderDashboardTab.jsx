import { useState, useEffect } from 'react';
import { 
  FaStar, FaSearchDollar, FaSpinner, FaArrowLeft, 
  FaUserTie, FaCheckCircle, FaGlobe, FaLock, 
  FaFileInvoiceDollar, FaHardHat, FaMapMarkerAlt, 
  FaClock, FaMoneyBillWave 
} from 'react-icons/fa';
import { fetchProviderDashboard, fetchProfile, fetchPublicTenders, fetchMyOffers } from '../../../services/api/providerApi';

const ProviderDashboardTab = ({ setActiveTab }) => {
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [stats, setStats] = useState({ completed_projects: 0, active_projects: 0, new_tenders: 0, average_rating: 0 });
    
    // حالات البطاقات السريعة
    const [latestPublicTender, setLatestPublicTender] = useState(null);
    const [latestPrivateInvite, setLatestPrivateInvite] = useState(null);
    const [latestOffer, setLatestOffer] = useState(null);
    const [latestActiveProject, setLatestActiveProject] = useState(null);

    useEffect(() => {
        const loadDashboardData = async () => {
            setLoading(true);
            try {
                // جلب كافة بيانات لوحة التحكم دفعة واحدة
                const [profileRes, dashRes, publicRes, offersRes] = await Promise.all([
                    fetchProfile().catch(() => ({ data: { data: {} } })),
                    fetchProviderDashboard().catch(() => ({ data: { data: {} } })),
                    fetchPublicTenders().catch(() => ({ data: { data: [] } })),
                    fetchMyOffers().catch(() => ({ data: { data: [] } }))
                ]);

                // 1. استخراج الاسم
                const profileData = profileRes.data?.data || profileRes.data || {};
                setName(profileData.first_name || 'مزود الخدمة');

                // 2. استخراج الإحصائيات والدعوات والمشاريع النشطة
                const dashData = dashRes.data?.data || {};
                if (dashData.statistics) setStats(dashData.statistics);
                if (dashData.private_invitations?.length > 0) setLatestPrivateInvite(dashData.private_invitations[0]);
                if (dashData.projects_in_progress?.length > 0) setLatestActiveProject(dashData.projects_in_progress[0]);

                // 3. استخراج أحدث مناقصة عامة
                const publicTenders = publicRes.data?.data || [];
                if (publicTenders.length > 0) setLatestPublicTender(publicTenders[0]);

                // 4. استخراج أحدث عرض
                const offersData = offersRes.data?.data || [];
                if (offersData.length > 0) setLatestOffer(offersData[0]);

            } catch (error) {
                console.error("خطأ في جلب بيانات لوحة التحكم:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto text-center py-5" style={{ maxWidth: '1400px' }}>
                <FaSpinner className="fa-spin text-warning mb-3" size={50} />
                <h4 className="fw-bold text-muted">جاري تحميل لوحة التحكم...</h4>
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {/* ==================== 1. الترحيب والإحصائيات العلوية ==================== */}
            <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '32px' }}>مرحباً بك، {name} 👋</h3>
                <div className="row g-4">
                    {/* بطاقة المشاريع المنجزة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-success hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مشاريع منجزة</p>
                                <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '36px' }}>{stats.completed_projects || 0}</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle" style={{ fontSize: '30px' }}><FaCheckCircle /></div>
                        </div>
                    </div>

                    {/* بطاقة مشاريع نشطة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مشاريع نشطة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>{stats.active_projects || 0}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle" style={{ fontSize: '30px' }}><FaSpinner className="fa-spin" /></div>
                        </div>
                    </div>
                    
                    {/* بطاقة مناقصات جديدة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>دعوات جديدة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>{stats.new_tenders || 0}</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle" style={{ fontSize: '30px' }}><FaSearchDollar /></div>
                        </div>
                    </div>
                    
                    {/* بطاقة التقييم العام */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 hover-effect">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>التقييم العام</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '36px' }}>{stats.average_rating || '0.0'}</h2>
                            </div>
                            <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle" style={{ fontSize: '30px' }}><FaStar /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ==================== 2. الإجراء السريع ==================== */}
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
                        {latestPublicTender ? (
                            <>
                                <h4 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>{latestPublicTender.title}</h4>
                                <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                                    <span className="d-flex align-items-center gap-1"><FaMapMarkerAlt /> {latestPublicTender.location_details || latestPublicTender.province?.name || 'غير محدد'}</span>
                                    <span className="d-flex align-items-center gap-1"><FaClock /> {latestPublicTender.tender_duration ? `ينتهي بعد ${latestPublicTender.tender_duration} ${latestPublicTender.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : 'غير محدد'}</span>
                                </div>
                                <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                                    {(latestPublicTender.description || 'لا يوجد وصف للمناقصة.').substring(0, 90)}...
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-4 my-auto">
                                <p className="text-muted fw-bold fs-5 mb-0">لا توجد مناقصات عامة جديدة في الوقت الحالي.</p>
                            </div>
                        )}
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
                        {latestPrivateInvite ? (
                            <>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{latestPrivateInvite.project?.title || 'مشروع بدون عنوان'}</h4>
                                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill border border-warning border-opacity-25" style={{ fontSize: '15px' }}>دعوة حصرية</span>
                                </div>
                                <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                                    <span className="d-flex align-items-center gap-1"><FaUserTie /> {latestPrivateInvite.project?.client?.first_name ? `${latestPrivateInvite.project.client.first_name} ${latestPrivateInvite.project.client.last_name || ''}` : (latestPrivateInvite.project?.client?.name || 'عميل')}</span>
                                    <span className="d-flex align-items-center gap-1"><FaMapMarkerAlt /> {latestPrivateInvite.project?.province?.name || 'غير محدد'}</span>
                                </div>
                                <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>تمت دعوتك بشكل مباشر من قبل العميل لتقديم عرض على هذا المشروع بناءً على تقييمك المرتفع.</p>
                            </>
                        ) : (
                            <div className="text-center py-4 my-auto">
                                <p className="text-muted fw-bold fs-5 mb-0">لا توجد دعوات خاصة بانتظار ردك حالياً.</p>
                            </div>
                        )}
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
                        {latestOffer ? (
                            <>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                    <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{latestOffer.project?.title || 'مشروع غير محدد'}</h4>
                                    <span className="badge bg-info bg-opacity-10 text-info px-3 py-1 rounded-pill" style={{ fontSize: '15px' }}>
                                        {latestOffer.status === 'accepted' ? 'مقبول' : (latestOffer.status === 'rejected' ? 'مرفوض' : <><FaSpinner className="fa-spin ms-1"/> قيد المراجعة</>)}
                                    </span>
                                </div>
                                <div className="text-muted fw-semibold mb-3 d-flex flex-wrap gap-3" style={{ fontSize: '16px' }}>
                                    <span className="d-flex align-items-center gap-1"><FaMoneyBillWave className="text-success"/> {latestOffer.cost} ل.س</span>
                                    <span className="d-flex align-items-center gap-1"><FaClock className="text-primary"/> المدة: {latestOffer.duration} {latestOffer.duration_unit === 'day' ? 'يوم' : (latestOffer.duration_unit === 'month' ? 'شهر' : 'سنة')}</span>
                                </div>
                                <p className="text-muted fw-semibold mb-4" style={{ fontSize: '18px', lineHeight: '1.6' }}>
                                    تم تقديم العرض بتاريخ {new Date(latestOffer.created_at).toLocaleDateString('ar-EG')}. يمكنك متابعته من خلال صفحة العروض.
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-4 my-auto">
                                <p className="text-muted fw-bold fs-5 mb-0">لم تقم بتقديم أي عروض حتى الآن.</p>
                            </div>
                        )}
                        <button className="btn btn-outline-info w-100 fw-bold rounded-pill mt-auto py-2 text-dark d-flex align-items-center justify-content-center gap-2" style={{ fontSize: '18px' }} onClick={() => setActiveTab('offers')}>
                            متابعة وإدارة عروضي <FaArrowLeft />
                        </button>
                    </div>
                </div>

                {/* --- بطاقة 4: المشاريع قيد التنفيذ --- */}
                <div className="col-lg-6 d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark d-flex align-items-center gap-2" style={{ fontSize: '24px' }}><FaHardHat className="text-danger"/> أحدث مشاريعك قيد التنفيذ</h4>
                        <button className="btn btn-link text-danger fw-bold text-decoration-none p-0" style={{ fontSize: '18px' }} onClick={() => setActiveTab('tracking')}>تحديث الإنجاز</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 flex-grow-1 bg-white border-end border-4 border-danger hover-effect d-flex flex-column">
                        {latestActiveProject ? (
                            <>
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{latestActiveProject.title}</h4>
                                    <span className="fw-bold text-danger fs-4">{latestActiveProject.progress_percentage || 0}%</span>
                                </div>
                                <div className="progress mb-4" style={{ height: '14px', borderRadius: '10px' }}>
                                    <div className="progress-bar bg-danger progress-bar-striped progress-bar-animated" style={{ width: `${latestActiveProject.progress_percentage || 0}%` }}></div>
                                </div>
                                <p className="text-muted fw-semibold mb-4 bg-light p-3 rounded-3 text-center border" style={{ fontSize: '16px' }}>
                                    <FaCheckCircle className="text-success ms-1"/> {latestActiveProject.execution_status === 'in_progress' ? 'جاري التنفيذ' : 'لم يبدأ بعد'}
                                </p>
                            </>
                        ) : (
                            <div className="text-center py-4 my-auto">
                                <p className="text-muted fw-bold fs-5 mb-0">لا يوجد مشاريع قيد التنفيذ حالياً.</p>
                            </div>
                        )}
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