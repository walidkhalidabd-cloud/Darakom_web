import { useState, useEffect } from 'react';
import { 
  FaArrowRight, FaCheck, FaSpinner, FaHardHat, FaMapMarkerAlt, 
  FaUserTie, FaCalendarAlt, FaProjectDiagram,
  FaCheckDouble, FaEye, FaExclamationTriangle, FaStar,
  FaPercentage, FaHourglassHalf, FaCheckCircle, FaPaperPlane
} from 'react-icons/fa';
import { fetchClientOngoingProjects, fetchClientProjectTracking, submitClientComplaint } from '../../../services/api/clientApi';
import ProjectRatingForm from '../../../components/ProjectRatingForm';
import ImageUploader from '../../../components/ImageUploader';

const TrackingTab = ({ setActiveTab }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectDetails, setSelectedProjectDetails] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'details' | 'complaint' | 'rate'
const [loading, setLoading] = useState(true);
  const [complaintText, setComplaintText] = useState('');
  const [complaintProvider, setComplaintProvider] = useState('');
  const [complaintProject, setComplaintProject] = useState('');
  const [complaintImages, setComplaintImages] = useState([]);

  // تحميل المشاريع قيد التنفيذ والمكتملة
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const res = await fetchClientOngoingProjects();
        setProjects(res.data?.data || []);
      } catch (err) {
        console.warn('⚠️ API غير متاح، استخدام بيانات وهمية:', err.message);
        // بيانات وهمية مطابقة لهيكل مشاريع المتابعة
        setProjects([
          { 
            id: 1, title: 'بناء عظم - مساحة 400م', provider: 'مؤسسة البناء الذهبي', 
            providerType: 'مقاول معتمد', location: 'دمشق، المزة', startDate: '2026/05/01',
            duration: '6 أشهر', price: '150,000', progress: 65, status: 'قيد التنفيذ',
            stageInfo: 'تم الانتهاء من المرحلة الثانية'
          },
          { 
            id: 2, title: 'تصميم داخلي لفيلا مودرن', provider: 'مكتب الإبداع الهندسي',
            providerType: 'مكتب هندسي', location: 'اللاذقية، الكورنيش', startDate: '2026/03/01',
            duration: 'شهرين', price: '45,000', progress: 100, status: 'مكتمل',
            stageInfo: 'جميع المراحل منجزة ✓'
          },
          { 
            id: 3, title: 'تأسيس شبكة كاميرات مراقبة', provider: 'م. أحمد خالد',
            providerType: 'مهندس اتصالات', location: 'دمشق، المهاجرين', startDate: '2026/07/01',
            duration: 'أسبوعين', price: '7,500', progress: 30, status: 'قيد التنفيذ',
            stageInfo: 'تم تركيب الكاميرات الخارجية'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // جلب تفاصيل المشروع (المراحل)
  const handleViewProject = async (project) => {
    setSelectedProject(project);
    setView('details');
    try {
const res = await fetchClientProjectTracking(project.id);
      setSelectedProjectDetails(res.data?.data);
    } catch {
      // بيانات وهمية للمراحل حسب المشروع
      const stagesData = {
        1: [
          { id: 1, name: 'أعمال الحفر والأساسات', completed: true, date: '2026/05/20', description: 'تم الانتهاء من الحفر وصب الأساسات حسب المخططات الهندسية.' },
          { id: 2, name: 'أعمال الهيكل الخرساني', completed: true, date: '2026/06/30', description: 'تم صب الأعمدة والأسقف لكامل المساحة.' },
          { id: 3, name: 'أعمال الطابوق واللياسة', completed: false, progress: 40, description: 'جارٍ العمل على بناء الجدران ولياسة الأسقف...' },
          { id: 4, name: 'التشطيبات النهائية', completed: false, progress: 0, description: 'لم تبدأ بعد - ستبدأ بعد الانتهاء من اللياسة.' },
        ],
        2: [
          { id: 1, name: 'رفع المساحات والقياسات', completed: true, date: '2026/03/10', description: 'تم رفع جميع القياسات للمساحات الداخلية.' },
          { id: 2, name: 'التصاميم ثلاثية الأبعاد', completed: true, date: '2026/04/01', description: 'تم تسليم التصاميم ثلاثية الأبعاد واعتمادها.' },
          { id: 3, name: 'المخططات التنفيذية', completed: true, date: '2026/04/28', description: 'تم تسليم جميع المخططات التنفيذية للكهرباء والسباكة.' },
          { id: 4, name: 'الإشراف على التنفيذ', completed: true, date: '2026/05/15', description: 'تم الإشراف الكامل والانتهاء من المشروع.' },
        ],
        3: [
          { id: 1, name: 'تركيب الكاميرات الخارجية', completed: true, date: '2026/07/10', description: 'تم تركيب 8 كاميرات خارجية HDCVI.' },
          { id: 2, name: 'تركيب الكاميرات الداخلية', completed: false, progress: 60, description: 'جارٍ تركيب الكاميرات الداخلية...' },
          { id: 3, name: 'برمجة النظام والتجربة', completed: false, progress: 0, description: 'لم تبدأ بعد.' },
        ]
      };
      setSelectedProjectDetails({ stages: stagesData[project.id] || stagesData[1] });
    }
  };

// تقديم شكوى
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    try {
      await submitClientComplaint({
        providerName: complaintProvider || selectedProject?.provider,
        projectTitle: complaintProject || selectedProject?.title,
        description: complaintText,
        images: complaintImages
      });
    } catch (err) {
      console.warn('⚠️ API غير متاح:', err.message);
    }
    alert(`✅ تم إرسال شكواك بخصوص المشروع "${selectedProject.title}" إلى إدارة المنصة. سيتم مراجعتها والرد عليك قريباً.`);
    setView('list');
    setSelectedProject(null);
    setSelectedProjectDetails(null);
    setComplaintText('');
    setComplaintProvider('');
    setComplaintProject('');
    setComplaintImages([]);
  };

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="d-flex align-items-center gap-3 mb-5 border-bottom pb-3">
          <h3 className="fw-bold text-dark mb-1">متابعة سير المشاريع <FaHardHat className="text-warning ms-2" /></h3>
        </div>
        <div className="row g-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="col-lg-6 col-xl-4">
              <div className="card border-0 shadow-sm rounded-4 p-4">
                <div className="placeholder-glow">
                  <div className="placeholder col-12" style={{ height: '180px', borderRadius: '12px' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      
      {/* ================ القائمة الرئيسية ================ */}
      {view === 'list' && (
        <>
          <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
            <div>
              <h3 className="fw-bold text-dark mb-1">متابعة سير المشاريع <FaHardHat className="text-warning ms-2" /></h3>
              <p className="text-muted fw-semibold mb-0">تتبع مراحل مشاريعك قيد التنفيذ والمكتملة مع تفاصيل التقدم.</p>
            </div>
          </div>

          {projects.length > 0 ? (
            <div className="row g-4">
              {projects.map(project => (
                <div key={project.id} className="col-lg-6 col-xl-4">
                  <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-end border-4 ${project.progress === 100 ? 'border-success' : 'border-warning'}`}>
                    
                    {/* رأس البطاقة */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                          <FaHardHat className={project.progress === 100 ? 'text-success fs-4' : 'text-warning fs-4'} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '17px' }}>{project.title}</h5>
                          <small className="text-muted fw-semibold">{project.provider}</small>
                        </div>
                      </div>
                      <span className={`badge ${project.progress === 100 ? 'bg-success' : 'bg-warning text-dark'} rounded-pill px-3 py-2 fw-bold fs-6`} style={{ whiteSpace: 'nowrap' }}>
                        {project.progress === 100 ? <><FaCheck className="me-1" /> مكتمل</> : <><FaSpinner className="fa-spin me-1" /> {project.progress}%</>}
                      </span>
                    </div>

                    {/* شريط التقدم */}
                    <div className="mb-3">
                      <div className="d-flex justify-content-between text-muted small fw-bold mb-1">
                        <span>نسبة الإنجاز</span>
                        <span className={project.progress === 100 ? 'text-success' : 'text-warning'}>{project.progress}%</span>
                      </div>
                      <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                        <div 
                          className={`progress-bar ${project.progress === 100 ? 'bg-success' : 'bg-warning progress-bar-striped progress-bar-animated'}`} 
                          style={{ width: `${project.progress}%`, borderRadius: '10px' }}
                        ></div>
                      </div>
                    </div>

                    {/* معلومات سريعة */}
                    <div className="d-flex flex-wrap gap-2 text-muted fw-semibold small mb-3">
                      <span><FaMapMarkerAlt className="text-warning ms-1" /> {project.location}</span>
                      <span><FaCalendarAlt className="text-primary ms-1" /> {project.startDate}</span>
                    </div>

                    {/* آخر تحديث */}
                    <div className="bg-light p-3 rounded-3 mb-3">
                      <small className="text-muted fw-bold d-block mb-1">آخر تحديث:</small>
                      <span className="fw-semibold" style={{ fontSize: '15px', color: '#1b2a47' }}>{project.stageInfo}</span>
                    </div>

                    {/* زر عرض التفاصيل */}
                    <button 
                      className={`btn w-100 fw-bold py-2 rounded-pill shadow-sm text-white d-flex align-items-center justify-content-center gap-2 mt-auto`}
                      style={{ backgroundColor: '#1b2a47', fontSize: '16px' }}
                      onClick={() => handleViewProject(project)}
                    >
                      <FaEye /> {project.progress === 100 ? 'عرض التفاصيل والتقييم' : 'عرض وتتبع الإنجاز'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <FaHardHat className="text-muted mb-3 opacity-25" size={60} />
              <h4 className="text-muted fw-bold">لا توجد مشاريع قيد التنفيذ حالياً</h4>
              <p className="text-muted fw-semibold">عند الموافقة على عرض لمشروعك سيظهر هنا لتتمكن من متابعة سير العمل.</p>
              <button 
                className="btn fw-bold px-5 py-3 rounded-pill shadow-sm mt-3"
                style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }}
                onClick={() => setActiveTab('offers-public')}
              >
                استعرض العروض المقدمة
              </button>
            </div>
          )}
        </>
      )}

      {/* ================ تفاصيل المشروع مع الجدول الزمني ================ */}
      {view === 'details' && selectedProject && (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
          {/* زر العودة */}
          <button 
            className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
            onClick={() => { setView('list'); setSelectedProjectDetails(null); }}
          >
            <FaArrowRight /> العودة للقائمة
          </button>

          {/* رأس التفاصيل */}
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 border-bottom pb-4">
            <div>
              <h2 className="fw-bold mb-2" style={{ color: '#1b2a47' }}>{selectedProject.title}</h2>
              <div className="d-flex flex-wrap gap-3 text-muted fw-semibold">
                <span><FaUserTie className="text-warning ms-1" /> {selectedProject.provider}</span>
                <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-1 rounded-pill border">{selectedProject.providerType}</span>
                <span><FaMapMarkerAlt className="text-danger ms-1" /> {selectedProject.location}</span>
              </div>
            </div>
            <div className="text-center">
              <div className="fw-bold fs-2" style={{ color: selectedProject.progress === 100 ? '#10b981' : '#ff8a00' }}>
                <FaPercentage className="ms-1" /> {selectedProject.progress}%
              </div>
              <span className={`badge ${selectedProject.progress === 100 ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold fs-6 mt-1`}>
                {selectedProject.status}
              </span>
            </div>
          </div>

          {/* معلومات المشروع الأساسية */}
          <div className="row g-3 mb-5 bg-light p-3 rounded-4 border">
            <div className="col-md-4 text-center border-md-start">
              <small className="text-muted fw-bold d-block">تاريخ البداية</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.startDate}</strong>
            </div>
            <div className="col-md-4 text-center border-md-start">
              <small className="text-muted fw-bold d-block">المدة</small>
              <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.duration}</strong>
            </div>
            <div className="col-md-4 text-center">
              <small className="text-muted fw-bold d-block">قيمة العقد</small>
              <strong className="fs-5" style={{ color: '#ff8a00' }}>{selectedProject.price} ل.س</strong>
            </div>
          </div>

          {/* شريط التقدم الكلي */}
          <div className="mb-5">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>
                <FaProjectDiagram className="ms-2 text-warning" /> مراحل المشروع
              </h5>
              <span className="fw-bold" style={{ color: selectedProject.progress === 100 ? '#10b981' : '#ff8a00', fontSize: '20px' }}>
                {selectedProject.progress}% مكتمل
              </span>
            </div>
            <div className="progress mb-4" style={{ height: '14px', borderRadius: '10px' }}>
              <div 
                className={`progress-bar ${selectedProject.progress === 100 ? 'bg-success' : 'bg-warning progress-bar-striped progress-bar-animated'}`} 
                style={{ width: `${selectedProject.progress}%`, borderRadius: '10px' }}
              ></div>
            </div>
          </div>

          {/* Timeline للمراحل */}
          <div className="position-relative me-3" style={{ paddingRight: '30px' }}>
            {(selectedProjectDetails?.stages || []).length > 0 ? (
              (selectedProjectDetails?.stages || []).map((stage, index) => (
                <div key={stage.id} className="mb-5 position-relative px-4">
                  {/* الدائرة الزمنية */}
                  <div 
                    className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                    style={{ 
                      width: '44px', height: '44px', 
                      right: '-37px', top: '0', 
                      backgroundColor: stage.completed ? '#10b981' : (stage.progress || 0) > 0 ? '#ff8a00' : '#cbd5e1',
                      fontSize: '16px',
                      zIndex: 2
                    }}
                  >
                    {stage.completed ? <FaCheck /> : (stage.progress || 0) > 0 ? <FaSpinner className="fa-spin" /> : index + 1}
                  </div>
                  
                  {/* الخط الرابط */}
                  {index < (selectedProjectDetails?.stages || []).length - 1 && (
                    <div 
                      className="position-absolute"
                      style={{ 
                        width: '3px', 
                        right: '-15px', 
                        top: '44px', 
                        bottom: '-20px',
                        backgroundColor: stage.completed ? '#10b981' : '#e2e8f0',
                        zIndex: 1
                      }}
                    ></div>
                  )}

                  {/* بطاقة المرحلة */}
                  <div className={`rounded-4 p-4 border ${stage.completed ? 'bg-light border-success border-opacity-25' : (stage.progress || 0) > 0 ? 'bg-white shadow-sm border-end border-4 border-warning' : 'bg-light opacity-75'}`}>
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="flex-grow-1">
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <h5 className={`fw-bold mb-0 ${stage.completed ? 'text-success' : ''}`} style={{ fontSize: '18px' }}>
                            {stage.name}
                          </h5>
                          {stage.completed && <FaCheckCircle className="text-success fs-5" />}
                        </div>
                        <p className="text-muted fw-semibold mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                          {stage.description}
                        </p>
                      </div>
                      <div className="me-3 flex-shrink-0">
                        {stage.completed && stage.date && (
                          <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                            <FaCheckDouble className="ms-1" /> {stage.date}
                          </span>
                        )}
                        {!stage.completed && (stage.progress || 0) > 0 && (
                          <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                            <FaSpinner className="fa-spin ms-1" /> {stage.progress}%
                          </span>
                        )}
                        {!stage.completed && !stage.progress && (
                          <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                            <FaHourglassHalf className="ms-1" /> قيد الانتظار
                          </span>
                        )}
                      </div>
                    </div>

                    {/* شريط تقدم للمراحل غير المكتملة والتي قيد العمل */}
                    {!stage.completed && (stage.progress || 0) > 0 && (
                      <div className="mt-3">
                        <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                          <div className="progress-bar bg-warning" style={{ width: `${stage.progress}%`, borderRadius: '10px' }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-5">
                <FaProjectDiagram className="text-muted mb-3 opacity-25" size={50} />
                <h4 className="text-muted fw-bold">لم يتم إضافة مراحل بعد</h4>
                <p className="text-muted fw-semibold">مزود الخدمة سيضيف مراحل المشروع تباعاً عند بدء العمل.</p>
              </div>
            )}
          </div>

          {/* أزرار الإجراءات */}
          <div className="d-flex justify-content-center gap-3 mt-5 pt-4 border-top flex-wrap">
{selectedProject.progress === 100 && (
              <button 
                className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
                style={{ backgroundColor: '#ff8a00', fontSize: '18px' }}
                onClick={() => setView('rate')}
              >
                <FaStar /> تقييم المشروع
              </button>
            )}
            {selectedProject.progress < 100 && selectedProject.progress > 0 && (
              <button 
                className="btn fw-bold px-5 py-3 rounded-pill shadow-sm btn-danger d-flex align-items-center gap-2"
                style={{ fontSize: '18px' }}
                onClick={() => setView('complaint')}
              >
                <FaExclamationTriangle /> تقديم شكوى
              </button>
            )}
            <button 
              className="btn fw-bold px-5 py-3 rounded-pill shadow-sm"
              style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '18px' }}
              onClick={() => { setView('list'); setSelectedProjectDetails(null); }}
            >
              <FaArrowRight /> العودة
            </button>
          </div>
        </div>
      )}

{/* ================ واجهة تقييم المشروع (نجوم + تعليق) ================ */}
      {view === 'rate' && selectedProject && (
        <ProjectRatingForm
          project={selectedProject}
          onBack={() => { setView('details'); setSelectedProjectDetails(null); }}
        />
      )}

      {/* ================ نموذج تقديم شكوى ================ */}
      {view === 'complaint' && selectedProject && (
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '800px' }}>
          <button 
            className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
            onClick={() => setView('details')}
          >
            <FaArrowRight /> العودة للتفاصيل
          </button>

          <div className="text-center mb-5">
            <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-circle d-inline-flex mb-3">
              <FaExclamationTriangle size={40} />
            </div>
            <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تقديم شكوى</h3>
            <p className="text-muted fw-semibold fs-5">
              مشروع: {selectedProject.title}
            </p>
            <p className="text-muted fw-semibold">
              مزود الخدمة: {selectedProject.provider}
            </p>
          </div>

<form onSubmit={handleSubmitComplaint}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>اسم مزود الخدمة</label>
                <input 
                  type="text" 
                  className="form-control p-3 bg-light border" 
                  placeholder="أدخل اسم مزود الخدمة"
                  style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}
                  value={complaintProvider}
                  onChange={(e) => setComplaintProvider(e.target.value)}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>المشروع المرتبط</label>
                <input 
                  type="text" 
                  className="form-control p-3 bg-light border" 
                  placeholder="أدخل اسم المشروع"
                  style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}
                  value={complaintProject}
                  onChange={(e) => setComplaintProject(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold fs-5 mb-3" style={{ color: '#1b2a47' }}>وصف المشكلة بالتفصيل</label>
              <textarea 
                className="form-control p-4 bg-light border" 
                rows="6" 
                placeholder="اشرح المشكلة التي تواجهها مع مزود الخدمة أو سير العمل..."
                style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px', lineHeight: '1.8' }}
                value={complaintText}
                onChange={(e) => setComplaintText(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-4">
              <ImageUploader 
                images={complaintImages} 
                onChange={setComplaintImages} 
                label="صور المشكلة"
              />
            </div>

            <div className="alert alert-warning rounded-4 p-4 mb-4 d-flex align-items-center gap-3">
              <FaExclamationTriangle className="fs-3 flex-shrink-0" />
              <div>
                <strong className="d-block">ملاحظة:</strong>
                <span className="fw-semibold">سيتم إرسال شكواك إلى إدارة المنصة للمراجعة والتحقق. سيتم الرد عليك خلال مدة أقصاها 48 ساعة.</span>
              </div>
            </div>

            <div className="d-flex justify-content-center gap-3 flex-wrap">
<button type="submit" className="btn btn-danger fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" style={{ fontSize: '20px' }}>
                <FaPaperPlane /> إرسال الشكوى
              </button>
              <button 
                type="button" 
                className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
                style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '20px' }}
                onClick={() => setView('details')}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};

export default TrackingTab;

