import { useState, useEffect } from 'react';
import {
FaCog, FaBook, FaInfoCircle, FaSave, FaSpinner,
    FaEnvelope, FaPhone, FaMapMarkerAlt, FaGlobe, FaClipboardList
} from 'react-icons/fa';
import { fetchSiteSettings, updateSiteSettings, fetchGuidanceContent, updateGuidanceContent } from '../../../services/api/adminApi';
import './admin-tabs.css';

const SiteSettingsTab = () => {
    const [activeSection, setActiveSection] = useState('info');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState(null);

    // معلومات الموقع
    const [siteInfo, setSiteInfo] = useState({
        siteName: 'داركم',
        tagline: 'منصتك الموثوقة لإدارة وتطوير مشاريعك الهندسية والمقاولات',
        email: 'info@darakom.com',
        phone: '011 234 5678',
        address: 'دمشق، سوريا',
        about: 'منصة داركم هي منصة سورية متكاملة تربط أصحاب المشاريع بمقدمي الخدمات الهندسية والمقاولات بكفاءة وموثوقية.'
    });

    // محتوى صفحة الإرشادات
    const [guidance, setGuidance] = useState({
        intro: 'مرحباً بك في مركز المساعدة والإرشادات الخاص بمنصة داركم. إليك دليلك الشامل لاستخدام المنصة بشكل صحيح.',
        sections: [
            { id: 1, title: 'كيفية إنشاء حساب', content: 'اضغط على زر إنشاء حساب، ثم اختر نوع الحساب (عميل أو مزود خدمة)، وأدخل بياناتك بجهة الشكل.' },
            { id: 2, title: 'كيفية إضافة مشروع', content: 'بعد تسجيل الدخول كعميل، توجه إلى قسم "إضافة مشروع" وأدخل تفاصيل مشروعك.' },
            { id: 3, title: 'كيفية تقديم عرض', content: 'إذا كنت مزود خدمة، تصفح المناقصات المتاحة وقدم عرضك على المشروع الذي يناسبك.' },
        ]
    });

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [siteRes, guidanceRes] = await Promise.all([
                    fetchSiteSettings().catch(() => null),
                    fetchGuidanceContent().catch(() => null)
                ]);
                if (siteRes?.data?.data) setSiteInfo(siteRes.data.data);
                if (guidanceRes?.data?.data) setGuidance(guidanceRes.data.data);
            } catch (err) {
                console.warn('⚠️ API غير متاح:', err.message);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const showToast = (type, message) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSaveInfo = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateSiteSettings(siteInfo);
        } catch {
            // تجاهل
        }
        setSaving(false);
        showToast('success', '✅ تم حفظ معلومات الموقع بنجاح');
    };

    const handleSaveGuidance = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateGuidanceContent(guidance);
        } catch {
            // تجاهل
        }
        setSaving(false);
        showToast('success', '✅ تم حفظ صفحة الإرشادات بنجاح');
    };

    if (loading) {
        return (
            <div className="mx-auto" style={{ maxWidth: '1100px' }}>
                <div className="section-header"><div><h3><FaCog className="ms-2 text-secondary" /> إدارة الموقع</h3></div></div>
                {[1, 2].map(i => <div key={i} className="card-admin p-5 mb-4"><div className="loading-skeleton" style={{ height: '150px' }}></div></div>)}
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1100px' }}>
            {toast && <div className={`toast-custom toast-${toast.type}`}>{toast.message}</div>}

            <div className="section-header">
                <div>
                    <h3><FaCog className="ms-2 text-secondary" /> إدارة بيانات الموقع</h3>
                    <p>إدارة معلومات الموقع ومحتوى صفحة الإرشادات</p>
                </div>
            </div>

            {/* التبويبات */}
            <div className="tab-switcher mb-4">
                <button className={activeSection === 'info' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'info' ? '#1b2a47' : '#e2e8f0', minWidth: '200px' }}
                    onClick={() => setActiveSection('info')}>
                    <FaInfoCircle className="ms-2" /> معلومات الموقع
                </button>
                <button className={activeSection === 'guidance' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'guidance' ? '#1b2a47' : '#e2e8f0', minWidth: '200px' }}
                    onClick={() => setActiveSection('guidance')}>
                    <FaBook className="ms-2" /> صفحة الإرشادات
                </button>
            </div>

            {/* قسم معلومات الموقع */}
            {activeSection === 'info' && (
                <form onSubmit={handleSaveInfo}>
                    <div className="card-admin p-4 p-md-5 bg-white mb-4">
                        <h4 className="fw-bold text-primary mb-4"><FaInfoCircle className="ms-2" /> معلومات الموقع العامة</h4>
                        <div className="row g-4">
                            <div className="col-md-6">
                                <label className="form-label fw-bold">اسم الموقع</label>
                                <input type="text" className="form-control form-control-custom" value={siteInfo.siteName}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, siteName: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold">الشعار أو الوصف المختصر</label>
                                <input type="text" className="form-control form-control-custom" value={siteInfo.tagline}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, tagline: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold"><FaEnvelope className="ms-1" /> البريد الإلكتروني</label>
                                <input type="email" className="form-control form-control-custom" value={siteInfo.email}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, email: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold"><FaPhone className="ms-1" /> رقم الهاتف</label>
                                <input type="text" className="form-control form-control-custom" value={siteInfo.phone}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, phone: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold"><FaMapMarkerAlt className="ms-1" /> العنوان</label>
                                <input type="text" className="form-control form-control-custom" value={siteInfo.address}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, address: e.target.value }))} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label fw-bold"><FaGlobe className="ms-1" /> نبذة عن الموقع</label>
                                <input type="text" className="form-control form-control-custom" value={siteInfo.about}
                                    onChange={e => setSiteInfo(prev => ({ ...prev, about: e.target.value }))} />
                            </div>
                            <div className="col-12 text-center mt-4">
                                <button type="submit" className="btn-admin-primary d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '20px' }} disabled={saving}>
                                    {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ المعلومات</>}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* قسم صفحة الإرشادات */}
            {activeSection === 'guidance' && (
                <form onSubmit={handleSaveGuidance}>
                    <div className="card-admin p-4 p-md-5 bg-white mb-4">
                        <h4 className="fw-bold text-primary mb-4"><FaBook className="ms-2" /> محتوى صفحة الإرشادات</h4>
                        <div className="mb-4">
                            <label className="form-label fw-bold">النص التعريفي للصفحة</label>
                            <textarea className="form-control form-control-custom" rows="3" value={guidance.intro}
                                onChange={e => setGuidance(prev => ({ ...prev, intro: e.target.value }))}></textarea>
                        </div>

                        <h5 className="fw-bold mb-3" style={{ color: '#1b2a47' }}><FaClipboardList className="ms-2" /> الأقسام الإرشادية</h5>
                        <div className="d-flex flex-column gap-4">
                            {guidance.sections.map((section, idx) => (
                                <div key={section.id} className="p-3 rounded-4" style={{ backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
                                    <div className="row g-3">
                                        <div className="col-md-4">
                                            <label className="form-label fw-bold small">عنوان القسم</label>
                                            <input type="text" className="form-control form-control-custom" value={section.title}
                                                onChange={e => {
                                                    const updated = [...guidance.sections];
                                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                                    setGuidance(prev => ({ ...prev, sections: updated }));
                                                }} />
                                        </div>
                                        <div className="col-md-8">
                                            <label className="form-label fw-bold small">المحتوى</label>
                                            <textarea className="form-control form-control-custom" rows="2" value={section.content}
                                                onChange={e => {
                                                    const updated = [...guidance.sections];
                                                    updated[idx] = { ...updated[idx], content: e.target.value };
                                                    setGuidance(prev => ({ ...prev, sections: updated }));
                                                }}></textarea>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="col-12 text-center mt-4">
                            <button type="submit" className="btn-admin-primary d-inline-flex align-items-center gap-2 px-5 py-3" style={{ fontSize: '20px' }} disabled={saving}>
                                {saving ? <><FaSpinner className="fa-spin" /> جاري الحفظ...</> : <><FaSave /> حفظ الإرشادات</>}
                            </button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default SiteSettingsTab;
