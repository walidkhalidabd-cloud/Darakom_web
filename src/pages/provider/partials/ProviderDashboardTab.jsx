import { useEffect, useState } from 'react';
import { FaStar, FaSearchDollar, FaSpinner, FaUserTie, FaCheckCircle } from 'react-icons/fa';
import { fetchProviderDashboard } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderDashboardTab = ({ setActiveTab }) => {
    const [stats, setStats] = useState({ completed_projects: 0, active_projects: 0, new_tenders: 0, average_rating: 0 });
    const [invitations, setInvitations] = useState([]);
    const [projectsInProgress, setProjectsInProgress] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchProviderDashboard();
                const data = res.data?.data;
                if (data) {
                    setStats(data.statistics || {});
                    setInvitations(data.private_invitations || []);
                    setProjectsInProgress(data.projects_in_progress || []);
                }
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1400px' }}>
                <div className="loading-skeleton" style={{ height: '200px' }}></div>
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {/* 1. رسالة الترحيب والإحصائيات المهمة */}
            <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '32px' }}>مرحباً بك 👋</h3>
                <div className="row g-4">
                    
                    {/* بطاقة المشاريع المنجزة */}
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-success">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مشاريع منجزة</p>
                                <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '38px' }}>{stats.completed_projects}</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle" style={{ fontSize: '32px' }}><FaCheckCircle /></div>
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مشاريع نشطة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>{stats.active_projects}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle" style={{ fontSize: '32px' }}><FaSpinner className="fa-spin" /></div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>مناقصات جديدة</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>{stats.new_tenders}</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle" style={{ fontSize: '32px' }}><FaSearchDollar /></div>
                        </div>
                    </div>
                    
                    <div className="col-md-3">
                        <div className="card border-0 shadow-sm rounded-4 p-4 d-flex flex-row align-items-center justify-content-between h-100">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>التقييم العام</p>
                                <h2 className="fw-bold mb-0" style={{ fontSize: '38px' }}>{stats.average_rating}</h2>
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
                        {invitations.length > 0 ? invitations.map(inv => (
                            <div key={inv.id} className="mb-3 pb-3 border-bottom">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                    <div>
                                        <h4 className="fw-bold mb-2" style={{ color: '#1b2a47', fontSize: '22px' }}>{inv.project?.title}</h4>
                                        <span className="text-muted fw-bold" style={{ fontSize: '16px' }}><FaUserTie className="me-2" /> العميل: {inv.project?.client?.full_name || inv.project?.client?.name || '—'}</span>
                                    </div>
                                    <span className="badge bg-danger bg-opacity-10 text-danger px-3 py-2 rounded-pill fw-bold border border-danger border-opacity-25" style={{ fontSize: '14px' }}>دعوة حصرية</span>
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted fw-semibold m-0">لا توجد طلبات مباشرة حالياً.</p>
                        )}
                    </div>
                </div>

                {/* عمود: مشاريع قيد التنفيذ */}
                <div className="col-lg-6">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>أحدث المشاريع قيد التنفيذ</h4>
                        <button className="btn btn-link text-warning fw-bold text-decoration-none" style={{ fontSize: '20px' }} onClick={() => setActiveTab('tracking')}>عرض الكل</button>
                    </div>
                    <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-end border-4 border-primary">
                        {projectsInProgress.length > 0 ? projectsInProgress.map(p => (
                            <div key={p.id} className="mb-3 pb-3 border-bottom">
                                <h4 className="fw-bold mb-2" style={{ color: '#1b2a47', fontSize: '22px' }}>{p.title}</h4>
                                <div className="d-flex justify-content-between text-muted fw-semibold mb-2" style={{ fontSize: '16px' }}>
                                    <span>نسبة إنجاز المشروع</span>
                                    <span className="text-primary fw-bold">{p.progress_percentage || 0}%</span>
                                </div>
                                <div className="progress" style={{ height: '12px', borderRadius: '10px' }}>
                                    <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" style={{ width: `${p.progress_percentage || 0}%` }}></div>
                                </div>
                            </div>
                        )) : (
                            <p className="text-muted fw-semibold m-0">لا توجد مشاريع قيد التنفيذ حالياً.</p>
                        )}
                    </div>
                </div>

            </div>

        </div>
    );
};

export default ProviderDashboardTab;
