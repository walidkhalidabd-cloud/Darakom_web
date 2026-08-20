import { useState, useEffect } from 'react';
import {
  FaHardHat, FaCheckCircle, FaTimesCircle, FaSearch,
  FaMapMarkerAlt, FaUserTie, FaCalendarAlt, FaSpinner,
  FaCheck, FaFileAlt, FaVectorSquare,
  FaPaperclip, FaRegFileImage, FaClock, FaTags,
  FaBuilding, FaMapPin, FaStar, FaBolt
} from 'react-icons/fa';
import { fetchAdminProjects, approveProject } from '../../../services/api/adminApi';
import apiReq from '../../../services/apiReq';
import './admin-tabs.css';

const ProjectsTab = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadProjects = async () => {
    setLoading(true);
    try {
      const res = await fetchAdminProjects();
      
      // معالجة التغليف المزدوج للبيانات بسبب استخدام paginate() في الباك إند
      const responseData = res.data?.data || res.data;
      const projectsArray = Array.isArray(responseData?.data) ? responseData.data : (Array.isArray(responseData) ? responseData : []);

      if (projectsArray.length > 0) {
        const formattedProjects = projectsArray.map(p => {
          
          let mappedStatus = p.status || 'pending';
if (mappedStatus === 'new' || mappedStatus === 'open' || mappedStatus === 'active') {
    mappedStatus = 'approved';
}

          // قراءة اسم العميل بناءً على علاقات الباك إند
          let clientName = p.client?.name || p.client?.full_name || 'غير معروف';
          if (!p.client?.name && p.client?.first_name) {
              clientName = `${p.client.first_name} ${p.client.last_name || ''}`.trim();
          }

          return {
            id: p.id,
            title: p.title || 'بدون عنوان',
            owner: clientName,
            province: p.province?.name || 'غير محدد',
            detailedAddress: p.location_details || 'غير محدد',
            status: mappedStatus,
            date: p.created_at ? new Date(p.created_at).toLocaleDateString('ar-EG') : 'غير محدد',
            projectCategory: p.projectType?.name || (p.work_type === 'construction' ? 'إنشاء' : 'تشطيب'),
            tenderType: p.tender_type === 'urgent' ? 'مستعجل' : 'عادي',
            description: p.description || 'لا يوجد وصف',
            area: p.area || '0',
            requiredProvider: p.craftsman_type || 'مكاتب هندسية وشركات',
            tenderDuration: p.tender_duration ? `${p.tender_duration} ${p.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : 'غير محدد',
            isDirect: p.invitation_type === 'private',
            directProviderName: p.providerProfile?.user?.name || (p.providerProfile?.user?.first_name ? `${p.providerProfile.user.first_name} ${p.providerProfile.user.last_name || ''}` : 'غير محدد'),
            rejectReason: p.comment || p.reject_reason || null, // الباك إند يحفظ سبب الرفض في comment
            attachments: p.documents?.map(doc => ({
               type: 'image',
               title: doc.description || 'مرفق',
               url: doc.path?.startsWith('http') ? doc.path : `http://127.0.0.1:8000/storage/${doc.path}`
            })) || []
          };
        });
        setProjects(formattedProjects);
      } else {
        setProjects([]); 
      }
    } catch (error) {
      console.error("خطأ في جلب المشاريع:", error);
      showToast('danger', 'فشل في تحميل المشاريع.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const getStatusBadge = (status) => {
    if (status === 'pending') return <span className="admin-badge admin-badge-pending">قيد المراجعة</span>;
    if (status === 'approved') return <span className="admin-badge admin-badge-approved"><FaCheckCircle /> مقبول (مطروح)</span>;
    if (status === 'rejected') return <span className="admin-badge admin-badge-rejected"><FaTimesCircle /> مرفوض</span>;
    return <span className="admin-badge bg-secondary text-white">{status}</span>;
  };

  const handleApprove = async (project) => {
    if(!window.confirm(`هل أنت متأكد من الموافقة على مشروع "${project.title}"؟`)) return;
    
    try {
      await approveProject(project.id);
      showToast('success', `✅ تمت الموافقة! المشروع الآن مطروح.`);
      loadProjects(); 
    } catch (error) {
      console.error("خطأ في القبول:", error);
      showToast('danger', 'فشل قبول المشروع.');
    }
  };

  const handleReject = async (project) => {
    const reason = window.prompt('يرجى كتابة سبب رفض هذا المشروع ليتم إشعار العميل بتعديله:');
    if (!reason) return; 
    
    try {
      // إرسال المتغير rejection_reason كما يتوقعه الباك إند تماماً
      await apiReq.post(`/admin/projects/${project.id}/reject`, { rejection_reason: reason });
      showToast('info', `تم رفض المشروع وإرسال التنبيه للعميل.`);
      loadProjects(); 
    } catch (error) {
       console.error("خطأ في الرفض:", error);
       showToast('danger', 'فشل رفض المشروع.');
    }
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
      {toast && <div className={`toast-custom toast-${toast.type === 'danger' ? 'error' : toast.type}`}>{toast.message}</div>}

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
              
              {project.isDirect && (
                  <div className="alert d-flex align-items-center gap-3 mb-4 rounded-3 shadow-sm border-0" style={{ backgroundColor: '#fff3cd', color: '#856404' }}>
                      <FaStar size={24} className="text-warning flex-shrink-0" />
                      <div className="fw-bold" style={{ fontSize: '16px' }}>
                          هذا الطلب ليس مناقصة عامة، بل هو (طلب مباشر) موجه حصرياً لمزود الخدمة: <span className="text-dark">[{project.directProviderName}]</span>
                      </div>
                  </div>
              )}

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
                        <span className="fw-bold text-dark fs-6">{project.area !== '0' ? `${project.area} م²` : 'غير محدد'}</span>
                    </div>
                    
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

                <div>
                    <span className="text-muted small fw-bold d-flex align-items-center gap-1 mb-2"><FaPaperclip /> المرفقات ({project.attachments?.length || 0})</span>
                    {project.attachments && project.attachments.length > 0 ? (
                        <div className="d-flex flex-wrap gap-2">
                            {project.attachments.map((att, i) => (
                                <a key={i} href={att.url} target="_blank" rel="noopener noreferrer" className="bg-white border rounded-3 p-2 px-3 d-flex align-items-center gap-2 shadow-sm text-decoration-none">
                                    <FaRegFileImage className="text-primary fs-4" />
                                    <div className="d-flex flex-column">
                                        <span className="fw-bold text-dark" style={{ fontSize: '13px' }}>{att.title || att.name}</span>
                                    </div>
                                </a>
                            ))}
                        </div>
                    ) : (
                        <span className="text-muted small fw-bold">لم يقم العميل بإرفاق أي ملفات.</span>
                    )}
                </div>
              </div>

              {project.status === 'rejected' && project.rejectReason && (
                <div className="p-3 rounded-4 mb-4 d-flex align-items-center gap-3" style={{ backgroundColor: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  <FaTimesCircle className="text-danger fs-3" />
                  <div>
                      <span className="fw-bold text-danger d-block mb-1">سبب رفض هذا الطلب:</span>
                      <span className="fw-semibold text-dark">{project.rejectReason}</span>
                  </div>
                </div>
              )}

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