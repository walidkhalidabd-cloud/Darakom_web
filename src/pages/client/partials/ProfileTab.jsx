import { useState, useEffect } from 'react';
import { FaUserEdit, FaStar, FaListAlt, FaShieldAlt, FaSpinner, FaSave, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { fetchClientProfile, updateClientProfile } from '../../../services/api/clientApi';
import { clearAuth } from '../../../services/auth';
import './client-tabs.css';

const ProfileTab = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  // مصفوفة المحافظات السورية مع IDs لتتوافق مع الباك إند
  const syrianGovernorates = [
    { id: 1, name: 'دمشق' },
    { id: 2, name: 'حلب' },
    { id: 3, name: 'ريف دمشق' },
    { id: 4, name: 'درعا' },
    { id: 5, name: 'السويداء' },
    { id: 6, name: 'القنيطرة' },
    { id: 7, name: 'اللاذقية' },
    { id: 8, name: 'طرطوس' },
    { id: 9, name: 'إدلب' },
    { id: 10, name: 'حماة' },
    { id: 11, name: 'الحسكة' },
    { id: 12, name: 'الرقة' },
    { id: 13, name: 'دير الزور' },
    { id: 14, name: 'حمص' }
  ];
  const [formData, setFormData] = useState({
    first_name: '', 
    last_name: '', 
    email: '', 
    phone: '', 
    address: '', 
    province_id: '', 
    bio: ''
  });
 const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchClientProfile();
        // معالجة البيانات القادمة من UserResource
        let data = res.data?.data || res.data || {};
        
        // ربط مباشر مع أسماء المتغيرات القادمة من الباك إند
        setFormData({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          province_id: data.province_id || '',
          bio: data.profile?.bio || ''
        });
      } catch (err) {
        console.error("Error fetching profile", err);
        showToast('error', 'حدث خطأ أثناء جلب البيانات من السيرفر.');
      } finally { setLoading(false); }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateClientProfile(formData);
      showToast('success', '✅ تم حفظ التغييرات بنجاح!');
    } catch (err) {
      console.error("Error updating profile", err);
      showToast('error', err.response?.data?.message || 'حدث خطأ أثناء حفظ التغييرات');
    } finally { setSaving(false); }
  };

 

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="card-provider p-5"><div className="loading-skeleton" style={{ height: '400px' }}></div></div>
      </div>
    );
  }

  // دمج الاسم للعرض في الواجهة
  const displayName = (formData.first_name || formData.last_name) 
        ? `${formData.first_name} ${formData.last_name}` 
        : 'مستخدم داركم';

  return (
    <div className="profile-container">
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      <div className="section-header">
        <div><h3><FaUserEdit className="ms-2 text-warning" /> الملف الشخصي</h3></div>
      </div>

      <div className="card-provider p-4 p-md-5 bg-white">
        <div className="row g-5">
          <div className="col-lg-4 text-center border-start">
            <div className="position-relative d-inline-block mb-4">
              <div className="bg-warning text-white rounded-circle d-flex align-items-center justify-content-center fw-bold shadow" style={{ width: '150px', height: '150px', fontSize: '60px', margin: '0 auto' }}>
                {formData.first_name?.charAt(0) || 'م'}
              </div>
              <button className="btn btn-sm btn-light rounded-circle position-absolute bottom-0 start-0 shadow" style={{ width: '45px', height: '45px' }}>
                <FaUserEdit size={22} className="text-dark" />
              </button>
            </div>
            
            <h3 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{displayName}</h3>
            
            <p className="text-muted fw-semibold mb-2">حساب عميل (صاحب مشاريع)</p>
            <span className="badge-pending px-3 py-2 rounded-pill fw-bold mb-4 d-inline-block" style={{ backgroundColor: 'rgba(25,135,84,0.1)', color: '#198754', border: '1px solid rgba(25,135,84,0.25)' }}>
              <FaShieldAlt className="ms-1" /> حساب موثق
            </span>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <div className="bg-light p-3 rounded-4 text-center w-50 border">
                <div className="text-primary mb-1"><FaListAlt size={24} /></div>
                <h4 className="fw-bold text-dark mb-1">0</h4>
                <span className="text-muted small fw-bold">مشاريع مطروحة</span>
              </div>
              <div className="bg-light p-3 rounded-4 text-center w-50 border">
                <div className="text-warning mb-1"><FaStar size={24} /></div>
                <h4 className="fw-bold text-dark mb-1">0</h4>
                <span className="text-muted small fw-bold">متوسط التقييم</span>
              </div>
            </div>
            
            <button 
              className="btn btn-outline-danger fw-bold rounded-pill px-4 py-2 mt-4 d-inline-flex align-items-center gap-2 shadow-sm"
              style={{ fontSize: '17px' }}
              onClick={handleLogout}
            >
              <FaSignOutAlt /> تسجيل الخروج
            </button>
          </div>

          <div className="col-lg-8">
            <div className="fw-bold fs-4 mb-4 pb-3 border-bottom">المعلومات الشخصية</div>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {[
                  { label: 'الاسم الأول', field: 'first_name', col: 6, type: 'text' },
                  { label: 'الاسم الأخير', field: 'last_name', col: 6, type: 'text' },
                  { label: 'البريد الإلكتروني', field: 'email', col: 6, type: 'email', readOnly: false },
                  { label: 'رقم الهاتف', field: 'phone', col: 6, type: 'text' },
                ].map(field => (
                  <div key={field.field} className={`col-md-${field.col}`}>
                    <label className="form-label fw-bold">{field.label}</label>
                    <input type={field.type} className="form-control form-control-custom" readOnly={field.readOnly}
                      value={formData[field.field]} onChange={e => setFormData(prev => ({ ...prev, [field.field]: e.target.value }))} />
                  </div>
                ))}
                
                <div className="col-md-6">
                  <label className="form-label fw-bold">المحافظة</label>
                  <select className="form-control form-control-custom"
                    value={formData.province_id}
                    onChange={e => setFormData(prev => ({ ...prev, province_id: e.target.value }))}>
                    <option value="">اختر المحافظة...</option>
                    {syrianGovernorates.map(gov => (
                      <option key={gov.id} value={gov.id}>{gov.name}</option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-bold">العنوان التفصيلي</label>
                  <input type="text" className="form-control form-control-custom" placeholder="مثل: حي المزة، شارع 15"
                    value={formData.address || ''} onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))} />
                </div>

                <div className="col-12">
                  <label className="form-label fw-bold">نبذة عنك (تظهر لمزودي الخدمة)</label>
                  <textarea className="form-control form-control-custom" rows="4" placeholder="اكتب نبذة مختصرة عنك..."
                    value={formData.bio || ''} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}></textarea>
                </div>
                
                <div className="col-12 text-center mt-4">
                  <button type="submit" className="btn-provider-orange d-inline-flex align-items-center gap-2 px-5 py-3" disabled={saving}>
                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ التغييرات</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileTab;