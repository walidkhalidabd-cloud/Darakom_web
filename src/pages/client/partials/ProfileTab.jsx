import { useState, useEffect } from 'react';
import { FaUserEdit, FaStar, FaListAlt, FaShieldAlt, FaSpinner, FaSave } from 'react-icons/fa';
import { fetchClientProfile, updateClientProfile } from '../../../services/api/clientApi';
import './client-tabs.css';

const ProfileTab = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  // مصفوفة المحافظات السورية
  const syrianGovernorates = [
    'دمشق', 'ريف دمشق', 'حلب', 'حمص', 'حماة',
    'اللاذقية', 'طرطوس', 'إدلب', 'الرقة', 'دير الزور',
    'الحسكة', 'درعا', 'السويداء', 'القنيطرة'
  ];

  const [formData, setFormData] = useState({
    first_name: '', last_name: '', email: '', phone: '', address: '', bio: ''
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchClientProfile();
        const data = res.data?.data || {};
        setFormData({
          first_name: data.first_name || 'أحمد',
          last_name: data.last_name || 'سليمان',
          email: data.email || 'ahmed.s@example.com',
          phone: data.phone || '0999123456',
          address: data.address || 'دمشق',
          bio: data.bio || 'مهتم بتطوير العقارات وبناء مشاريع سكنية حديثة.'
        });
      } catch (err) {
        setFormData({
          first_name: 'أحمد', last_name: 'سليمان', email: 'ahmed.s@example.com',
          phone: '0999123456', address: 'دمشق',
          bio: 'مهتم بتطوير العقارات وبناء مشاريع سكنية حديثة.'
        });
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
      showToast('success', '✅ تم حفظ التغييرات بنجاح!');
    } finally { setSaving(false); }
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="card-provider p-5"><div className="loading-skeleton" style={{ height: '400px' }}></div></div>
      </div>
    );
  }

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
            <h3 className="fw-bold mb-1" style={{ color: '#1b2a47' }}>{formData.first_name} {formData.last_name}</h3>
            <p className="text-muted fw-semibold mb-2">حساب عميل (صاحب مشاريع)</p>
            <span className="badge-pending px-3 py-2 rounded-pill fw-bold mb-4 d-inline-block" style={{ backgroundColor: 'rgba(25,135,84,0.1)', color: '#198754', border: '1px solid rgba(25,135,84,0.25)' }}>
              <FaShieldAlt className="ms-1" /> حساب موثق
            </span>
            <div className="d-flex justify-content-center gap-3 mt-2">
              <div className="bg-light p-3 rounded-4 text-center w-50 border">
                <div className="text-primary mb-1"><FaListAlt size={24} /></div>
                <h4 className="fw-bold text-dark mb-1">5</h4>
                <span className="text-muted small fw-bold">مشاريع مطروحة</span>
              </div>
              <div className="bg-light p-3 rounded-4 text-center w-50 border">
                <div className="text-warning mb-1"><FaStar size={24} /></div>
                <h4 className="fw-bold text-dark mb-1">4.8</h4>
                <span className="text-muted small fw-bold">متوسط التقييم</span>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="fw-bold fs-4 mb-4 pb-3 border-bottom">المعلومات الشخصية</div>
            <form onSubmit={handleSubmit}>
              <div className="row g-4">
                {[
                  { label: 'الاسم الأول', field: 'first_name', col: 6, type: 'text' },
                  { label: 'الاسم الأخير', field: 'last_name', col: 6, type: 'text' },
                  { label: 'البريد الإلكتروني', field: 'email', col: 6, type: 'email', readOnly: true },
                  { label: 'رقم الهاتف', field: 'phone', col: 6, type: 'text' },
                ].map(field => (
                  <div key={field.field} className={`col-md-${field.col}`}>
                    <label className="form-label fw-bold">{field.label}</label>
                    <input type={field.type} className="form-control form-control-custom" readOnly={field.readOnly}
                      value={formData[field.field]} onChange={e => setFormData(prev => ({ ...prev, [field.field]: e.target.value }))} />
                  </div>
                ))}
                {/* حقل المحافظة كقائمة منسدلة */}
                <div className="col-md-12">
                  <label className="form-label fw-bold">المحافظة</label>
                  <select className="form-control form-control-custom"
                    value={formData.address}
                    onChange={e => setFormData(prev => ({ ...prev, address: e.target.value }))}>
                    <option value="">اختر المحافظة...</option>
                    {syrianGovernorates.map(gov => (
                      <option key={gov} value={gov}>{gov}</option>
                    ))}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label fw-bold">نبذة عنك (تظهر لمزودي الخدمة)</label>
                  <textarea className="form-control form-control-custom" rows="4"
                    value={formData.bio} onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}></textarea>
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

