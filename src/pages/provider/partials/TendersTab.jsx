import { useState, useEffect } from 'react';
import { FaGlobe, FaLock, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaUserTie, FaSpinner } from 'react-icons/fa';
import TenderDetails from './TenderDetails';
import SubmitOffer from './SubmitOffer';
import { fetchPublicTenders, fetchPrivateTenders, fetchTenderDetails } from '../../../services/api/providerApi';
import './provider-tabs.css';

const TendersTab = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [selectedTender, setSelectedTender] = useState(null);
    const [showSubmitOffer, setShowSubmitOffer] = useState(false);
    const [publicTenders, setPublicTenders] = useState([]);
    const [privateTenders, setPrivateTenders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [pubRes, privRes] = await Promise.all([
                    fetchPublicTenders(),
                    fetchPrivateTenders()
                ]);
                setPublicTenders(pubRes.data?.data || []);
                setPrivateTenders(privRes.data?.data || []);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
                setPublicTenders([]);
                setPrivateTenders([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const handleOpenDetails = async (t) => {
        try {
            const res = await fetchTenderDetails(t.id);
            setSelectedTender(res.data?.data || t);
        } catch {
            setSelectedTender(t);
        }
    };

    if (showSubmitOffer && selectedTender) {
        return <SubmitOffer tender={selectedTender} onBack={() => setShowSubmitOffer(false)} />;
    }

    if (selectedTender) {
        return <TenderDetails tender={selectedTender} onBack={() => setSelectedTender(null)} onStartOffer={() => setShowSubmitOffer(true)} />;
    }

    const currentData = activeSection === 'general' ? publicTenders : privateTenders;

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="section-header">
                <div>
                    <h3><FaBuilding className="ms-2 text-warning" /> سوق المناقصات</h3>
                    <p>تصفح المناقصات وقدم أفضل عروضك</p>
                </div>
            </div>

            <div className="tab-switcher justify-content-center">
                <button className={activeSection === 'general' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'general' ? '#1b2a47' : '', color: activeSection === 'general' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('general')}>
                    <FaGlobe className="ms-2" /> المناقصات العامة
                </button>
                <button className={activeSection === 'private' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'private' ? '#ff8a00' : '', color: activeSection === 'private' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('private')}>
                    <FaLock className="ms-2" /> المناقصات الخاصة
                </button>
            </div>

            {/* Alert */}
            <div className="alert border-0 shadow-sm rounded-4 p-4 mb-4 text-center fw-bold fs-5"
                style={{ backgroundColor: activeSection === 'general' ? '#e9f2ff' : '#fff4e5', color: activeSection === 'general' ? '#1b2a47' : '#ff8a00' }}>
                {activeSection === 'general'
                    ? '💡 هذه المناقصات مطروحة لجميع مزودي الخدمة. قدّم أفضل عرض لديك!'
                    : '⭐ هذه دعوات مباشرة موجهة لك من العملاء بناءً على تميزك.'}
            </div>

            {loading ? (
                <div className="d-flex flex-column gap-4">
                    {[1, 2].map(i => <div key={i} className="card-provider p-5"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
                </div>
            ) : (
                <div className="d-flex flex-column gap-4">
                    {currentData.length > 0 ? currentData.map(t => {
                        const isPrivate = activeSection === 'private';
                        const project = isPrivate ? t.project : t;
                        const title = project?.title;
                        const color = isPrivate ? '#ff8a00' : '#1b2a47';
                        const location = project?.province?.name || '';
                        const area = project?.area ? `${project.area}م` : '';
                        const deadline = project?.end_date ? project.end_date.slice(0, 10) : (project?.tender_duration ? `بعد ${project.tender_duration} ${project.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : '');
                        return (
                            <div key={t.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                                style={{ borderColor: color }}>

                                <div className="row align-items-center">
                                    <div className="col-lg-8 mb-4 mb-lg-0">
                                        <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                            <span className="badge px-3 py-2 rounded-pill fs-6 fw-bold d-inline-flex align-items-center gap-1"
                                                style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}40` }}>
                                                {isPrivate ? <FaUserTie /> : <FaSpinner className="fa-spin" />} {isPrivate ? 'دعوة حصرية' : 'متاح للتقديم'}
                                            </span>
                                            <span className="text-muted fw-bold fs-6">{project?.created_at ? project.created_at.slice(0, 10) : ''}</span>
                                        </div>
                                        <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{title}</h4>

                                        <div className="d-flex flex-wrap gap-4 text-muted fw-bold fs-5 mb-3">
                                            <span className="d-flex align-items-center gap-2"><FaMapMarkerAlt style={{ color }} /> {location}</span>
                                            {area && <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color }} /> مساحة: {area}</span>}
                                            {deadline && <span className="d-flex align-items-center gap-2"><FaCalendarAlt style={{ color }} /> {deadline}</span>}
                                            {isPrivate && project?.client && <span className="d-flex align-items-center gap-2"><FaUserTie style={{ color }} /> {project.client.full_name || project.client.name}</span>}
                                        </div>
                                    </div>

                                    <div className="col-lg-4 text-lg-end text-center">
                                        <button onClick={() => handleOpenDetails(t)}
                                            className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                            style={{ backgroundColor: color, fontSize: '18px' }}>
                                            تفاصيل وتقديم عرض <FaChevronLeft className="ms-2" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="empty-state">
                            <FaBuilding size={60} />
                            <h4>لا توجد مناقصات في هذا القسم حالياً</h4>
                            <p>ستظهر المناقصات الجديدة هنا</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TendersTab;
