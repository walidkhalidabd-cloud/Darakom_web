import { useState } from 'react';
import { FaMoneyBillWave, FaUserTie, FaRegClock, FaFileContract, FaCheckCircle, FaSpinner, FaTruck, FaStar, FaArrowRight, FaPlus, FaExclamationTriangle, FaCheck, FaHourglassHalf, FaEdit, FaTrash, FaSave, FaTimes, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaEye, FaTimesCircle, FaHardHat, FaPaperPlane } from 'react-icons/fa';
import OfferDetails from './OfferDetails';
import ProjectRatingForm from '../../../components/ProjectRatingForm';
import ImageUploader from '../../../components/ImageUploader';

const OffersTab = () => {
    const [offerStatus, setOfferStatus] = useState('pending');
    // tracking: 'list' | 'details' | 'complaint' | 'edit' | 'view-offers' | 'offer-detail' | 'rate'
    const [trackingView, setTrackingView] = useState('list');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [complaintImages, setComplaintImages] = useState([]);
    const [editForm, setEditForm] = useState({
        title: '', description: '', governorate: '', area: '', providerType: '', tenderDays: ''
    });
    const [editDocs, setEditDocs] = useState([]);
    const [projectOffers, setProjectOffers] = useState([]);

    // بيانات وهمية: العروض المستلمة لكل مشروع قيد الانتظار
    const receivedOffersData = {
        5: [
            {
                id: 101,
                providerName: 'مؤسسة التشطيب الذهبي',
                providerType: 'مقاول تشطيبات',
                rating: 4.7,
                price: '25,000',
                duration: '25 يوم',
                offerDate: '2026/04/16',
                details: 'نقدم لكم عرضنا لتشطيب الشقة كاملة بأعلى المواصفات، يشمل السيراميك والدهانات والسباكة والكهرباء. لدينا فريق عمل متكامل وخبرة تتجاوز 15 عاماً.',
                status: 'pending',
                startDate: '2026/05/01',
                stages: [
                    { name: 'أعمال السباكة والكهرباء', duration: '7 أيام' },
                    { name: 'أعمال السيراميك والبلاط', duration: '10 أيام' },
                    { name: 'أعمال الدهان والديكور', duration: '8 أيام' }
                ]
            },
            {
                id: 102,
                providerName: 'م. سامر الحسن',
                providerType: 'مهندس ديكور',
                rating: 4.5,
                price: '22,000',
                duration: '20 يوم',
                offerDate: '2026/04/17',
                details: 'عرض تشطيب شامل مع لمسات ديكور عصرية. نستخدم مواد عالية الجودة ونوفر ضمان لمدة عام على جميع الأعمال.',
                status: 'pending',
                startDate: '2026/05/05',
                stages: [
                    { name: 'التجهيزات الأولية', duration: '5 أيام' },
                    { name: 'أعمال التشطيب الرئيسية', duration: '10 أيام' },
                    { name: 'اللمسات النهائية والتسليم', duration: '5 أيام' }
                ]
            },
            {
                id: 103,
                providerName: 'شركة البيان للتشطيبات',
                providerType: 'شركة مقاولات',
                rating: 4.9,
                price: '30,000',
                duration: '30 يوم',
                offerDate: '2026/04/18',
                details: 'عرض متكامل يشمل تشطيب الشقة بأفضل المواد المستوردة مع الإشراف الهندسي الكامل. نوفر كفالة لمدة 5 سنوات على جميع الأعمال.',
                status: 'pending',
                startDate: '2026/05/10',
                stages: [
                    { name: 'أعمال التكسير والتمديدات', duration: '7 أيام' },
                    { name: 'أعمال البناء واللياسة', duration: '8 أيام' },
                    { name: 'أعمال التشطيب النهائي', duration: '15 يوم' }
                ]
            }
        ],
        6: [
            {
                id: 201,
                providerName: 'مكتب الإبداع الهندسي',
                providerType: 'مكتب هندسي',
                rating: 4.6,
                price: '12,000',
                duration: '15 يوم',
                offerDate: '2026/04/19',
                details: 'تصميم داخلي متكامل للمكتب يشمل التخطيط المكاني وتصميم الأثاث والإضاءة. نقدم 3 مقترحات تصميمية مختلفة مع إمكانية التعديل.',
                status: 'pending',
                startDate: '2026/05/01',
                stages: [
                    { name: 'رفع القياسات والمساحات', duration: '3 أيام' },
                    { name: 'التصاميم الأولية', duration: '5 أيام' },
                    { name: 'التصاميم النهائية والتسليم', duration: '7 أيام' }
                ]
            }
        ]
    };

    const pendingOffers = [
        {
            id: 5,
            projectTitle: 'تشطيب شقة سكنية 120م',
            providerType: 'فني بلاط',
            price: '0 - بانتظار العروض',
            duration: '7 أيام',
            datePosted: '2026/04/15',
            details: 'تشطيب كامل لشقة سكنية مساحة 120م تشمل بلاط وسيراميك ودهان وكهرباء وسباكة.',
            status: 'بانتظار العروض',
            progress: 0,
            offersCount: 3,
            daysRemaining: 5,
            governorate: 'دمشق',
            area: '120',
            providerTypeNeeded: 'فني بلاط',
            tenderDays: 7,
            description: 'تشطيب كامل لشقة سكنية مساحة 120م تشمل بلاط وسيراميك ودهان وكهرباء وسباكة.'
        },
        {
            id: 6,
            projectTitle: 'تصميم داخلي لمكتب',
            providerType: 'مهندس معماري',
            price: '0 - بانتظار العروض',
            duration: '10 أيام',
            datePosted: '2026/04/18',
            details: 'تصميم داخلي لمكتب مساحة 80م يشمل المخططات والتصور ثلاثي الأبعاد.',
            status: 'بانتظار العروض',
            progress: 0,
            offersCount: 0,
            daysRemaining: 8,
            governorate: 'حلب',
            area: '80',
            providerTypeNeeded: 'مهندس معماري',
            tenderDays: 10,
            description: 'تصميم داخلي لمكتب مساحة 80م يشمل المخططات والتصور ثلاثي الأبعاد.'
        }
    ];

    const ongoingOffers = [
        {
            id: 1,
            projectTitle: 'بناء عظم - مساحة 400م',
            providerName: 'مؤسسة البناء الذهبي',
            providerType: 'مقاول معتمد',
            price: '150,000',
            duration: '6 أشهر',
            dateAccepted: '2026/05/01',
            details: 'يشمل السعر توريد جميع المواد الأساسية (حديد، اسمنت، طابوق) حسب المخططات الهندسية المرفقة، مع الالتزام بالجدول الزمني.',
            progress: 65,
            status: 'قيد التنفيذ',
            milestones: [
                { name: 'المرحلة الأولى: الأساسات', completed: true },
                { name: 'المرحلة الثانية: الهيكل الخرساني', completed: true },
                { name: 'المرحلة الثالثة: أعمال الطابوق واللياسة', completed: false },
                { name: 'المرحلة الرابعة: التشطيبات النهائية', completed: false }
            ]
        },
        {
            id: 4,
            projectTitle: 'بناء عظم - مساحة 400م',
            providerName: 'مؤسسة البناء الذهبي',
            providerType: 'مقاول معتمد',
            price: '150,000',
            duration: '6 أشهر',
            dateAccepted: '2026/05/01',
            details: 'يشمل السعر توريد جميع المواد الأساسية (حديد، اسمنت، طابوق) حسب المخططات الهندسية المرفقة.',
            progress: 30,
            status: 'قيد التنفيذ',
            milestones: [
                { name: 'المرحلة الأولى: الأساسات', completed: true },
                { name: 'المرحلة الثانية: الهيكل الخرساني', completed: false },
                { name: 'المرحلة الثالثة: أعمال الطابوق واللياسة', completed: false }
            ]
        }
    ];

    const completedOffers = [
        {
            id: 2,
            projectTitle: 'تصميم داخلي لفيلا مودرن',
            providerName: 'مكتب الإبداع الهندسي',
            providerType: 'مكتب هندسي',
            price: '45,000',
            duration: 'شهرين',
            dateCompleted: '2026/02/15',
            details: 'تصميم 3D لجميع الفراغات الداخلية مع المخططات التنفيذية للكهرباء والسباكة والأسقف المستعارة.',
            progress: 100,
            status: 'مكتمل',
            milestones: [
                { name: 'المرحلة الأولى: التصاميم الأولية', completed: true },
                { name: 'المرحلة الثانية: التصاميم التنفيذية', completed: true },
                { name: 'المرحلة الثالثة: الإشراف على التنفيذ', completed: true }
            ]
        },
        {
            id: 3,
            projectTitle: 'تأسيس شبكة كاميرات مراقبة',
            providerName: 'م. أحمد خالد',
            providerType: 'مهندس اتصالات',
            price: '8,500',
            duration: 'أسبوعين',
            dateCompleted: '2025/11/20',
            details: 'توريد وتركيب 16 كاميرا خارجية وداخلية بدقة 4K مع جهاز التسجيل والربط على الجوال.',
            progress: 100,
            status: 'مكتمل',
            milestones: [
                { name: 'المرحلة الأولى: التوصيلات والتمديدات', completed: true },
                { name: 'المرحلة الثانية: التركيب والتشغيل', completed: true }
            ]
        }
    ];

    const projects = offerStatus === 'pending' ? pendingOffers 
        : offerStatus === 'ongoing' ? ongoingOffers 
        : completedOffers;

const startEdit = (project) => {
        setEditForm({
            title: project.projectTitle,
            description: project.description || project.details,
            governorate: project.governorate || '',
            area: project.area || '',
            providerType: project.providerTypeNeeded || '',
            tenderDays: project.tenderDays || ''
        });
        setEditDocs([]);
        setSelectedProject(project);
        setTrackingView('edit');
    };

    const cancelEdit = () => {
        setTrackingView('list');
        setSelectedProject(null);
        setEditDocs([]);
    };

    const saveEdit = (e) => {
        e.preventDefault();
        alert(`تم تعديل المشروع "${editForm.title}" وإعادة طرحه بنجاح!`);
        setTrackingView('list');
        setSelectedProject(null);
        setEditDocs([]);
    };

    const handleDelete = (projectId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            alert(`تم حذف المشروع رقم ${projectId}`);
        }
    };

    const addEditDocRow = () => setEditDocs([...editDocs, { id: Date.now(), type: '', title: '', file: null }]);
    const handleEditDocChange = (id, field, value) => setEditDocs(editDocs.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    const removeEditDocRow = (id) => setEditDocs(editDocs.filter(doc => doc.id !== id));

    const viewProjectOffers = (project) => {
        setProjectOffers(receivedOffersData[project.id] || []);
        setSelectedProject(project);
        setTrackingView('view-offers');
    };

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

    // دالة لإرجاع لون الحدود للبطاقة حسب الحالة (مثل OffersReceivedTab)
    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'accepted': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    // عرض تفاصيل العرض (OfferDetails)
    if (trackingView === 'offer-detail' && selectedOffer) {
        return (
            <OfferDetails 
                offer={selectedOffer} 
                offerType="public" 
                onBack={() => { setTrackingView('view-offers'); setSelectedOffer(null); }} 
            />
        );
    }

    // واجهة عرض العروض المستلمة للمشروع قيد الانتظار (بنفس تصميم OffersReceivedTab)
    if (trackingView === 'view-offers' && selectedProject) {
        return (
            <div className="mx-auto" style={{ maxWidth: '100%' }}>
                <button 
                    className="btn btn-light fw-bold mb-4 d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
                    onClick={() => { setTrackingView('list'); setSelectedProject(null); setProjectOffers([]); }}
                >
                    <FaArrowRight /> العودة لمشاريعي
                </button>

                <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                    <div>
                        <h3 className="fw-bold text-dark mb-1">العروض المستلمة <FaEye className="text-primary ms-2" /></h3>
                        <p className="text-muted fw-semibold">المشروع: {selectedProject.projectTitle}</p>
                    </div>
                </div>

                {projectOffers.length > 0 ? (
                    <div className="d-flex flex-column gap-4">
                        {projectOffers.map(offer => (
                            <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                                
                                {/* رأس البطاقة: رقم العرض والحالة */}
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaHardHat className="text-primary" size={20} />
                                        <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>عرض من {offer.providerName}</h5>
                                    </div>
                                    {getStatusBadge(offer.status)}
                                </div>

                                {/* معلومات مزود الخدمة مع التقييم والمشروع */}
                                <div className="row mb-4 p-3 rounded-4 mx-0 bg-light">
                                    <div className="col-md-6 mb-3 mb-md-0 d-flex align-items-center gap-3">
                                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaUserTie size={20} /></div>
                                        <div>
                                            <span className="text-muted small fw-bold d-block">مزود الخدمة</span>
                                            <span className="fw-bold text-dark fs-5">{offer.providerName}</span>
                                            <span className="d-block text-muted fw-semibold small">{offer.providerType}</span>
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex align-items-center gap-3 border-start ps-md-4">
                                        <div className="bg-white p-2 rounded-circle shadow-sm text-primary"><FaStar size={20} className="text-warning" /></div>
                                        <div>
                                            <span className="text-muted small fw-bold d-block">التقييم</span>
                                            <div className="d-flex align-items-center gap-2">
                                                <span className="fw-bold fs-5 text-dark">{offer.rating}</span>
                                                <span className="d-flex align-items-center gap-1">{renderStars(offer.rating)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* صف التقييم + السعر + المدة */}
                                <div className="row mb-4 g-3">
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
                                    <div className="col-md-4">
                                        <div className="p-3 rounded-3 bg-white border shadow-sm h-100">
                                            <div className="d-flex align-items-center gap-2 mb-1">
                                                <FaCalendarAlt className="text-primary" size={18} />
                                                <span className="text-muted fw-bold small">تاريخ البدء</span>
                                            </div>
                                            <span className="fw-bold fs-4 text-dark">{offer.startDate}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* وصف العرض */}
                                <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                        {offer.details}
                                    </p>
                                </div>

                                {/* المراحل الزمنية */}
                                {offer.stages && (
                                    <div className="mt-4">
                                        <h6 className="fw-bold mb-3 text-muted">المراحل الزمنية:</h6>
                                        <div className="d-flex flex-wrap gap-2">
                                            {offer.stages.map((stage, idx) => (
                                                <span key={idx} className="badge bg-light text-dark px-3 py-2 rounded-pill fw-bold border">
                                                    {stage.name} ({stage.duration})
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* تاريخ التقديم وأزرار الإجراءات */}
                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <span className="text-muted small fw-bold">تاريخ العرض: {offer.offerDate}</span>
                                    <div className="d-flex gap-2 flex-wrap">
                                        {/* زر عرض التفاصيل - يظهر دائماً */}
                                        <button 
                                            className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                            style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                            onClick={() => { setSelectedOffer(offer); setTrackingView('offer-detail'); }}
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-5">
                        <FaEye className="text-muted mb-3 opacity-25" size={50} />
                        <h4 className="text-muted fw-bold">لا توجد عروض مستلمة بعد.</h4>
                        <p className="text-muted fw-semibold">عندما يقوم مزودو الخدمة بتقديم عروض على هذا المشروع، ستظهر هنا.</p>
                    </div>
                )}
            </div>
        );
    }

    // عرض تفاصيل المشروع (Tracking Details)
    if (trackingView === 'details' && selectedProject) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white">
                <button 
                    className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2" 
                    onClick={() => { setTrackingView('list'); setSelectedProject(null); }}
                >
                    <FaArrowRight /> العودة للقائمة
                </button>
                <h2 className="fw-bold text-center mb-5" style={{ color: '#1b2a47' }}>{selectedProject.projectTitle}</h2>
                <div className="row g-4 mb-5">
                    <div className="col-md-6">
                        <div className="bg-light p-4 rounded-4">
                            <h5 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>معلومات المشروع</h5>
                            {selectedProject.providerName && (
                                <p className="mb-2"><span className="text-muted fw-bold">مقدم الخدمة:</span> <span className="fw-bold">{selectedProject.providerName}</span></p>
                            )}
                            <p className="mb-2"><span className="text-muted fw-bold">النوع:</span> <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-1 rounded-pill fw-bold border">{selectedProject.providerType}</span></p>
                            <p className="mb-2"><span className="text-muted fw-bold">القيمة:</span> <span className="fw-bold" style={{ color: '#ff8a00' }}>{selectedProject.price} ر.س</span></p>
                            <p className="mb-0"><span className="text-muted fw-bold">المدة:</span> <span className="fw-bold">{selectedProject.duration}</span></p>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="bg-light p-4 rounded-4">
                            <h5 className="fw-bold mb-3" style={{ color: '#1b2a47' }}>نسبة الإنجاز</h5>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="text-muted fw-semibold">إجمالي الإنجاز</span>
                                <span className="fw-bold fs-4" style={{ color: selectedProject.progress === 100 ? '#10b981' : selectedProject.progress === 0 ? '#3b82f6' : '#ff8a00' }}>{selectedProject.progress}%</span>
                            </div>
                            <div className="progress mb-3" style={{ height: '16px', borderRadius: '10px' }}>
                                <div 
                                    className={`progress-bar ${selectedProject.progress === 100 ? 'bg-success' : selectedProject.progress === 0 ? 'bg-primary' : 'bg-warning progress-bar-striped progress-bar-animated'}`} 
                                    style={{ width: `${selectedProject.progress}%` }}
                                ></div>
                            </div>
                            <span className={`badge ${selectedProject.progress === 100 ? 'bg-success' : selectedProject.progress === 0 ? 'bg-primary' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold fs-6`}>
                                {selectedProject.status}
                            </span>
                        </div>
                    </div>
                </div>
                {selectedProject.milestones && (
                    <>
                        <h4 className="fw-bold mb-4 border-bottom pb-3" style={{ color: '#1b2a47' }}>الجدول الزمني وتقارير الإنجاز</h4>
                        <div className="position-relative me-3 border-start border-2 border-warning pb-4 pe-4" style={{ borderColor: selectedProject.progress === 100 ? '#10b981' : '#ff8a00' }}>
                            {selectedProject.milestones?.map((milestone, index) => (
                                <div key={index} className="mb-5 position-relative px-4">
                                    <div 
                                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                                        style={{ 
                                            width: '40px', height: '40px', 
                                            right: '-21px', top: '0',
                                            backgroundColor: milestone.completed ? '#10b981' : '#cbd5e1'
                                        }}
                                    >
                                        {milestone.completed ? <FaCheck /> : index + 1}
                                    </div>
                                    <h5 className={`fw-bold mb-2 ${milestone.completed ? 'text-success' : 'text-muted'}`}>
                                        {milestone.name}
                                        {milestone.completed && <FaCheckCircle className="me-2 text-success" />}
                                    </h5>
                                    {!milestone.completed && (
                                        <div className="progress" style={{ height: '6px', borderRadius: '10px' }}>
                                            <div className="progress-bar bg-secondary" style={{ width: '0%' }}></div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
                <div className="d-flex justify-content-center gap-3 mt-5 pt-4 border-top flex-wrap">
{selectedProject.progress === 100 && (
                        <button 
                            className="btn fw-bold px-5 py-3 rounded-pill text-white d-flex align-items-center gap-2" 
                            style={{ backgroundColor: '#ff8a00', fontSize: '20px' }}
                            onClick={() => setTrackingView('rate')}
                        >
                            <FaStar /> تقييم المشروع
                        </button>
                    )}
                    {selectedProject.progress > 0 && selectedProject.progress < 100 && (
                        <button 
                            className="btn fw-bold px-5 py-3 rounded-pill btn-danger d-flex align-items-center gap-2" 
                            style={{ fontSize: '20px' }} 
                            onClick={() => setTrackingView('complaint')}
                        >
                            <FaExclamationTriangle /> تقديم شكوى
                        </button>
                    )}
                </div>
            </div>
        );
    }

// واجهة تقييم المشروع (نجوم + تعليق لمزود الخدمة)
    if (trackingView === 'rate' && selectedProject) {
        return (
            <ProjectRatingForm
                project={selectedProject}
                onBack={() => setTrackingView('details')}
            />
        );
    }

// نموذج تقديم شكوى
    if (trackingView === 'complaint' && selectedProject) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
                <button 
                    className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2" 
                    onClick={() => setTrackingView('details')}
                >
                    <FaArrowRight /> العودة
                </button>
                <div className="text-center mb-5">
                    <FaExclamationTriangle className="text-danger mb-3" size={50} />
                    <h3 className="fw-bold" style={{ color: '#1b2a47' }}>نموذج تقديم شكوى</h3>
                    <p className="text-muted fw-semibold">{selectedProject.projectTitle} - {selectedProject.providerName}</p>
                </div>
<form onSubmit={(e) => { e.preventDefault(); alert('تم إرسال الشكوى!'); setTrackingView('list'); setComplaintImages([]); setSelectedProject(null); }}>
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="fw-bold mb-2 text-muted">اسم مزود الخدمة</label>
                            <input type="text" className="form-control p-3 bg-light" placeholder="أدخل اسم مزود الخدمة" defaultValue={selectedProject.providerName || ''} />
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-2 text-muted">المشروع المرتبط</label>
                            <input type="text" className="form-control p-3 bg-light" placeholder="أدخل اسم المشروع" defaultValue={selectedProject.projectTitle || ''} />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="fw-bold mb-2 text-muted">وصف المشكلة</label>
                        <textarea className="form-control p-4 bg-light" rows="5" placeholder="اكتب وصفاً تفصيلياً للمشكلة..." required></textarea>
                    </div>
                    <div className="mb-4">
                        <ImageUploader 
                            images={complaintImages} 
                            onChange={setComplaintImages} 
                            label="صور المشكلة"
                        />
                    </div>
                    <button type="submit" className="btn w-100 fw-bold py-3 btn-danger fs-4 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2">
                        <FaPaperPlane /> إرسال الشكوى
                    </button>
                </form>
            </div>
        );
    }

    // نموذج تعديل المشروع
    if (trackingView === 'edit' && selectedProject) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '100%' }}>
                <button className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2" onClick={cancelEdit}><FaArrowRight /> العودة للقائمة</button>
                <div className="text-center mb-5">
                    <FaEdit className="text-warning mb-3" size={50} />
                    <h3 className="fw-bold" style={{ color: '#1b2a47' }}>تعديل المشروع وإعادة طرحه</h3>
                    <p className="text-muted fw-semibold">قم بتعديل بيانات المشروع ثم أعد طرحه لاستقبال عروض جديدة</p>
                </div>
                <form onSubmit={saveEdit}>
                    <div className="row g-5">
                        <div className="col-12">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>اسم المشروع</label>
                            <input type="text" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} placeholder="أدخل اسم المشروع" required value={editForm.title} onChange={(e) => setEditForm({...editForm, title: e.target.value})} />
                        </div>
                        <div className="col-12">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>وصف المشروع بدقة</label>
                            <textarea className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} rows="5" required value={editForm.description} onChange={(e) => setEditForm({...editForm, description: e.target.value})}></textarea>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المحافظة</label>
                            <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={editForm.governorate} onChange={(e) => setEditForm({...editForm, governorate: e.target.value})}>
                                <option value="">اختر المحافظة...</option>
                                <option value="دمشق">دمشق</option>
                                <option value="ريف دمشق">ريف دمشق</option>
                                <option value="حلب">حلب</option>
                                <option value="حمص">حمص</option>
                                <option value="حماة">حماة</option>
                                <option value="اللاذقية">اللاذقية</option>
                                <option value="طرطوس">طرطوس</option>
                                <option value="إدلب">إدلب</option>
                                <option value="الرقة">الرقة</option>
                                <option value="دير الزور">دير الزور</option>
                                <option value="الحسكة">الحسكة</option>
                                <option value="درعا">درعا</option>
                                <option value="السويداء">السويداء</option>
                                <option value="القنيطرة">القنيطرة</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>المساحة</label>
                            <div className="input-group">
                                <input type="number" className="form-control p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px 0 0 12px' }} required value={editForm.area} onChange={(e) => setEditForm({...editForm, area: e.target.value})} />
                                <span className="input-group-text p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '0 12px 12px 0', fontWeight: 'bold', color: '#1b2a47' }}>م²</span>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مزود الخدمة المطلوبة</label>
                            <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={editForm.providerType} onChange={(e) => setEditForm({...editForm, providerType: e.target.value})}>
                                <option value="">اختر...</option>
                                <option value="مكاتب هندسية وشركات">مكاتب هندسية وشركات</option>
                                <option value="مهندس مدني">مهندس مدني</option>
                                <option value="مهندس معماري">مهندس معماري</option>
                                <option value="مهندس استشاري">مهندس استشاري</option>
                                <option value="مقاول">مقاول</option>
                                <option value="فني كهرباء">فني كهرباء</option>
                                <option value="فني سباكة">فني سباكة</option>
                                <option value="فني دهان">فني دهان</option>
                                <option value="فني بلاط">فني بلاط</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label fw-bold mb-3" style={{ fontSize: '22px', color: '#1b2a47' }}>مدة المناقصة (بالأيام)</label>
                            <select className="form-select p-4 bg-light border" style={{ borderColor: '#e2e8f0', fontSize: '20px', borderRadius: '12px' }} required value={editForm.tenderDays} onChange={(e) => setEditForm({...editForm, tenderDays: e.target.value})}>
                                <option value="">اختر...</option>
                                {Array.from({ length: 30 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={num}>{num} يوم</option>
                                ))}
                            </select>
                        </div>
                        <div className="col-12 mt-5">
                            <div className="d-flex align-items-center justify-content-between p-4 rounded-4 bg-light border">
                                <span className="fw-bold" style={{ color: '#1b2a47', fontSize: '24px' }}>المرفقات</span>
                                <button type="button" className="btn fw-bold d-flex align-items-center gap-2 px-4 py-2 rounded-pill shadow-sm text-white" style={{ backgroundColor: '#ff8a00', fontSize: '20px' }} onClick={addEditDocRow}><FaPlus /> إضافة ملف</button>
                            </div>
                            {editDocs.map((doc) => (
                                <div key={doc.id} className="row g-3 p-4 mt-3 rounded-4 align-items-end" style={{ border: '2px dashed #cbd5e1' }}>
                                    <div className="col-md-3">
                                        <select className="form-select p-3 bg-light" value={doc.type} onChange={(e) => handleEditDocChange(doc.id, 'type', e.target.value)} required>
                                            <option value="">اختر...</option>
                                            <option value="image">صورة</option>
                                            <option value="pdf">مستند</option>
                                        </select>
                                    </div>
                                    <div className="col-md-4">
                                        <input type="text" className="form-control p-3 bg-light" placeholder="عنوان الملف" value={doc.title} onChange={(e) => handleEditDocChange(doc.id, 'title', e.target.value)} required />
                                    </div>
                                    <div className="col-md-4">
                                        <input type="file" className="form-control p-3 bg-light" onChange={(e) => handleEditDocChange(doc.id, 'file', e.target.files[0])} required />
                                    </div>
                                    <div className="col-md-1 text-center">
                                        <button type="button" className="btn btn-outline-danger p-3 w-100" onClick={() => removeEditDocRow(doc.id)}><FaTrash size={20} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="col-12 mt-5 text-center">
                            <div className="d-flex justify-content-center gap-4 flex-wrap">
                                <button type="submit" className="btn fw-bold py-3 px-5 shadow d-flex align-items-center gap-2" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '24px', borderRadius: '15px' }}><FaSave /> حفظ التعديلات وإعادة الطرح</button>
                                <button type="button" className="btn fw-bold py-3 px-5 shadow d-flex align-items-center gap-2" style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '24px', borderRadius: '15px' }} onClick={cancelEdit}><FaTimes /> إلغاء</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }

    // === العرض الرئيسي: قائمة المشاريع ===
    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">مشاريعي <FaFileContract className="text-warning ms-2" /></h3>
                    <p className="text-muted fw-semibold">جميع مشاريعك - قيد الانتظار، قيد التنفيذ، والمنتهية في مكان واحد.</p>
                </div>
            </div>

            <div className="d-flex justify-content-center gap-3 mb-5 flex-wrap">
                <button 
                    className="btn fw-bold px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerStatus === 'pending' ? '#3b82f6' : '#e2e8f0', color: offerStatus === 'pending' ? 'white' : '#1b2a47', fontSize: '18px', minWidth: '220px', justifyContent: 'center' }}
                    onClick={() => setOfferStatus('pending')}
                >
                    <FaHourglassHalf /> مشاريع قيد الانتظار
                </button>
                <button 
                    className="btn fw-bold px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerStatus === 'ongoing' ? '#ff8a00' : '#e2e8f0', color: offerStatus === 'ongoing' ? 'white' : '#1b2a47', fontSize: '18px', minWidth: '220px', justifyContent: 'center' }}
                    onClick={() => setOfferStatus('ongoing')}
                >
                    <FaSpinner className={offerStatus === 'ongoing' ? 'fa-spin' : ''} /> مشاريع قيد التنفيذ
                </button>
                <button 
                    className="btn fw-bold px-4 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2" 
                    style={{ backgroundColor: offerStatus === 'completed' ? '#10b981' : '#e2e8f0', color: offerStatus === 'completed' ? 'white' : '#1b2a47', fontSize: '18px', minWidth: '220px', justifyContent: 'center' }}
                    onClick={() => setOfferStatus('completed')}
                >
                    <FaCheckCircle /> المشاريع المنتهية
                </button>
            </div>

            <div className="row g-4">
                {projects.length > 0 ? projects.map(project => (
                    <div key={project.id} className="col-12">
                        <div className={`card border-0 shadow-sm rounded-4 p-4 bg-white border-end border-4 ${project.progress === 100 ? 'border-success' : project.progress === 0 ? 'border-primary' : 'border-warning'}`}>
                            <div className="row align-items-center">
                                <div className="col-md-8">
                                    <div className="d-flex justify-content-between align-items-start mb-2">
                                        <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{project.projectTitle}</h4>
                                        <span className={`badge ${project.progress === 100 ? 'bg-success' : project.progress === 0 ? 'bg-primary' : 'bg-warning text-dark'} px-3 py-2 rounded-pill fw-bold fs-6 me-2`}>
                                            {project.progress === 0 && project.offersCount !== undefined ? `${project.offersCount} عروض` : project.status}
                                        </span>
                                    </div>
                                    {project.providerName && (
                                        <div className="d-flex align-items-center gap-3 mb-2">
                                            <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary border shadow-sm" style={{ width: '60px', height: '60px', fontSize: '20px' }}>
                                                <FaUserTie />
                                            </div>
                                            <div>
                                                <h5 className="fw-bold mb-1 text-dark">{project.providerName}</h5>
                                                <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-1 rounded-pill fw-bold border">{project.providerType}</span>
                                            </div>
                                        </div>
                                    )}
                                    <p className="text-muted fw-semibold mb-0 mt-2" style={{ lineHeight: '1.8' }}>{project.details}</p>
                                    {project.progress === 0 && project.daysRemaining !== undefined && (
                                        <div className="d-flex gap-3 mt-3 flex-wrap">
                                            {project.governorate && <span className="text-muted fw-semibold"><FaMapMarkerAlt className="ms-1 text-primary" />{project.governorate}</span>}
                                            {project.area && <span className="text-muted fw-semibold"><FaBuilding className="ms-1 text-primary" />{project.area} م²</span>}
                                            <span className="text-muted fw-semibold"><FaCalendarAlt className="ms-1 text-primary" />متبقي {project.daysRemaining} أيام</span>
                                        </div>
                                    )}
                                    {project.progress > 0 && (
                                        <div className="mt-3">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <span className="text-muted small fw-bold">نسبة الإنجاز</span>
                                                <span className="fw-bold" style={{ color: project.progress === 100 ? '#10b981' : '#ff8a00' }}>{project.progress}%</span>
                                            </div>
                                            <div className="progress" style={{ height: '10px', borderRadius: '10px' }}>
                                                <div className={`progress-bar ${project.progress === 100 ? 'bg-success' : 'bg-warning progress-bar-striped progress-bar-animated'}`} style={{ width: `${project.progress}%` }}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-4 text-md-end text-start mt-4 mt-md-0 border-start ps-md-4 d-flex flex-column justify-content-center">
                                    {project.progress === 0 && project.offersCount !== undefined ? (
                                        <>
                                            <p className="text-muted fw-bold mb-1"><FaRegClock className="me-1" /> تاريخ الطرح</p>
                                            <h5 className="fw-bold mb-3">{project.datePosted}</h5>
                                            <p className="text-muted fw-bold mb-1"><FaFileContract className="me-1" /> المدة</p>
                                            <h5 className="fw-bold mb-3">{project.duration}</h5>
                                            <div className="d-flex flex-column gap-2">
                                                <button 
                                                    className="btn fw-bold py-2 rounded-pill shadow-sm w-100 d-flex align-items-center justify-content-center gap-2" 
                                                    style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '18px' }}
                                                    onClick={() => viewProjectOffers(project)}
                                                >
                                                    <FaEye /> عرض العروض المستلمة
                                                </button>
                                                <button 
                                                    className="btn fw-bold py-2 rounded-pill shadow-sm w-100 d-flex align-items-center justify-content-center gap-2" 
                                                    style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }}
                                                    onClick={() => startEdit(project)}
                                                >
                                                    <FaEdit /> تعديل المشروع
                                                </button>
                                                <button 
                                                    className="btn fw-bold py-2 rounded-pill shadow-sm w-100 d-flex align-items-center justify-content-center gap-2" 
                                                    style={{ backgroundColor: '#dc3545', color: 'white', fontSize: '18px' }}
                                                    onClick={() => handleDelete(project.id)}
                                                >
                                                    <FaTrash /> حذف المشروع
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-muted fw-bold mb-1"><FaRegClock className="me-1" /> {project.progress === 100 ? 'المدة المستغرقة' : 'مدة التنفيذ'}</p>
                                            <h5 className="fw-bold mb-3">{project.duration}</h5>
                                            <p className="text-muted fw-bold mb-1"><FaMoneyBillWave className="me-1" /> {project.progress === 100 ? 'القيمة النهائية' : 'قيمة العرض المعتمد'}</p>
                                            <h3 className={`fw-bold mb-4 ${project.progress === 100 ? 'text-secondary' : ''}`} style={{ color: project.progress === 100 ? '#6c757d' : '#ff8a00' }}>{project.price} ر.س</h3>
                                            {project.progress < 100 ? (
                                                <button className="btn fw-bold py-2 rounded-pill shadow-sm w-100" style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '18px' }} onClick={() => { setSelectedProject(project); setTrackingView('details'); }}>
                                                    <FaTruck className="me-2" /> عرض تفاصيل المشروع
                                                </button>
                                            ) : (
                                                <button className="btn fw-bold py-2 rounded-pill shadow-sm w-100" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }} onClick={() => { setSelectedProject(project); setTrackingView('details'); }}>
                                                    <FaCheckCircle className="me-2" /> عرض التفاصيل والتقييم
                                                </button>
                                            )}
                                            <div className="text-muted small fw-semibold mt-3 text-center">
                                                {project.progress === 100 ? `تاريخ الانتهاء: ${project.dateCompleted}` : `تاريخ اعتماد العرض: ${project.dateAccepted}`}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )) : (
                    <div className="col-12 text-center py-5">
                        <h4 className="text-muted fw-bold">
                            {offerStatus === 'pending' ? 'لا توجد مشاريع قيد الانتظار حالياً.' 
                            : offerStatus === 'ongoing' ? 'لا توجد مشاريع قيد التنفيذ حالياً.' 
                            : 'لا يوجد أرشيف لمشاريع منتهية.'}
                        </h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OffersTab;

