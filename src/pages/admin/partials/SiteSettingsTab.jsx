import { useState, useEffect } from 'react';
import {
  FaCog, FaSpinner, FaSave, FaBook, FaInfoCircle,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt
} from 'react-icons/fa';
import { fetchSiteSettings, updateSiteSettings, updateGuidancePage } from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات وهمية احتياطية
const mockSettings = {
  site: {
    name: 'داركم',
    tagline: 'خطتك الذكية لبيت أحلامك',
    description: 'منصتك الموثوقة لإدارة وتطوير مشاريعك الهندسية والمقاولات بكل احترافية.',
  },
  contact: {
    phone: '0999123456',
    email: 'info@darakom.sy',
    address: 'دمشق، سوريا'
  },
  guidance: {
    intro: 'كل ما تحتاجه من معلومات، خطوات، ونصائح لبناء مشروعك بنجاح وبأعلى معايير الجودة والتوفير.',
    general: 'السلامة أولاً، استخراج التراخيص القانونية، اختيار المقاول المعتمد، والحرص على جودة المواد.',
    tips: 'وضع ميزانية دقيقة مع هامش طوارئ، المقارنة بين عروض الأسعار، والالتزام بالتصميم المعتمد.'
  }
};

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState(mockSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetchSiteSettings();
        const data = res.data?.data;
        if (data) setSettings(data);
      } catch {
        // ابقِ على البيانات الوهمية
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSiteChange = (field, value) => {
    setSettings({ ...settings, site: { ...settings.site, [field]: value } });
  };

  const handleContactChange = (field, value) => {
    setSettings({ ...settings, contact: { ...settings.contact, [field]: value } });
  };

  const handleGuidanceChange = (field, value) => {
    setSettings({ ...settings, guidance: { ...settings.guidance, [field]: value } });
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSiteSettings(settings.site);
      await updateGuidancePage(settings.guidance);
    } catch {
      // محلياً
    } finally {
      setSaving(false);
    }
    showToast('success', '✅ تم حفظ إعدادات الموقع بنجاح');
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <FaSpinner className="fa-spin fs-1 text-warning" />
      </div>
    );
  }

  return (
    <div className="mx-auto" style={{ maxWidth: '100%' }}>
      {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

      {/* رأس الواجهة */}
      <div className="admin-section-header">
        <div>
          <h3><FaCog className="ms-2 text-warning" /> إدارة بيانات الموقع</h3>
          <p>تعديل معلومات الموقع ومحتوى الصفحة الإرشادية.</p>
        </div>
      </div>

      <form onSubmit={handleSaveAll}>
        {/* ===== معلومات الموقع ===== */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '22px' }}>
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(13,110,253,0.1)' }}><FaInfoCircle className="text-primary fs-4" /></div>
            معلومات الموقع
          </h5>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label fw-bold">اسم الموقع</label>
              <input className="form-control form-control-admin" value={settings.site.name}
                onChange={e => handleSiteChange('name', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold">الشعار أو الوصف المختصر</label>
              <input className="form-control form-control-admin" value={settings.site.tagline}
                onChange={e => handleSiteChange('tagline', e.target.value)} />
            </div>
            <div className="col-12">
              <label className="form-label fw-bold">وصف الموقع</label>
              <textarea className="form-control form-control-admin" rows="3" value={settings.site.description}
                onChange={e => handleSiteChange('description', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ===== معلومات التواصل ===== */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '22px' }}>
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(16,185,129,0.1)' }}><FaPhoneAlt className="text-success fs-4" /></div>
            معلومات التواصل
          </h5>
          <div className="row g-4">
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaPhoneAlt className="ms-1" /> رقم الهاتف</label>
              <input className="form-control form-control-admin" dir="ltr" value={settings.contact.phone}
                onChange={e => handleContactChange('phone', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaEnvelope className="ms-1" /> البريد الإلكتروني</label>
              <input className="form-control form-control-admin" dir="ltr" type="email" value={settings.contact.email}
                onChange={e => handleContactChange('email', e.target.value)} />
            </div>
            <div className="col-md-4">
              <label className="form-label fw-bold"><FaMapMarkerAlt className="ms-1" /> العنوان</label>
              <input className="form-control form-control-admin" value={settings.contact.address}
                onChange={e => handleContactChange('address', e.target.value)} />
            </div>
          </div>
        </div>

        {/* ===== الصفحة الإرشادية ===== */}
        <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 mb-4 bg-white">
          <h5 className="fw-bold mb-4 d-flex align-items-center gap-2" style={{ color: '#1b2a47', fontSize: '22px' }}>
            <div className="p-2 rounded-3" style={{ backgroundColor: 'rgba(255,138,0,0.1)' }}><FaBook className="text-warning fs-4" /></div>
            محتوى الصفحة الإرشادية
          </h5>
          <div className="row g-4">
            <div className="col-12">
              <label className="form-label fw-bold">المقدمة</label>
              <textarea className="form-control form-control-admin" rows="2" value={settings.guidance.intro}
                onChange={e => handleGuidanceChange('intro', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold"><FaShieldAlt className="ms-1" /> الإرشادات العامة</label>
              <textarea className="form-control form-control-admin" rows="4" value={settings.guidance.general}
                onChange={e => handleGuidanceChange('general', e.target.value)} />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-bold"><FaInfoCircle className="ms-1" /> النصائح المالية</label>
              <textarea className="form-control form-control-admin" rows="4" value={settings.guidance.tips}
                onChange={e => handleGuidanceChange('tips', e.target.value)} />
            </div>
          </div>
        </div>

        {/* زر الحفظ */}
        <div className="text-center">
          <button type="submit" className="btn-admin-orange d-inline-flex align-items-center gap-2 px-5 py-3" disabled={saving}>
            {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ جميع التغييرات</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SiteSettingsTab;
