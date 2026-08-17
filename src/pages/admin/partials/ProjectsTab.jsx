import { useState, useEffect } from 'react';
import {
  FaHardHat, FaCheckCircle, FaTimesCircle, FaSearch,
  FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaSpinner,
  FaCheck, FaFileAlt, FaVectorSquare,
  FaPaperclip, FaRegFileImage, FaClock, FaTags,
  FaBuilding, FaMapPin, FaStar, FaBolt
} from 'react-icons/fa';
import { fetchAdminProjects, approveProject, rejectProject } from '../../../services/api/adminApi';
import './admin-tabs.css';

// تم تحديث البيانات الوهمية لتتطابق تماماً مع الحقول التي يدخلها العميل في استمارة "إضافة مشروع"
const mockProjects = [
  { 
    id: 1, 
    title: 'بناء عظم لفيلا سكنية', 
    owner: 'أحمد سليمان', 
    province: 'دمشق', 
    detailedAddress: 'المزة، حي الفيلات الغربية، قرب الحديقة',
    status: 'pending', 
    date: '2026/08/18', 
    projectCategory: 'إنشاء',
    description: 'مطلوب مقاول معتمد للبدء بأعمال الحفر والبناء لهيكل عظمي لفيلا سكنية مكونة من 3 طوابق. المخططات الهندسية جاهزة وتم استخراج كافة التراخيص من البلدية.',
    area: '400', 
    requiredProvider: 'مكاتب هندسية وشركات',
    tenderDuration: '15 يوم',
    isDirect: false,
    directProviderName: null,
    attachments: [
        { type: 'image', title: 'صورة المخطط', name: 'plan_image.jpg', size: '2.5 MB' }
    ]
  },
  { 
    id: 2, 
    title: 'أعمال كهرباء وسباكة لشقة', 
    owner: 'سمر حسن', 
    province: 'حلب', 
    detailedAddress: 'الجميلية، الشارع الرئيسي، بناء السلام',
    status: 'pending', 
    date: '2026/08/17', 
    projectCategory: 'تشطيب',
    tenderType: 'مستعجل',
    description: 'عندي مشكلة في تمديدات الكهرباء والسباكة في الحمام والمطبخ وتحتاج إلى صيانة وتجديد كامل بأسرع وقت ممكن.',
    area: '120', 
    requiredProvider: 'فني كهرباء', // بناءً على الحرفة
    tenderDuration: '48 ساعة',
    isDirect: true,
    directProviderName: 'محمد علي (فني كهرباء)',
    attachments: []
  }
];

