import { useState, useEffect, useCallback } from 'react';
import { 
  FaArrowRight, FaCheck, FaSpinner, FaPlus, 
  FaHardHat, FaMapMarkerAlt, FaUserTie, FaCalendarAlt, 
  FaPercentage, FaEye, FaClock, FaCheckDouble,
  FaExclamationTriangle, FaPaperPlane
} from 'react-icons/fa';
import './provider-tabs.css';

// استقبال setActiveTab للتنقل بين الواجهات
const ProviderTrackingTab = ({ setActiveTab }) => {
  const mockProjects = [
    { id: 1, title: 'تنفيذ أعمال السباكة والكهرباء لفيلا سكنية', client: 'أحمد سليمان', location: 'دمشق، المزة', start_date: '15 مارس 2026', duration: '6 أشهر', price: '250,000 ل.س', progress: 45, status: 'قيد التنفيذ', currentStage: 'التمديدات الكهربائية الأساسية' },
    { id: 2, title: 'تشطيب واجهة عمارة سكنية', client: 'خالد عبدالله', location: 'حلب، حي الفردوس', start_date: '1 يناير 2026', duration: '8 أشهر', price: '450,000 ل.س', progress: 100, status: 'مكتمل', currentStage: 'تم التسليم النهائي' },
    { id: 3, title: 'تصميم داخلي وتشطيب شقة فاخرة', client: 'شركة الأفق العقارية', location: 'اللاذقية، الكورنيش', start_date: '10 أبريل 2026', duration: 'شهرين', price: '85,000 ل.س', progress: 20, status: 'قيد التنفيذ', currentStage: 'تقديم التصاميم الأولية للعميل' },
    { id: 4, title: 'ترميم وتجديد فيلا كلاسيكية', client: 'أ. سارة ناصر', location: 'حمص، حي الخالدية', start_date: '5 مايو 2026', duration: '4 أشهر', price: '120,000 ل.س', progress: 60, status: 'قيد التنفيذ', currentStage: 'أعمال اللياسة الداخلية' },
  ];

  const mockStagesData = {
    1: [
      { id: 1, name: 'أعمال الهدم والإزالة', completed: true, date: '2026/04/15', description: 'تم إزالة الجدران القديمة والأرضيات وتجهيز الموقع بالكامل.' },
      { id: 2, name: 'التمديدات الكهربائية والسباكة', completed: true, date: '2026/05/10', description: 'تم تمديد جميع الشبكات الأساسية واختبار ضغط المواسير بنجاح.' },
      { id: 3, name: 'أعمال اللياسة والمحارة', completed: false, progress: 70, description: 'جارٍ العمل على تغطية الجدران الداخلية والخارجية بالأسمنت.' },
      { id: 4, name: 'تركيب الأرضيات والبلاط', completed: false, progress: 0, description: 'ستبدأ المرحلة فور الانتهاء من أعمال اللياسة وتجفافها.' },
    ],
    2: [
      { id: 1, name: 'الحفر والأساسات', completed: true, date: '2026/02/10', description: 'تم الحفر وصب القواعد الخرسانية العادية والمسلحة حسب المخطط.' },
      { id: 2, name: 'بناء الهيكل الخرساني', completed: true, date: '2026/04/20', description: 'تم صب جميع الأعمدة والأسقف لكافة الأدوار.' },
      { id: 3, name: 'أعمال الطوب والجدران', completed: true, date: '2026/06/15', description: 'تم الانتهاء من بناء كافة الجدران الداخلية والخارجية.' },
      { id: 4, name: 'التشطيبات الأساسية والتسليم', completed: true, date: '2026/08/01', description: 'تم الانتهاء من المشروع وتسليمه للعميل بنجاح وبدون أي ملاحظات.' },
    ],
    3: [
      { id: 1, name: 'القياسات والمعاينة', completed: true, date: '2026/05/05', description: 'تم زيارة الموقع وأخذ كافة المقاسات اللازمة للبدء بالتصميم.' },
      { id: 2, name: 'تقديم التصاميم الأولية', completed: false, progress: 60, description: 'جارٍ تجهيز المخططات ثلاثية الأبعاد (3D) لعرضها على العميل.' },
      { id: 3, name: 'اعتماد التصاميم النهائية', completed: false, progress: 0, description: 'في انتظار مراجعة العميل واعتماد التصميم النهائي للبدء بالتنفيذ.' },
    ],
    4: [
      { id: 1, name: 'تجهيز الموقع', completed: true, date: '2026/05/10', description: 'تم تجهيز الموقع وتأمين المواد الأولية للترميم.' },
      { id: 2, name: 'أعمال اللياسة الداخلية', completed: false, progress: 60, description: 'جاري العمل على ترميم وتلييس الجدران الداخلية للمبنى.' }
    ]
  };

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [view, setView] = useState('list'); 
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  const [complaintText, setComplaintText] = useState('');

  const handleViewProject = useCallback((project) => {
    setSelectedProject(project);
    setView('details');
    setSelectedProjectDetails({ stages: mockStagesData[project.id] || mockStagesData[1] });
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setProjects(mockProjects);
      
      const targetProjectStr = localStorage.getItem('openTrackingProject');
      if (targetProjectStr) {
          const targetProject = JSON.parse(targetProjectStr);
          const projectToOpen = mockProjects.find(p => p.title === targetProject.title) || targetProject;
          handleViewProject(projectToOpen);
          localStorage.removeItem('openTrackingProject'); 
      }
      
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [handleViewProject]);

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    alert(`✅ تم إرسال شكواك بخصوص العميل "${selectedProject.client}" إلى إدارة المنصة. سيتم مراجعتها والرد عليك قريباً.`);
    setView('list');
    setSelectedProject(null);
    setSelectedProjectDetails(null);
    setComplaintText('');
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

      {/* ==================== 1. واجهة القائمة الرئيسية (List View) ==================== */}
      {view === 'list' && (
        <>
          <div className="section-header">
            <div>
              <h3><FaHardHat className="ms-2 text-warning" /> متابعة المشاريع</h3>
              <p>تتبع مراحل الإنجاز لمشاريعك قيد التنفيذ والمكتملة</p>
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
                    <span className="d-flex align-items-center"><FaUserTie className="text-warning ms-1" /> {p.client}</span>
                    <span className="d-flex align-items-center"><FaMapMarkerAlt style={{ color: '#1b2a47' }} className="ms-1" /> {p.location}</span>
                    <span className="d-flex align-items-center"><FaCalendarAlt className="text-primary ms-1" /> {p.start_date}</span>
                  </div>

                  <div className="bg-light p-3 rounded-4 mb-4">
                    <div className="d-flex justify-content-between fw-bold mb-2">
                      <span style={{ color: '#1b2a47' }}>نسبة الإنجاز الكلية</span>
                      <span className={p.progress === 100 ? 'text-success' : 'text-warning'} style={{ fontSize: '20px' }}>{p.progress}%</span>
                    </div>
                    <div className="progress-custom">
                      <div className={`progress-bar-custom ${p.progress === 100 ? 'completed' : ''}`} style={{ width: `${p.progress}%` }}></div>
                    </div>
                  </div>

                  <button className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3 mt-auto"
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
                  <p>عند البدء بتنفيذ مشاريع جديدة ستظهر هنا</p>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* ==================== 2. واجهة تفاصيل المشروع والجدول الزمني (Details View) ==================== */}
      {view === 'details' && selectedProject && (
        <div className="card-provider p-4 p-md-5 bg-white">
          <button className="btn-provider-outline d-flex align-items-center gap-2 px-4 py-2 mb-4" onClick={() => setView('list')}>
            <FaArrowRight /> العودة للقائمة
          </button>

          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3 border-bottom pb-4">
            <div>
              <h2 className="fw-bold mb-2" style={{ color: '#1b2a47' }}>{selectedProject.title}</h2>
              <div className="d-flex flex-wrap gap-3 text-muted fw-semibold mt-2">
                <span className="d-flex align-items-center"><FaUserTie className="text-warning ms-1" /> العميل: {selectedProject.client}</span>
                <span className="d-flex align-items-center"><FaMapMarkerAlt style={{ color: '#1b2a47' }} className="ms-1" /> {selectedProject.location}</span>
              </div>
            </div>
            <div className="text-center bg-light p-3 rounded-4 border">
              <div className="fw-bold fs-3" style={{ color: selectedProject.progress === 100 ? '#198754' : '#ff8a00' }}>
                <FaPercentage className="ms-1" /> {selectedProject.progress}%
              </div>
              <span className={`badge ${selectedProject.progress === 100 ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold fs-6 mt-1`}>
                {selectedProject.status}
              </span>
            </div>
          </div>

          <div className="row g-3 mb-5 bg-light p-3 rounded-4 border">
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block mb-1">تاريخ البدء المتفق عليه</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.start_date}</strong>
            </div>
            <div className="col-md-4 text-center border-start border-end">
              <small className="text-muted fw-bold d-block mb-1">المدة الكلية المتوقعة</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.duration}</strong>
            </div>
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block mb-1">قيمة العقد المتفق عليها</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.price}</strong>
            </div>
          </div>

          <h4 className="fw-bold mb-4 pb-3 border-bottom d-flex align-items-center gap-2" style={{ color: '#1b2a47' }}>
            <FaClock className="text-warning" /> الجدول الزمني ومراحل الإنجاز
          </h4>

          <div className="timeline">
            {(selectedProjectDetails?.stages || []).map((stage, index) => (
              <div key={stage.id} className="timeline-item">
                <div className={`timeline-dot ${stage.completed ? 'completed' : (stage.progress || 0) > 0 ? 'in-progress' : 'pending'}`}>
                  {stage.completed ? <FaCheck size={14} /> : (stage.progress || 0) > 0 ? <FaSpinner className="fa-spin" size={14} /> : index + 1}
                </div>
                
                <div className={`card border-0 rounded-4 p-4 me-5 ${stage.completed ? 'bg-light border border-success border-opacity-25 shadow-sm' : (stage.progress || 0) > 0 ? 'bg-white shadow-sm border-end border-4 border-warning' : 'bg-light opacity-75'}`}>
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                    <div className="flex-grow-1">
                      <h5 className={`fw-bold mb-2 ${stage.completed ? 'text-success' : 'text-dark'}`}>{stage.name}</h5>
                      <p className="text-muted fw-semibold mb-0" style={{ fontSize: '16px', lineHeight: '1.6' }}>{stage.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                      {stage.completed && stage.date && (
                        <span className="badge-resolved rounded-pill fs-6"><FaCheckDouble className="ms-1" /> أُنجزت في: {stage.date}</span>
                      )}
                      {!stage.completed && (stage.progress || 0) > 0 && (
                        <span className="badge-pending rounded-pill fs-6"><FaSpinner className="fa-spin ms-1" /> نسبة المرحلة: {stage.progress}%</span>
                      )}
                    </div>
                  </div>

                  {!stage.completed && (stage.progress || 0) > 0 && (
                    <div className="mt-3">
                      <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                        <div className="progress-bar bg-warning progress-bar-striped progress-bar-animated" style={{ width: `${stage.progress}%`, borderRadius: '10px' }}></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-center gap-3 mt-5 pt-4 border-top flex-wrap">
            {selectedProject.progress < 100 && (
              <button 
                className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3 shadow" 
                style={{ fontSize: '18px' }}
                onClick={() => {
                    // التعديل هنا: تخزين المشروع والانتقال لتبويب مشاريعي لفتح نافذة الإضافة
                    localStorage.setItem('projectToUpdateStage', JSON.stringify(selectedProject));
                    if (setActiveTab) setActiveTab('projects');
                }}
              >
                <FaPlus /> تحديث / إضافة إنجاز جديد
              </button>
            )}
            
            {selectedProject.progress > 0 && selectedProject.progress < 100 && (
              <button 
                className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-danger d-flex align-items-center gap-2 border border-danger bg-white"
                style={{ fontSize: '18px' }}
                onClick={() => setView('complaint')}
              >
                <FaExclamationTriangle /> تقديم شكوى ضد العميل
              </button>
            )}
          </div>
        </div>
      )}

      {/* ==================== 3. واجهة تقديم شكوى ضد العميل (Complaint View) ==================== */}
      {view === 'complaint' && selectedProject && (
        <div className="card-provider border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto border-end border-4 border-danger" style={{ maxWidth: '800px' }}>
          <button 
            className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
            onClick={() => setView('details')}
          >
            <FaArrowRight /> التراجع
          </button>

          <div className="text-center mb-5">
            <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-circle d-inline-flex mb-3">
              <FaExclamationTriangle size={40} />
            </div>
            <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تقديم شكوى ضد العميل</h3>
            <p className="text-muted fw-semibold fs-5">نحن هنا لحماية حقوقك ومساعدتك في حل أي نزاع.</p>
          </div>

          <form onSubmit={handleSubmitComplaint}>
            <div className="row g-4 mb-4 bg-light p-4 rounded-4 border">
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>اسم العميل</label>
                <div className="form-control p-3 bg-white text-muted fw-bold border-0 shadow-sm" style={{ fontSize: '17px', borderRadius: '12px' }}>
                  <FaUserTie className="ms-2 text-warning"/> {selectedProject.client}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>المشروع المرتبط</label>
                <div className="form-control p-3 bg-white text-muted fw-bold border-0 shadow-sm" style={{ fontSize: '17px', borderRadius: '12px' }}>
                  <FaHardHat className="ms-2 text-warning"/> {selectedProject.title}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>وصف المشكلة التي تواجهها مع العميل بدقة</label>
              <textarea 
                className="form-control p-4 bg-light border" 
                rows="6" 
                placeholder="اشرح المشكلة... مثلاً: تأخر في سداد الدفعات، طلب تعديلات خارج العقد المتفق عليه، إلخ."
                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px', lineHeight: '1.8' }}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="alert alert-warning rounded-4 p-4 mb-4 d-flex align-items-center gap-3 border border-warning border-opacity-25">
              <FaExclamationTriangle className="fs-1 text-warning flex-shrink-0" />
              <div>
                <strong className="d-block text-dark fs-5 mb-1">ملاحظة هامة:</strong>
                <span className="fw-semibold text-muted">سيتم إرسال شكواك إلى إدارة المنصة للمراجعة والتحقق من بنود العقد. سيتم التواصل معك والرد عليك خلال مدة أقصاها 48 ساعة.</span>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 flex-wrap mt-5">
              <button type="submit" className="btn btn-danger fw-bold px-5 py-3 rounded-pill shadow d-flex align-items-center gap-2" style={{ fontSize: '20px' }}>
                <FaPaperPlane /> إرسال الشكوى للإدارة
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default ProviderTrackingTab;