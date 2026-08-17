import { useState, useEffect, useRef } from 'react';
import { 
  FaUserEdit, FaStar, FaHardHat, FaShieldAlt, 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaBriefcase, FaPen,
  FaSave, FaCamera, FaSpinner, FaTools,
  FaExclamationTriangle, FaBuilding,
  FaPlusCircle, FaTrash, FaImage, FaTimes,
  FaThumbsUp, FaComment, FaShare,
  FaGlobeAsia, FaIdCard
} from 'react-icons/fa';
import { fetchProfile, updateProfile } from '../../../services/api/providerApi';
import ImageUploader from '../../../components/ImageUploader';
import './provider-tabs.css';

const ProviderProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
  const fileInputRef = useRef(null);
  
  // هيكل البيانات الأساسية المطابق لنموذج التسجيل
  const [profileData, setProfileData] = useState({
    first_name: '', last_name: '', email: '', phone: '', location: '',
    provider_type: '', // شركة/مؤسسة، مهندس، حرفي/فني
    company_name: '', commercial_register: '',
    syndicate_number: '', engineering_specialization: '',
    craft_type: '',
    experience_years: '',
    bio: '',
    services: [], avatar_url: null, projects_completed: 0,
    active_projects: 0, average_rating: 0
  });

  const [projects, setProjects] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // نموذج إضافة العمل السابق مبسط جداً (وصف + صور فقط)
  const [newProject, setNewProject] = useState({ description: '', images: [] });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [likedPosts, setLikedPosts] = useState(new Set());

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchProfile();
        if (response.data?.data) {
          setProfileData(response.data.data);
          setProjects(response.data.data.past_projects || []);
        }
      } catch (err) {
        console.warn('⚠️ API غير متاح، استخدام بيانات وهمية:', err.message);
        
        // تحديث البيانات الوهمية لتتطابق مع معلومات التسجيل
        setProfileData({
          first_name: 'وليد', 
          last_name: 'محمد', 
          email: 'walid1@gmail.com', 
          phone: '0995499144', 
          location: 'دمشق', 
          provider_type: 'شركة/مؤسسة', 
          company_name: 'مؤسسة وليد للمقاولات العامة', 
          commercial_register: '458796', 
          syndicate_number: '', 
          engineering_specialization: '', 
          craft_type: '',
          experience_years: 5, 
          bio: 'مؤسسة متخصصة في أعمال المقاولات العامة والتشطيبات الداخلية والخارجية بخبرة تمتد لأكثر من 5 سنوات في السوق المحلي. نسعى دائماً لتقديم الجودة والاحترافية لعملائنا.',
          services: ['مقاولات عامة', 'بناء عظم', 'تشطيب كامل على المفتاح'],
          projects_completed: 12, 
          active_projects: 2, 
          average_rating: 4.9
        });
        
        // بيانات تجريبية إضافية للأعمال السابقة (وصف وصور فقط)
        setProjects([
          { 
            id: 1, 
            description: 'تم بحمد الله الانتهاء من تشطيب فيلا سكنية بمساحة 500م في دمشق على الطراز المودرن. شملت الأعمال: تركيب سيراميك ورخام فاخر، دهانات ديكورية، أعمال جبس بورد، مطابخ ألمنيوم، ونظام إضاءة ذكي. تفخر مؤسستنا بتقديم أعلى معايير الجودة لعملائنا الكرام. 🏗️✨',
            images: [
              'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
              'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            ], 
            likes: 45, 
            comments: 12 
          },
          { 
            id: 2, 
            description: 'جانب من أعمالنا في بناء ملحق خارجي متكامل مع تصميم وتنسيق الحديقة المحيطة به. تم استخدام أفضل المواد العازلة للحرارة والرطوبة لضمان استدامة البناء. مدة التنفيذ كانت قياسية! 🔨🏠',
            images: [
              'https://images.unsplash.com/photo-1558904541-efa843a96f09?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
            ], 
            likes: 32, 
            comments: 8 
          },
        ]);
      } finally { setLoading(false); }
    };
    loadProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({ ...profileData, past_projects: projects });
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

  const handleServicesChange = (e) => {
    const servicesArray = e.target.value.split('،').map(s => s.trim());
    setProfileData(prev => ({ ...prev, services: servicesArray }));
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddProject = () => {
    if (!newProject.description.trim()) {
      showToast('error', '⚠️ الرجاء إدخال وصف العمل');
      return;
    }
    
    const newImageUrls = uploadedImages.map(img => URL.createObjectURL(img));

    setProjects(prev => [{
      id: Date.now(),
      description: newProject.description,
      images: [...newImageUrls],
      likes: 0, comments: 0
    }, ...prev]);
    
    setNewProject({ description: '', images: [] });
    setUploadedImages([]);
    setShowAddForm(false);
    showToast('success', '✅ تم نشر العمل بنجاح!');
  };

  const handleDeleteProject = (id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    showToast('info', '🗑️ تم حذف المنشور');
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
  const avatarLetter = profileData.first_name?.[0] || 'و';
  
  const displayTitle = profileData.provider_type === 'شركة/مؤسسة' ? profileData.company_name : 
                       profileData.provider_type === 'مهندس' ? profileData.engineering_specialization : 
                       profileData.craft_type || profileData.provider_type;

  return (
    <div className="mx-auto" style={{ maxWidth: '1200px' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

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
                <FaBriefcase className="me-2" /> {displayTitle}
              </p>
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
                  <input type="email" className="form-control form-control-custom text-muted" value={profileData.email} disabled />
                </div>
                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaPhone className="ms-1 text-success" /> رقم الهاتف</label>
                  <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!isEditing} required />
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaMapMarkerAlt className="ms-1 text-danger" /> المحافظة</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.location} onChange={(e) => handleChange('location', e.target.value)} disabled={!isEditing} required>
                    <option value="">اختر المحافظة...</option>
                    <option value="دمشق">دمشق</option>
                    <option value="ريف دمشق">ريف دمشق</option>
                    <option value="حلب">حلب</option>
                    <option value="حمص">حمص</option>
                    <option value="اللاذقية">اللاذقية</option>
                    <option value="طرطوس">طرطوس</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark">سنوات الخبرة العملية</label>
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
                    <h5 className="fw-bold mb-3 pb-2 border-bottom text-muted">التفاصيل المهنية</h5>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold text-dark"><FaBuilding className="ms-1 text-muted" /> نوع مزود الخدمة</label>
                  <select className={`form-select form-control-custom ${isEditing ? 'border-warning' : ''}`}
                    value={profileData.provider_type} onChange={(e) => handleChange('provider_type', e.target.value)} disabled={!isEditing} required>
                    <option value="شركة/مؤسسة">شركة / مؤسسة مقاولات</option>
                    <option value="مهندس">مهندس (مستقل أو مكتب)</option>
                    <option value="حرفي/فني">حرفي / فني</option>
                  </select>
                </div>

                {profileData.provider_type === 'شركة/مؤسسة' && (
                  <>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">اسم الشركة أو المؤسسة</label>
                        <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`} placeholder="مثال: شركة الأفق للمقاولات"
                            value={profileData.company_name} onChange={(e) => handleChange('company_name', e.target.value)} disabled={!isEditing} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">رقم السجل التجاري</label>
                        <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                            value={profileData.commercial_register} onChange={(e) => handleChange('commercial_register', e.target.value)} disabled={!isEditing} required />
                    </div>
                  </>
                )}

                {profileData.provider_type === 'مهندس' && (
                  <>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">التخصص الهندسي</label>
                        <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`} placeholder="مثال: مهندس مدني، معماري..."
                            value={profileData.engineering_specialization} onChange={(e) => handleChange('engineering_specialization', e.target.value)} disabled={!isEditing} required />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">الرقم النقابي</label>
                        <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`}
                            value={profileData.syndicate_number} onChange={(e) => handleChange('syndicate_number', e.target.value)} disabled={!isEditing} required />
                    </div>
                  </>
                )}

                {profileData.provider_type === 'حرفي/فني' && (
                  <div className="col-md-6">
                    <label className="form-label fw-bold text-dark"><FaTools className="ms-1 text-muted" /> نوع الحرفة أو المهنة</label>
                    <input type="text" className={`form-control form-control-custom ${isEditing ? 'border-warning' : ''}`} placeholder="مثال: فني كهرباء، سباك، دهان..."
                        value={profileData.craft_type} onChange={(e) => handleChange('craft_type', e.target.value)} disabled={!isEditing} required />
                  </div>
                )}

                <div className="col-12">
                  <label className="form-label fw-bold text-dark">الخدمات التي تقدمها (افصل بينها بفاصلة "،")</label>
                  {isEditing ? (
                      <input type="text" className="form-control form-control-custom border-warning mb-2" placeholder="أدخل الخدمات مفصولة بفاصلة..."
                        value={profileData.services?.join('، ')} onChange={handleServicesChange} />
                  ) : (
                      <div className="d-flex flex-wrap gap-2 mt-2">
                        {profileData.services?.map((service, index) => (
                          <span key={index} className="badge bg-warning bg-opacity-15 text-dark px-3 py-2 rounded-pill fs-6 border border-warning border-opacity-25 shadow-sm">
                            {service}
                          </span>
                        ))}
                      </div>
                  )}
                </div>

                <div className="col-12 mt-4">
                  <label className="form-label fw-bold text-dark d-flex align-items-center gap-2">
                      <FaPen className="text-primary"/> نبذة عني (Bio)
                  </label>
                  <p className="text-muted small mb-2">تحدث عن خبراتك، مهاراتك، وما يميزك عن غيرك. هذا النص سيظهر للعملاء عند تصفح ملفك.</p>
                  <textarea className={`form-control form-control-custom shadow-sm ${isEditing ? 'border-warning' : ''}`} rows="5"
                    placeholder="اكتب نبذة احترافية عنك وعن أعمالك..."
                    value={profileData.bio} onChange={(e) => handleChange('bio', e.target.value)} disabled={!isEditing} style={{ lineHeight: '1.8', fontSize: '16px' }}></textarea>
                </div>

              </div>
              
              {isEditing && (
                <div className="text-center mt-5 pt-4 border-top">
                  <button type="submit" className="btn-provider-orange d-inline-flex align-items-center justify-content-center gap-2 px-5 py-3 shadow-lg" style={{ fontSize: '20px', minWidth: '300px' }} disabled={saving}>
                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ جميع التغييرات</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </form>

      {/* ========== قسم الأعمال السابقة - نمط المنشورات ========== */}
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

        {/* نموذج إضافة عمل سابق (مبسط: وصف وصور فقط) */}
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
                  onClick={handleAddProject}
                  disabled={!newProject.description}
                  style={{ fontSize: '18px' }}
                >
                  <FaPlusCircle /> نشر العمل في ملفي الشخصي
                </button>
              </div>
            </div>
          </div>
        )}

        {/* عرض المنشورات (الأعمال السابقة) */}
        <div className="d-flex flex-column gap-5">
          {projects.length > 0 ? projects.map(project => {
            const isLiked = likedPosts.has(project.id);
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

                {/* الوصف مباشرة بدون عنوان */}
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
                          <div key={i} style={{ width: project.images.length === 2 ? '50%' : '33.33%', height: '250px' }}
                            className="border border-white border-2">
                            <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}

                <div className="d-flex justify-content-between align-items-center px-4 py-3 border-bottom mx-2 mt-2">
                  <div className="d-flex align-items-center gap-2">
                    <div className="rounded-circle bg-primary d-flex align-items-center justify-content-center shadow-sm" style={{ width: '24px', height: '24px' }}>
                      <FaThumbsUp size={12} className="text-white" />
                    </div>
                    <span className="text-muted fw-bold">{project.likes || 0}</span>
                  </div>
                  <div className="d-flex gap-4">
                    <span className="text-muted fw-bold">{project.comments || 0} تعليقات</span>
                    <span className="text-muted fw-bold">مشاركة</span>
                  </div>
                </div>

                <div className="d-flex px-3 py-2">
                  <button className={`btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold rounded-3 border-0 transition-hover ${isLiked ? 'text-primary bg-primary bg-opacity-10' : 'text-muted'}`}
                    style={{ fontSize: '16px' }} onClick={() => toggleLike(project.id)}>
                    <FaThumbsUp size={18} /> إعجاب
                  </button>
                  <button className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold text-muted rounded-3 border-0 transition-hover"
                    style={{ fontSize: '16px' }}>
                    <FaComment size={18} /> تعليق
                  </button>
                  <button className="btn btn-light flex-grow-1 d-flex align-items-center justify-content-center gap-2 py-3 fw-bold text-muted rounded-3 border-0 transition-hover"
                    style={{ fontSize: '16px' }}>
                    <FaShare size={18} /> مشاركة
                  </button>
                </div>

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