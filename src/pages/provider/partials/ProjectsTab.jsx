import { useState } from 'react';
import { FaGlobe, FaLock, FaBuilding, FaMapMarkerAlt, FaPlusCircle, FaChartLine, FaUserTie, FaSpinner, FaCheckCircle, FaPercentage } from 'react-icons/fa';
import './provider-tabs.css';

const ProjectsTab = () => {
    const [activeSection, setActiveSection] = useState('general');

    const projects = {
        general: [
            { id: 1, status: 'قيد التنفيذ', statusColor: '#1b2a47', startDate: '15 مارس 2026', title: 'تنفيذ أعمال السباكة والكهرباء لفيلا سكنية', location: 'دمشق، المزة', area: '450م', progress: 45 },
            { id: 2, status: 'مكتمل', statusColor: '#10b981', startDate: '1 يناير 2026', title: 'تشطيب واجهة عمارة سكنية', location: 'حلب، حي الفردوس', area: '300م', progress: 100 },
        ],
        private: [
            { id: 3, status: 'قيد التنفيذ', statusColor: '#ff8a00', startDate: '10 أبريل 2026', title: 'تصميم داخلي وتشطيب شقة فاخرة', client: 'شركة الأفق العقارية', location: 'اللاذقية، الكورنيش', progress: 20 },
            { id: 4, status: 'قيد التنفيذ', statusColor: '#ff8a00', startDate: '5 مايو 2026', title: 'ترميم وتجديد فيلا كلاسيكية', client: 'أ. سارة ناصر', location: 'حمص، حي الخالدية', progress: 60 },
        ]
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="section-header">
                <div>
                    <h3><FaBuilding className="ms-2 text-warning" /> مشاريعي</h3>
                    <p>جميع مشاريعك قيد التنفيذ والمكتملة</p>
                </div>
            </div>

            <div className="tab-switcher justify-content-center">
                <button className={activeSection === 'general' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'general' ? '#1b2a47' : '', color: activeSection === 'general' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('general')}>
                    <FaGlobe className="ms-2" /> مشاريع عامة
                </button>
                <button className={activeSection === 'private' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'private' ? '#ff8a00' : '', color: activeSection === 'private' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('private')}>
                    <FaLock className="ms-2" /> مشاريع خاصة
                </button>
            </div>

            <div className="d-flex flex-column gap-4">
                {(activeSection === 'general' ? projects.general : projects.private).length > 0 ? 
                    (activeSection === 'general' ? projects.general : projects.private).map(p => (
                        <div key={p.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                            style={{ borderColor: p.progress === 100 ? '#10b981' : p.statusColor }}>

                            <div className="row align-items-center">
                                <div className="col-lg-8 mb-4 mb-lg-0">
                                    <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                        {p.progress === 100 
                                            ? <span className="badge-resolved rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6"><FaCheckCircle /> مكتمل</span>
                                            : <span className="badge-active rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1 fs-6"><FaSpinner className="fa-spin" /> {p.status}</span>}
                                        <span className="text-muted fw-bold fs-6">تاريخ البدء: {p.startDate}</span>
                                    </div>
                                    <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{p.title}</h4>

                                    <div className="d-flex flex-wrap gap-4 text-muted fw-bold fs-5 mb-4">
                                        <span className="d-flex align-items-center gap-2"><FaMapMarkerAlt style={{ color: '#1b2a47' }} /> {p.location}</span>
                                        <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color: '#1b2a47' }} /> مساحة: {p.area}</span>
                                        {p.client && <span className="d-flex align-items-center gap-2"><FaUserTie className="text-warning" /> {p.client}</span>}
                                    </div>

                                    {/* Progress */}
                                    <div className="bg-light p-3 rounded-4">
                                        <div className="d-flex justify-content-between fw-bold mb-2">
                                            <span style={{ color: '#1b2a47' }}>نسبة الإنجاز</span>
                                            <span className={p.progress === 100 ? 'text-success' : 'text-warning'}
                                                style={{ fontSize: '22px' }}><FaPercentage className="ms-1" />{p.progress}%</span>
                                        </div>
                                        <div className="progress-custom">
                                            <div className={`progress-bar-custom ${p.progress === 100 ? 'completed' : ''}`}
                                                style={{ width: `${p.progress}%`, backgroundColor: p.progress === 100 ? '' : p.statusColor }}></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-lg-4 d-flex flex-column gap-3 text-center border-start border-light pt-3 pt-lg-0 ps-lg-4">
                                    <button className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3" style={{ fontSize: '18px' }}>
                                        <FaPlusCircle /> إضافة مرحلة منجزة
                                    </button>
                                    <button className="btn-provider-outline w-100 d-flex align-items-center justify-content-center gap-2 py-3" style={{ fontSize: '18px' }}>
                                        <FaChartLine /> عرض سير المشروع
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="empty-state">
                            <FaBuilding size={60} />
                            <h4>لا توجد مشاريع في هذا القسم</h4>
                            <p>عند بدء المشاريع ستظهر هنا</p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default ProjectsTab;

