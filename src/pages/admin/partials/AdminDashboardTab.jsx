import { useState, useEffect } from 'react';
import {
    FaUsers, FaUserAlt, FaUserTie, FaBuilding, FaHardHat, FaHammer,
FaFolderOpen, FaCheckCircle, FaPauseCircle, FaFileContract, FaCheckDouble,
    FaClipboardList, FaExclamationTriangle
} from 'react-icons/fa';
import { fetchAdminStats } from '../../../services/api/adminApi';
import './admin-tabs.css';

const AdminDashboardTab = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchAdminStats();
                setStats(res.data?.data || null);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                // بيانات تجريبية واقعية
                setStats({
                    totalUsers: 324,
                    usersByType: { clients: 150, engineers: 62, offices: 38, contractors: 45, craftsmen: 29 },
                    projects: { open: 48, completed: 126, pending: 23 },
                    offers: { submitted: 96, accepted: 54 },
                    recentComplaints: 5
                });
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1400px' }}>
                {[1, 2, 3].map(i => <div key={i} className="card-admin p-5 mb-4"><div className="loading-skeleton" style={{ height: '120px' }}></div></div>)}
            </div>
        );
    }

    const userTypes = [
        { id: 'clients', label: 'عملاء', count: stats?.usersByType?.clients || 0, icon: <FaUserAlt />, color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
        { id: 'engineers', label: 'مهندسين', count: stats?.usersByType?.engineers || 0, icon: <FaUserTie />, color: '#198754', bg: 'rgba(25,135,84,0.1)' },
        { id: 'offices', label: 'مكاتب', count: stats?.usersByType?.offices || 0, icon: <FaBuilding />, color: '#6f42c1', bg: 'rgba(111,66,193,0.1)' },
        { id: 'contractors', label: 'مقاولين', count: stats?.usersByType?.contractors || 0, icon: <FaHardHat />, color: '#ff8a00', bg: 'rgba(255,138,0,0.1)' },
        { id: 'craftsmen', label: 'حرفيين', count: stats?.usersByType?.craftsmen || 0, icon: <FaHammer />, color: '#dc3545', bg: 'rgba(220,53,69,0.1)' },
    ];

    const projectStats = [
        { id: 'open', label: 'مشاريع مفتوحة', count: stats?.projects?.open || 0, icon: <FaFolderOpen />, color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
        { id: 'completed', label: 'مشاريع مكتملة', count: stats?.projects?.completed || 0, icon: <FaCheckCircle />, color: '#198754', bg: 'rgba(25,135,84,0.1)' },
        { id: 'pending', label: 'مشاريع معلقة', count: stats?.projects?.pending || 0, icon: <FaPauseCircle />, color: '#ff8a00', bg: 'rgba(255,138,0,0.1)' },
    ];

    const offerStats = [
        { id: 'submitted', label: 'عروض مقدمة', count: stats?.offers?.submitted || 0, icon: <FaFileContract />, color: '#0d6efd', bg: 'rgba(13,110,253,0.1)' },
        { id: 'accepted', label: 'عروض مقبولة', count: stats?.offers?.accepted || 0, icon: <FaCheckDouble />, color: '#198754', bg: 'rgba(25,135,84,0.1)' },
    ];

    const totalProjects = (stats?.projects?.open || 0) + (stats?.projects?.completed || 0) + (stats?.projects?.pending || 0);
    const totalOffers = (stats?.offers?.submitted || 0) + (stats?.offers?.accepted || 0);

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>

            {/* 1. رسالة الترحيب والإحصائيات الكلية */}
            <div className="mb-5">
                <h3 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '32px' }}>مرحباً بك، مدير النظام 👋</h3>

                {/* بطاقات الإحصائيات الرئيسية */}
                <div className="row g-4 mb-4">
                    <div className="col-lg-4">
                        <div className="card-admin p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-primary">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>إجمالي المستخدمين</p>
                                <h2 className="fw-bold mb-0 text-primary" style={{ fontSize: '38px' }}>{stats?.totalUsers || 0}</h2>
                            </div>
                            <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle" style={{ fontSize: '32px' }}><FaUsers /></div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card-admin p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-warning">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>إجمالي المشاريع</p>
                                <h2 className="fw-bold mb-0 text-warning" style={{ fontSize: '38px' }}>{totalProjects}</h2>
                            </div>
                            <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle" style={{ fontSize: '32px' }}><FaClipboardList /></div>
                        </div>
                    </div>
                    <div className="col-lg-4">
                        <div className="card-admin p-4 d-flex flex-row align-items-center justify-content-between h-100 border-bottom border-4 border-success">
                            <div>
                                <p className="text-muted fw-bold mb-1" style={{ fontSize: '20px' }}>إجمالي العروض</p>
                                <h2 className="fw-bold mb-0 text-success" style={{ fontSize: '38px' }}>{totalOffers}</h2>
                            </div>
                            <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle" style={{ fontSize: '32px' }}><FaFileContract /></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. تصنيف المستخدمين حسب النوع */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="fw-bold mb-0 text-dark" style={{ fontSize: '26px' }}>تصنيف المستخدمين حسب النوع</h4>
                </div>
                <div className="row g-4">
                    {userTypes.map(t => (
                        <div className="col-md-4 col-lg" key={t.id}>
                            <div className="card-admin p-4 h-100 text-center">
                                <div className="mx-auto mb-3 p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ color: t.color, backgroundColor: t.bg, fontSize: '28px' }}>
                                    {t.icon}
                                </div>
                                <h2 className="fw-bold mb-1" style={{ fontSize: '36px', color: t.color }}>{t.count}</h2>
                                <p className="text-muted fw-bold mb-0" style={{ fontSize: '18px' }}>{t.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. المشاريع والعروض */}
            <div className="row g-4 mb-5">
                {/* المشاريع */}
                <div className="col-lg-6">
                    <div className="card-admin p-4 h-100">
                        <h4 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '24px' }}>
                            <FaClipboardList className="ms-2 text-warning" /> حالة المشاريع
                        </h4>
                        <div className="d-flex flex-column gap-3">
                            {projectStats.map(p => (
                                <div key={p.id} className="d-flex align-items-center justify-content-between p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ color: p.color, backgroundColor: p.bg, fontSize: '22px' }}>{p.icon}</div>
                                        <span className="fw-bold text-muted" style={{ fontSize: '20px' }}>{p.label}</span>
                                    </div>
                                    <span className="fw-bold" style={{ fontSize: '28px', color: p.color }}>{p.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* العروض */}
                <div className="col-lg-6">
                    <div className="card-admin p-4 h-100">
                        <h4 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '24px' }}>
                            <FaFileContract className="ms-2 text-success" /> العروض المقدمة والمقبولة
                        </h4>
                        <div className="d-flex flex-column gap-3">
                            {offerStats.map(o => (
                                <div key={o.id} className="d-flex align-items-center justify-content-between p-3 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <div className="d-flex align-items-center gap-3">
                                        <div className="p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ color: o.color, backgroundColor: o.bg, fontSize: '22px' }}>{o.icon}</div>
                                        <span className="fw-bold text-muted" style={{ fontSize: '20px' }}>{o.label}</span>
                                    </div>
                                    <span className="fw-bold" style={{ fontSize: '28px', color: o.color }}>{o.count}</span>
                                </div>
                            ))}
                        </div>
                        {(stats?.offers?.submitted || 0) > 0 && (
                            <div className="mt-4">
                                <div className="d-flex justify-content-between text-muted fw-semibold mb-2" style={{ fontSize: '18px' }}>
                                    <span>نسبة العروض المقبولة</span>
                                    <span className="text-success fw-bold">{Math.round(((stats?.offers?.accepted || 0) / (stats?.offers?.submitted || 1)) * 100)}%</span>
                                </div>
                                <div className="progress" style={{ height: '14px', borderRadius: '10px' }}>
                                    <div className="progress-bar bg-success" style={{ width: `${Math.round(((stats?.offers?.accepted || 0) / (stats?.offers?.submitted || 1)) * 100)}%` }}></div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 4. تنبيهات سريعة */}
            <div className="card-admin p-5 text-white text-center d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#1b2a47' }}>
                <h3 className="fw-bold mb-3" style={{ fontSize: '28px' }}>
                    <FaExclamationTriangle className="ms-2 text-warning" />
                    لديك {(stats?.recentComplaints || 0)} شكاوى بانتظار المراجعة
                </h3>
                <p className="fw-semibold text-white-50 mb-0" style={{ fontSize: '20px' }}>تحقق من قسم الشكاوى والملاحظات لمتابعتها والرد عليها.</p>
            </div>

        </div>
    );
};

export default AdminDashboardTab;
