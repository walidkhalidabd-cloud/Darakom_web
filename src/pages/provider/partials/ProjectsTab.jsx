import { useState, useEffect } from 'react';
import { 
    FaGlobe, FaLock, FaBuilding, FaMapMarkerAlt, FaPlusCircle, 
    FaChartLine, FaUserTie, FaSpinner, FaCheckCircle, FaPercentage, 
    FaArrowRight, FaCheckDouble, FaFileAlt
} from 'react-icons/fa';
import ImageUploader from '../../../components/ImageUploader';
import './provider-tabs.css';

const ProjectsTab = ({ setActiveTab }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [view, setView] = useState('list'); 
    const [selectedProject, setSelectedProject] = useState(null);
    
    const [reportText, setReportText] = useState('');
    const [progress, setProgress] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [saving, setSaving] = useState(false);

    const projects = {
        general: [
            { id: 1, status: 'قيد التنفيذ', statusColor: '#1b2a47', startDate: '15 مارس 2026', title: 'تنفيذ أعمال السباكة والكهرباء لفيلا سكنية', location: 'دمشق، المزة', area: '450م', progress: 45, currentStage: 'التمديدات الكهربائية الأساسية', client: 'أحمد سليمان', duration: '6 أشهر', price: '250,000 ل.س' },
            { id: 2, status: 'مكتمل', statusColor: '#10b981', startDate: '1 يناير 2026', title: 'تشطيب واجهة عمارة سكنية', location: 'حلب، حي الفردوس', area: '300م', progress: 100, currentStage: 'تم التسليم النهائي', client: 'خالد عبدالله', duration: '8 أشهر', price: '450,000 ل.س' },
        ],
        private: [
            { id: 3, status: 'قيد التنفيذ', statusColor: '#ff8a00', startDate: '10 أبريل 2026', title: 'تصميم داخلي وتشطيب شقة فاخرة', client: 'شركة الأفق العقارية', location: 'اللاذقية، الكورنيش', progress: 20, currentStage: 'تقديم التصاميم الأولية للعميل', duration: 'شهرين', price: '85,000 ل.س' },
            { id: 4, status: 'قيد التنفيذ', statusColor: '#ff8a00', startDate: '5 مايو 2026', title: 'ترميم وتجديد فيلا كلاسيكية', client: 'أ. سارة ناصر', location: 'حمص، حي الخالدية', progress: 60, currentStage: 'أعمال اللياسة الداخلية', duration: '4 أشهر', price: '120,000 ل.س' },
        ]
    };

    const currentData = activeSection === 'general' ? projects.general : projects.private;

    // دالة لفتح نافذة إضافة مرحلة منجزة
    const handleOpenUpdate = (project) => {
        setSelectedProject(project);
        setProgress(project.progress + 10 > 100 ? 100 : project.progress + 10);
        setView('update_stage');
    };

    // التعديل هنا: التقاط التوجيه القادم من تبويب متابعة المشاريع
    useEffect(() => {
        const updateStr = localStorage.getItem('projectToUpdateStage');
        if (updateStr) {
            const proj = JSON.parse(updateStr);
            handleOpenUpdate(proj);
            localStorage.removeItem('projectToUpdateStage'); // مسح التخزين
        }
    }, []);

    const handleOpenTimeline = (project) => {
        localStorage.setItem('openTrackingProject', JSON.stringify(project));
        if(setActiveTab) {
            setActiveTab('tracking');
        }
    };

    const handleSubmitReport = (e) => {
        e.preventDefault();
        if (!reportText.trim()) return;
        
        setSaving(true);
        setTimeout(() => {
            alert('✅ تم رفع التقرير وتحديث المرحلة بنجاح! سيتم إشعار العميل بذلك.');
            setSaving(false);
            setView('list');
            setReportText('');
            setUploadedImages([]);
            setSelectedProject(null);
        }, 1200);
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            
            {view === 'list' && (
                <>
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
                        {currentData.length > 0 ? currentData.map(p => (
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
                                            {p.area && <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color: '#1b2a47' }} /> مساحة: {p.area}</span>}
                                            {p.client && <span className="d-flex align-items-center gap-2"><FaUserTie className="text-warning" /> {p.client}</span>}
                                        </div>

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
                                        <button 
                                            className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3" 
                                            style={{ fontSize: '18px' }}
                                            onClick={() => handleOpenUpdate(p)}
                                            disabled={p.progress === 100}
                                        >
                                            <FaPlusCircle /> إضافة مرحلة منجزة
                                        </button>
                                        <button 
                                            className="btn-provider-outline w-100 d-flex align-items-center justify-content-center gap-2 py-3" 
                                            style={{ fontSize: '18px' }}
                                            onClick={() => handleOpenTimeline(p)}
                                        >
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
                </>
            )}

            {/* ==================== 2. واجهة إضافة مرحلة منجزة (Update Stage View) ==================== */}
            {view === 'update_stage' && selectedProject && (
                <div className="card-provider p-4 p-md-5 bg-white mx-auto border-end border-4 border-warning" style={{ maxWidth: '900px' }}>
                    <button className="btn-provider-outline d-flex align-items-center gap-2 px-4 py-2 mb-4" onClick={() => setView('list')}>
                        <FaArrowRight /> العودة للقائمة
                    </button>

                    <div className="text-center mb-5">
                        <div className="bg-warning bg-opacity-10 text-warning p-4 rounded-circle d-inline-flex mb-3">
                            <FaFileAlt size={40} />
                        </div>
                        <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تحديث المرحلة الحالية</h3>
                        <p className="text-muted fw-semibold fs-5">قم بكتابة تقرير مفصل حول ما تم إنجازه وإرفاق الصور للعميل</p>
                    </div>

                    <div className="bg-light p-4 rounded-4 border mb-4">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <span className="text-muted fw-bold d-block mb-1">المشروع المرتبط:</span>
                                <h5 className="fw-bold text-dark">{selectedProject.title}</h5>
                            </div>
                            <div className="col-md-6 border-start">
                                <span className="text-muted fw-bold d-block mb-1">المرحلة الحالية المُراد تحديثها:</span>
                                <h5 className="fw-bold text-warning">{selectedProject.currentStage}</h5>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitReport}>
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>تقرير الإنجاز المفصل</label>
                                <textarea 
                                    className="form-control p-4 bg-light border" 
                                    rows="5" 
                                    placeholder="اشرح للعميل الخطوات التي قمت بتنفيذها في هذه المرحلة بالتفصيل..."
                                    style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px', lineHeight: '1.8' }}
                                    value={reportText}
                                    onChange={(e) => setReportText(e.target.value)}
                                    required
                                ></textarea>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>تحديث نسبة إنجاز المشروع</label>
                                <div className="d-flex align-items-center gap-4">
                                    <input 
                                        type="range" 
                                        className="form-range flex-grow-1" 
                                        min="0" max="100" step="5" 
                                        value={progress}
                                        onChange={(e) => setProgress(e.target.value)}
                                    />
                                    <span className="fw-bold fs-4 text-warning">{progress}%</span>
                                </div>
                            </div>

                            <div className="col-12">
                                <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>إرفاق صور وملفات توثيقية</label>
                                <ImageUploader 
                                    images={uploadedImages} 
                                    onChange={setUploadedImages} 
                                    label="صور ومستندات الإنجاز"
                                />
                            </div>

                            <div className="col-12 text-center mt-5 pt-4 border-top">
                                <button type="submit" className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-2 px-5 py-3 shadow w-100" style={{ fontSize: '22px' }} disabled={saving}>
                                    {saving ? <><FaSpinner className="fa-spin" /> جاري رفع التقرير...</> : <><FaCheckDouble /> رفع التقرير وتحديث المشروع</>}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default ProjectsTab;