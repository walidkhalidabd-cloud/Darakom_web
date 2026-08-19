import { useState, useEffect } from 'react';
import { 
    FaGlobe, FaLock, FaBuilding, FaMapMarkerAlt, FaPlusCircle, 
    FaChartLine, FaUserTie, FaSpinner, FaCheckCircle, FaPercentage, 
    FaArrowRight, FaCheckDouble, FaFileAlt
} from 'react-icons/fa';
import { fetchProviderProjects, addReport } from '../../../services/api/providerApi';
import ImageUploader from '../../../components/ImageUploader';
import './provider-tabs.css';

const ProjectsTab = ({ setActiveTab }) => {
    const [activeSection, setActiveSection] = useState('general');
    const [view, setView] = useState('list'); 
    const [selectedProject, setSelectedProject] = useState(null);
    
    // حالة المشاريع الفعلية القادمة من الباك إند
    const [projects, setProjects] = useState({ general: [], private: [] });
    const [loading, setLoading] = useState(true);

    const [reportText, setReportText] = useState('');
    const [progress, setProgress] = useState(0);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [saving, setSaving] = useState(false);

    // دالة جلب المشاريع من الباك إند
    const loadProjects = async () => {
        setLoading(true);
        try {
            const res = await fetchProviderProjects();
            const data = res.data?.data || [];
            
            const gen = [];
            const priv = [];

            data.forEach(p => {
                const isFinished = p.execution_status === 'finished' || p.status === 'completed';
                const formatted = {
                    id: p.id,
                    status: isFinished ? 'مكتمل' : (p.execution_status === 'in_progress' ? 'قيد التنفيذ' : 'لم يبدأ'),
                    statusColor: isFinished ? '#10b981' : (p.execution_status === 'in_progress' ? '#1b2a47' : '#ff8a00'),
                    startDate: p.start_date ? new Date(p.start_date).toLocaleDateString('ar-EG') : 'غير محدد',
                    title: p.title || 'مشروع بدون عنوان',
                    location: p.location_details || p.province?.name || 'غير محدد',
                    area: p.area ? `${p.area} م²` : null,
                    progress: p.progress_percentage || 0,
                    currentStage: 'جاري التنفيذ', 
                    client: p.client?.first_name ? `${p.client.first_name} ${p.client.last_name || ''}`.trim() : (p.client?.name || 'غير معروف'),
                    duration: p.tender_duration ? `${p.tender_duration} ${p.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : 'غير محدد',
                    price: p.budget ? `${p.budget} ل.س` : 'غير محدد',
                    original: p
                };

                // تصنيف المشروع (عام أو خاص)
                if (p.invitation_type === 'private') {
                    priv.push(formatted);
                } else {
                    gen.push(formatted);
                }
            });

            setProjects({ general: gen, private: priv });
        } catch (error) {
            console.error("خطأ في جلب المشاريع:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const currentData = activeSection === 'general' ? projects.general : projects.private;

    // دالة لفتح نافذة إضافة مرحلة منجزة
    const handleOpenUpdate = (project) => {
        setSelectedProject(project);
        setProgress(project.progress + 10 > 100 ? 100 : project.progress + 10);
        setView('update_stage');
    };

    // التقاط التوجيه القادم من تبويب متابعة المشاريع
    useEffect(() => {
        const updateStr = localStorage.getItem('projectToUpdateStage');
        if (updateStr) {
            const proj = JSON.parse(updateStr);
            // نبحث عن المشروع المطابق لتحديث حالته
            let targetProj = projects.general.find(p => p.id === proj.id) || projects.private.find(p => p.id === proj.id);
            if(targetProj) {
                handleOpenUpdate(targetProj);
            } else {
                handleOpenUpdate(proj); // كحالة بديلة
            }
            localStorage.removeItem('projectToUpdateStage'); 
        }
    }, [projects]); // إعادة التشغيل عند تحميل المشاريع

    const handleOpenTimeline = (project) => {
        localStorage.setItem('openTrackingProject', JSON.stringify(project));
        if(setActiveTab) {
            setActiveTab('tracking');
        }
    };

    // إرسال التقرير للباك إند
    const handleSubmitReport = async (e) => {
        e.preventDefault();
        if (!reportText.trim()) return;
        
        setSaving(true);
        try {
            const payload = {
                description: reportText,
                reported_progress: parseInt(progress)
            };

            await addReport(selectedProject.id, payload);

            alert('✅ تم رفع التقرير وتحديث المرحلة بنجاح! سيتم إشعار العميل بذلك.');
            setView('list');
            setReportText('');
            setUploadedImages([]);
            setSelectedProject(null);
            loadProjects(); // إعادة تحميل القائمة لجلب النسبة الجديدة
        } catch (err) {
            console.error("خطأ في إضافة التقرير:", err);
            alert('❌ حدث خطأ أثناء إرسال التقرير. يرجى المحاولة لاحقاً.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="mx-auto text-center py-5" style={{ maxWidth: '1400px' }}>
                <FaSpinner className="fa-spin text-warning mb-3" size={50} />
                <h4 className="fw-bold text-muted">جاري تحميل مشاريعك...</h4>
            </div>
        );
    }

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
                                            <FaPlusCircle /> إضافة تقرير ومرحلة
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
                            <div className="empty-state py-5">
                                <FaBuilding size={60} className="text-muted opacity-25 mb-3" />
                                <h4 className="fw-bold text-muted">لا توجد مشاريع في هذا القسم</h4>
                                <p className="text-muted fw-semibold">عند بدء المشاريع ستظهر هنا</p>
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
                        <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تحديث نسبة الإنجاز والتقارير</h3>
                        <p className="text-muted fw-semibold fs-5">قم بكتابة تقرير مفصل حول ما تم إنجازه لإعلام العميل بتقدم العمل</p>
                    </div>

                    <div className="bg-light p-4 rounded-4 border mb-4">
                        <div className="row g-3">
                            <div className="col-md-12 text-center">
                                <span className="text-muted fw-bold d-block mb-1">المشروع المرتبط:</span>
                                <h5 className="fw-bold text-dark mb-0">{selectedProject.title}</h5>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmitReport}>
                        <div className="row g-4">
                            <div className="col-12">
                                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>تقرير الإنجاز المفصل *</label>
                                <textarea 
                                    className="form-control p-4 bg-light border" 
                                    rows="5" 
                                    placeholder="اشرح للعميل الخطوات التي قمت بتنفيذها حتى الآن بالتفصيل..."
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

                            <div className="col-12 text-center mt-5 pt-4 border-top">
                                <button type="submit" className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-2 px-5 py-3 shadow w-100" style={{ fontSize: '22px' }} disabled={saving}>
                                    {saving ? <><FaSpinner className="fa-spin" /> جاري رفع التقرير...</> : <><FaCheckDouble /> رفع التقرير وتحديث نسبة المشروع</>}
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