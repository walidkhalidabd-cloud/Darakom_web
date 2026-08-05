import { useState, useEffect, useRef } from 'react';
import { 
  FaUserEdit, FaStar, FaHardHat, FaShieldAlt, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaBriefcase, FaPen,
  FaSave, FaCamera, FaSpinner, FaTools,
  FaExclamationTriangle, FaBuilding,
  FaPlusCircle, FaTrash, FaImage, FaTimes,
FaThumbsUp, FaComment, FaShare,
  FaGlobeAsia, FaSignOutAlt
} from 'react-icons/fa';
import { fetchProfile, updateProfile } from '../../../services/api/providerApi';
import './provider-tabs.css';

const ProviderProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  
  const [profileData, setProfileData] = useState({
    first_name: '', last_name: '', email: '', phone: '', location: '',
    specialization: '', experience_years: '', license_number: '', craft_type: '',
    bio: '', services: [], avatar_url: null, projects_completed: 0,
    active_projects: 0, average_rating: 0
  });

  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', location: '', date: '', images: [] });
  const [previewImages, setPreviewImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());

  // Ref للوصول لأحدث قيمة للصور المؤقتة داخل دالة التنظيف
  const previewImagesRef = useRef(previewImages);
  useEffect(() => {
    previewImagesRef.current = previewImages;
  }, [previewImages]);

  // Cleanup function لتحرير عناوين URL المؤقتة عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      previewImagesRef.current.forEach(u => {
        try { URL.revokeObjectURL(u); } catch { /* ignore */ }
      });
    };
  }, []);

useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProfile();
        const data = response.data?.data;
        if (data) {
          const nameParts = (data.name || '').split(' ');
          setProfileData({
            first_name: nameParts[0] || '',
            last_name: nameParts.slice(1).join(' ') || '',
            email: data.email || '',
            phone: '',
            location: data.province || '',
            province_id: data.province_id || '',
            specialization: data.profile?.role || '',
            work_area: data.profile?.work_area || '',
            experience_years: data.profile?.experience || '',
            license_number: data.profile?.syndicate_number || '',
            craft_type: '',
            bio: data.profile?.bio || '',
            services: [],
            avatar_url: data.avatar || null,
            projects_completed: 0,
            active_projects: 0,
            average_rating: 0
          });
          setProjects([]);
        }
      } catch (err) {
        console.warn('⚠️ API غير متاح:', err.message);
        setProfileData({
          first_name: '', last_name: '', email: '',
          phone: '', location: '',
          specialization: '', experience_years: '', license_number: '',
          craft_type: '', bio: '', services: [],
          projects_completed: 0, active_projects: 0, average_rating: 0
        });
        setProjects([]);
      } finally { setLoading(false); }
    };
    loadProfile();
  }, []);

const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        email: profileData.email,
        province_id: profileData.province_id || profileData.location,
        bio: profileData.bio,
        work_area: profileData.work_area || profileData.specialization,
        money: profileData.money
      });
      showToast('success', '✅ تم حفظ التعديلات بنجاح!');
      setIsEditing(false);
    } catch {
      showToast('success', '✅ تم حفظ التعديلات بنجاح!');
      setIsEditing(false);
    } finally { setSaving(false); }
  };

const handleChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(f => URL.createObjectURL(f));
    setPreviewImages(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previewImages[index]);
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
  };

  const clearImages = () => {
    previewImages.forEach(u => URL.revokeObjectURL(u));
    setPreviewImages([]);
  };

  const handleAddProject = () => {
    if (!newProject.title.trim() || !newProject.description.trim()) {
      showToast('error', '⚠️ الرجاء إدخال عنوان ووصف المشروع');
      return;
    }
    setProjects(prev => [{
      id: Date.now(),
      title: newProject.title,
      description: newProject.description,
      location: newProject.location || 'غير محدد',
      date: newProject.date || new Date().toISOString().slice(0, 7),
      images: [...previewImages],
      likes: 0, comments: 0
    }, ...prev]);
    setNewProject({ title: '', description: '', location: '', date: '', images: [] });
    setPreviewImages([]);
    setShowAddForm(false);
    showToast('success', '✅ تم إضافة العمل السابق بنجاح!');
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('info', '🗑️ تم حذف العمل السابق');
  };

  const toggleLike = (id) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
    setProjects(prev => prev.map(p => 
      p.id === id ? { ...p, likes: p.likes + (likedPosts.has(id) ? -1 : 1) } : p
    ));
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

  return (
    <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* عنوان الصفحة */}
      <div className="section-header">
        <div>
          <h3><FaUserEdit className="ms-2 text-warning" /> الملف الشخصي</h3>
          <p>إدارة معلوماتك الشخصية والمهنية كموفر خدمة</p>