const ProjectsTab = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchAdminProjects();
        const data = res.data?.data || res.data;
        if (Array.isArray(data)) {
            setProjects(data);
        }
      } catch {
        // الاعتماد على البيانات الوهمية في حال الفشل
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending">قيد المراجعة</span>;
    if (status === 'approved') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> مقبول (مطروح)</span>;
    return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
  };

  const handleApprove = async (project) => {
    if(!window.confirm(`هل أنت متأكد من الموافقة على مشروع "${project.title}"؟`)) return;
    
    const safeProjectsList = Array.isArray(projects) ? projects : [];
    try {
      await approveProject(project.id);
    } catch {
      // محلياً
    }
    setProjects(safeProjectsList.map(p => p.id === project.id ? { ...p, status: 'approved' } : p));
    showToast('success', `✅ تمت الموافقة! المشروع الآن مطروح.`);
  };

  const handleReject = async (project) => {
    const reason = window.prompt('يرجى كتابة سبب رفض هذا المشروع ليتم إشعار العميل بتعديله:');
    if (!reason) return; 
    
    const safeProjectsList = Array.isArray(projects) ? projects : [];
    try {
      await rejectProject(project.id, reason);
    } catch {
      // محلياً
    }
    setProjects(safeProjectsList.map(p => p.id === project.id ? { ...p, status: 'rejected', rejectReason: reason } : p));
    showToast('info', `تم رفض المشروع وإرسال التنبيه للعميل.`);
  };

  const safeProjects = Array.isArray(projects) ? projects : [];
  
  const filtered = safeProjects.filter(p => {
    const title = p.title || '';
    const owner = p.owner || '';
    const matchSearch = title.toLowerCase().includes(search.toLowerCase()) || owner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="admin-section-header">
        <div>
          <h3><FaHardHat className="ms-2 text-warning" /> مراجعة المشاريع المطروحة</h3>
          <p>مراجعة المشاريع والطلبات المباشرة المقدمة من العملاء، وقبولها ليتم طرحها.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4 bg-white">
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="position-relative">
              <input
                type="text"
                className="form-control form-control-admin"
                placeholder="ابحث باسم المشروع أو اسم العميل..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ paddingRight: '45px' }}
              />
              <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" />
            </div>
          </div>
          <div className="col-md-6">
            <select className="form-control form-control-admin" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">كل الحالات</option>
              <option value="pending">مشاريع قيد المراجعة</option>
              <option value="approved">مشاريع مقبولة</option>
              <option value="rejected">مشاريع مرفوضة</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><FaSpinner className="fa-spin fs-1 text-warning" /></div>
      ) : filtered.length > 0 ? (
        <div className="d-flex flex-column gap-4">
          {filtered.map(project => (
            <div key={project.id} className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4" style={{ borderColor: project.status === 'pending' ? '#ff8a00' : project.status === 'approved' ? '#10b981' : '#ef4444' }}>
              
              {/* تنبيه الطلب المباشر */}
              {project.isDirect && (
                  <div className="alert d-flex align-items-center gap-3 mb-4 rounded-3 shadow-sm border-0" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                      <FaStar size={24} className="text-warning flex-shrink-0" />
                      <div className="fw-bold" style={{ fontSize: '16px' }}>
                          هذا الطلب ليس مناقصة عامة، بل هو (طلب مباشر) موجه حصرياً لمزود الخدمة: <span className="text-dark">[{project.directProviderName}]</span>
                      </div>
                  </div>
              )}

              {/* رأس البطاقة - العميل والتاريخ */}
              <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3 pb-3 border-bottom">
                <div className="d-flex align-items-center gap-3">
                    <div className="bg-light p-3 rounded-circle text-primary">
                        <FaUserTie size={24} />
                    </div>
                    <div>
                        <span className="text-muted small fw-bold d-block mb-1">العميل (صاحب المشروع)</span>
                        <h5 className="fw-bold text-dark mb-0">{project.owner}</h5>
                    </div>
                </div>
                <div className="text-end">
                    {getStatusBadge(project.status)}
                    <div className="text-muted small fw-bold mt-2 d-flex align-items-center justify-content-end gap-1">
                        <FaCalendarAlt /> تاريخ الإرسال: {project.date}
                    </div>
                </div>
              </div>

              {/* عنوان المشروع */}
              <div className="d-flex align-items-center gap-2 mb-4">
                  <h4 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>
                    {project.title}
                  </h4>
                  {project.tenderType === 'مستعجل' && (
                      <span className="badge bg-danger text-white d-flex align-items-center gap-1 ms-2 fs-6 px-3">
                          <FaBolt /> مستعجل
                      </span>
                  )}
              </div>

              {/* === استمارة بيانات المشروع المأخوذة من العميل === */}
              <div className="bg-light p-4 rounded-4 mb-4 border">
                <h6 className="fw-bold text-primary mb-4 pb-2 border-bottom d-flex align-items-center gap-2">
                    <FaFileAlt /> بيانات الاستمارة المُرسلة
                </h6>

                <div className="row g-4 mb-4">
                    <div className="col-md-6 col-lg-4">
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaTags /> نوع المشروع</span>
                        <span className="fw-bold text-dark fs-6">{project.projectCategory || 'غير محدد'}</span>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaMapMarkerAlt /> المحافظة</span>
                        <span className="fw-bold text-dark fs-6">{project.province || 'غير محدد'}</span>
                    </div>
                    <div className="col-md-6 col-lg-4">
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaVectorSquare /> مساحة المشروع</span>
                        <span className="fw-bold text-dark fs-6">{project.area ? `${project.area} م²` : 'غير محدد'}</span>
                    </div>
                    
                    {/* إخفاء نوع المزود المطلوب إذا كان طلباً مباشراً */}
                    {!project.isDirect && (
                        <div className="col-md-6 col-lg-4">
                            <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaBuilding /> المزود / الحرفة المطلوبة</span>
                            <span className="fw-bold text-dark fs-6">{project.requiredProvider || 'غير محدد'}</span>
                        </div>
                    )}
                    
                    <div className="col-md-6 col-lg-4">
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaClock /> مدة طرح المناقصة</span>
                        <span className="fw-bold text-danger fs-6">{project.tenderDuration || 'غير محدد'}</span>
                    </div>
                    <div className="col-md-6 col-lg-12">
                        <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-1"><FaMapPin /> العنوان بالتفصيل</span>
                        <span className="fw-bold text-dark fs-6">{project.detailedAddress || 'غير محدد'}</span>
                    </div>
                </div>

                <div className="mb-4">
                    <span className="text-muted small fw-bold d-block mb-2">الوصف التفصيلي (كما كتبه العميل)</span>
                    <div className="bg-white p-3 rounded-3 border text-dark fw-semibold" style={{ lineHeight: '1.8', fontSize: '16px' }}>
                        {project.description || 'لا يوجد وصف.'}
                    </div>
                </div>

                {/* المرفقات (العميل يرفع صور فقط حسب كوده) */}
                <div>
                    <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-2"><FaPaperclip /> المرفقات ({project.attachments?.length || 0})</span>
                    {project.attachments && project.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {project.attachments.map((att, i) => (
                                <div key={i} className="bg-white border rounded-3 p-2 px-3 d-flex align-items-center gap-2 shadow-sm">
                                    <FaRegFileImage className="text-primary fs-4" />
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{att.title || att.name}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted small fw-bold">لم يقم العميل بإرفاق أي ملفات.</span>
                    )}
                </div>
              </div>

              {/* حالة الرفض السابقة */}
              {project.status === 'rejected' && project.rejectReason && (
                <div className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FaTimesCircle className="text-danger fs-3" />
                  <div>
                      <span className="fw-bold text-danger d-block mb-1">سبب رفض هذا الطلب:</span>
                      <span className="fw-semibold text-dark">{project.rejectReason}</span>
                  </div>
                </div>
              )}

              {/* أزرار الإدارة */}
              {project.status === 'pending' && (
                <div className="d-flex justify-content-end gap-3 mt-4 pt-3 border-top flex-wrap">
                  <button className="btn btn-outline-danger fw-bold d-inline-flex align-items-center justify-content-center gap-2 px-4 py-2" onClick={() => handleReject(project)}>
                    <FaTimesCircle /> رفض المشروع
                  </button>
                  <button className="btn-admin-primary d-inline-flex align-items-center justify-content-center gap-2 px-5 py-2 shadow-sm" onClick={() => handleApprove(project)}>
                    <FaCheck /> {project.isDirect ? 'الموافقة وتمرير الطلب للمزود' : 'الموافقة وطرح المناقصة'}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="admin-empty">
          <FaHardHat size={50} />
          <h5>لا توجد مشاريع مطابقة</h5>
          <p>جرّب تعديل البحث أو التصفية.</p>
        </div>
      )}
    </div>
  );
};

export default ProjectsTab;