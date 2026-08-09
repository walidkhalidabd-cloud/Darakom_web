import { FaHeart, FaStar, FaCheckCircle } from 'react-icons/fa';

const FavoritesTab = ({ handleDirectOffer }) => {
    // تم نقل بيانات المفضلين لتعيش هنا فقط
    const favoriteProviders = [
        { id: 1, name: 'مؤسسة البناء الذهبي', type: 'مقاول بناء', rating: 4.8, projectsCount: 12, initials: 'ب.ذ' },
        { id: 2, name: 'مكتب الإبداع الهندسي', type: 'مكتب هندسي', rating: 4.9, projectsCount: 34, initials: 'إ.هـ' },
        { id: 3, name: 'م. خالد عبدالله', type: 'مهندس معماري', rating: 4.7, projectsCount: 8, initials: 'خ.ع' },
        { id: 4, name: 'شركة أطياف للتشطيبات', type: 'تشطيب وديكور', rating: 4.6, projectsCount: 22, initials: 'أ.ط' }
    ];

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">مزودو الخدمة المفضلين <FaHeart className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold">قائمة بالشركات والمهندسين الذين قمت بحفظهم للتعامل معهم مستقبلاً.</p>
                </div>
            </div>

            <div className="row g-4">
                {favoriteProviders.map(provider => (
                    <div key={provider.id} className="col-lg-6">
                        <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                            <div className="d-flex align-items-start gap-4 mb-4">
                                <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary border shadow-sm" style={{ width: '80px', height: '80px', fontSize: '24px', flexShrink: 0 }}>
                                    {provider.initials}
                                </div>
                                <div className="flex-grow-1">
                                    <div className="d-flex justify-content-between align-items-center mb-1">
                                        <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{provider.name}</h4>
                                        <FaHeart className="text-danger" size={24} style={{ cursor: 'pointer' }} />
                                    </div>
                                    <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill fw-bold fs-6 mb-3 border">
                                        {provider.type}
                                    </span>
                                    <div className="d-flex gap-4 text-muted fw-semibold">
                                        <div className="d-flex align-items-center gap-1"><FaStar className="text-warning" size={20} /><span className="fs-5 text-dark">{provider.rating}</span></div>
                                        <div className="d-flex align-items-center gap-1"><FaCheckCircle className="text-success" size={18} /><span className="fs-6">{provider.projectsCount} مشاريع مكتملة</span></div>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex gap-3 mt-auto pt-3 border-top">
                                <button 
                                    className="btn fw-bold py-2 rounded-pill shadow-sm flex-grow-1" 
                                    style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }}
                                    onClick={() => handleDirectOffer(provider)}
                                >
                                    تقديم عرض مباشر
                                </button>
                                <button className="btn btn-outline-dark fw-bold py-2 rounded-pill flex-grow-1" style={{ fontSize: '18px' }}>
                                    عرض الملف الشخصي
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FavoritesTab;