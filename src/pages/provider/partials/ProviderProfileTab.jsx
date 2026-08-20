import { useState, useEffect } from 'react';
import { 
  FaUserEdit, FaStar, FaHardHat, FaShieldAlt, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaBriefcase, FaPen,
  FaSave, FaCamera, FaSpinner, FaBuilding,
  FaExclamationTriangle,
  FaPlusCircle, FaTrash, FaGlobeAsia, FaIdCard, FaTimes
} from 'react-icons/fa';
import { 
  fetchProfile, updateProfile, 
  fetchPreviousWorks, createPreviousWork, deletePreviousWork 
} from '../../../services/api/providerApi';
import ImageUploader from '../../../components/ImageUploader';
import './provider-tabs.css';

const ProviderProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  
  // مصفوفة المحافظات الـ 14 المطابقة لقاعدة البيانات
  const syrianGovernorates = [
    { id: 1, name: 'دمشق' }, { id: 2, name: 'حلب' }, { id: 3, name: 'ريف دمشق' },
    { id: 4, name: 'درعا' }, { id: 5, name: 'السويداء' }, { id: 6, name: 'القنيطرة' },
    { id: 7, name: 'اللاذقية' }, { id: 8, name: 'طرطوس' }, { id: 9, name: 'إدلب' },
    { id: 10, name: 'حماة' }, { id: 11, name: 'الحسكة' }, { id: 12, name: 'الرقة' },
    { id: 13, name: 'دير الزور' }, { id: 14, name: 'حمص' }
  ];

  const [profileData, setProfileData] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: '',
    province_id: 1, 
    provider_type: 'غير محدد', 
    work_area: '', 
    syndicate_number: '',
    experience_years: 0, 
    bio: '',
    services: [], avatar_url: null, 
    projects_completed: 0, active_projects: 0, average_rating: 0
  });

  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ description: '', images: [] });
  const [uploadedImages, setUploadedImages] = useState([]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [profileRes, worksRes] = await Promise.all([
        fetchProfile(),
        fetchPreviousWorks().catch(() => ({ data: { data: [] } })) 
      ]);

      let user = profileRes.data?.data || profileRes.data || {};
      if (user.data) user = user.data; 

      const profile = user.profile || {};

      let cleanWorkArea = profile.work_area || '';
      if (cleanWorkArea === '1' || cleanWorkArea === '2' || cleanWorkArea === '3') {
          cleanWorkArea = ''; 
      }

      setProfileData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
        province_id: user.province_id || 1,
        provider_type: profile.role || 'غير محدد', 
        work_area: cleanWorkArea,
        syndicate_number: profile.syndicate_number || '',
        experience_years: profile.experience_years ?? profile.experience ?? 0,
        bio: profile.bio || '',
        services: [], 
        avatar_url: user.avatar ? user.avatar : null,
        projects_completed: 0, 
        active_projects: 0, 
        average_rating: 0 
      });

      const works = worksRes.data?.data || [];
      setProjects(works.map(w => ({
        id: w.id,
        description: w.title || w.description || '',
        images: w.images?.map(img => img.url) || [],
        likes: 0, comments: 0
      })));

    } catch (err) {
      console.error('خطأ في جلب الملف الشخصي:', err);
      setError('تعذر جلب البيانات من الخادم، الرجاء المحاولة لاحقاً.');
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        phone: profileData.phone,
        province_id: profileData.province_id,
        address: profileData.address || 'سوريا',
        bio: profileData.bio,
        work_area: profileData.work_area || profileData.provider_type, // إرسال التخصص الأساسي كقيمة احتياطية للباك إند
        syndicate_number: profileData.syndicate_number,
        experience_years: profileData.experience_years 
      };

      await updateProfile(payload);
      showToast('success', '✅ تم حفظ التعديلات بنجاح!');
      setIsEditing(false);
      loadData(); 
    } catch (err) {
      console.error(err);
      showToast('error', err.response?.data?.message || '❌ حدث خطأ أثناء الحفظ.');
    } finally { 
      setSaving(false); 
    }
  };

  const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddProject = async () => {
    if (!newProject.description.trim()) {
      showToast('error', '⚠️ الرجاء إدخال وصف العمل');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('title', newProject.description.substring(0, 50)); 
      formData.append('description', newProject.description);
      
      await createPreviousWork(formData);
      showToast('success', '✅ تم نشر العمل بنجاح!');
      setNewProject({ description: '', images: [] });
      setUploadedImages([]);
      setShowAddForm(false);
      loadData(); 
    } catch (err) {
      showToast('error', '❌ فشل نشر العمل السابقة.');
    }
  };

  const handleDeleteProject = async (id) => {
    if(!window.confirm('هل أنت متأكد من حذف هذا العمل؟')) return;
    try {
      await deletePreviousWork(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      showToast('info', '🗑️ تم حذف المنشور');
    } catch (err) {
      showToast('error', '❌ فشل عملية الحذف.');
    }
  };

  if (loading) {
    return (
      <div className="mx-auto" style={{ maxWidth: '1200px' }}>
        <div className="section-header"><div><h3><FaUserEdit className="ms-2 text-warning" /> الملف الشخصي</h3></div></div>
        <div className="row g-4">
          <div className="col-lg-4">
            <div className="card-provider p-4 text-center">
              <div className="loading-skeleton" style={{ width: '150px', height: '150px', borderRadius: '50%', margin: '0 auto' }}></div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card-provider p-5">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className="loading-skeleton mb-3" style={{ width: '100%', height: '50px' }}></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fullName = `${profileData.first_name} ${profileData.last_name}`;
  const avatarLetter = profileData.first_name?.[0] || 'م';
  const displayTitle = profileData.provider_type !== 'غير محدد' ? profileData.provider_type : 'مزود خدمة';

  return (
    <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      {toast && <div className={`toast-custom toast-${toast.type === 'error' ? 'danger' : toast.type}`}>{toast.message}</div>}

      <div className="section-header">
        <div>
          <h3><FaUserEdit className="ms-2 text-warning" /> الملف الشخصي</h3>
          <p>إدارة معلوماتك الشخصية والمهنية وتوثيق خبراتك للعملاء</p>
        </div>
        {!isEditing ? (
          <button className="btn-provider-outline d-flex align-items-center gap-2" onClick={() => setIsEditing(true)}>
            <FaPen /> تعديل الملف
          </button>
        ) : (
          <button className="btn-provider-orange d-flex align-items-center gap-2"
            onClick={() => document.getElementById('profileForm').requestSubmit()} disabled={saving}>
            {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ التغييرات</>}
          </button>
        )}
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-3 rounded-4 mb-4">
          <FaExclamationTriangle size={24} />
          <strong>{error}</strong>
        </div>
      )}

      <form id="profileForm" onSubmit={handleSave}>
        <div className="row g-4">
          
          <div className="col-lg-4">
            <div className="card-provider p-4 bg-white text-center" style={{ position: 'sticky', top: '20px' }}>
              <div className="position-relative d-inline-block mb-4">
                {profileData.avatar_url ? (
                  <img src={profileData.avatar_url} alt="" className="rounded-circle shadow mx-auto" style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mx-auto"
                    style={{ width: '150px', height: '150px', fontSize: '60px', background: 'linear-gradient(135deg, #1b2a47, #2d4a7a)', color: '#ff8a00' }}>
                    {avatarLetter}
                  </div>
                )}
                {isEditing && (
                  <button type="button" className="btn btn-warning rounded-circle position-absolute bottom-0 start-0 shadow d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
                    <FaCamera size={20} className="text-dark" />
                  </button>
                )}
              </div>
              <h4 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{fullName}</h4>
              <p className="text-warning fw-bold mb-3 fs-5"><FaBriefcase className="me-2" /> {displayTitle}</p>
              <span className="badge bg-success bg-opacity-10 text-success px-4 py-2 rounded-pill fw-bold mb-4 fs-6 border border-success border-opacity-25">
                <FaShieldAlt className="me-1" /> حساب موثق
              </span>
              
              <div className="row g-2 mt-3">
                <div className="col-4">
                  <div className="bg-light p-2 rounded-3 border shadow-sm">
                    <FaHardHat size={22} className="text-primary mb-1 d-block mx-auto" />
                    <h5 className="fw-bold text-dark mb-0">{profileData.projects_completed}</h5>
                    <span style={{ fontSize: '11px' }} className="text-muted fw-bold">مشاريع منجزة</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-light p-2 rounded-3 border shadow-sm">
                    <FaStar size={22} className="text-warning mb-1 d-block mx-auto" />
                    <h5 className="fw-bold text-dark mb-0">{profileData.average_rating}</h5>
                    <span style={{ fontSize: '11px' }} className="text-muted fw-bold">متوسط التقييم</span>
                  </div>
                </div>
                <div className="col-4">
                  <div className="bg-light p-2 rounded-3 border shadow-sm">
                    <FaSpinner size={22} className="text-success mb-1 d-block mx-auto fa-spin" />
                    <h5 className="fw-bold text-dark mb-0">{profileData.active_projects}</h5>
                    <span style={{ fontSize: '11px' }} className="text-muted fw-bold">نشطة حالياً</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card-provider p-4 p-md-5 bg-white border-top border-4 border-warning">
              <h4 className="fw-bold mb-4 pb-3 border-bottom d-flex align-items-center gap-2" style={{ color: '#1b2a47' }}>
                <FaIdCard className="text-warning" /> بيانات الحساب الأساسية
              </h4>
              
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark">الاسم الأول</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} disabled={!isEditing} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark">الاسم الأخير</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} disabled={!isEditing} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaEnvelope className="ms-1 text-primary" /> البريد الإلكتروني</label>
                  <input type="email" className={`form-control form-control-custom ${isEditing ? 'border-warning' : 'text-muted'}`} 
                    value={profileData.email} onChange={(e) => handleChange('email', e.target.value)} disabled={!isEditing} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaPhone className="ms-1 text-success" /> رقم الهاتف</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!isEditing} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaMapMarkerAlt className="ms-1 text-danger" /> المحافظة</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.province_id} onChange={(e) => handleChange('province_id', e.target.value)} disabled={!isEditing} required>
                    <option value="">اختر المحافظة...</option>
                    {syrianGovernorates.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-12 mt-4">
                    <h5 className="fw-bold mb-3 pb-2 border-bottom text-muted">التفاصيل المهنية</h5>
                </div>

                {/* تم تعديل التخطيط ليكون الحقول الثلاثة في سطر واحد */}
                <div className="col-md-4">
                    <label className="form-label fw-bold text-dark">التخصص الأساسي</label>
                    <input type="text" className="form-control form-control-custom bg-light text-primary fw-bold" 
                        value={profileData.provider_type} disabled />
                </div>
                
                <div className="col-md-4">
                    <label className="form-label fw-bold text-dark">الرقم النقابي/السجل</label>
                    <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                        value={profileData.syndicate_number} onChange={(e) => handleChange('syndicate_number', e.target.value)} disabled={!isEditing} />
                </div>

                <div className="col-md-4">
                  <label className="form-label fw-bold text-dark">سنوات الخبرة</label>
                  <div className="input-group shadow-sm">
                    <input 
                      type="number" 
                      min="0" 
                      className={`form-control form-control-custom border-end-0 ${isEditing ? 'border-warning' : ''}`}
                      placeholder="أدخل عدد السنوات..." 
                      value={profileData.experience_years} 
                      onChange={(e) => handleChange('experience_years', e.target.value)} 
                      disabled={!isEditing} 
                      required 
                    />
                    <span className={`input-group-text fw-bold bg-light ${isEditing ? 'border-warning border-start-0' : ''}`} style={{ color: '#1b2a47' }}>
                        سنوات
                    </span>
                  </div>
                </div>

                <div className="col-12 mt-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-2">
                      <FaPen className="text-primary"/> نبذة عني (Bio)
                  </label>
                  <p className="text-muted small mb-2">تحدث عن خبراتك، مهاراتك، وما يميزك عن غيرك.</p>
                  <textarea className={`form-control form-control-custom shadow-sm ${isEditing ? 'border-warning' : ''}`} rows="5"
                    placeholder="اكتب نبذة احترافية عنك وعن أعمالك..."
                    value={profileData.bio} onChange={(e) => handleChange('bio', e.target.value)} disabled={!isEditing} style={{ lineHeight: '1.8', fontSize: '16px' }}></textarea>
                </div>

              </div>
              
              {isEditing && (
                <div className="text-center mt-5 pt-4 border-top">
                  <button type="submit" className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-2 px-5 py-3 shadow-lg" style={{ fontSize: '20px', minWidth: '300px' }} disabled={saving}>
                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ التغييرات وإرسالها</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* قسم الأعمال السابقة */}
      <div className="mt-5 pt-3">
        <div className="section-header">
          <div>
            <h3><FaBuilding className="ms-2 text-warning" /> أعمالي السابقة</h3>
            <p>شارك صور وتفاصيل مشاريعك السابقة كمنشورات لتعزيز موثوقيتك أمام العملاء</p>
          </div>
          <button className="btn-provider-orange d-inline-flex align-items-center gap-2 px-4 py-2 shadow-sm"
            onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? <><FaTimes /> إلغاء</> : <><FaPlusCircle /> إضافة عمل سابق</>}
          </button>
        </div>

        {showAddForm && (
          <div className="card-provider p-4 p-md-5 bg-white mb-5 border-top border-4 border-warning shadow-sm">
            <h4 className="fw-bold mb-4" style={{ color: '#1b2a47' }}>إضافة عمل سابق جديد</h4>
            <div className="row g-4">
              <div className="col-12">
                <label className="form-label fw-bold text-dark">وصف العمل *</label>
                <textarea className="form-control form-control-custom" rows="4" placeholder="اكتب وصفاً تفصيلياً لما قمت بإنجازه في هذا المشروع..."
                  value={newProject.description} onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}></textarea>
              </div>
              <div className="col-12 mt-4">
                <ImageUploader 
                  images={uploadedImages} 
                  onChange={setUploadedImages} 
                  label="صور المشروع (إثبات جودة عملك)"
                  maxImages={10}
                />
              </div>
              <div className="col-12 text-center mt-4 border-top pt-4">
                <button 
                  className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3 shadow" 
                  onClick={handleAddProject} disabled={!newProject.description} style={{ fontSize: '18px' }}>
                  <FaPlusCircle /> نشر العمل في ملفي الشخصي
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="d-flex flex-column gap-5">
          {projects.length > 0 ? projects.map(project => {
            return (
              <div key={project.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
                <div className="d-flex align-items-center justify-content-between p-4 pb-0">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                      style={{ width: '55px', height: '55px', fontSize: '24px', background: 'linear-gradient(135deg, #1b2a47, #2d4a7a)' }}>
                      {avatarLetter}
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0 text-dark">{fullName}</h5>
                      <span className="text-muted small fw-semibold d-flex align-items-center gap-1 mt-1">
                         <FaGlobeAsia size={12} /> تم النشر في ملف الأعمال السابقة
                      </span>
                    </div>
                  </div>
                  <button className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px' }} onClick={() => handleDeleteProject(project.id)} title="حذف المنشور">
                    <FaTrash size={16} className="text-danger" />
                  </button>
                </div>
                <div className="p-4">
                  <p className="mb-0 text-dark fw-semibold" style={{ lineHeight: '1.8', fontSize: '17px' }}>{project.description}</p>
                </div>
                {project.images && project.images.length > 0 ? (
                  <div className="bg-light d-flex justify-content-center" style={{ maxHeight: '500px', overflow: 'hidden' }}>
                    {project.images.length === 1 ? (
                      <img src={project.images[0]} alt="" style={{ width: '100%', maxHeight: '500px', objectFit: 'contain', backgroundColor: '#f8f9fa' }} />
                    ) : (
                      <div className="d-flex flex-wrap w-100">
                        {project.images.slice(0, 4).map((img, i) => (
                          <div key={i} style={{ width: project.images.length === 2 ? '50%' : '33.33%', height: '250px' }} className="border border-white border-2">
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            );
          }) : (
            <div className="empty-state py-5">
              <FaBuilding size={70} className="text-muted opacity-25 mb-3" />
              <h4 className="fw-bold text-muted">ملف الأعمال فارغ</h4>
              <p className="text-muted fw-semibold">لم تقم بإضافة أي أعمال سابقة حتى الآن.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileTab;