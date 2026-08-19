import { useState, useEffect } from 'react';
import { FaGlobe, FaLock, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaUserTie, FaSpinner } from 'react-icons/fa';
import { fetchPublicTenders, fetchPrivateTenders, declineInvitation } from '../../../services/api/providerApi';
import TenderDetails from './TenderDetails';
import SubmitOffer from './SubmitOffer';
import './provider-tabs.css';

const TendersTab = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [selectedTenderId, setSelectedTenderId] = useState(null);
    const [selectedTenderType, setSelectedTenderType] = useState(null); // 'public' or 'private'
    const [showSubmitOffer, setShowSubmitOffer] = useState(false);
    const [loading, setLoading] = useState(true);
    const [tenders, setTenders] = useState({ general: [], private: [] });

    const loadTenders = async () => {
        setLoading(true);
        try {
            // جلب المناقصات العامة والخاصة بالتوازي
            const [publicRes, privateRes] = await Promise.all([
                fetchPublicTenders().catch(() => ({ data: { data: [] } })),
                fetchPrivateTenders().catch(() => ({ data: { data: [] } }))
            ]);

            const publicData = publicRes.data?.data || [];
            const privateData = privateRes.data?.data || [];

            // تنسيق المناقصات العامة
            const gen = publicData.map(t => ({
                id: t.id,
                status: 'متاح للتقديم',
                time: new Date(t.created_at).toLocaleDateString('ar-EG'),
                title: t.title || 'مشروع بدون عنوان',
                location: t.location_details || t.province?.name || 'غير محدد',
                area: t.area || 'غير محدد',
                deadline: t.tender_duration ? `${t.tender_duration} ${t.tender_duration_unit === 'day' ? 'يوم' : 'ساعة'}` : 'غير محدد',
                color: '#1b2a47',
                type: 'public'
            }));

            // تنسيق المناقصات الخاصة (الدعوات)
            const priv = privateData.map(inv => {
                const t = inv.project; // الدعوة تحتوي على كائن المشروع
                const clientName = t?.client?.first_name ? `${t.client.first_name} ${t.client.last_name || ''}`.trim() : (t?.client?.name || 'غير معروف');
                return {
                    id: inv.id, // نستخدم ID الدعوة لكي نتمكن من رفضها أو قبولها
                    project_id: t?.id, // ID المشروع الحقيقي لتقديم العرض
                    status: 'دعوة حصرية',
                    time: new Date(inv.created_at).toLocaleDateString('ar-EG'),
                    title: t?.title || 'مشروع بدون عنوان',
                    client: clientName,
                    location: t?.location_details || t?.province?.name || 'غير محدد',
                    area: t?.area || 'غير محدد',
                    deadline: inv.expires_at ? `ينتهي في: ${new Date(inv.expires_at).toLocaleDateString('ar-EG')}` : 'غير محدد',
                    color: '#ff8a00',
                    type: 'private'
                };
            });

            setTenders({ general: gen, private: priv });
        } catch (error) {
            console.error("خطأ في جلب المناقصات:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTenders();
    }, []);

    // دالة لرفض الدعوة الخاصة
    const handleDecline = async (invitationId) => {
        if (!window.confirm("هل أنت متأكد من رغبتك بالاعتذار عن هذا المشروع؟")) return;
        try {
            await declineInvitation(invitationId);
            alert("✅ تم الاعتذار عن المشروع بنجاح.");
            loadTenders(); // إعادة التحميل لإزالة الدعوة من القائمة
        } catch (error) {
            console.error("خطأ في رفض الدعوة:", error);
            alert("❌ حدث خطأ أثناء رفض الدعوة.");
        }
    };

    const currentData = activeSection === 'general' ? tenders.general : tenders.private;

    // واجهة تقديم العرض (يجب تمرير بيانات المشروع كاملة لها من التفاصيل)
    if (showSubmitOffer && selectedTenderId) {
        return <SubmitOffer 
                    tender={selectedTenderId} // نمرر الـ Object القادم من التفاصيل
                    onBack={() => setShowSubmitOffer(false)} 
               />;
    }

    // واجهة تفاصيل المناقصة
    if (selectedTenderId) {
        return <TenderDetails 
                    tenderId={selectedTenderId.type === 'private' ? selectedTenderId.project_id : selectedTenderId.id} 
                    tenderType={selectedTenderId.type}
                    invitationId={selectedTenderId.type === 'private' ? selectedTenderId.id : null} // للاستخدام عند رفض الدعوة من الداخل
                    onBack={() => setSelectedTenderId(null)} 
                    onStartOffer={(fullTenderData) => {
                        setSelectedTenderId(fullTenderData); // نمرر التفاصيل الكاملة لنرسلها لواجهة تقديم العرض
                        setShowSubmitOffer(true);
                    }} 
               />;
    }

    if (loading) {
        return (
            <div className="mx-auto text-center py-5" style={{ maxWidth: '1400px' }}>
                <FaSpinner className="fa-spin text-warning mb-3" size={50} />
                <h4 className="fw-bold text-muted">جاري تحميل سوق المناقصات...</h4>
            </div>
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '1400px' }}>
            <div className="section-header">
                <div>
                    <h3><FaBuilding className="ms-2 text-warning" /> سوق المناقصات</h3>
                    <p>تصفح المناقصات وقدم أفضل عروضك</p>
                </div>
            </div>

            <div className="tab-switcher justify-content-center">
                <button className={activeSection === 'general' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'general' ? '#1b2a47' : '', color: activeSection === 'general' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('general')}>
                    <FaGlobe className="ms-2" /> المناقصات العامة
                </button>
                <button className={activeSection === 'private' ? 'active-tab' : 'inactive-tab'}
                    style={{ backgroundColor: activeSection === 'private' ? '#ff8a00' : '', color: activeSection === 'private' ? 'white' : '#1b2a47' }}
                    onClick={() => setActiveSection('private')}>
                    <FaLock className="ms-2" /> المناقصات الخاصة
                </button>
            </div>

            <div className="alert border-0 shadow-sm rounded-4 p-4 mb-4 text-center fw-bold fs-5"
                style={{ backgroundColor: activeSection === 'general' ? '#e9f2ff' : '#fff4e5', color: activeSection === 'general' ? '#1b2a47' : '#ff8a00' }}>
                {activeSection === 'general'
                    ? '💡 هذه المناقصات مطروحة لجميع مزودي الخدمة. قدّم أفضل عرض لديك!'
                    : '⭐ هذه دعوات مباشرة موجهة لك من العملاء بناءً على تميزك.'}
            </div>

            <div className="d-flex flex-column gap-4">
                {currentData.length > 0 ? currentData.map(t => (
                    <div key={t.id} className="card-provider p-4 p-md-5 bg-white border-end border-4"
                        style={{ borderColor: t.color }}>

                        <div className="row align-items-center">
                            <div className="col-lg-8 mb-4 mb-lg-0">
                                <div className="d-flex align-items-center gap-3 mb-3 flex-wrap">
                                    <span className="badge px-3 py-2 rounded-pill fs-6 fw-bold d-inline-flex align-items-center gap-1"
                                        style={{ backgroundColor: `${t.color}15`, color: t.color, border: `1px solid ${t.color}40` }}>
                                        {t.status === 'دعوة حصرية' ? <FaUserTie /> : <FaSpinner className="fa-spin" />} {t.status}
                                    </span>
                                    <span className="text-muted fw-bold fs-6">{t.time}</span>
                                </div>
                                <h4 className="fw-bold mb-3" style={{ color: '#1b2a47', fontSize: '26px' }}>{t.title}</h4>

                                <div className="d-flex flex-wrap gap-4 text-muted fw-bold fs-5 mb-3">
                                    <span className="d-flex align-items-center gap-2"><FaMapMarkerAlt style={{ color: t.color }} /> {t.location}</span>
                                    <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color: t.color }} /> مساحة: {t.area} م²</span>
                                    <span className="d-flex align-items-center gap-2"><FaCalendarAlt style={{ color: t.color }} /> {t.deadline}</span>
                                    {t.client && <span className="d-flex align-items-center gap-2"><FaUserTie style={{ color: t.color }} /> {t.client}</span>}
                                </div>
                            </div>

                            <div className="col-lg-4 text-lg-end text-center">
                                {/* نمرر الـ Object الخاص بالمناقصة بالكامل لفتحه في التفاصيل */}
                                <button onClick={() => setSelectedTenderId(t)}
                                    className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                    style={{ backgroundColor: t.color, fontSize: '18px' }}>
                                    تفاصيل وتقديم عرض <FaChevronLeft className="ms-2" />
                                </button>
                                {t.status === 'دعوة حصرية' && (
                                    <button 
                                        className="btn btn-outline-danger fw-bold py-2 rounded-pill w-100 mt-2" 
                                        style={{ fontSize: '16px' }}
                                        onClick={() => handleDecline(t.id)}
                                    >
                                        الاعتذار عن المشروع
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state py-5">
                        <FaBuilding size={60} className="text-muted opacity-25 mb-3" />
                        <h4 className="fw-bold text-muted">لا توجد مناقصات في هذا القسم حالياً</h4>
                        <p className="text-muted fw-semibold">ستظهر المناقصات الجديدة هنا</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TendersTab;