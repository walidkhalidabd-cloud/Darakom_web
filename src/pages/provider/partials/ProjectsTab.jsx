import { useState, useEffect } from 'react';
import { FaBuilding, FaMapMarkerAlt, FaChartLine, FaUserTie, FaSpinner, FaCheckCircle, FaPercentage } from 'react-icons/fa';
import { fetchProviderProjects } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProjectsTab = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await fetchProviderProjects();
                setProjects(res.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setProjects([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="section-header">
                <div>
                    <h3><FaBuilding className="ms-2 text-warning" /> مشاريعي</h3>
                    <p>جميع مشاريعك قيد التنفيذ والمكتملة</p>
                </div>
            </div>

            {loading ? (
                <div className="d-flex flex-column gap-4">
                    {[1, 2].map(i => <div key={i} className="card-provider p-5"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {projects.length > 0 ? projects.map(p => {
                        const progress = p.progress_percentage || 0;
                        const statusColor = p.execution_status === 'finished' ? '#10b981' : '#ff8a00';
                        const client = p.client?.full_name || p.client?.name;
                        return (
                            <div key={p.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                                style={{ borderColor: progress === 100 ? '#10b981' : statusColor }}>

                                <div className="row align-items-center">
                                    <div className="col-lg-8 mb-4 mb-lg-0">
                                        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                            {progress === 100
                                                ? <span className="badge-resolved rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6"><FaCheckCircle /> مكتمل</span>
                                                : <span className="badge-active rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6"><FaSpinner className="fa-spin" /> قيد التنفيذ</span>}
                                            <span className="text-muted fw-bold fs-6">تاريخ البدء: {p.start_date ? p.start_date.slice(0, 10) : '—'}</span>
                                        </div>
                                        <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{p.title}</h4>

                                        <div className="d-flex flex-wrap gap-4 text-muted fw-bold fs-5 mb-4">
                                            <span className="d-flex align-items-center gap-2"><FaMapMarkerAlt style={{ color: '#1b2a47' }} /> {p.province?.name || ''}</span>
                                            <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color: '#1b2a47' }} /> مساحة: {p.area ? `${p.area}م` : ''}</span>
                                            {client && <span className="d-flex align-items-center gap-2"><FaUserTie className="text-warning" /> {client}</span>}
                                        </div>

                                        {/* Progress */}
                                        <div className="bg-light p-3 rounded-4">
                                            <div className="d-flex justify-content-between fw-bold mb-2">
                                                <span style={{ color: '#1b2a47' }}>نسبة الإنجاز</span>
                                                <span className={progress === 100 ? 'text-success' : 'text-warning'}
                                                    style={{ fontSize: '22px' }}><FaPercentage className="ms-1" />{progress}%</span>
                                            </div>
                                            <div className="progress-custom">
                                                <div className={`progress-bar-custom ${progress === 100 ? 'completed' : ''}`}
                                                    style={{ width: `${progress}%`, backgroundColor: progress === 100 ? '' : statusColor }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="col-lg-4 d-flex flex-column gap-3 text-center border-start border-light pt-3 pt-lg-0 ps-lg-4">
                                        <button className="btn-provider-outline w-100 d-flex align-items-center justify-content-center gap-2 py-3" style={{ fontSize: '18px' }}>
                                            <FaChartLine /> عرض سير المشروع
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="empty-state">
                            <FaBuilding size={60} />
                            <h4>لا توجد مشاريع في هذا القسم</h4>
                            <p>عند بدء المشاريع ستظهر هنا</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProjectsTab;