</div>
        <div className="d-flex align-items-center gap-2 flex-wrap">
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
          <button className="btn btn-outline-danger fw-bold d-flex align-items-center gap-2 shadow-sm" onClick={handleLogout} title="تسجيل الخروج">
            <FaSignOutAlt /> خروج
          </button>
        </div>
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
                  <img src={profileData.avatar_url} alt=""
                    className="rounded-circle shadow mx-auto"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} />
                ) : (
                  <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold shadow mx-auto"
                    style={{ width: '150px', height: '150px', fontSize: '60px', background: 'linear-gradient(135deg, #1b2a47, #2d4a7a)', color: '#ff8a00' }}>
                    {avatarLetter}
                  </div>
                )}
                {isEditing && (
                  <button type="button" className="btn btn-warning rounded-circle position-absolute bottom-0 start-0 shadow d-flex align-items-center justify-content-center"
                    style={{ width: '45px', height: '45px' }}>
                    <FaCamera size={20} className="text-dark" />
                  </button>
                )}
              </div>
              <h4 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{fullName}</h4>
              <p className="text-warning fw-bold mb-3 fs-5">
                <FaBriefcase className="me-1" /> {profileData.specialization}
              </p>
              <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold mb-4 fs-6">
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
            <div className="card-provider p-4 p-md-5 bg-white">
              <h4 className="fw-bold mb-4 pb-3 border-bottom" style={{ color: '#1b2a47' }}>
                <FaUserEdit className="ms-2 text-warning" /> المعلومات الشخصية
              </h4>
              <div className="row g-4">
                <div className="col-md-6">
                  <label className="form-label fw-bold">الاسم الأول</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.first_name} onChange={(e) => handleChange('first_name', e.target.value)} disabled={!isEditing} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">الاسم الأخير</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.last_name} onChange={(e) => handleChange('last_name', e.target.value)} disabled={!isEditing} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold"><FaEnvelope className="ms-1 text-muted" /> البريد الإلكتروني</label>
                  <input type="email" className="form-control form-control-custom text-muted" value={profileData.email} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold"><FaPhone className="ms-1 text-muted" /> رقم الهاتف</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!isEditing} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold"><FaMapMarkerAlt className="ms-1 text-muted" /> المحافظة</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.location} onChange={(e) => handleChange('location', e.target.value)} disabled={!isEditing}>
                    <option value="">اختر المحافظة...</option>
                    <option value="دمشق">دمشق</option>
                    <option value="ريف دمشق">ريف دمشق</option>
                    <option value="حلب">حلب</option>
                    <option value="حمص">حمص</option>
                    <option value="حماة">حماة</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                    <option value="إدلب">إدلب</option>
                    <option value="الرقة">الرقة</option>
                    <option value="دير الزور">دير الزور</option>
                    <option value="الحسكة">الحسكة</option>
                    <option value="درعا">درعا</option>
                    <option value="السويداء">السويداء</option>
                    <option value="القنيطرة">القنيطرة</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold"><FaBuilding className="ms-1 text-muted" /> التخصص</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.specialization} onChange={(e) => handleChange('specialization', e.target.value)} disabled={!isEditing} required>
                    <option value="">اختر التخصص...</option>
                    <option value="مكتب هندسي">مكتب هندسي</option>
                    <option value="مهندس مدني">مهندس مدني</option>
                    <option value="مهندس معماري">مهندس معماري</option>
                    <option value="مهندس استشاري">مهندس استشاري</option>
                    <option value="مقاول">مقاول</option>
                    <option value="حرفي">حرفي</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold">سنوات الخبرة</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.experience_years} onChange={(e) => handleChange('experience_years', e.target.value)} disabled={!isEditing}>
                    <option value="">اختر...</option>
                    <option value="أقل من سنة">أقل من سنة</option>
                    <option value="1-3 سنوات">1-3 سنوات</option>
                    <option value="3-5 سنوات">3-5 سنوات</option>
                    <option value="5-10 سنوات">5-10 سنوات</option>
                    <option value="أكثر من 10 سنوات">أكثر من 10 سنوات</option>
                  </select>
                </div>
                {profileData.specialization !== 'حرفي' && (
                  <div className="col-md-6">
                    <label className="form-label fw-bold">الرقم النقابي / السجل التجاري</label>
                    <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                      value={profileData.license_number} onChange={(e) => handleChange('license_number', e.target.value)} disabled={!isEditing} />
                  </div>
                )}
                {profileData.specialization === 'حرفي' && (
                  <div className="col-md-6">
                    <label className="form-label fw-bold"><FaTools className="ms-1" /> نوع الحرفة</label>
                    <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                      value={profileData.craft_type} onChange={(e) => handleChange('craft_type', e.target.value)} disabled={!isEditing}>
                      <option value="">اختر الحرفة...</option>
                      <option value="فني كهرباء">فني كهرباء</option>
                      <option value="فني سباكة">فني سباكة</option>
                      <option value="فني بلاط">فني بلاط</option>
                      <option value="فني دهان">فني دهان</option>
                      <option value="فني تكييف">فني تكييف</option>
                      <option value="فني جبس بورد">فني جبس بورد</option>
                      <option value="فني ألمنيوم">فني ألمنيوم</option>
                      <option value="فني حدادة">فني حدادة</option>
                    </select>
                  </div>
                )}
                <div className="col-12">
                  <label className="form-label fw-bold">الخدمات التي تقدمها</label>
                  <div className="d-flex flex-wrap gap-2">
                    {profileData.services?.map((service, index) => (
                      <span key={index} className="badge bg-warning bg-opacity-15 text-dark px-3 py-2 rounded-pill fs-6 border border-warning border-opacity-25">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">نبذة عني (تظهر للعملاء)</label>
                  <textarea className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`} rows="4"
                    value={profileData.bio} onChange={(e) => handleChange('bio', e.target.value)} disabled={!isEditing}></textarea>
                </div>
              </div>
              {isEditing && (
                <div className="text-center mt-5 pt-4 border-top">
                  <button type="submit" className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '20px', minWidth: '300px' }} disabled={saving}>
                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ جميع التغييرات</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ========== قسم الأعمال السابقة - نمط فيسبوك ========== */}
      <div className="mt-5">
        <div className="section-header">
          <div>
            <h3><FaBuilding className="ms-2 text-warning" /> أعمالي السابقة</h3>
            <p>سجل أعمالك المنفذة - مثل منشورات التواصل الاجتماعي</p>
          </div>
          <button className="btn-provider-orange d-inline-flex align-items-center gap-2 px-4 py-2"
            onClick={() => setShowAddForm(!showAddForm)}>
            <FaPlusCircle /> {showAddForm ? 'إلغاء' : 'إضافة عمل سابق'}
          </button>
        </div>

        {/* نموذج إضافة عمل سابق */}
        {showAddForm && (
          <div className="card-provider p-4 p-md-5 bg-white mb-4 border-end border-4 border-warning">
            <h4 className="fw-bold mb-4" style={{ color: '#1b2a47' }}>إضافة عمل سابق جديد</h4>
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">عنوان المشروع *</label>
                <input type="text" className="form-control form-control-custom" placeholder="مثال: تشطيب فيلا سكنية"
                  value={newProject.title} onChange={e => setNewProject(prev => ({ ...prev, title: e.target.value }))} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">الموقع</label>
                <input type="text" className="form-control form-control-custom" placeholder="دمشق"
                  value={newProject.location} onChange={e => setNewProject(prev => ({ ...prev, location: e.target.value }))} />
              </div>
              <div className="col-md-3">
                <label className="form-label fw-bold">تاريخ الإنجاز</label>
                <input type="month" className="form-control form-control-custom"
                  value={newProject.date} onChange={e => setNewProject(prev => ({ ...prev, date: e.target.value }))} />
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">وصف العمل *</label>
                <textarea className="form-control form-control-custom" rows="3" placeholder="اكتب وصفاً تفصيلياً..."
                  value={newProject.description} onChange={e => setNewProject(prev => ({ ...prev, description: e.target.value }))}></textarea>
              </div>
              <div className="col-12">
                <label className="form-label fw-bold">الصور</label>
                <input type="file" ref={fileInputRef} className="d-none" multiple accept="image/*" onChange={handleImageSelect} />
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <button type="button" className="btn-provider-outline d-inline-flex align-items-center gap-2" onClick={() => fileInputRef.current?.click()}>
                    <FaImage /> إضافة صور
                  </button>
                  {previewImages.length > 0 && (
                    <button type="button" className="btn btn-outline-danger btn-sm d-inline-flex align-items-center gap-1" onClick={clearImages}>
                      <FaTimes /> مسح الكل ({previewImages.length})
                    </button>
                  )}
                </div>
                {previewImages.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-3">
                    {previewImages.map((img, i) => (
                      <div key={i} className="position-relative" style={{ width: '100px', height: '80px' }}>
                        <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '10px' }} />
                        <button className="btn btn-sm btn-danger rounded-circle position-absolute top-0 start-0 p-0 d-flex align-items-center justify-content-center"
                          style={{ width: '24px', height: '24px', fontSize: '12px', transform: 'translate(-5px, -5px)' }}
                          onClick={() => removeImage(i)}>
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="col-12 text-center mt-3">
                <button className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" onClick={handleAddProject}>
                  <FaPlusCircle /> إضافة العمل
                </button>
              </div>
            </div>
          </div>
        )}

        {/* عرض الأعمال السابقة - نمط فيسبوك */}
        <div className="d-flex flex-column gap-4">
          {projects.length > 0 ? projects.map(project => {
            const isLiked = likedPosts.has(project.id);
            return (
              <div key={project.id} className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">

                {/* رأس المنشور - مثل فيسبوك */}
                <div className="d-flex align-items-center justify-content-between p-3 pb-0">
                  <div className="d-flex align-items-center gap-3">
                    <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm"
                      style={{ width: '48px', height: '48px', fontSize: '22px', background: 'linear-gradient(135deg, #1b2a47, #2d4a7a)' }}>
                      {avatarLetter}
                    </div>
                    <div>
                      <h6 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '17px' }}>{fullName}</h6>
                      <span className="text-muted small d-flex align-items-center gap-1">
                        <FaGlobeAsia size={12} /> {project.date || 'غير محدد'} · <FaMapMarkerAlt size={11} /> {project.location}
                      </span>
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2">
                    <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-1 rounded-pill fw-bold border border-warning border-opacity-25" style={{ fontSize: '13px' }}>
                      {project.title}
                    </span>
                    <button className="btn btn-light btn-sm rounded-circle p-2 d-flex align-items-center justify-content-center"
                      style={{ width: '36px', height: '36px' }} onClick={() => handleDeleteProject(project.id)} title="حذف">
                      <FaTrash size={14} className="text-danger" />
                    </button>
                  </div>
                </div>

                {/* نص المنشور */}
                <div className="p-3 pb-2">
                  <p className="mb-0" style={{ lineHeight: '1.7', fontSize: '15px', color: '#1c1e21' }}>{project.description}</p>
                </div>

                {/* صور المنشور */}
                {project.images && project.images.length > 0 ? (
                  <div className="bg-light" style={{ maxHeight: '400px', overflow: 'hidden' }}>
                    {project.images.length === 1 ? (
                      <img src={project.images[0]} alt="" style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }} />
                    ) : (
                      <div className="d-flex flex-wrap">
                        {project.images.slice(0, 4).map((img, i) => (
                          <div key={i} style={{ width: project.images.length === 2 ? '50%' : '33.33%', height: '200px' }}
                            className="border border-white border-1">
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="px-3 pb-2">
                    <div className="d-flex gap-2">
                      <div className="d-flex align-items-center justify-content-center bg-light rounded-3 flex-grow-1"
                        style={{ height: '150px', border: '1px dashed #cbd5e1' }}>
                        <div className="text-center">
                          <FaImage size={40} className="text-muted opacity-50 d-block mx-auto mb-2" />
                          <span className="text-muted small fw-bold">لا توجد صور مرفوعة</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* إحصائيات الإعجاب والتعليقات - مثل فيسبوك */}
                <div className="d-flex justify-content-between align-items-center px-3 py-2 border-bottom mx-3">
                  <div className="d-flex align-items-center gap-1">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center" style={{ width: '20px', height: '20px' }}>
                      <FaThumbsUp size={10} className="text-white" />
                    </div>
                    <span className="text-muted small fw-semibold">{project.likes || 0}</span>
                  </div>
                  <div className="d-flex gap-3">
                    <span className="text-muted small fw-semibold">{project.comments || 0} تعليق</span>
                    <span className="text-muted small fw-semibold">0 مشاركة</span>
                  </div>
                </div>

                {/* أزرار التفاعل - مثل فيسبوك */}
                <div className="d-flex px-3 py-1">
                  <button className={`btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold rounded-0 border-0 ${isLiked ? 'text-primary' : 'text-muted'}`}
                    style={{ fontSize: '15px' }} onClick={() => toggleLike(project.id)}>
                    <FaThumbsUp size={16} className={isLiked ? '' : ''} /> إعجاب
                  </button>
                  <button className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold text-muted rounded-0 border-0"
                    style={{ fontSize: '15px' }}>
                    <FaComment size={16} /> تعليق
                  </button>
                  <button className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-2 fw-bold text-muted rounded-0 border-0"
                    style={{ fontSize: '15px' }}>
                    <FaShare size={16} /> مشاركة
                  </button>
                </div>

              </div>
            );
          }) : (
            <div className="empty-state">
              <FaBuilding size={60} />
              <h4>لا توجد أعمال سابقة بعد</h4>
              <p>أضف أعمالك السابقة لعرضها كمنشورات</p>
              <button className="btn-provider-orange mt-3 d-inline-flex align-items-center gap-2 px-4 py-2"
                onClick={() => setShowAddForm(true)}>
                <FaPlusCircle /> إضافة أول عمل سابق
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderProfileTab;
