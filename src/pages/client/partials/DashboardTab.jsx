import { useState, useEffect, useCallback } from 'react';
import { 
  FaListAlt, FaSpinner, FaCheckCircle, FaFileInvoiceDollar, 
  FaPlusSquare, FaStar, FaUserTie, FaSearch, FaClock, 
  FaHourglassHalf, FaBuilding, FaMapMarkerAlt, FaCalendarAlt,
  FaChevronLeft, FaIdCard, FaHeart, FaRegHeart, FaUser
} from 'react-icons/fa';
import { fetchClientProjects } from '../../../services/api/clientApi';

// بيانات وهمية لمزودي الخدمة للبحث (خارج المكون لتجنب إعادة التصريح)
const providersDB = [
  { id: 'PR-001', name: 'مؤسسة البناء الذهبي', type: 'مقاول معتمد', phone: '0999123456', email: 'golden@build.sy', rating: 4.8, projects: 32 },
  { id: 'PR-002', name: 'مكتب الإبداع الهندسي', type: 'مكتب هندسي', phone: '0999234567', email: 'ibdaa@eng.sy', rating: 4.9, projects: 28 },
  { id: 'PR-003', name: 'م. خالد عبدالله', type: 'مهندس معماري', phone: '0999345678', email: 'khaled.a@arch.sy', rating: 4.7, projects: 15 },
  { id: 'PR-004', name: 'شركة أطياف للتشطيبات', type: 'تشطيب وديكور', phone: '0999456789', email: 'atyaf@finish.sy', rating: 4.6, projects: 41 },
  { id: 'PR-005', name: 'مؤسسة الأساس المتين', type: 'مقاول إنشاء', phone: '0999567890', email: 'alass@construct.sy', rating: 4.5, projects: 19 },
  { id: 'PR-006', name: 'م. سامر الحسن', type: 'مهندس استشاري', phone: '0999678901', email: 'samer.h@cons.sy', rating: 4.9, projects: 23 },
  { id: 'PR-007', name: 'فني كهرباء - محمد علي', type: 'حرفي كهرباء', phone: '0999789012', email: 'mohd.elec@craft.sy', rating: 4.4, projects: 56 },
  { id: 'PR-008', name: 'شركة الشام للمقاولات', type: 'شركة مقاولات', phone: '0999890123', email: 'sham@contract.sy', rating: 4.8, projects: 67 },
];

