import { useState, useEffect } from 'react';
import { FaHeart, FaStar, FaCheckCircle, FaSpinner, FaRegHeart } from 'react-icons/fa';
// تأكد من إضافة هاتين الدالتين في ملف clientApi.js الخاص بك
import { fetchClientFavorites, toggleClientFavorite } from '../../../services/api/clientApi';

const FavoritesTab = ({ handleDirectOffer }) => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            setLoading(true);
            try {
                const res = await fetchClientFavorites();
                const data = res.data?.data || res.data || [];
                if (Array.isArray(data)) {
                    setFavorites(data);
                }
            } catch (err) {
                console.error("Error fetching favorites", err);
            } finally {
                setLoading(false);
            }
        };
        
        loadFavorites();
    }, []);

    // دالة إزالة أو إضافة للمفضلة
    const handleToggleFavorite = async (favoriteUserId) => {
        try {
            // تحديث الواجهة فوراً (Optimistic Update) لجعل التجربة أسرع
            setFavorites(prev => prev.filter(f => f.favorite_user_id !== favoriteUserId));
            
            // إرسال الطلب للباك إند
            await toggleClientFavorite({ favorite_user_id: favoriteUserId });
        } catch (err) {
            console.error("Error toggling favorite", err);
            // في حال فشل الطلب يمكن إعادة تحميل القائمة هنا
        }
    };

    // دالة لاستخراج أول حرفين من اسم المزود للأيقونة
    const getInitials = (name) => {
        if (!name) return 'م';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) return `${parts[0][0]}.${parts[1][0]}`;
        return name.substring(0, 2);
    };

    return (
        <div className="mx-auto" style={{ maxWidth: '100%' }}>
            <div className="d-flex justify-content-between align-items-center mb-5 border-bottom pb-3">
                <div>
                    <h3 className="fw-bold text-dark mb-1">مزودو الخدمة المفضلين <FaHeart className="text-danger ms-2" /></h3>
                    <p className="text-muted fw-semibold">قائمة بالشركات والمهندسين الذين قمت بحفظهم للتعامل معهم مستقبلاً.</p>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <FaSpinner className="fa-spin fs-1 text-danger" />
                </div>
            ) : favorites.length > 0 ? (
                <div className="row g-4">
                    {favorites.map(fav => {
                        // معالجة البيانات القادمة من الباك إند (Laravel يرجع العلاقات بصيغة snake_case أو camelCase)
                        const user = fav.favorite_user || fav.favoriteUser || {};
                        const profile = user.profile || {};
                        const pName = user.name || user.full_name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'مزود خدمة';
                        const pType = profile.role?.name || profile.work_area || 'مزود خدمة';
                        // استخدام بيانات افتراضية للتقييم والمشاريع لحين توفرها من الباك إند
                        const rating = user.rating || 4.8; 
                        const projectsCount = user.projects_count || 5;

                        // تجهيز كائن المزود لتمريره لزر "تقديم عرض مباشر"
                        const providerObj = {
                            id: fav.favorite_user_id,
                            name: pName,
                            type: pType
                        };

                        return (
                            <div key={fav.id || fav.favorite_user_id} className="col-lg-6">
                                <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
                                    <div className="d-flex align-items-start gap-4 mb-4">
                                        <div className="bg-light rounded-circle d-flex align-items-center justify-content-center fw-bold text-secondary border shadow-sm" style={{ width: '80px', height: '80px', fontSize: '24px', flexShrink: 0 }}>
                                            {getInitials(pName)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <div className="d-flex justify-content-between align-items-center mb-1">
                                                <h4 className="fw-bold mb-0" style={{ color: '#1b2a47' }}>{pName}</h4>
                                                <FaHeart 
                                                    className="text-danger" 
                                                    size={24} 
                                                    style={{ cursor: 'pointer', transition: 'transform 0.2s' }} 
                                                    onClick={() => handleToggleFavorite(fav.favorite_user_id)}
                                                    title="إزالة من المفضلة"
                                                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.2)'}
                                                    onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                                />
                                            </div>
                                            <span className="badge bg-secondary bg-opacity-10 text-dark px-3 py-2 rounded-pill fw-bold fs-6 mb-3 border">
                                                {pType}
                                            </span>
                                            <div className="d-flex gap-4 text-muted fw-semibold">
                                                <div className="d-flex align-items-center gap-1">
                                                    <FaStar className="text-warning" size={20} />
                                                    <span className="fs-5 text-dark">{rating}</span>
                                                </div>
                                                <div className="d-flex align-items-center gap-1">
                                                    <FaCheckCircle className="text-success" size={18} />
                                                    <span className="fs-6">{projectsCount} مشاريع مكتملة</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-3 mt-auto pt-3 border-top flex-wrap">
                                        <button 
                                            className="btn fw-bold py-2 rounded-pill shadow-sm flex-grow-1" 
                                            style={{ backgroundColor: '#ff8a00', color: 'white', fontSize: '18px' }}
                                            onClick={() => handleDirectOffer(providerObj)}
                                        >
                                            تقديم عرض مباشر
                                        </button>
                                        <button className="btn btn-outline-dark fw-bold py-2 rounded-pill flex-grow-1" style={{ fontSize: '18px' }}>
                                            عرض الملف الشخصي
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-5 mt-4">
                    <FaRegHeart className="text-muted mb-3 opacity-25" size={60} />
                    <h4 className="text-muted fw-bold mb-2">قائمة المفضلة فارغة</h4>
                    <p className="text-muted fw-semibold">لم تقم بإضافة أي مزود خدمة إلى المفضلة حتى الآن.</p>
                </div>
            )}
        </div>
    );
};

export default FavoritesTab;