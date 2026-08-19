import { useState, useEffect, useCallback } from 'react';
import { 
  FaArrowRight, FaCheck, FaSpinner, FaHardHat, FaMapMarkerAlt, 
  FaUserTie, FaCalendarAlt, FaProjectDiagram,
  FaCheckDouble, FaEye, FaExclamationTriangle, FaStar,
  FaPercentage, FaHourglassHalf, FaCheckCircle, FaPaperPlane
} from 'react-icons/fa';
// يجب التأكد من وجود هذه الدوال في ملف clientApi.js الخاص بك
import { fetchClientOngoingProjects, fetchClientProjectSteps, submitClientComplaint } from '../../../services/api/clientApi';
import ProjectRatingForm from '../../../components/ProjectRatingForm';

const TrackingTab = ({ setActiveTab, targetProject, setTargetProject }) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedProjectSteps, setSelectedProjectSteps] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'details' | 'complaint' | 'rate'
  const [loading, setLoading] = useState(true);
  const [loadingSteps, setLoadingSteps] = useState(false);
  const [complaintText, setComplaintText] = useState('');

  // تحميل المشاريع قيد التنفيذ والمكتملة
  useEffect(() => {
    const loadProjects = async () => {
      setLoading(true);
      try {
        const res = await fetchClientOngoingProjects();
        // تصفية المشاريع لعرض المشاريع النشطة والمكتملة فقط
        const allProjects = res.data?.data || res.data || [];
        const activeProjects = allProjects.filter(p => 
            p.status === 'active' || p.execution_status === 'in_progress' || p.execution_status === 'finished' || p.status === 'completed'
        );
        setProjects(activeProjects);
      } catch (err) {
        console.error('Error loading ongoing projects:', err);
      } finally {
        setLoading(false);
      }
    };
    loadProjects();
  }, []);

  // جلب تفاصيل خطوات/مراحل المشروع
  const handleViewProject = useCallback(async (project) => {
    setSelectedProject(project);
    setView('details');
    setLoadingSteps(true);
    
    try {
      // استدعاء دالة جلب الخطوات من الباك إند
      const res = await fetchClientProjectSteps(project.id);
      const stepsData = res.data?.data || res.data || [];
      
      // ترتيب الخطوات حسب المعرف أو تاريخ الإنشاء لضمان تسلسل زمني صحيح
      const sortedSteps = [...stepsData].sort((a, b) => a.id - b.id);
      setSelectedProjectSteps(sortedSteps);
    } catch (err) {
        console.error("Error fetching project steps:", err);
        setSelectedProjectSteps([]);
    } finally {
        setLoadingSteps(false);
    }
  }, []);

  // فتح تفاصيل المشروع تلقائياً إذا تم التوجيه من واجهة أخرى
  useEffect(() => {
    if (targetProject) {
      handleViewProject(targetProject);
      if (setTargetProject) setTargetProject(null);
    }
  }, [targetProject, handleViewProject, setTargetProject]);

  // تقديم شكوى
  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    if (!complaintText.trim()) return;
    try {
      await submitClientComplaint({
        project_id: selectedProject?.id,
        against_user_id: selectedProject?.performer?.user?.id || null,
        type: 'general',
        text: complaintText
      });
      alert(`✅ تم إرسال شكواك بخصوص المشروع "${selectedProject.title}" إلى إدارة المنصة بنجاح.`);
    } catch (err) {
      console.error('Error submitting complaint:', err);
      alert('حدث خطأ أثناء إرسال الشكوى.');
    }
    
    setView('list');
    setSelectedProject(null);
    setComplaintText('');
  };

  // دالة لحساب نسبة إنجاز المشروع بناءً على الخطوات
  const calculateProjectProgress = (steps) => {
      if (!steps || steps.length === 0) return 0;
      const totalSteps = steps.length;
      const completedSteps = steps.filter(s => s.status === 'completed' || s.progress_percent === 100).length;
      
      // إذا كانت كل الخطوات مكتملة
      if(totalSteps === completedSteps) return 100;

      // حساب المتوسط العام لنسبة الإنجاز لكل الخطوات
      const totalProgress = steps.reduce((sum, step) => sum + (step.progress_percent || 0), 0);
      return Math.round(totalProgress / totalSteps);
  };

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="d-flex align-items-center gap-3 mb-5 border-bottom pb-3">
          <h3 className="fw-bold text-dark mb-1">متابعة سير المشاريع <FaHardHat className="text-warning ms-2" /></h3>
        </div>
        <div className="text-center py-5">
            <FaSpinner className="fa-spin fs-1 text-warning" />
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
              {projects.map(project => {
                  const isCompleted = project.execution_status === 'finished' || project.status === 'completed';
                  // يمكن استبدال هذه ببيانات حقيقية من الباك إند إن وجدت
                  const progress = isCompleted ? 100 : (project.progress_percent || 50); 
                  const providerName = project.performer?.user?.name || project.performer?.user?.full_name || 'مزود الخدمة';
                  
                  return (
                <div key={project.id} className="col-lg-6 col-xl-4">
                  <div className={`card border-0 shadow-sm rounded-4 p-4 h-100 bg-white border-end border-4 ${isCompleted ? 'border-success' : 'border-warning'}`}>
                    
                    {/* رأس البطاقة */}
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <div className="d-flex align-items-center gap-2">
                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
                          <FaHardHat className={isCompleted ? 'text-success fs-4' : 'text-warning fs-4'} />
                        </div>
                        <div>
                          <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '17px' }}>{project.title}</h5>
                          <small className="text-muted fw-semibold">{providerName}</small>
                        </div>
                      </div>
                      <span className={`badge ${isCompleted ? 'bg-success' : 'bg-warning text-dark'} rounded-pill px-3 py-2 fw-bold fs-6`} style={{ whiteSpace: 'nowrap' }}>
                        {isCompleted ? <><FaCheck className="me-1" /> مكتمل</> : <><FaSpinner className="fa-spin me-1" /> قيد التنفيذ</>}
                      </span>
                    </div>

                    {/* معلومات سريعة */}
                    <div className="d-flex flex-wrap gap-2 text-muted fw-semibold small mb-4 mt-2">
                      <span><FaMapMarkerAlt className="text-warning ms-1" /> {project.location_details || project.province?.name || 'موقع المشروع'}</span>
                    </div>

                    {/* زر عرض التفاصيل */}
                    <button 
                      className={`btn w-100 fw-bold py-2 rounded-pill shadow-sm text-white d-flex align-items-center justify-content-center gap-2 mt-auto`}
                      style={{ backgroundColor: '#1b2a47', fontSize: '16px' }}
                      onClick={() => handleViewProject(project)}
                    >
                      <FaEye /> {isCompleted ? 'عرض التفاصيل والتقييم' : 'عرض وتتبع الإنجاز'}
                    </button>
                  </div>
                </div>
              )})}
            </div>
          ) : (
            <div className="text-center py-5">
              <FaHardHat className="text-muted mb-3 opacity-25" size={60} />
              <h4 className="text-muted fw-bold">لا توجد مشاريع قيد التنفيذ حالياً</h4>
              <p className="text-muted fw-semibold">عند الموافقة على عرض لمشروعك وبدء تنفيذه، سيظهر هنا.</p>
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
            onClick={() => { setView('list'); setSelectedProjectSteps([]); }}
          >
            <FaArrowRight /> العودة للقائمة
          </button>

          {/* حساب المتغيرات */}
          {(() => {
              const isCompleted = selectedProject.execution_status === 'finished' || selectedProject.status === 'completed';
              const providerName = selectedProject.performer?.user?.name || selectedProject.performer?.user?.full_name || 'مزود الخدمة';
              const providerType = selectedProject.performer?.role?.name || 'مزود خدمة';
              const calculatedProgress = calculateProjectProgress(selectedProjectSteps);
              const finalProgress = isCompleted ? 100 : calculatedProgress;

              return (
              <>
                  {/* رأس التفاصيل */}
                  <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 border-bottom pb-4">
                    <div>
                      <h2 className="fw-bold mb-2" style={{ color: '#1b2a47' }}>{selectedProject.title}</h2>
                      <div className="d-flex flex-wrap gap-3 text-muted fw-semibold">
                        <span><FaUserTie className="text-warning ms-1" /> {providerName}</span>
                        <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-1 rounded-pill border">{providerType}</span>
                        <span><FaMapMarkerAlt className="text-danger ms-1" /> {selectedProject.location_details || 'موقع غير محدد'}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="fw-bold fs-2" style={{ color: finalProgress === 100 ? '#10b981' : '#ff8a00' }}>
                        <FaPercentage className="ms-1" /> {finalProgress}%
                      </div>
                      <span className={`badge ${finalProgress === 100 ? 'bg-success' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold fs-6 mt-1`}>
                        {isCompleted ? 'مكتمل' : 'قيد التنفيذ'}
                      </span>
                    </div>
                  </div>

                  {/* معلومات المشروع الأساسية */}
                  <div className="row g-3 mb-5 bg-light p-3 rounded-4 border">
                    <div className="col-md-6 text-center border-md-start">
                      <small className="text-muted fw-bold d-block">تاريخ البداية المتوقع</small>
                      <strong className="fs-5" style={{ color: '#1b2a47' }}>{selectedProject.start_date || 'غير محدد'}</strong>
                    </div>
                    <div className="col-md-6 text-center">
                      <small className="text-muted fw-bold d-block">قيمة الميزانية التقديرية</small>
                      <strong className="fs-5" style={{ color: '#ff8a00' }}>{selectedProject.budget || 'غير محدد'} ل.س</strong>
                    </div>
                  </div>

                  {/* شريط التقدم الكلي */}
                  <div className="mb-5">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>
                        <FaProjectDiagram className="ms-2 text-warning" /> مراحل المشروع
                      </h5>
                    </div>
                    <div className="progress mb-4" style={{ height: '14px', borderRadius: '10px' }}>
                      <div 
                        className={`progress-bar ${finalProgress === 100 ? 'bg-success' : 'bg-warning progress-bar-striped progress-bar-animated'}`} 
                        style={{ width: `${finalProgress}%`, borderRadius: '10px' }}
                      ></div>
                    </div>
                  </div>

                  {/* Timeline للمراحل */}
                  <div className="position-relative me-3" style={{ paddingRight: '30px' }}>
                    {loadingSteps ? (
                         <div className="text-center py-4"><FaSpinner className="fa-spin fs-2 text-warning" /></div>
                    ) : selectedProjectSteps.length > 0 ? (
                      selectedProjectSteps.map((stage, index) => {
                          const isStageCompleted = stage.status === 'completed' || stage.progress_percent === 100;
                          const stageProgress = stage.progress_percent || 0;
                          
                          return (
                        <div key={stage.id} className="mb-5 position-relative px-4">
                          {/* الدائرة الزمنية */}
                          <div 
                            className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold shadow-sm"
                            style={{ 
                              width: '44px', height: '44px', 
                              right: '-37px', top: '0', 
                              backgroundColor: isStageCompleted ? '#10b981' : stageProgress > 0 ? '#ff8a00' : '#cbd5e1',
                              fontSize: '16px',
                              zIndex: 2
                            }}
                          >
                            {isStageCompleted ? <FaCheck /> : stageProgress > 0 ? <FaSpinner className="fa-spin" /> : index + 1}
                          </div>
                          
                          {/* الخط الرابط */}
                          {index < selectedProjectSteps.length - 1 && (
                            <div 
                              className="position-absolute"
                              style={{ 
                                width: '3px', 
                                right: '-15px', 
                                top: '44px', 
                                bottom: '-20px',
                                backgroundColor: isStageCompleted ? '#10b981' : '#e2e8f0',
                                zIndex: 1
                              }}
                            ></div>
                          )}

                          {/* بطاقة المرحلة */}
                          <div className={`rounded-4 p-4 border ${isStageCompleted ? 'bg-light border-success border-opacity-25' : stageProgress > 0 ? 'bg-white shadow-sm border-end border-4 border-warning' : 'bg-light opacity-75'}`}>
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="d-flex align-items-center gap-2 mb-2">
                                  <h5 className={`fw-bold mb-0 ${isStageCompleted ? 'text-success' : ''}`} style={{ fontSize: '18px' }}>
                                    {stage.title}
                                  </h5>
                                  {isStageCompleted && <FaCheckCircle className="text-success fs-5" />}
                                </div>
                                <p className="text-muted fw-semibold mb-0" style={{ fontSize: '16px', lineHeight: '1.8' }}>
                                  {stage.description || 'لا يوجد وصف مضاف لهذه المرحلة.'}
                                </p>
                              </div>
                              <div className="me-3 flex-shrink-0 text-start">
                                {isStageCompleted ? (
                                  <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                                    <FaCheckDouble className="ms-1" /> {stage.date || 'مكتملة'}
                                  </span>
                                ) : stageProgress > 0 ? (
                                  <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                                    <FaSpinner className="fa-spin ms-1" /> {stageProgress}%
                                  </span>
                                ) : (
                                  <span className="badge bg-secondary bg-opacity-10 text-secondary px-3 py-2 rounded-pill fw-bold fs-6" style={{ whiteSpace: 'nowrap' }}>
                                    <FaHourglassHalf className="ms-1" /> قيد الانتظار
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* شريط تقدم للمراحل غير المكتملة والتي قيد العمل */}
                            {!isStageCompleted && stageProgress > 0 && (
                              <div className="mt-3">
                                <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
                                  <div className="progress-bar bg-warning" style={{ width: `${stageProgress}%`, borderRadius: '10px' }}></div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )})
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
                    {isCompleted && (
                      <button 
                        className="btn fw-bold px-5 py-3 rounded-pill shadow-sm text-white d-flex align-items-center gap-2"
                        style={{ backgroundColor: '#ff8a00', fontSize: '18px' }}
                        onClick={() => setView('rate')}
                      >
                        <FaStar /> تقييم المشروع
                      </button>
                    )}
                    {!isCompleted && (
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
                      onClick={() => { setView('list'); setSelectedProjectSteps([]); }}
                    >
                      <FaArrowRight /> العودة
                    </button>
                  </div>
              </>
              );
          })()}
        </div>
      )}

      {/* ================ واجهة تقييم المشروع (نجوم + تعليق) ================ */}
      {view === 'rate' && selectedProject && (
        <ProjectRatingForm
          project={selectedProject}
          onBack={() => { setView('details'); }}
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
            <p className="text-muted fw-semibold fs-5">أنت تقوم بتقديم شكوى بخصوص هذا المشروع</p>
          </div>

          <form onSubmit={handleSubmitComplaint}>
            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>اسم مزود الخدمة</label>
                <div className="form-control p-3 bg-light text-muted fw-bold border" style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}>
                  {selectedProject.performer?.user?.name || selectedProject.performer?.user?.full_name || 'مزود الخدمة'}
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold fs-5 mb-2" style={{ color: '#1b2a47' }}>المشروع المرتبط</label>
                <div className="form-control p-3 bg-light text-muted fw-bold border" style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}>
                  {selectedProject.title}
                </div>
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