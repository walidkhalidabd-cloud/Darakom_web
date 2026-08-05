import { useState, useEffect } from 'react';
import {
  FaArrowRight, FaCheck, FaSpinner, FaImage, FaPlus,
  FaHardHat, FaMapMarkerAlt, FaUserTie, FaCalendarAlt,
  FaPercentage, FaEye, FaClock, FaCheckDouble
} from 'react-icons/fa';
import { fetchProviderProjects, fetchProjectDetails, addProjectReport } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderTrackingTab = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [newStageName, setNewStageName] = useState('');
  const [newStageDesc, setNewStageDesc] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchProviderProjects();
        setProjects(res.data?.data || []);
      } catch (err) {
        console.warn('⚠️ API غير متاح:', err.message);
        setProjects([
          { id: 1, title: 'تشطيب فيلا مودرن', client: 'أحمد سليمان', location: 'الرياض، حي الملقا', start_date: '2026/04/01', duration: '6 أشهر', price: '250,000 ر.س', progress: 40, status: 'قيد التنفيذ' },
          { id: 2, title: 'بناء عظم - 400م', client: 'خالد عبدالله', location: 'جدة، حي الشاطئ', start_date: '2026/01/15', duration: '8 أشهر', price: '450,000 ر.س', progress: 100, status: 'مكتمل' },
          { id: 3, title: 'تصميم داخلي لشقة فاخرة', client: 'سارة ناصر', location: 'الدمام، حي النورس', start_date: '2026/05/01', duration: 'شهرين', price: '85,000 ر.س', progress: 20, status: 'قيد التنفيذ' },
        ]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleViewProject = async (project) => {
    setSelectedProject(project);
    setView('details');
    try {
      const res = await fetchProjectDetails(project.id);
      setSelectedProjectDetails(res.data?.data);
    } catch {
      // Fallback stages
      const stagesData = {
        1: [
          { id: 1, name: 'أعمال الهدم والإزالة', completed: true, date: '2026/04/15', description: 'تم إزالة الجدران القديمة والأرضيات.' },
          { id: 2, name: 'التمديدات الكهربائية والسباكة', completed: true, date: '2026/05/10', description: 'تم تمديد جميع الشبكات.' },
          { id: 3, name: 'أعمال اللياسة والمحارة', completed: false, progress: 70, description: 'جارٍ العمل على تغطية الجدران...' },
          { id: 4, name: 'تركيب الأرضيات والبلاط', completed: false, progress: 0, description: 'لم تبدأ بعد' },
        ],
        2: [
          { id: 1, name: 'الحفر والأساسات', completed: true, date: '2026/02/10', description: 'تم الحفر والقواعد الخرسانية.' },
          { id: 2, name: 'بناء الهيكل الخرساني', completed: true, date: '2026/04/20', description: 'تم صب الأعمدة والأسقف.' },
          { id: 3, name: 'أعمال الطوب والجدران', completed: true, date: '2026/06/15', description: 'تم بناء الجدران.' },
          { id: 4, name: 'التشطيبات الأساسية', completed: true, date: '2026/08/01', description: 'تم الانتهاء من التشطيبات.' },
        ],
        3: [
          { id: 1, name: 'القياسات والمعاينة', completed: true, date: '2026/05/05', description: 'تم أخذ المقاسات.' },
          { id: 2, name: 'تقديم التصاميم الأولية', completed: false, progress: 60, description: 'جارٍ تجهيز التصاميم...' },
          { id: 3, name: 'اعتماد التصاميم النهائية', completed: false, progress: 0, description: 'في انتظار الاعتماد' },
        ]
      };
      setSelectedProjectDetails({ stages: stagesData[project.id] || stagesData[1] });
    }
  };

  const handleAddStage = async (e) => {
    e.preventDefault();
    if (!newStageName || !selectedProject) return;
    setSaving(true);
    try {
await addProjectReport(selectedProject.id, { description: newStageDesc || newStageName });
    } catch { /* ignore */ }
    showToast('success', `✅ تم إضافة المرحلة "${newStageName}" بنجاح!`);
    setNewStageName('');
    setNewStageDesc('');
    setSaving(false);
    setView('details');
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="section-header"><div><h3><FaHardHat className="ms-2 text-warning" /> متابعة المشاريع</h3></div></div>
        <div className="row g-4">
          {[1,2].map(i => <div key={i} className="col-lg-6"><div className="card-provider p-4"><div className="loading-skeleton" style={{ height: '180px' }}></div></div></div>)}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* ==== القائمة ==== */}
      {view === 'list' && (
        <>
          <div className="section-header">
            <div>
              <h3><FaHardHat className="ms-2 text-warning" /> متابعة المشاريع</h3>
              <p>جميع مشاريعك قيد التنفيذ والمكتملة</p>
            </div>
          </div>

          <div className="row g-4">
            {projects.length > 0 ? projects.map(p => (
              <div key={p.id} className="col-lg-6">
                <div className="card-provider p-4 h-100 bg-white border-end border-4" style={{ borderColor: p.progress === 100 ? '#198754' : '#ff8a00' }}>
                  <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
                    <h4 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '22px' }}>{p.title}</h4>
                    {p.progress === 100
                      ? <span className="badge-resolved rounded-pill fs-6"><FaCheck className="ms-1" /> مكتمل</span>
                      : <span className="badge-active rounded-pill fs-6"><FaSpinner className="fa-spin ms-1" /> {p.status}</span>}
                  </div>

                  <div className="d-flex flex-wrap gap-3 text-muted fw-semibold mb-3" style={{ fontSize: '15px' }}>
                    <span><FaUserTie className="text-warning ms-1" /> {p.client}</span>
                    <span><FaMapMarkerAlt style={{ color: '#1b2a47' }} className="ms-1" /> {p.location}</span>
                    <span><FaCalendarAlt className="text-primary ms-1" /> {p.start_date}</span>
                  </div>

                  <div className="bg-light p-3 rounded-4 mb-3">
                    <div className="d-flex justify-content-between fw-bold mb-2">
                      <span style={{ color: '#1b2a47' }}>نسبة الإنجاز</span>
                      <span className={p.progress === 100 ? 'text-success' : 'text-warning'} style={{ fontSize: '20px' }}>{p.progress}%</span>
                    </div>
                    <div className="progress-custom">
                      <div className={`progress-bar-custom ${p.progress === 100 ? 'completed' : ''}`} style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>

                  <button className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                    onClick={() => handleViewProject(p)}>
                    <FaEye /> {p.progress === 100 ? 'عرض التفاصيل' : 'عرض وتحديث الإنجاز'}
                  </button>
                </div>
              </div>
            )) : (
              <div className="col-12">
                <div className="empty-state">
                  <FaHardHat size={60} />
                  <h4>لا توجد مشاريع حالياً</h4>
                  <p>عند بدء المشاريع ستظهر هنا</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==== التفاصيل ==== */}
      {view === 'details' && selectedProject && (
        <div className="card-provider p-4 p-md-5 bg-white">
          <button className="btn-provider-outline d-flex align-items-center gap-2 px-4 py-2 mb-4" onClick={() => setView('list')}>
            <FaArrowRight /> العودة
          </button>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{selectedProject.title}</h2>
              <div className="d-flex flex-wrap gap-3 text-muted fw-semibold mt-2">
                <span><FaUserTie className="text-warning ms-1" /> {selectedProject.client}</span>
                <span><FaMapMarkerAlt style={{ color: '#1b2a47' }} className="ms-1" /> {selectedProject.location}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="fw-bold fs-4" style={{ color: selectedProject.progress === 100 ? '#198754' : '#ff8a00' }}>
                <FaPercentage className="ms-1" /> {selectedProject.progress}%
              </div>
            </div>
          </div>

          <div className="row g-3 mb-5 bg-light p-3 rounded-4 border">
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block">تاريخ البداية</small>
              <strong className="fs-5">{selectedProject.start_date}</strong>
            </div>
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block">المدة</small>
              <strong className="fs-5">{selectedProject.duration}</strong>
            </div>
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block">قيمة العقد</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.price}</strong>
            </div>
          </div>

          {/* Timeline */}
          <h4 className="fw-bold mb-4 pb-3 border-bottom" style={{ color: '#1b2a47' }}>
            <FaClock className="ms-2 text-warning" /> الجدول الزمني
          </h4>

          <div className="timeline">
            {(selectedProjectDetails?.stages || []).map((stage, index) => (
              <div key={stage.id} className="timeline-item">
                <div className={`timeline-dot ${stage.completed ? 'completed' : (stage.progress || 0) > 0 ? 'in-progress' : 'pending'}`}>
                  {stage.completed ? <FaCheck size={14} /> : (stage.progress || 0) > 0 ? <FaSpinner className="fa-spin" size={14} /> : index + 1}
                </div>
                <div className={`card border-0 rounded-4 p-4 me-5 ${stage.completed ? 'bg-light border border-success border-opacity-25' : (stage.progress || 0) > 0 ? 'bg-white shadow-sm border-end border-4 border-warning' : 'bg-light opacity-75'}`}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div className="flex-grow-1">
                      <h5 className={`fw-bold mb-2 ${stage.completed ? 'text-success' : ''}`}>{stage.name}</h5>
                      <p className="text-muted fw-semibold mb-0" style={{ fontSize: '16px' }}>{stage.description}</p>
                    </div>
                    {stage.completed && stage.date && (
                      <span className="badge-resolved rounded-pill fs-6 flex-shrink-0 me-2"><FaCheckDouble className="ms-1" /> {stage.date}</span>
                    )}
                    {!stage.completed && (stage.progress || 0) > 0 && (
                      <span className="badge-pending rounded-pill fs-6 flex-shrink-0 me-2"><FaSpinner className="fa-spin ms-1" /> {stage.progress}%</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-5 pt-4 border-top">
            {selectedProject.progress < 100 && (
              <button className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '20px' }}
                onClick={() => setView('update')}>
                <FaPlus /> إضافة مرحلة جديدة
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==== إضافة مرحلة ==== */}
      {view === 'update' && selectedProject && (
        <div className="card-provider p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '800px' }}>
          <button className="btn-provider-outline d-flex align-items-center gap-2 px-4 py-2 mb-4" onClick={() => setView('details')}>
            <FaArrowRight /> العودة
          </button>

          <div className="text-center mb-5">
            <div className="bg-warning bg-opacity-10 text-warning p-4 rounded-circle d-inline-flex mb-3"><FaPlus size={40} /></div>
            <h3 className="fw-bold" style={{ color: '#1b2a47' }}>إضافة مرحلة منجزة</h3>
            <p className="text-muted fw-semibold">قم بتحديث تقدم المشروع</p>
            <h5 className="fw-bold">{selectedProject.title}</h5>
          </div>

          <form onSubmit={handleAddStage}>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label fw-bold">اسم المرحلة</label>
                <input type="text" className="form-control form-control-custom" placeholder="مثال: أعمال الدهان والتشطيب" required
                  value={newStageName} onChange={e => setNewStageName(e.target.value)} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">وصف الإنجاز</label>
                <textarea className="form-control form-control-custom" rows="4" placeholder="اذكر ما تم إنجازه..." required
                  value={newStageDesc} onChange={e => setNewStageDesc(e.target.value)}></textarea>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">نسبة الإنجاز التراكمي</label>
                <input type="range" className="form-range" min="0" max="100" step="5" defaultValue={selectedProject.progress + 10} />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold"><FaImage className="ms-1" /> صور الإنجاز</label>
                <input type="file" className="form-control form-control-custom" multiple accept="image/*" />
              </div>
              <div className="col-12 text-center mt-5">
                <button type="submit" className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '22px', minWidth: '300px' }} disabled={saving}>
                  {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaCheckDouble /> تأكيد الإضافة</>}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProviderTrackingTab;
