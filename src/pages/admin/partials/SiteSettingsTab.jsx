import { useState, useEffect } from 'react';
import {
  FaCog, FaSpinner, FaSave, FaBook, FaInfoCircle,
  FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaShieldAlt
} from 'react-icons/fa';
import { fetchSiteSettings, updateSiteSettings } from '../../../services/api/adminApi';
import './admin-tabs.css';

// بيانات ابتدائية فارغة (أو وهمية احتياطية) ريثما يتم التحميل من الباك إند
const defaultSettings = {
  site: { name: '', tagline: '', description: '' },
  contact: { phone: '', email: '', address: '' },
  guidance: { intro: '', general: '', tips: '' }
};

const SiteSettingsTab = () => {
  const [settings, setSettings] = useState(defaultSettings);
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
        // الباك إند يعيد البيانات على شكل { key: value }
        const data = res.data?.data || res.data;
        
        if (data) {
          // تفريغ البيانات القادمة من الباك إند لتناسب هيكلية الفرونت إند
          setSettings({
            site: {
              name: data.site_name || '',
              tagline: data.site_slogan || '',
              description: data.site_description || '',
            },
            contact: {
              phone: data.contact_phone || '',
              email: data.contact_email || '',
              address: data.contact_address || ''
            },
            guidance: {
              intro: data.guide_intro || '',
              general: data.guide_general_instructions || '',
              tips: data.guide_financial_advice || ''
            }
          });
        }
      } catch (error) {
        console.error("فشل جلب الإعدادات من السيرفر:", error);
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
      // تجهيز الكائن (Payload) بالأسماء التي يتوقعها الباك إند بالضبط في قواعد التحقق (Validation)
      const payload = {
        site_name: settings.site.name,
        site_slogan: settings.site.tagline,
        site_description: settings.site.description,
        contact_phone: settings.contact.phone,
        contact_email: settings.contact.email,
        contact_address: settings.contact.address,
        guide_intro: settings.guidance.intro,
        guide_general_instructions: settings.guidance.general,
        guide_financial_advice: settings.guidance.tips
      };

      // إرسال طلب التحديث للباك إند
      await updateSiteSettings(payload);
      showToast('success', '✅ تم حفظ جميع إعدادات الموقع بنجاح');
    } catch (error) {
      console.error("فشل حفظ الإعدادات:", error);
      showToast('danger', '❌ حدث خطأ أثناء حفظ الإعدادات، تأكد من صحة البيانات.');
    } finally {
      setSaving(false);
    }
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
      {toast && <div className={`toast-custom toast-${toast.type === 'danger' ? 'error' : toast.type}`}>{toast.message}</div>}

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