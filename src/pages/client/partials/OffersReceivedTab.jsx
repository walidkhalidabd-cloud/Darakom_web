import { useState } from 'react';
import { FaFileInvoiceDollar, FaUserTie, FaHardHat, FaMoneyBillWave, FaRegClock, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaGlobe, FaLock, FaStar, FaEye } from 'react-icons/fa';
import OfferDetails from './OfferDetails';

const OffersReceivedTab = () => {
    // التبديل بين العروض العامة والعروض الخاصة
    const [offerType, setOfferType] = useState('public'); // 'public' or 'private'
    // العرض المحدد لعرض التفاصيل
    const [selectedOffer, setSelectedOffer] = useState(null);

    // بيانات وهمية: العروض العامة (عروض مفتوحة من مزودي خدمة على مشاريع العميل)
    const publicOffers = [
        {
            id: 1,
            providerName: 'مؤسسة البناء الذهبي',
            providerType: 'مقاول بناء',
            rating: 4.8,
            projectTitle: 'بناء عظم - مساحة 400م',
            price: '145,000',
            duration: '6 أشهر',
            status: 'pending', // pending, accepted, rejected
            offerDate: '2026/06/01',
            details: 'نقدم لكم عرضنا لتنفيذ أعمال البناء العظمي حسب المخططات المرفقة، يشمل العرض توريد جميع المواد الأساسية (حديد سابك، اسمنت، طابوق) مع عمالة فنية مدربة.',
            startDate: '2026/07/01',
            stages: [
                { id: 1, name: 'أعمال الحفر والأساسات', duration: '30 يوم' },
                { id: 2, name: 'أعمال الهيكل الخرساني', duration: '45 يوم' },
                { id: 3, name: 'أعمال الطابوق واللياسة', duration: '30 يوم' },
                { id: 4, name: 'التشطيبات النهائية', duration: '60 يوم' }
            ],
            attachments: [
                { id: 1, type: 'image', title: 'صورة المخطط الهيكلي' },
                { id: 2, type: 'file', title: 'جدول المواصفات الفنية' },
                { id: 3, type: 'image', title: 'صورة الواجهة الأمامية' }
            ]
        },
        {
            id: 2,
            providerName: 'مكتب الإبداع الهندسي',
            providerType: 'مكتب هندسي',
            rating: 4.5,
            projectTitle: 'تصميم داخلي لفيلا مودرن',
            price: '42,000',
            duration: 'شهرين',
            status: 'pending',
            offerDate: '2026/06/05',
            details: 'تصميم داخلي كامل بمساحة 300م²، يشمل 3D للفراغات ومخططات تنفيذية للكهرباء والسباكة والأسقف المستعارة.',
            startDate: '2026/06/15',
            stages: [
                { id: 1, name: 'رفع المساحات والقياسات', duration: '7 يوم' },
                { id: 2, name: 'تصميم المخططات المبدئية', duration: '14 يوم' },
                { id: 3, name: 'التصاميم ثلاثية الأبعاد', duration: '21 يوم' },
                { id: 4, name: 'المخططات التنفيذية', duration: '14 يوم' }
            ],
            attachments: [
                { id: 1, type: 'image', title: 'معرض صور تصاميم سابقة' },
                { id: 2, type: 'file', title: 'محفظة الأعمال' }
            ]
        }
    ];

    // بيانات وهمية: العروض الخاصة (عروض مباشرة من مزودي خدمة)
    const privateOffers = [
        {
            id: 3,
            providerName: 'م. أحمد خالد',
            providerType: 'مهندس معماري',
            rating: 4.2,
            projectTitle: 'تأسيس شبكة كاميرات مراقبة',
            price: '7,500',
            duration: 'أسبوعين',
            status: 'accepted',
            offerDate: '2026/05/20',
            details: 'عرض خاص لتركيب نظام كاميرات مراقبة متكامل للمنزل، كاميرات HDCVI بدقة 5MP مع جهاز تسجيل 16 قناة.',
            startDate: '2026/06/01',
            stages: [
                { id: 1, name: 'تركيب الكاميرات الخارجية', duration: '5 أيام' },
                { id: 2, name: 'تركيب الكاميرات الداخلية', duration: '3 أيام' },
                { id: 3, name: 'برمجة النظام والتجربة', duration: '2 يوم' }
            ],
            attachments: [
                { id: 1, type: 'image', title: 'صورة نموذج الكاميرا' },
                { id: 2, type: 'file', title: 'كتالوج المواصفات' }
            ]
        },
        {
            id: 4,
            providerName: 'شركة أطياف للتشطيبات',
            providerType: 'تشطيب وديكور',
            rating: 4.0,
            projectTitle: 'تشطيب شقة 150م',
            price: '85,000',
            duration: '3 أشهر',
            status: 'rejected',
            offerDate: '2026/04/15',
            details: 'عرض تشطيب شامل للشقة بأعلى المواصفات، يشمل السيراميك والدهانات والسباكة والكهرباء والمطابخ.',
            startDate: '2026/05/01',
            stages: [
                { id: 1, name: 'أعمال السباكة والكهرباء', duration: '20 يوم' },
                { id: 2, name: 'أعمال السيراميك والبلاط', duration: '25 يوم' },
                { id: 3, name: 'أعمال الدهان والديكور', duration: '20 يوم' },
                { id: 4, name: 'تركيب المطابخ والنجارة', duration: '15 يوم' }
            ],
            attachments: [
                { id: 1, type: 'image', title: 'صورة تشطيب سابق' },
                { id: 2, type: 'file', title: 'قائمة المواد المستخدمة' },
                { id: 3, type: 'image', title: 'معرض صور الأعمال' }
            ]
        },
        {
            id: 5,
            providerName: 'مؤسسة البناء الذهبي',
            providerType: 'مقاول بناء',
            rating: 4.8,
            projectTitle: 'بناء ملحق خارجي 60م',
            price: '55,000',
            duration: 'شهرين',
            status: 'accepted',
            offerDate: '2026/06/10',
            details: 'عرض خاص لبناء ملحق خارجي بمساحة 60م يشمل غرفتين وصالة ومطبخ وحمام.',
            startDate: '2026/07/10',
            stages: [
                { id: 1, name: 'أعمال الأساسات', duration: '10 أيام' },
                { id: 2, name: 'بناء الجدران', duration: '15 يوم' },
                { id: 3, name: 'السقف والتشطيب', duration: '20 يوم' },
                { id: 4, name: 'التسليم النهائي', duration: '5 أيام' }
            ],
            attachments: [
                { id: 1, type: 'image', title: 'المخطط المعماري' }
            ]
        }
    ];

    // دالة لإرجاع شكل ولون حالة العرض
    const getStatusBadge = (status) => {
        switch(status) {
            case 'pending': 
                return <span className="badge bg-warning text-dark px-3 py-2 rounded-pill fs-6 shadow-sm"><FaHourglassHalf className="me-1"/> قيد الانتظار</span>;
            case 'accepted': 
                return <span className="badge bg-success px-3 py-2 rounded-pill fs-6 shadow-sm"><FaCheckCircle className="me-1"/> تم القبول</span>;
            case 'rejected': 
                return <span className="badge bg-danger px-3 py-2 rounded-pill fs-6 shadow-sm"><FaTimesCircle className="me-1"/> مرفوض</span>;
            default: 
                return null;
        }
    };

    // دالة لإرجاع لون الحدود للبطاقة حسب الحالة
    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'accepted': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    // دالة لإرجاع لون خلفية معلومات مزود الخدمة حسب نوع العرض
    const getInfoBgClass = (type) => {
        return type === 'public' ? 'bg-light' : 'bg-warning bg-opacity-10 border border-warning border-opacity-25';
    };

    // دالة لتنسيق تاريخ العرض
    const formatDate = (dateStr) => {
        return dateStr;
    };

    // دالة لعرض التقييم بالنجوم
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars.push(<FaStar key={i} className="text-warning" size={16} />);
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars.push(<FaStar key={i} className="text-warning" size={16} style={{ opacity: 0.5 }} />);
            } else {
                stars.push(<FaStar key={i} className="text-muted" size={16} style={{ opacity: 0.3 }} />);
            }
        }
        return stars;
    };

    // إذا تم تحديد عرض، اظهر صفحة التفاصيل
    if (selectedOffer) {
        return (
            <OfferDetails 
                offer={selectedOffer} 
                offerType={offerType}
                onBack={() => setSelectedOffer(null)} 
            />
        );
    }

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            
            {/* عنوان الصفحة */}
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">العروض <FaFileInvoiceDollar className="text-success ms-2" /></h3>
                    <p className="text-muted fw-semibold">استعرض العروض التي تلقيتها من مزودي الخدمة على مشاريعك.</p>
                </div>
            </div>

            {/* أزرار التبديل (Tabs) بين العروض العامة والخاصة */}
            <div className="d-flex justify-content-center gap-3 mb-5">
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerType === 'public' ? '#ff8a00' : '#e2e8f0', color: offerType === 'public' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setOfferType('public')}
                >
                    <FaGlobe /> العروض العامة
                </button>
                <button 
                    className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerType === 'private' ? '#ff8a00' : '#e2e8f0', color: offerType === 'private' ? 'white' : '#1b2a47', fontSize: '20px', minWidth: '250px', justifyContent: 'center' }}
                    onClick={() => setOfferType('private')}
                >
                    <FaLock /> العروض الخاصة
                </button>
            </div>

            {/* عرض بطاقات العروض */}
            <div className="d-flex flex-column gap-4">
                
                {/* 1. العروض العامة */}
                {offerType === 'public' && (
                    publicOffers.length > 0 ? publicOffers.map(offer => (
                        <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                            
                            {/* رأس البطاقة: رقم العرض والحالة */}
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <FaGlobe className="text-primary" size={20} />
                                    <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>عرض عام #{offer.id + 100}</h5>
                                </div>
                                {getStatusBadge(offer.status)}
                            </div>
                            
                            {/* معلومات مزود الخدمة مع التقييم والمشروع */}
                            <div className={`row mb-4 p-3 rounded-4 mx-0 ${getInfoBgClass('public')}`}>
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة</span>
                                        <span className="fw-bold text-dark fs-5">{offer.providerName}</span>
                                        <span className="d-block text-muted fw-semibold small">{offer.providerType}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{offer.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            {/* صف التقييم + السعر + المدة */}
                            <div className="row mb-4 g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaStar className="text-warning" size={18} />
                                            <span className="text-muted fw-bold small">تقييم مزود الخدمة</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold fs-4 text-dark">{offer.rating}</span>
                                            <span className="d-flex align-items-center gap-1">{renderStars(offer.rating)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-success" size={18} />
                                            <span className="text-muted fw-bold small">قيمة العرض</span>
                                        </div>
                                        <span className="fw-bold fs-4" style={{ color: '#ff8a00' }}>{offer.price} ر.س</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaRegClock className="text-info" size={18} />
                                            <span className="text-muted fw-bold small">مدة التنفيذ</span>
                                        </div>
                                        <span className="fw-bold fs-4 text-dark">{offer.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* وصف العرض */}
                            <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    {offer.details}
                                </p>
                            </div>

                            {/* تاريخ التقديم وأزرار الإجراءات */}
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <span className="text-muted small fw-bold">تاريخ العرض: {formatDate(offer.offerDate)}</span>
                                <div className="d-flex gap-2 flex-wrap">
                                    {/* زر عرض التفاصيل - يظهر دائماً */}
                                    <button 
                                        className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                        onClick={() => setSelectedOffer(offer)}
                                    >
                                        <FaEye /> عرض التفاصيل
                                    </button>
                                    {offer.status === 'pending' && (
                                        <>
                                            <button className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ fontSize: '16px' }}>
                                                <FaCheckCircle className="me-1" /> قبول العرض
                                            </button>
                                            <button className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill" style={{ fontSize: '16px' }}>
                                                <FaTimesCircle className="me-1" /> رفض
                                            </button>
                                        </>
                                    )}
                                    {offer.status === 'accepted' && (
                                        <span className="text-success fw-bold fs-6"><FaCheckCircle className="me-1" /> تم قبول هذا العرض</span>
                                    )}
                                    {offer.status === 'rejected' && (
                                        <span className="text-danger fw-bold fs-6"><FaTimesCircle className="me-1" /> تم رفض هذا العرض</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaGlobe className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لا توجد عروض عامة حتى الآن.</h4>
                            <p className="text-muted fw-semibold">عندما يقوم مزودو الخدمة بتقديم عروض على مشاريعك، ستظهر هنا.</p>
                        </div>
                    )
                )}

                {/* 2. العروض الخاصة */}
                {offerType === 'private' && (
                    privateOffers.length > 0 ? privateOffers.map(offer => (
                        <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                            
                            {/* رأس البطاقة: رقم العرض والحالة */}
                            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                <div className="d-flex align-items-center gap-2">
                                    <FaLock className="text-warning" size={20} />
                                    <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>عرض خاص #{offer.id + 200}</h5>
                                </div>
                                {getStatusBadge(offer.status)}
                            </div>
                            
                            {/* معلومات مزود الخدمة مع التقييم والمشروع */}
                            <div className={`row mb-4 p-3 rounded-4 mx-0 ${getInfoBgClass('private')}`}>
                                <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaUserTie size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">مزود الخدمة</span>
                                        <span className="fw-bold text-dark fs-5">{offer.providerName}</span>
                                        <span className="d-block text-muted fw-semibold small">{offer.providerType}</span>
                                    </div>
                                </div>
                                <div className="col-md-6 d-flex align-items-center gap-3 border-start border-warning border-opacity-50 ps-md-4">
                                    <div className="bg-white p-2 rounded-circle shadow-sm text-warning"><FaHardHat size={20} /></div>
                                    <div>
                                        <span className="text-muted small fw-bold d-block">المشروع</span>
                                        <span className="fw-bold text-dark fs-5">{offer.projectTitle}</span>
                                    </div>
                                </div>
                            </div>

                            {/* صف التقييم + السعر + المدة */}
                            <div className="row mb-4 g-3">
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaStar className="text-warning" size={18} />
                                            <span className="text-muted fw-bold small">تقييم مزود الخدمة</span>
                                        </div>
                                        <div className="d-flex align-items-center gap-2">
                                            <span className="fw-bold fs-4 text-dark">{offer.rating}</span>
                                            <span className="d-flex align-items-center gap-1">{renderStars(offer.rating)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaMoneyBillWave className="text-success" size={18} />
                                            <span className="text-muted fw-bold small">قيمة العرض</span>
                                        </div>
                                        <span className="fw-bold fs-4" style={{ color: '#ff8a00' }}>{offer.price} ر.س</span>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                        <div className="d-flex align-items-center gap-2 mb-1">
                                            <FaRegClock className="text-info" size={18} />
                                            <span className="text-muted fw-bold small">مدة التنفيذ</span>
                                        </div>
                                        <span className="fw-bold fs-4 text-dark">{offer.duration}</span>
                                    </div>
                                </div>
                            </div>

                            {/* وصف العرض */}
                            <div className="position-relative p-4 rounded-4 bg-white border shadow-sm">
                                <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                    {offer.details}
                                </p>
                            </div>

                            {/* تاريخ التقديم وأزرار الإجراءات */}
                            <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                <span className="text-muted small fw-bold">تاريخ العرض: {formatDate(offer.offerDate)}</span>
                                <div className="d-flex gap-2 flex-wrap">
                                    {/* زر عرض التفاصيل - يظهر دائماً */}
                                    <button 
                                        className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                        onClick={() => setSelectedOffer(offer)}
                                    >
                                        <FaEye /> عرض التفاصيل
                                    </button>
                                    {offer.status === 'pending' && (
                                        <>
                                            <button className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm" style={{ fontSize: '16px' }}>
                                                <FaCheckCircle className="me-1" /> قبول العرض
                                            </button>
                                            <button className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill" style={{ fontSize: '16px' }}>
                                                <FaTimesCircle className="me-1" /> رفض
                                            </button>
                                        </>
                                    )}
                                    {offer.status === 'accepted' && (
                                        <span className="text-success fw-bold fs-6"><FaCheckCircle className="me-1" /> تم قبول هذا العرض</span>
                                    )}
                                    {offer.status === 'rejected' && (
                                        <span className="text-danger fw-bold fs-6"><FaTimesCircle className="me-1" /> تم رفض هذا العرض</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="text-center py-5">
                            <FaLock className="text-muted mb-3 opacity-25" size={50} />
                            <h4 className="text-muted fw-bold">لا توجد عروض خاصة حتى الآن.</h4>
                            <p className="text-muted fw-semibold">العروض المباشرة التي يرسلها لك مزودو الخدمة ستظهر هنا.</p>
                        </div>
                    )
                )}

            </div>
        </div>
    );
};

export default OffersReceivedTab;

