import { useState } from 'react';
import { FaGlobe, FaLock, FaMapMarkerAlt, FaCalendarAlt, FaBuilding, FaChevronLeft, FaUserTie, FaSpinner } from 'react-icons/fa';
import TenderDetails from './TenderDetails';
import SubmitOffer from './SubmitOffer';
import './provider-tabs.css';

const TendersTab = () => {
    const [activeSection, setActiveSection] = useState('general');
    const [selectedTender, setSelectedTender] = useState(null);
    const [showSubmitOffer, setShowSubmitOffer] = useState(false);

    if (showSubmitOffer && selectedTender) {
        return <SubmitOffer tender={selectedTender} onBack={() => setShowSubmitOffer(false)} />;
    }

    if (selectedTender) {
        return <TenderDetails tender={selectedTender} onBack={() => setSelectedTender(null)} onStartOffer={() => setShowSubmitOffer(true)} />;
    }

    const tenderData = {
        general: [
            { id: 1, status: 'متاح للتقديم', time: 'نُشر منذ ساعتين', title: 'تنفيذ أعمال السباكة والكهرباء لفيلا سكنية', location: 'دمشق، المزة', area: '450م', deadline: 'بعد 3 أيام', color: '#1b2a47',
              details: { description: 'نبحث عن مقاول متخصص...', requirements: ['الالتزام بالمخططات.', 'توفير ضمان لا يقل عن 10 سنوات.'], attachments: [{ id: 1, type: 'image', name: 'مخطط_الدور_الارضي.jpg' }] }},
            { id: 2, status: 'متاح للتقديم', time: 'نُشر بالأمس', title: 'بناء مسبح خارجي مع تنسيق الحدائق', location: 'اللاذقية، الشاطئ الأزرق', area: '200م', deadline: 'بعد 5 أيام', color: '#1b2a47',
              details: { description: 'مطلوب شركة أو مقاول...', requirements: ['تقديم تصميم ثلاثي الأبعاد.', 'تنفيذ العزل المائي.'], attachments: [{ id: 1, type: 'pdf', name: 'كروكي_الموقع.pdf' }] }},
            { id: 3, status: 'متاح للتقديم', time: 'منذ 5 أيام', title: 'أعمال دهان وتشطيب داخلي', location: 'حلب، حي الجميلية', area: '550م', deadline: 'بعد 7 أيام', color: '#1b2a47',
              details: { description: 'مطلوب مقاول دهانات...', requirements: ['خبرة لا تقل عن 5 سنوات.', 'توفير عمالة مدربة.'], attachments: [] }},
        ],
        private: [
            { id: 4, status: 'دعوة حصرية', time: 'وصلتك منذ 5 ساعات', title: 'تصميم داخلي وتشطيب شقة فاخرة', client: 'شركة الأفق العقارية', location: 'طرطوس، مشروع دمر', deadline: 'يرجى الرد خلال: 48 ساعة', color: '#ff8a00',
              details: { description: 'دعوة خاصة من شركة الأفق العقارية...', requirements: ['تقديم جدول زمني.', 'استخدام مواد عالية الجودة.'], attachments: [{ id: 1, type: 'pdf', name: 'مخطط_الشقة.pdf' }] }},
            { id: 5, status: 'دعوة حصرية', time: 'منذ يوم', title: 'توريد وتركيب سيراميك ورخام', client: 'أ. خالد عبدالله', location: 'حمص، حي المحطة', deadline: 'يرجى الرد خلال: 24 ساعة', color: '#ff8a00',
              details: { description: 'دعوة خاصة...', requirements: ['معاينة الموقع قبل التوريد.', 'توريد مواد من الدرجة الأولى.'], attachments: [] }},
        ]
    };

    const currentData = activeSection === 'general' ? tenderData.general : tenderData.private;

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

            {/* Alert */}
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
                                    <span className="d-flex align-items-center gap-2"><FaBuilding style={{ color: t.color }} /> مساحة: {t.area}</span>
                                    <span className="d-flex align-items-center gap-2"><FaCalendarAlt style={{ color: t.color }} /> {t.deadline}</span>
                                    {t.client && <span className="d-flex align-items-center gap-2"><FaUserTie style={{ color: t.color }} /> {t.client}</span>}
                                </div>
                            </div>

                            <div className="col-lg-4 text-lg-end text-center">
                                <button onClick={() => setSelectedTender({ title: t.title, ...t.details, location: t.location, deadline: t.deadline, status: t.status })}
                                    className="btn-provider-primary w-100 d-flex align-items-center justify-content-center gap-2 py-3"
                                    style={{ backgroundColor: t.color, fontSize: '18px' }}>
                                    تفاصيل وتقديم عرض <FaChevronLeft className="ms-2" />
                                </button>
                                {t.status === 'دعوة حصرية' && (
                                    <button className="btn btn-outline-danger fw-bold py-2 rounded-pill w-100 mt-2" style={{ fontSize: '16px' }}>
                                        الاعتذار عن المشروع
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="empty-state">
                        <FaBuilding size={60} />
                        <h4>لا توجد مناقصات في هذا القسم حالياً</h4>
                        <p>ستظهر المناقصات الجديدة هنا</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TendersTab;