const DashboardTab = ({ setActiveTab }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const [favorites, setFavorites] = useState(() => {
    // تحميل المفضلة من localStorage عند بدء التشغيل
    const saved = localStorage.getItem('darakom_favorites');
    return saved ? JSON.parse(saved) : [];
  });
const [toast, setToast] = useState(null); // { message, type }
  const [liveProjects, setLiveProjects] = useState([]);

// جلب مشاريع العميل من الباك
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchClientProjects();
        setLiveProjects(res.data?.data || []);
      } catch (err) {
        console.warn('⚠️ API غير متاح:', err.message);
      }
    };
    load();
  }, []);

  // حفظ المفضلة في localStorage عند التحديث
  useEffect(() => {
    localStorage.setItem('darakom_favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Toast notification - إخفاء تلقائي بعد 3 ثوان
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // التصفية الفورية (Auto-filter) مع debounce
  const performSearch = useCallback((query) => {
    if (!query.trim()) {
      setSearchResults(null);
      setSearching(false);
      return;
    }
    setSearching(true);
    const q = query.toLowerCase();
    const results = providersDB.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.id.toLowerCase().includes(q) ||
      p.type.includes(q)
    );
    setSearchResults(results);
    setSearching(false);
  }, []);

  // Debounce للبحث - التنفيذ بعد 300ms من آخر تغيير
  useEffect(() => {
    const timer = setTimeout(() => {
      performSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery, performSearch]);

  // تبديل حالة المفضلة لمزود معين
  const toggleFavorite = (provider) => {
    setFavorites(prev => {
      const isFav = prev.some(fav => fav.id === provider.id);
      if (isFav) {
        setToast({ message: `تم إزالة ${provider.name} من المفضلة`, type: 'info' });
        return prev.filter(fav => fav.id !== provider.id);
      } else {
        setToast({ message: `تم إضافة ${provider.name} إلى المفضلة ❤️`, type: 'success' });
        return [...prev, provider];
      }
    });
  };

  // التحقق إذا كان المزود موجود في المفضلة
  const isFavorite = (providerId) => favorites.some(fav => fav.id === providerId);

  // بيانات وهمية للعروض الحديثة
  const recentOffers = [
    { id: 1, providerName: 'مؤسسة البناء الذهبي', providerType: 'مقاول معتمد', price: '150,000', date: 'منذ ساعتين', status: 'جديد', initials: 'ب.ذ', color: '#10b981' },
    { id: 2, providerName: 'مكتب الإبداع الهندسي', providerType: 'مكتب هندسي', price: '45,000', date: 'منذ 5 ساعات', status: 'مقروء', initials: 'إ.هـ', color: '#3b82f6' },
    { id: 3, providerName: 'م. خالد عبدالله', providerType: 'مهندس معماري', price: '12,500', date: 'منذ يوم', status: 'جديد', initials: 'خ.ع', color: '#10b981' },
    { id: 4, providerName: 'شركة أطياف للتشطيبات', providerType: 'تشطيب وديكور', price: '85,000', date: 'منذ 3 أيام', status: 'مقروء', initials: 'أ.ط', color: '#3b82f6' },
  ];

// بيانات المشاريع المستمدة من الباك
  const mapProject = (p) => {
    const provider = p.performer?.user?.full_name || p.performer?.user?.name || (p.offers && p.offers.length ? 'بانتظار الترسية' : 'لم يتم الترسية بعد');
    return {
      id: p.id,
      title: p.title || 'مشروع',
      location: p.province?.name || '',
      progress: p.progress_percentage || 0,
      deadline: p.end_date ? p.end_date.slice(0, 10) : (p.start_date ? p.start_date.slice(0, 10) : 'بانتظار البدء'),
      provider,
      offersCount: p.offers ? p.offers.length : 0,
    };
  };

  const projects = {
    inProgress: liveProjects.filter(p => p.execution_status === 'in_progress' || p.execution_status === 'not_started').map(mapProject),
    pending: liveProjects.filter(p => !p.execution_status || p.execution_status === 'pending' || p.execution_status === 'new').map(mapProject),
    completed: liveProjects.filter(p => p.execution_status === 'finished').map(mapProject),
  };

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      
      {/* Toast Notification */}
      {toast && (
        <div className={`toast-custom ${toast.type === 'success' ? 'toast-success' : 'toast-info'}`}>
          {toast.message}
        </div>
      )}

      {/* ===== قسم الإحصائيات (مكبر 50%) ===== */}
      <div className="mb-4">
        <h4 className="fw-bold mb-4" style={{ color: '#1b2a47', fontSize: '30px' }}>مرحباً بعودتك، أحمد 👋</h4>
        <div className="row g-3">
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ transition: '0.3s' }}>
<div><p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>إجمالي المشاريع</p><h3 className="fw-bold mb-0" style={{ fontSize: '32px' }}>{liveProjects.length}</h3></div>
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle fs-4"><FaListAlt /></div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ transition: '0.3s' }}>
              <div><p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>قيد الإنشاء</p><h3 className="fw-bold mb-0" style={{ fontSize: '32px' }}>{projects.inProgress.length}</h3></div>
              <div className="bg-warning bg-opacity-10 text-warning p-3 rounded-circle fs-4"><FaSpinner /></div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ transition: '0.3s' }}>
              <div><p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>مكتملة</p><h3 className="fw-bold mb-0" style={{ fontSize: '32px' }}>{projects.completed.length}</h3></div>
              <div className="bg-success bg-opacity-10 text-success p-3 rounded-circle fs-4"><FaCheckCircle /></div>
            </div>
          </div>
          <div className="col-md-3 col-6">
            <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 d-flex flex-row align-items-center justify-content-between h-100" style={{ transition: '0.3s' }}>
              <div><p className="text-muted fw-bold mb-1" style={{ fontSize: '18px' }}>عروض بانتظارك</p><h3 className="fw-bold mb-0" style={{ fontSize: '32px' }}>{liveProjects.reduce((s, p) => s + (p.offers ? p.offers.length : 0), 0)}</h3></div>
              <div className="bg-info bg-opacity-10 text-info p-3 rounded-circle fs-4"><FaFileInvoiceDollar /></div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== شريط بحث مزود الخدمة (مع autofilter + أزرار المفضلة والملف الشخصي) ===== */}
      <div className="card border-0 shadow-sm rounded-4 p-3 p-md-4 mb-4 bg-white">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <FaSearch className="text-warning fs-3" />
            <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '27px' }}>بحث عن مزود خدمة</span>
            {searching && <FaSpinner className="fa-spin text-warning fs-3" />}
          </div>
          <div className="flex-grow-1 position-relative" style={{ minWidth: '250px' }}>
            <input 
              type="text" 
              className="form-control form-control-custom" 
              placeholder="ابحث بالاسم أو الرقم التعريفي (مثل: PR-001)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingRight: '50px', fontSize: '20px', padding: '16px 18px' }}
            />
            <FaSearch className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted fs-5" />
            {searchQuery && (
              <button 
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-2 border-0"
                onClick={() => { setSearchQuery(''); setSearchResults(null); }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* نتائج البحث (تظهر فوراً أثناء الكتابة) */}
        {searchResults !== null && (
          <div className="mt-3 pt-3 border-top">
            {searchResults.length > 0 ? (
              <div className="d-flex flex-column gap-2">
                <span className="fw-bold text-muted mb-1" style={{ fontSize: '18px' }}>نتائج البحث ({searchResults.length}):</span>
                {searchResults.map(provider => (
                  <div key={provider.id} className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-light border">
                    <div className="d-flex align-items-center gap-3">
                      {/* زر القلب (المفضلة) */}
                      <button
                        className="btn btn-sm p-0 border-0 d-flex align-items-center justify-content-center"
                        onClick={() => toggleFavorite(provider)}
                        title={isFavorite(provider.id) ? 'إزالة من المفضلة' : 'إضافة إلى المفضلة'}
                        style={{ width: '36px', height: '36px' }}
                      >
                        {isFavorite(provider.id) ? (
                          <FaHeart className="text-danger" size={22} style={{ cursor: 'pointer' }} />
                        ) : (
                          <FaRegHeart className="text-muted" size={22} style={{ cursor: 'pointer' }} />
                        )}
                      </button>
                      {/* أيقونة المزود */}
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                        style={{ width: '60px', height: '60px', fontSize: '24px', background: 'linear-gradient(135deg, #1b2a47, #ff8a00)' }}>
                        {provider.name.charAt(0)}
                      </div>
                      <div>
                        <h6 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '20px' }}>{provider.name}</h6>
                        <div className="d-flex align-items-center gap-3 text-muted fw-semibold flex-wrap" style={{ fontSize: '16px' }}>
                          <span><FaIdCard className="ms-1 text-warning" />{provider.id}</span>
                          <span><FaUserTie className="ms-1" />{provider.type}</span>
                          <span><FaStar className="ms-1 text-warning" />{provider.rating}</span>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      {/* زر عرض الملف الشخصي */}
                      <button 
                        className="btn fw-bold rounded-pill px-3" 
                        style={{ backgroundColor: '#f0f0f0', color: '#1b2a47', border: '1px solid #e2e8f0', fontSize: '16px', padding: '10px 20px' }}
                        onClick={() => { setActiveTab('profile'); }}
                      >
                        <FaUser className="ms-1" />الملف الشخصي
                      </button>
                      {/* زر طلب مباشر */}
                      <button 
                        className="btn fw-bold rounded-pill px-3 text-white" 
                        style={{ backgroundColor: '#ff8a00', fontSize: '16px', padding: '10px 20px' }}
                        onClick={() => { setActiveTab('add-project'); }}
                      >
                        طلب مباشر
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3">
                <FaSearch size={40} className="text-muted opacity-50 mb-2" />
                <p className="fw-bold text-muted mb-0" style={{ fontSize: '18px' }}>لا توجد نتائج للبحث. حاول بكلمات أخرى.</p>
              </div>
            )}
          </div>
        )}

        {/* دليل سريع للبحث (يظهر فقط عندما لا يوجد بحث نشط) */}
        {searchResults === null && !searchQuery && (
          <div className="d-flex gap-2 mt-2 flex-wrap">
            <span className="text-muted fw-semibold" style={{ fontSize: '16px' }}>مقترحات:</span>
            {['مقاول', 'مهندس', 'مكتب هندسي', 'كهرباء'].map((tag, i) => (
              <button key={i} className="btn fw-bold rounded-pill px-3" 
                style={{ backgroundColor: '#f0f0f0', color: '#1b2a47', border: '1px solid #e2e8f0', fontSize: '16px', padding: '10px 20px' }}
                onClick={() => { setSearchQuery(tag); }}>
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ===== زر إضافة مشروع جديد (النص على اليمين - الزر على اليسار) ===== */}
      <div className="card border-0 shadow-sm rounded-4 p-4 mb-5 text-white" 
        style={{ background: 'linear-gradient(135deg, #1b2a47 0%, #2d4a7a 100%)' }}>
        <div className="row align-items-center">
          <div className="col-md-8 text-end mb-3 mb-md-0 d-flex flex-column justify-content-center">
            <h4 className="fw-bold mb-2" style={{ fontSize: '32px' }}>هل لديك فكرة مشروع جديد؟</h4>
            <p className="mb-0 text-white-50 fw-semibold" style={{ fontSize: '20px' }}>اطرح مشروعك الآن واستقبل عروضاً من أفضل مزودي الخدمة في سوريا</p>
          </div>
          <div className="col-md-4 text-start">
            <button 
              className="btn fw-bold px-5 py-3 rounded-pill shadow-lg d-inline-flex align-items-center gap-2"
              style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '24px' }} 
              onClick={() => setActiveTab('add-project')}
            >
              <FaPlusSquare /> إضافة مشروع جديد
            </button>
          </div>
        </div>
      </div>

      {/* ===== المشاريع: قيد الإنشاء + قيد الانتظار + المنتهية ===== */}
      <div className="row g-4 mb-5">
        {/* قيد الإنشاء */}
        <div className="col-lg-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(255, 138, 0, 0.15)' }}>
              <FaSpinner className="fa-spin text-warning fs-3" />
            </div>
            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>قيد الإنشاء</h5>
            <span className="badge bg-warning bg-opacity-10 text-warning px-3 py-2 rounded-pill fw-bold me-auto" style={{ fontSize: '16px' }}>{projects.inProgress.length}</span>
          </div>
          <div className="d-flex flex-column gap-3">
            {projects.inProgress.map(p => (
              <div key={p.id} className="card border-0 shadow-sm rounded-4 p-3 bg-white border-end border-4 border-warning">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '18px' }}>{p.title}</h6>
                  <FaBuilding className="text-warning opacity-50 fs-4" />
                </div>
                <div className="d-flex gap-2 text-muted fw-semibold mb-2 flex-wrap" style={{ fontSize: '16px' }}>
                  <span><FaMapMarkerAlt className="ms-1 text-warning" />{p.location}</span>
                  <span><FaUserTie className="ms-1" />{p.provider}</span>
                </div>
                <div className="d-flex justify-content-between fw-bold mb-1" style={{ fontSize: '16px' }}>
                  <span className="text-muted">نسبة الإنجاز</span>
                  <span className="text-warning">{p.progress}%</span>
                </div>
                <div className="progress mb-2" style={{ height: '10px', borderRadius: '10px' }}>
                  <div className="progress-bar" style={{ width: `${p.progress}%`, background: 'linear-gradient(90deg, #ff8a00, #ffb347)', borderRadius: '10px' }}></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span className="text-muted fw-semibold" style={{ fontSize: '15px' }}><FaCalendarAlt className="ms-1" />{p.deadline}</span>
<button className="btn text-white fw-bold px-3 rounded-pill" style={{ backgroundColor: '#1b2a47', fontSize: '16px', padding: '8px 20px' }} onClick={() => setActiveTab('offers')}>متابعة</button>
                </div>
              </div>
            ))}
            {projects.inProgress.length === 0 && (
              <div className="text-center py-4 bg-white rounded-4 border">
                <FaBuilding size={40} className="text-muted opacity-50 mb-2" />
                <p className="fw-bold text-muted mb-0" style={{ fontSize: '18px' }}>لا توجد مشاريع قيد الإنشاء</p>
              </div>
            )}
          </div>
        </div>

        {/* قيد الانتظار */}
        <div className="col-lg-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
              <FaHourglassHalf className="text-primary fs-3" />
            </div>
            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>قيد الانتظار</h5>
            <span className="badge bg-primary bg-opacity-10 text-primary px-3 py-2 rounded-pill fw-bold me-auto" style={{ fontSize: '16px' }}>{projects.pending.length}</span>
          </div>
          <div className="d-flex flex-column gap-3">
            {projects.pending.map(p => (
              <div key={p.id} className="card border-0 shadow-sm rounded-4 p-3 bg-white border-end border-4 border-primary">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '18px' }}>{p.title}</h6>
                  {p.offersCount && (
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill fw-bold" style={{ fontSize: '14px', padding: '6px 12px' }}>
                      {p.offersCount} عروض
                    </span>
                  )}
                </div>
                <div className="d-flex gap-2 text-muted fw-semibold mb-2 flex-wrap" style={{ fontSize: '16px' }}>
                  <span><FaMapMarkerAlt className="ms-1 text-primary" />{p.location}</span>
                  <span><FaUserTie className="ms-1" />{p.provider}</span>
                </div>
                <div className="p-2 rounded-3 text-center fw-bold mt-2" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6', fontSize: '16px' }}>
                  <FaClock className="ms-1" /> {p.deadline}
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  {p.offersCount > 0 && (
                    <button className="btn btn-outline-primary fw-bold px-3 rounded-pill" style={{ fontSize: '16px', padding: '8px 20px' }} onClick={() => setActiveTab('offers')}>
                      عرض العروض
                    </button>
                  )}
                </div>
              </div>
            ))}
            {projects.pending.length === 0 && (
              <div className="text-center py-4 bg-white rounded-4 border">
                <FaHourglassHalf size={40} className="text-muted opacity-50 mb-2" />
                <p className="fw-bold text-muted mb-0" style={{ fontSize: '18px' }}>لا توجد مشاريع معلقة</p>
              </div>
            )}
          </div>
        </div>

        {/* المنتهية */}
        <div className="col-lg-4">
          <div className="d-flex align-items-center gap-2 mb-3">
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <FaCheckCircle className="text-success fs-3" />
            </div>
            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>منتهية</h5>
            <span className="badge bg-success bg-opacity-10 text-success px-3 py-2 rounded-pill fw-bold me-auto" style={{ fontSize: '16px' }}>{projects.completed.length}</span>
          </div>
          <div className="d-flex flex-column gap-3">
            {projects.completed.map(p => (
              <div key={p.id} className="card border-0 shadow-sm rounded-4 p-3 bg-white border-end border-4 border-success">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h6 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '18px' }}>{p.title}</h6>
                  <span className="badge bg-success rounded-pill fw-bold text-white" style={{ fontSize: '14px', padding: '6px 12px' }}>مكتمل</span>
                </div>
                <div className="d-flex gap-2 text-muted fw-semibold mb-2 flex-wrap" style={{ fontSize: '16px' }}>
                  <span><FaMapMarkerAlt className="ms-1 text-success" />{p.location}</span>
                  <span><FaUserTie className="ms-1" />{p.provider}</span>
                </div>
                <div className="progress mb-2" style={{ height: '10px', borderRadius: '10px' }}>
                  <div className="progress-bar bg-success" style={{ width: '100%', borderRadius: '10px' }}></div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-2 pt-2 border-top">
                  <span className="text-muted fw-semibold" style={{ fontSize: '15px' }}><FaCalendarAlt className="ms-1" />{p.deadline}</span>
                  <button className="btn btn-outline-warning text-dark fw-bold px-3 rounded-pill d-inline-flex align-items-center gap-1" style={{ fontSize: '16px', padding: '8px 20px' }} onClick={() => setActiveTab('reviews')}>
                    <FaStar className="text-warning" /> تقييم
                  </button>
                </div>
              </div>
            ))}
            {projects.completed.length === 0 && (
              <div className="text-center py-4 bg-white rounded-4 border">
                <FaCheckCircle size={40} className="text-muted opacity-50 mb-2" />
                <p className="fw-bold text-muted mb-0" style={{ fontSize: '18px' }}>لا توجد مشاريع منتهية</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ===== أحدث العروض المقدمة ===== */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)' }}>
              <FaFileInvoiceDollar className="text-success fs-3" />
            </div>
            <h5 className="fw-bold mb-0" style={{ color: '#1b2a47', fontSize: '24px' }}>أحدث العروض المقدمة</h5>
          </div>
          <button className="btn btn-link text-warning fw-bold text-decoration-none d-inline-flex align-items-center gap-1" style={{ fontSize: '18px' }} onClick={() => setActiveTab('offers')}>
            عرض الكل <FaChevronLeft size={16} />
          </button>
        </div>
        <div className="d-flex overflow-auto gap-3 pb-3 px-1" style={{ whiteSpace: 'nowrap', scrollBehavior: 'smooth' }}>
          {recentOffers.map(offer => (
            <div key={offer.id} className="card border-0 shadow-sm rounded-4 p-3 d-inline-block" style={{ minWidth: '350px', transition: '0.3s' }}>
              <div className="d-flex align-items-center gap-3 mb-3">
                <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white shadow-sm" 
                  style={{ width: '60px', height: '60px', fontSize: '24px', background: 'linear-gradient(135deg, #1b2a47, #ff8a00)' }}>
                  {offer.initials}
                </div>
                <div className="flex-grow-1" style={{ whiteSpace: 'normal' }}>
                  <div className="d-flex align-items-center gap-2">
                    <h6 className="fw-bold mb-0 text-dark" style={{ fontSize: '18px' }}>{offer.providerName}</h6>
                    {offer.status === 'جديد' && (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: '12px', padding: '4px 8px' }}>جديد</span>
                    )}
                  </div>
                  <span className="text-muted" style={{ fontSize: '15px' }}>{offer.providerType}</span>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-3 border-top">
                <div>
                  <span className="text-muted fw-semibold d-block" style={{ fontSize: '15px' }}>{offer.date}</span>
                  <span className="fw-bold" style={{ color: '#ff8a00', fontSize: '22px' }}>{offer.price} ل.س</span>
                </div>
                <button className="btn fw-bold rounded-pill px-3" 
                  style={{ backgroundColor: '#f0f0f0', color: '#1b2a47', border: '1px solid #e2e8f0', fontSize: '16px', padding: '8px 20px' }} 
                  onClick={() => setActiveTab('offers')}>
                  عرض التفاصيل
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardTab;
