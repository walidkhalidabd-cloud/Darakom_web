import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaUserTie, FaRegClock, FaFileContract, FaCheckCircle, FaSpinner, FaTruck, FaStar, FaArrowRight, FaPlus, FaExclamationTriangle, FaCheck, FaHourglassHalf, FaEdit, FaTrash, FaSave, FaTimes, FaMapMarkerAlt, FaBuilding, FaCalendarAlt, FaEye, FaTimesCircle, FaHardHat, FaPaperPlane } from 'react-icons/fa';
import OfferDetails from './OfferDetails';
import ProjectRatingForm from '../../../components/ProjectRatingForm';
import clientApi from '../../../services/api/clientApi'; // تأكد من المسار حسب هيكلية مشروعك

const OffersTab = ({ setActiveTab, setTargetTrackingProject }) => {
    const [offerStatus, setOfferStatus] = useState('pending');
    // tracking: 'list' | 'details' | 'complaint' | 'edit' | 'view-offers' | 'offer-detail' | 'rate'
    const [trackingView, setTrackingView] = useState('list');
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedOffer, setSelectedOffer] = useState(null);
    const [editForm, setEditForm] = useState({
        title: '', description: '', governorate: '', area: '', providerType: '', tenderDays: ''
    });
    const [editDocs, setEditDocs] = useState([]);
    
    // States الخاصة بالباك إند
    const [allProjects, setAllProjects] = useState([]);
    const [projectOffers, setProjectOffers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

   

    const fetchProjects = async () => {
        try {
            setLoading(true);
            const response = await clientApi.fetchClientProjects();
            const projectsData = response.data?.data || response.data || [];
            
            // تهيئة البيانات القادمة من الباك إند لتتطابق مع التصميم
            const formattedProjects = projectsData.map(apiProject => {
                // تحديد حالة المشروع بناءً على الباك إند
                let executionStatus = apiProject.execution_status || 'not_started';
                let progress = 0;
                if (executionStatus === 'in_progress') progress = 50;
                if (executionStatus === 'finished') progress = 100;

                return {
                    id: apiProject.id,
                    projectTitle: apiProject.title || 'مشروع بدون عنوان',
                    providerName: apiProject.performer?.user?.name || null,
                    providerType: apiProject.projectType?.name || apiProject.providerTypeNeeded || 'غير محدد',
                    price: apiProject.budget || apiProject.price || '0',
                    duration: apiProject.duration_days ? `${apiProject.duration_days} يوم` : 'غير محدد',
                    datePosted: new Date(apiProject.created_at).toLocaleDateString('ar-EG'),
                    dateAccepted: apiProject.start_date || '',
                    dateCompleted: apiProject.end_date || '',
                    details: apiProject.description || '',
                    progress: progress,
                    status: executionStatus === 'finished' ? 'مكتمل' : (executionStatus === 'in_progress' ? 'قيد التنفيذ' : 'بانتظار العروض'),
                    offersCount: apiProject.offers?.length || 0,
                    daysRemaining: apiProject.tender_days || 0,
                    governorate: apiProject.province?.name || '',
                    area: apiProject.area || '',
                    backendStatus: executionStatus,
                    description: apiProject.description || '',
                    milestones: apiProject.steps || [] // جلب الخطوات إن وجدت
                };
            });
            setAllProjects(formattedProjects);
        } catch (error) {
            console.error("خطأ في جلب المشاريع:", error);
        } finally {
            setLoading(false);
        }
    };
    // جلب بيانات المشاريع عند تحميل المكون
    useEffect(() => {
        fetchProjects();
    }, []);

    // فلترة المشاريع حسب التبويبات الثلاثة
    const pendingOffers = allProjects.filter(p => p.backendStatus === 'not_started');
    const ongoingOffers = allProjects.filter(p => p.backendStatus === 'in_progress');
    const completedOffers = allProjects.filter(p => p.backendStatus === 'finished');

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

    const saveEdit = async (e) => {
        e.preventDefault();
        try {
            setActionLoading(true);
            const payload = {
                title: editForm.title,
                description: editForm.description,
                area: editForm.area,
                tender_days: editForm.tenderDays,
                // يمكنك إضافة الحقول الإضافية التي يطلبها الـ API هنا مثل المحافظة والنوع
            };
            
            await clientApi.updateClientProject(selectedProject.id, payload);
            alert(`تم تعديل المشروع "${editForm.title}" بنجاح!`);
            setTrackingView('list');
            setSelectedProject(null);
            fetchProjects();
        } catch (error) {
            console.error("خطأ في تعديل المشروع", error);
            alert("حدث خطأ أثناء تعديل المشروع.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleDelete = async (projectId) => {
        if (window.confirm('هل أنت متأكد من حذف هذا المشروع؟')) {
            try {
                await clientApi.deleteClientProject(projectId);
                alert(`تم حذف المشروع بنجاح`);
                fetchProjects();
            } catch (error) {
                console.error("خطأ في حذف المشروع", error);
                alert("حدث خطأ أثناء حذف المشروع.");
            }
        }
    };

    const addEditDocRow = () => setEditDocs([...editDocs, { id: Date.now(), type: '', title: '', file: null }]);
    const handleEditDocChange = (id, field, value) => setEditDocs(editDocs.map(doc => doc.id === id ? { ...doc, [field]: value } : doc));
    const removeEditDocRow = (id) => setEditDocs(editDocs.filter(doc => doc.id !== id));

    const viewProjectOffers = async (project) => {
        setSelectedProject(project);
        setTrackingView('view-offers');
        setProjectOffers([]);
        try {
            setLoading(true);
            const response = await clientApi.fetchProjectOffers(project.id);
            const offersData = response.data?.data || response.data || [];
            
            const formattedOffers = offersData.map(offer => ({
                id: offer.id,
                providerName: offer.provider?.user?.name || 'مزود خدمة',
                providerType: offer.provider?.role?.name || 'مستقل',
                rating: offer.provider?.rating || 0,
                price: offer.price,
                duration: `${offer.duration_days || 0} يوم`,
                offerDate: new Date(offer.created_at).toLocaleDateString('ar-EG'),
                details: offer.details,
                status: offer.status || 'pending', 
                startDate: offer.start_date || '-',
                stages: offer.stages || []
            }));
            
            setProjectOffers(formattedOffers);
        } catch (error) {
            console.error("خطأ في جلب العروض:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptOffer = async (offerId) => {
        if (!window.confirm('هل أنت متأكد من قبول هذا العرض؟ سيتم رفض باقي العروض تلقائياً.')) return;
        try {
            setActionLoading(true);
            await clientApi.acceptOffer(selectedProject.id, offerId);
            alert('تم قبول العرض بنجاح وبدء التنفيذ!');
            fetchProjects();
            setTrackingView('list');
            setOfferStatus('ongoing');
        } catch (error) {
            console.error("خطأ في قبول العرض", error);
            alert("حدث خطأ أثناء قبول العرض.");
        } finally {
            setActionLoading(false);
        }
    };

    const handleRejectOffer = async (offerId) => {
        if (!window.confirm('هل أنت متأكد من رفض هذا العرض؟')) return;
        try {
            setActionLoading(true);
            await clientApi.rejectOffer(selectedProject.id, offerId);
            alert('تم رفض العرض!');
            viewProjectOffers(selectedProject);
        } catch (error) {
            console.error("خطأ في رفض العرض", error);
            alert("حدث خطأ أثناء رفض العرض.");
        } finally {
            setActionLoading(false);
        }
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

    const getBorderColor = (status) => {
        switch(status) {
            case 'pending': return 'border-warning';
            case 'accepted': return 'border-success';
            case 'rejected': return 'border-danger';
            default: return 'border-secondary';
        }
    };

    // 1. واجهة تفاصيل العرض الفردي
    if (trackingView === 'offer-detail' && selectedOffer) {
        return (
            <OfferDetails 
                offer={selectedOffer} 
                offerType="public" 
                onBack={() => { setTrackingView('view-offers'); setSelectedOffer(null); }} 
            />
        );
    }

    // 2. واجهة عرض كل العروض المستلمة للمشروع
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

                {loading ? (
                    <div className="text-center py-5">
                        <FaSpinner className="fa-spin text-primary mb-3" size={40} />
                        <h5 className="text-muted fw-bold">جاري تحميل العروض...</h5>
                    </div>
                ) : projectOffers.length > 0 ? (
                    <div className="d-flex flex-column gap-4">
                        {projectOffers.map(offer => (
                            <div key={offer.id} className={`card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white border-end border-4 ${getBorderColor(offer.status)}`}>
                                
                                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                                    <div className="d-flex align-items-center gap-2">
                                        <FaHardHat className="text-primary" size={20} />
                                        <h5 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>عرض من {offer.providerName}</h5>
                                    </div>
                                    {getStatusBadge(offer.status)}
                                </div>

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

                                <div className="position-relative p-4 rounded-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <p className="text-dark fw-semibold fs-5 mb-0 position-relative z-1" style={{ lineHeight: '1.8' }}>
                                        {offer.details}
                                    </p>
                                </div>

                                {offer.stages && offer.stages.length > 0 && (
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

                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3 border-top">
                                    <span className="text-muted small fw-bold">تاريخ العرض: {offer.offerDate}</span>
                                    <div className="d-flex gap-2 flex-wrap">
                                        <button 
                                            className="btn fw-bold px-4 py-2 rounded-pill shadow-sm d-flex align-items-center gap-2"
                                            style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '16px' }}
                                            onClick={() => { setSelectedOffer(offer); setTrackingView('offer-detail'); }}
                                        >
                                            <FaEye /> عرض التفاصيل
                                        </button>
                                        {offer.status === 'pending' && (
                                            <>
                                                <button 
                                                    className="btn btn-success fw-bold px-4 py-2 rounded-pill shadow-sm" 
                                                    style={{ fontSize: '16px' }}
                                                    onClick={() => handleAcceptOffer(offer.id)}
                                                    disabled={actionLoading}
                                                >
                                                    <FaCheckCircle className="me-1" /> {actionLoading ? 'جاري القبول...' : 'قبول العرض'}
                                                </button>
                                                <button 
                                                    className="btn btn-outline-danger fw-bold px-4 py-2 rounded-pill" 
                                                    style={{ fontSize: '16px' }}
                                                    onClick={() => handleRejectOffer(offer.id)}
                                                    disabled={actionLoading}
                                                >
                                                    <FaTimesCircle className="me-1" /> {actionLoading ? 'جاري الرفض...' : 'رفض'}
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

    // 3. واجهة تفاصيل المشروع (Tracking Details)
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
                {selectedProject.milestones && selectedProject.milestones.length > 0 && (
                    <>
                        <h4 className="fw-bold mb-4 border-bottom pb-3" style={{ color: '#1b2a47' }}>الجدول الزمني وتقارير الإنجاز</h4>
                        <div className="position-relative me-3 border-start border-2 border-warning pb-4 pe-4" style={{ borderColor: selectedProject.progress === 100 ? '#10b981' : '#ff8a00' }}>
                            {selectedProject.milestones.map((milestone, index) => (
                                <div key={index} className="mb-5 position-relative px-4">
                                    <div 
                                        className="position-absolute d-flex align-items-center justify-content-center rounded-circle text-white fw-bold"
                                        style={{ 
                                            width: '40px', height: '40px', 
                                            right: '-21px', top: '0',
                                            backgroundColor: milestone.completed || milestone.status === 'completed' ? '#10b981' : '#cbd5e1'
                                        }}
                                    >
                                        {milestone.completed || milestone.status === 'completed' ? <FaCheck /> : index + 1}
                                    </div>
                                    <h5 className={`fw-bold mb-2 ${milestone.completed || milestone.status === 'completed' ? 'text-success' : 'text-muted'}`}>
                                        {milestone.name || milestone.title}
                                        {(milestone.completed || milestone.status === 'completed') && <FaCheckCircle className="me-2 text-success" />}
                                    </h5>
                                    {(!milestone.completed && milestone.status !== 'completed') && (
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

    // 4. واجهة تقييم المشروع
    if (trackingView === 'rate' && selectedProject) {
        return (
            <ProjectRatingForm
                project={selectedProject}
                onBack={() => setTrackingView('details')}
            />
        );
    }

    // 5. واجهة نموذج تقديم شكوى
    if (trackingView === 'complaint' && selectedProject) {
        return (
            <div className="card border-0 shadow-sm rounded-4 p-4 p-md-5 bg-white mx-auto" style={{ maxWidth: '800px' }}>
                <button 
                    className="btn btn-light fw-bold mb-4 w-auto me-auto d-flex align-items-center gap-2 rounded-pill px-4 py-2 shadow-sm" 
                    onClick={() => setTrackingView('details')}
                >
                    <FaArrowRight /> العودة للتفاصيل
                </button>
                <div className="text-center mb-5">
                    <div className="bg-danger bg-opacity-10 text-danger p-4 rounded-circle d-inline-flex mb-3">
                        <FaExclamationTriangle size={40} />
                    </div>
                    <h3 className="fw-bold" style={{ color: '#1b2a47' }}>نموذج تقديم شكوى</h3>
                    <p className="text-muted fw-semibold fs-5">أنت تقوم بتقديم شكوى بخصوص هذا المشروع</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); alert('تم إرسال الشكوى بنجاح!'); setTrackingView('list'); setSelectedProject(null); }}>
                    <div className="row g-4 mb-4">
                        <div className="col-md-6">
                            <label className="fw-bold mb-2 text-muted fs-5">اسم مزود الخدمة</label>
                            <div className="form-control p-3 bg-light text-muted fw-bold border" style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}>
                                {selectedProject.providerName || selectedProject.provider}
                            </div>
                        </div>
                        <div className="col-md-6">
                            <label className="fw-bold mb-2 text-muted fs-5">المشروع المرتبط</label>
                            <div className="form-control p-3 bg-light text-muted fw-bold border" style={{ borderColor: '#e2e8f0', fontSize: '17px', borderRadius: '12px' }}>
                                {selectedProject.projectTitle || selectedProject.title}
                            </div>
                        </div>
                    </div>
                    
                    <div className="mb-4">
                        <label className="fw-bold mb-3 text-dark fs-5">وصف المشكلة بالتفصيل</label>
                        <textarea className="form-control p-4 bg-light border" rows="6" placeholder="اكتب وصفاً تفصيلياً للمشكلة..." style={{ borderColor: '#e2e8f0', fontSize: '18px', borderRadius: '12px', lineHeight: '1.8' }} required></textarea>
                    </div>

                    <div className="alert alert-warning rounded-4 p-4 mb-4 d-flex align-items-center gap-3">
                        <FaExclamationTriangle className="fs-3 flex-shrink-0" />
                        <div>
                            <strong className="d-block">ملاحظة:</strong>
                            <span className="fw-semibold">سيتم إرسال شكواك إلى إدارة المنصة للمراجعة والتحقق. سيتم الرد عليك خلال مدة أقصاها 48 ساعة.</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 flex-wrap">
                        <button type="submit" className="btn fw-bold px-5 py-3 btn-danger fs-5 rounded-pill shadow-sm d-flex align-items-center justify-content-center gap-2">
                            <FaPaperPlane /> إرسال الشكوى
                        </button>
                        <button 
                            type="button" 
                            className="btn fw-bold px-5 py-3 rounded-pill shadow-sm d-flex align-items-center gap-2"
                            style={{ backgroundColor: '#e2e8f0', color: '#1b2a47', fontSize: '20px' }}
                            onClick={() => setTrackingView('details')}
                        >
                            إلغاء
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    // 6. واجهة تعديل المشروع
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
                                <button type="submit" disabled={actionLoading} className="btn fw-bold py-3 px-5 shadow d-flex align-items-center gap-2" style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '24px', borderRadius: '15px' }}>
                                    {actionLoading ? <FaSpinner className="fa-spin" /> : <FaSave />} حفظ التعديلات وإعادة الطرح
                                </button>
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

            {loading ? (
                 <div className="text-center py-5">
                    <FaSpinner className="fa-spin text-primary mb-3" size={50} />
                    <h4 className="text-muted fw-bold">جاري تحميل مشاريعك...</h4>
                </div>
            ) : (
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
                                        {project.progress === 0 ? (
                                            <>
                                                <p className="text-muted fw-bold mb-1"><FaRegClock className="me-1" /> تاريخ الطرح</p>
                                                <h5 className="fw-bold mb-3">{project.datePosted}</h5>
                                                <p className="text-muted fw-bold mb-1"><FaFileContract className="me-1" /> الميزانية التقديرية</p>
                                                <h5 className="fw-bold mb-3 text-primary">{project.price}</h5>
                                                <div className="d-flex flex-column gap-2">
                                                    <button 
                                                        className="btn fw-bold py-2 rounded-pill shadow-sm w-100 d-flex align-items-center justify-content-center gap-2" 
                                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '18px' }}
                                                        onClick={() => viewProjectOffers(project)}
                                                    >
                                                        <FaEye /> عرض العروض ({project.offersCount})
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
                                                    <button 
                                                        className="btn fw-bold py-2 rounded-pill shadow-sm w-100" 
                                                        style={{ backgroundColor: '#1b2a47', color: 'white', fontSize: '18px' }} 
                                                        onClick={() => { 
                                                            setTargetTrackingProject(project); 
                                                            setActiveTab('tracking'); 
                                                        }}
                                                    >
                                                        <FaTruck className="me-2" /> متابعة تفاصيل المشروع
                                                    </button>
                                                ) : (
                                                    <button 
                                                        className="btn fw-bold py-2 rounded-pill shadow-sm w-100" 
                                                        style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }} 
                                                        onClick={() => { 
                                                            setTargetTrackingProject(project); 
                                                            setActiveTab('tracking'); 
                                                        }}
                                                    >
                                                        <FaCheckCircle className="me-2" /> عرض التفاصيل والتقييم
                                                    </button>
                                                )}
                                                <div className="text-muted small fw-semibold mt-3 text-center">
                                                    {project.progress === 100 ? `تاريخ الانتهاء: ${project.dateCompleted}` : `تاريخ البدء: ${project.dateAccepted}`}
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
            )}
        </div>
    );
};

export default OffersTab;